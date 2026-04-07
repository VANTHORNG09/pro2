"use client"

import * as React from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastAction = {
  label: string
  onClick: () => void
}

type Toast = ToastProps & {
  id: string
  action?: ToastAction
}

const toastStore: { toasts: Toast[]; listeners: ((toasts: Toast[]) => void)[] } = {
  toasts: [],
  listeners: [],
}

function notify(toast: ToastProps & { id?: string }) {
  const id = toast.id ?? Math.random().toString(36).slice(2)
  const newToast = { ...toast, id }
  toastStore.toasts = [...toastStore.toasts, newToast]
  toastStore.listeners.forEach((l) => l(toastStore.toasts))

  setTimeout(() => {
    toastStore.toasts = toastStore.toasts.filter((t) => t.id !== id)
    toastStore.listeners.forEach((l) => l(toastStore.toasts))
  }, 4000)
}

function dismiss(id: string) {
  toastStore.toasts = toastStore.toasts.filter((t) => t.id !== id)
  toastStore.listeners.forEach((l) => l(toastStore.toasts))
}

export function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>(toastStore.toasts)

  React.useEffect(() => {
    const listener = (t: Toast[]) => setToasts([...t])
    toastStore.listeners.push(listener)
    return () => {
      toastStore.listeners = toastStore.listeners.filter((l) => l !== listener)
    }
  }, [])

  const toast = React.useCallback((props: ToastProps) => notify(props), [])
  const dismissToast = React.useCallback((id: string) => dismiss(id), [])

  return { toast, toasts, dismiss: dismissToast }
}

// Simple toast renderer — drop into your root layout or a provider
export function ToastContainer() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`min-w-[300px] rounded-lg border p-4 shadow-lg transition-all ${
            t.variant === "destructive"
              ? "border-destructive/50 bg-destructive text-destructive-foreground"
              : "border bg-background text-foreground"
          }`}
        >
          {t.title && <p className="font-medium">{t.title}</p>}
          {t.description && <p className="mt-1 text-sm opacity-90">{t.description}</p>}
          <button
            className="absolute right-2 top-2 text-xs opacity-60 hover:opacity-100"
            onClick={() => dismiss(t.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
