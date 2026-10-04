import { clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Die eigenen Schriftrollen müssen tailwind-merge bekannt sein, sonst wirft es
// text-meta neben text-muted-foreground weg.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['page', 'kpi', 'object', 'value', 'body', 'meta', 'label', 'section'] }],
    },
  },
})

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


export const isIframe = window.self !== window.top;
