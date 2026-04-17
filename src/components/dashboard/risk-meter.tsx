"use client"

import { RiskLevel } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Shield, AlertTriangle, ShieldAlert } from 'lucide-react'

interface RiskMeterProps {
  riskLevel: RiskLevel
  score?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function RiskMeter({ riskLevel, score, className, size = 'md' }: RiskMeterProps) {
  const riskConfig = {
    LOW: {
      label: 'Low Risk',
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      barColor: 'bg-green-500'
    },
    MEDIUM: {
      label: 'Medium Risk',
      icon: AlertTriangle,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      barColor: 'bg-yellow-500'
    },
    HIGH: {
      label: 'High Risk',
      icon: ShieldAlert,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      barColor: 'bg-red-500'
    }
  }

  const config = riskConfig[riskLevel]
  const IconComponent = config.icon
  
  const sizeClasses = {
    sm: {
      container: 'p-2',
      icon: 'h-3 w-3',
      text: 'text-xs',
      bar: 'h-1'
    },
    md: {
      container: 'p-3',
      icon: 'h-4 w-4',
      text: 'text-sm',
      bar: 'h-1.5'
    },
    lg: {
      container: 'p-4',
      icon: 'h-5 w-5',
      text: 'text-base',
      bar: 'h-2'
    }
  }

  const sizeClass = sizeClasses[size]

  // Convert risk level to percentage for visualization
  const riskPercentage = score || (
    riskLevel === 'LOW' ? 25 :
    riskLevel === 'MEDIUM' ? 60 :
    85
  )

  return (
    <div className={cn(
      'rounded-lg border border-border/50',
      config.bgColor,
      sizeClass.container,
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <IconComponent className={cn(sizeClass.icon, config.color)} />
          <span className={cn('font-medium', sizeClass.text, config.color)}>
            {config.label}
          </span>
        </div>
        {score && (
          <span className={cn('font-mono', sizeClass.text, 'text-muted-foreground')}>
            {score}/100
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        <div className={cn('w-full bg-muted rounded-full', sizeClass.bar)}>
          <div 
            className={cn(
              'rounded-full transition-all duration-500 ease-out',
              sizeClass.bar,
              config.barColor
            )}
            style={{ width: `${Math.min(riskPercentage, 100)}%` }}
          />
        </div>
        {score && (
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        )}
      </div>
    </div>
  )
}