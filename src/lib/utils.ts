import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const splitDimensions = (dims: string): [string, string, string] => {
  const [length, width, height] = dims.split('x');
  return [length || '', width || '', height || ''];
};