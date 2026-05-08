import axios from 'axios';
import { VideoMetadata } from '../types';

export const videoService = {
  async fetchMetadata(url: string): Promise<VideoMetadata> {
    try {
      const response = await axios.post('/api/fetch-video', { url });
      return response.data;
    } catch (error) {
      console.error('Error fetching video metadata:', error);
      throw new Error('Could not fetch video information. Please check the URL.');
    }
  },

  async downloadVideo(sourceUrl: string, formatId: string, title?: string, ext: string = 'mp4'): Promise<void> {
    const safeExt = (ext || 'mp4').replace(/[^a-z0-9]/gi, '').slice(0, 5) || 'mp4';
    const filename = `${title || 'video'}.${safeExt}`.replace(/[^a-z0-9.]/gi, '_');
    const proxyUrl =
      `/api/download?url=${encodeURIComponent(sourceUrl)}` +
      `&formatId=${encodeURIComponent(formatId)}` +
      `&ext=${encodeURIComponent(safeExt)}` +
      `&filename=${encodeURIComponent(filename)}`;
    
    const link = document.createElement('a');
    link.href = proxyUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
