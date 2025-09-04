import * as React from 'react'
import { toast } from 'sonner'

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),
  loading: (message: string) => toast.loading(message),
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => toast.promise(promise, messages),
  custom: (jsx: (id: string | number) => React.ReactElement) => toast.custom(jsx),
  dismiss: (toastId?: string | number) => toast.dismiss(toastId),
}

export { toast }