export type Priority = "Low" | "Medium" | "High";

export interface WishItem {
  id: string;
  title: string;
  price?: string;
  imageUri?: string;
  link?: string;
  priority: Priority;
  notes?: string;
  progress?: number;
  isCompleted: boolean;
  createdAt: string;
}

export type WishInput = Omit<WishItem, "id" | "isCompleted" | "createdAt">;
