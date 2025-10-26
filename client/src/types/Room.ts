export type Room = {
    id: string;
    title: string;
    participants: number;
    thumbnail: string;
    video_url: string;
    is_private: boolean;
    playback_id: string;
    asset_id: string;
    auto_scroll: boolean;
    room_key: string;
}