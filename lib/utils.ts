import { clsx, type ClassValue } from "clsx"
import { Arvo, Faustina, IBM_Plex_Serif, Joan, Shippori_Mincho } from "next/font/google";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const font = Faustina({weight: "400", subsets: ["latin"]});

