export interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration?: string;
  platform: "instagram" | "youtube" | "tiktok" | "facebook" | "twitter" | "unknown";
  qualities: VideoQuality[];
}

export interface VideoQuality {
  label: string;
  formatId: string;
  ext: string;
  /**
   * Human-readable size hint (if available).
   * Note: some platforms don't provide filesize without downloading.
   */
  size?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: "user" | "admin";
  createdAt: string;
}
