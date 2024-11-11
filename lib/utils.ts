import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const capitalize = (text: string) =>
  text
    .split(" ")
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(" ");
