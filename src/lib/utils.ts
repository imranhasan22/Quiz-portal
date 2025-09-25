import { twMerge } from "tailwind-merge";

// 'cn' merges Tailwind class strings safely
export function cn(...inputs: Parameters<typeof twMerge>) {
  return twMerge(...inputs);
}
