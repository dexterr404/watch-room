export const extractPlayableThumbnail = (url: string): string => {
  const lowerUrl = url.toLowerCase();

  // YouTube
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  }

  // Vimeo
  if (lowerUrl.includes('vimeo.com')) {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (match) return `/api/vimeo-thumbnail/${match[1]}`; // use your backend API
  }

  // Dailymotion
  if (lowerUrl.includes('dailymotion.com') || lowerUrl.includes('dai.ly')) {
    const match = url.match(/(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9]+)/);
    if (match) return `https://www.dailymotion.com/thumbnail/video/${match[1]}`;
  }

  // Wistia
  if (lowerUrl.includes('wistia')) {
    const match = url.match(/(?:medias|embed)\/([a-zA-Z0-9]+)/);
    if (match) return `https://embed-ssl.wistia.com/deliveries/${match[1]}/thumbnail.jpg`;
  }

  // Streamable
  if (lowerUrl.includes('streamable.com')) {
    const match = url.match(/streamable\.com\/([a-zA-Z0-9]+)/);
    if (match) return `https://cdn-cf-east.streamable.com/image/${match[1]}.jpg`;
  }

  // Twitch clips/videos
  if (lowerUrl.includes('twitch.tv')) {
    return '/twitch-placeholder.jpg'; // Replace with Twitch API if needed
  }

  // Direct video/audio files
  if (/\.(mp4|webm|ogg|mov|avi|mkv|m3u8|mp3|wav|m4a|flac)$/i.test(url)) {
    return '/video-placeholder.jpg';
  }

  // Default placeholder
  return '/default-thumbnail.jpg';
};
