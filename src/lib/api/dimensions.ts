import { ApiService } from "@/lib/api-service";

export interface HeroSettings {
  id: number;
  image_url: string | null;
  hero_images: string[];
  width: number;
  height: number;
  label: string;
  updated_at: string;
}

export const DimensionsApi = {
  // Get current settings (public)
  getSettings: async (): Promise<HeroSettings> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dimensions`
    );
    if (!res.ok) throw new Error("Failed to fetch hero settings");
    return res.json();
  },

  // Upload image (admin)
  uploadImage: async (file: File): Promise<{ image_url: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await ApiService.fetchWithAuth("/dimensions/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Upload failed");
    }
    return res.json();
  },

  // Update dimensions (admin)
  updateDimensions: async (
    width: number,
    height: number,
    label: string,
  ): Promise<HeroSettings> => {
    const res = await ApiService.fetchWithAuth("/dimensions", {
      method: "PATCH",
      body: JSON.stringify({ width, height, label }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to update dimensions");
    }
    return res.json();
  },

  // Delete image (admin)
  deleteImage: async (): Promise<{ message: string }> => {
    const res = await ApiService.fetchWithAuth("/dimensions", {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete image");
    return res.json();
  },

uploadHeroImage: async (file: File): Promise<HeroSettings> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await ApiService.fetchWithAuth("/dimensions/hero-images", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Upload failed");
    }
    return res.json();
  },

  deleteHeroImage: async (index: number): Promise<HeroSettings> => {
    const res = await ApiService.fetchWithAuth(`/dimensions/hero-images/${index}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Delete failed");
    }
    return res.json();
  },

  reorderHeroImages: async (images: string[]): Promise<HeroSettings> => {
    const res = await ApiService.fetchWithAuth("/dimensions/hero-images/reorder", {
      method: "PATCH",
      body: JSON.stringify({ images }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Reorder failed");
    }
    return res.json();
  },
};