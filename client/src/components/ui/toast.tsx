import * as React from "react"
import { X } from "lucide-react"

const Toast = ({ 
  title, 
  description, 
  variant = "default",
  onClose 
}: { 
  title: string
  description?: string
  variant?: "default" | "destructive"
  onClose?: () => void
}) => {
  const variantClasses = {
    default: "bg-slate-900 border-slate-800 text-slate-50",
    destructive: "bg-red-900/50 border-red-800 text-red-50"
  }

  return (
    <div className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg ${variantClasses[variant]}`}>
      <div className="flex-1">
        <h4 className="font-semibold text-sm">{title}</h4>
        {description && (
          <p className="text-sm opacity-90 mt-1">{description}</p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export { Toast }
