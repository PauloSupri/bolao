import { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'live' | 'info'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-700 text-slate-300',
    success: 'bg-green-900/50 text-green-400 border border-green-700/50',
    warning: 'bg-yellow-900/50 text-yellow-400 border border-yellow-700/50',
    danger: 'bg-red-900/50 text-red-400 border border-red-700/50',
    live: 'bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse',
    info: 'bg-blue-900/50 text-blue-400 border border-blue-700/50',
  }

  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
