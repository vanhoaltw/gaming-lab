import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const pad = (n: number) => (n > 9 ? `${n}` : `0${n}`)

export function verifyImageResponse(url: string) {
  return new Promise((res, rej) => {
    const image = new Image()
    image.src = url
    image.crossOrigin = "anonymous"
    image.onload = res
    image.onerror = rej
  })
}

export function durationDisplay(counter: number) {
  const days = ~~(counter / 86400)
  const remain = counter - days * 86400
  const hrs = ~~(remain / 3600)
  const min = ~~((remain - hrs * 3600) / 60)
  const sec = ~~(remain % 60)
  return `${hrs > 0 ? `${pad(hrs)}:` : ""}${pad(min)}:${pad(sec)}`
}
