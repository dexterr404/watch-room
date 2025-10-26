import { useEffect, useState, useRef } from 'react';
import { supabase } from '../config/supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type Participant = {
  user_id: string;
  username?: string;
  avatar_url?: string;
  online_at: string;
};

export type Message = {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    username?: string;
    avatar_url?: string;
  };
};

export function useWatchRoom(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // Use ref to prevent duplicate subscriptions
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!roomId || isInitializedRef.current) return;
    
    isInitializedRef.current = true;
    let mounted = true;

    const setupRealtime = async () => {
      try {
        // 1️⃣ Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.error('❌ Auth error:', authError);
          return;
        }

        if (!mounted) return;

        console.log('✅ User authenticated:', user.id);

        // 2️⃣ Fetch initial messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select(`
            *,
            profiles!messages_user_id_fkey (
              username,
              avatar_url
            )
          `)
          .eq('room_id', roomId)
          .order('created_at', { ascending: true });

        if (messagesError) {
          console.error('❌ Error fetching messages:', messagesError);
        } else if (mounted) {
          console.log('📨 Fetched messages:', messagesData?.length);
          const formatted = (messagesData || []).map((msg: any) => ({
            ...msg,
            user: {
              username: msg.profiles?.username,
              avatar_url: msg.profiles?.avatar_url,
            },
          }));
          setMessages(formatted);
        }

        // 3️⃣ Get current user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();

        if (!mounted) return;

        console.log('👤 Current user profile:', profile);

        // 4️⃣ Create Realtime channel (only once!)
        const channel = supabase.channel(`room:${roomId}`, {
          config: { 
            presence: { key: user.id }
          }
        });

        channelRef.current = channel;

        // 5️⃣ Listen for new messages
        channel.on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `room_id=eq.${roomId}`,
          },
          async (payload: any) => {
            console.log('📩 New message received:', payload.new);

            if (!mounted) return;

            // Fetch profile for the new message
            const { data: msgProfile } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', payload.new.user_id)
              .single();

            if (!mounted) return;

            setMessages((prev) => {
              // Prevent duplicates
              if (prev.some(m => m.id === payload.new.id)) {
                return prev;
              }
              
              return [
                ...prev,
                {
                  ...payload.new,
                  user: {
                    username: msgProfile?.username,
                    avatar_url: msgProfile?.avatar_url,
                  },
                },
              ];
            });
          }
        );

        // 6️⃣ Presence handlers
        channel.on('presence', { event: 'sync' }, () => {
          if (!mounted) return;
          
          const state = channel.presenceState();
          console.log('👥 Raw presence state:', state);
          
          const onlineUsers = Object.values(state)
            .flat()
            .map((p: any) => ({
              user_id: p.user_id,
              username: p.username,
              avatar_url: p.avatar_url,
              online_at: p.online_at,
            }));
          
          console.log('👥 Online users:', onlineUsers.length);
          setParticipants(onlineUsers);
        });

        channel.on('presence', { event: 'join' }, ({ key }) => {
          console.log('🟢 User joined:', key);
        });

        channel.on('presence', { event: 'leave' }, ({ key }) => {
          console.log('🔴 User left:', key);
        });

        // 7️⃣ Subscribe and track presence
        channel.subscribe(async (status) => {
          console.log('📡 Channel status:', status);

          if (!mounted) return;

          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
            
            const presencePayload = {
              user_id: user.id,
              username: profile?.username || user.email?.split('@')[0] || 'Anonymous',
              avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || '',
              online_at: new Date().toISOString(),
            };
            
            console.log('🟢 Tracking presence:', presencePayload);
            await channel.track(presencePayload);
            console.log('✅ Presence tracked successfully');
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setIsConnected(false);
            console.error('❌ Channel error:', status);
          } else if (status === 'CLOSED') {
            setIsConnected(false);
            console.log('🔒 Channel closed');
          }
        });

      } catch (error) {
        console.error('❌ Setup error:', error);
      }
    };

    setupRealtime();

    // Cleanup - only runs when component unmounts or roomId changes
    return () => {
      console.log('🧹 Cleaning up channel...');
      mounted = false;
      isInitializedRef.current = false;
      
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [roomId]); // Only depend on roomId

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('❌ No user found when sending message');
      return;
    }
    
    console.log('📤 Sending message...');
    
    const { error } = await supabase.from('messages').insert({
      room_id: roomId,
      user_id: user.id,
      content: content.trim(),
    });

    if (error) {
      console.error('❌ Error sending message:', error);
      alert('Failed to send message: ' + error.message);
    } else {
      console.log('✅ Message sent successfully');
    }
  };

  return { messages, participants, sendMessage, isConnected };
}