import React from 'react'
import { cn } from '../../../lib/utils'
import { Badge } from './badge'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../feedback/context-menu'

export interface ContentCardProps {
  title: string
  subtitle?: string
  imageUrl?: string
  imageFallback?: React.ReactNode
  stats?: Array<{
    label: string
    value: string | number
    variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary'
  }>
  badges?: Array<{
    label: string
    variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'outline'
  }>
  variant?: 'campaign' | 'character' | 'npc' | 'location' | 'quest'
  onClick?: () => void
  onContextMenu?: (action: string) => void
  className?: string
  children?: React.ReactNode
}

const variantStyles = {
  campaign: {
    accent: 'from-primary/20 to-primary/60',
    border: 'border-primary/20 hover:border-primary/40'
  },
  character: {
    accent: 'from-blue-500/20 to-blue-500/60',
    border: 'border-blue-500/20 hover:border-blue-500/40'
  },
  npc: {
    accent: 'from-green-500/20 to-green-500/60',
    border: 'border-green-500/20 hover:border-green-500/40'
  },
  location: {
    accent: 'from-orange-500/20 to-orange-500/60',
    border: 'border-orange-500/20 hover:border-orange-500/40'
  },
  quest: {
    accent: 'from-purple-500/20 to-purple-500/60',
    border: 'border-purple-500/20 hover:border-purple-500/40'
  }
}

export function ContentCard({
  title,
  subtitle,
  imageUrl,
  imageFallback,
  stats = [],
  badges = [],
  variant = 'campaign',
  onClick,
  onContextMenu,
  className,
  children
}: ContentCardProps) {
  const variantStyle = variantStyles[variant]

  const contextMenuItems = [
    { label: 'Apri', action: 'open' },
    { label: 'Modifica', action: 'edit' },
    { label: 'Duplica', action: 'duplicate' },
    { label: 'Elimina', action: 'delete' }
  ]

  const cardContent = (
    <div
      className={cn(
        'relative group cursor-pointer',
        'aspect-[4/5] rounded-lg overflow-hidden',
        'border bg-card text-card-foreground shadow-sm',
        'transition-all duration-200 ease-in-out',
        'hover:scale-[1.02] hover:shadow-lg',
        variantStyle.border,
        className
      )}
      onClick={onClick}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            {imageFallback || (
              <div className="text-muted-foreground text-4xl font-fantasy">
                {title.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className={cn(
        'absolute inset-0',
        'bg-gradient-to-t from-black/80 via-black/20 to-transparent',
        'transition-opacity duration-200',
        'group-hover:from-black/90'
      )} />

      {/* Variant-specific accent overlay */}
      <div className={cn(
        'absolute inset-0',
        'bg-gradient-to-t',
        variantStyle.accent,
        'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
      )} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        {/* Badges at top */}
        {badges.length > 0 && (
          <div className="absolute top-4 left-4 flex flex-wrap gap-1">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                variant={badge.variant}
                size="sm"
                className="text-xs"
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Main content at bottom */}
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-white text-lg leading-tight line-clamp-2">
              {title}
            </h3>
            {subtitle && (
              <p className="text-white/80 text-sm line-clamp-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* Stats */}
          {stats.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-1">
                  <span className="text-white/60">{stat.label}:</span>
                  <Badge
                    variant={stat.variant || 'secondary'}
                    size="sm"
                    className="text-xs px-1.5 py-0.5"
                  >
                    {stat.value}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Custom children content */}
          {children && (
            <div className="text-white/80 text-sm">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (onContextMenu) {
    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          {cardContent}
        </ContextMenuTrigger>
        <ContextMenuContent>
          {contextMenuItems.map((item) => (
            <ContextMenuItem
              key={item.action}
              onClick={() => onContextMenu(item.action)}
              className={item.action === 'delete' ? 'text-destructive' : ''}
            >
              {item.label}
            </ContextMenuItem>
          ))}
        </ContextMenuContent>
      </ContextMenu>
    )
  }

  return cardContent
}

// Preset variants for common use cases
export function CampaignCard(props: Omit<ContentCardProps, 'variant'>) {
  return <ContentCard {...props} variant="campaign" />
}

export function CharacterCard(props: Omit<ContentCardProps, 'variant'>) {
  return <ContentCard {...props} variant="character" />
}

export function NPCCard(props: Omit<ContentCardProps, 'variant'>) {
  return <ContentCard {...props} variant="npc" />
}

export function LocationCard(props: Omit<ContentCardProps, 'variant'>) {
  return <ContentCard {...props} variant="location" />
}

export function QuestCard(props: Omit<ContentCardProps, 'variant'>) {
  return <ContentCard {...props} variant="quest" />
}