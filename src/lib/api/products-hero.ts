import { ApiService } from "@/lib/api-service";

export interface ProductsHeroSettings {
  id: string;
  hero_images: string[];
  updated_at: string;
}

export const ProductsHeroApi = {
  getSettings: async (): Promise<ProductsHeroSettings> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products-hero`);
    if (!res.ok) throw new Error("Failed to fetch products hero settings");
    return res.json();
  },

  uploadHeroImage: async (file: File): Promise<ProductsHeroSettings> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await ApiService.fetchWithAuth("/products-hero/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Upload failed");
    }
    return res.json();
  },

  deleteHeroImage: async (index: number): Promise<ProductsHeroSettings> => {
    const res = await ApiService.fetchWithAuth(`/products-hero/image/${index}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Delete failed");
    }
    return res.json();
  },
};