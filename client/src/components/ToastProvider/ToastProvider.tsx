import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Slide from '@mui/material/Slide'
import type { AlertColor } from '@mui/material/Alert'

interface Toast {
    id: number
    message: string
    severity: AlertColor
}

interface ToastContextType {
    showToast: (message: string, severity?: AlertColor) => void
    success: (message: string) => void
    error: (message: string) => void
    warning: (message: string) => void
    info: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) throw new Error('useToast must be used within ToastProvider')
    return context
}

export default function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback((message: string, severity: AlertColor = 'info') => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, severity }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 4000)
    }, [])

    const success = useCallback((message: string) => showToast(message, 'success'), [showToast])
    const error = useCallback((message: string) => showToast(message, 'error'), [showToast])
    const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast])
    const info = useCallback((message: string) => showToast(message, 'info'), [showToast])

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
            {children}
            {toasts.map((toast, index) => (
                <Snackbar
                    key={toast.id}
                    open
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    TransitionComponent={Slide}
                    sx={{ bottom: index * 70 + 24 }}
                >
                    <Alert
                        severity={toast.severity}
                        variant="filled"
                        onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                        sx={{
                            minWidth: 300,
                            boxShadow: 3,
                            animation: 'slideIn 0.3s ease-out',
                            '@keyframes slideIn': {
                                from: {
                                    transform: 'translateX(400px)',
                                    opacity: 0,
                                },
                                to: {
                                    transform: 'translateX(0)',
                                    opacity: 1,
                                },
                            },
                        }}
                    >
                        {toast.message}
                    </Alert>
                </Snackbar>
            ))}
        </ToastContext.Provider>
    )
}

