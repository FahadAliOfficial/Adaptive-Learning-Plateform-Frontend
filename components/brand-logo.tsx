import { cn } from "@/lib/utils"

interface BrandLogoProps {
  className?: string
  imageClassName?: string
}

export function BrandLogo({ className, imageClassName }: BrandLogoProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl bg-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-100 dark:bg-slate-950 dark:ring-slate-700",
        className
      )}
    >
      <img
        src="/rapl-icon.png"
        alt="RAPL AI logo"
        className={cn("h-full w-full object-contain", imageClassName)}
      />
    </div>
  )
}
