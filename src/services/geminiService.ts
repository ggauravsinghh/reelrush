import axios from "axios";

export async function generateHashtags(title: string) {
  try {
    const response = await axios.post("/api/generate-hashtags", { title });
    return response.data.hashtags || "";
  } catch (error) {
    console.error("Error generating hashtags:", error);
    throw new Error("Failed to generate hashtags");
  }
}

export async function generateCaption(title: string) {
  try {
    const response = await axios.post("/api/generate-caption", { title });
    return response.data.caption || "";
  } catch (error) {
    console.error("Error generating caption:", error);
    throw new Error("Failed to generate caption");
  }
}

export async function generateSmartTitle(platform: string, description: string) {
  try {
    const response = await axios.post("/api/generate-title", { platform, description });
    return response.data.title || "";
  } catch (error) {
    console.error("Error generating title:", error);
    throw new Error("Failed to generate title");
  }
}
