import * as React from "react"

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "destructive" | "outline" }
>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-800 text-slate-50 hover:bg-slate-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "text-slate-50 border border-slate-800"
  }

  return (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${variantClasses[variant]} ${className || ''}`}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
