import { forwardRef, ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ children, className, hover }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-slate-800/60 border border-slate-700/50 rounded-xl backdrop-blur-sm',
        hover && 'hover:border-slate-600 hover:bg-slate-800/80 transition-all duration-200',
        className
      )}
    >
      {children}
    </div>
  )
})
Card.displayName = 'Card'
