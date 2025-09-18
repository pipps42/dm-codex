import * as React from "react"
import { User } from "lucide-react"
import { cn } from '../../../lib/utils'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  shape?: "circle" | "square"
  fallback?: string
  fallbackIcon?: React.ReactNode
  status?: 'online' | 'offline' | 'busy' | 'away'
}

const avatarSizes = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
  "2xl": "w-20 h-20 text-2xl",
}

const statusColors = {
  online: "bg-green-400",
  offline: "bg-gray-400",
  busy: "bg-red-400",
  away: "bg-yellow-400",
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({
    className,
    src,
    alt,
    size = "md",
    shape = "circle",
    fallback,
    fallbackIcon,
    status,
    ...props
  }, ref) => {
    const [imageError, setImageError] = React.useState(false)
    const [imageLoaded, setImageLoaded] = React.useState(false)

    const handleImageError = () => {
      setImageError(true)
    }

    const handleImageLoad = () => {
      setImageLoaded(true)
      setImageError(false)
    }

    React.useEffect(() => {
      setImageError(false)
      setImageLoaded(false)
    }, [src])

    const shouldShowFallback = !src || imageError || !imageLoaded

    const getFallbackText = () => {
      if (fallback) return fallback
      if (alt) {
        return alt
          .split(' ')
          .map(word => word.charAt(0))
          .slice(0, 2)
          .join('')
          .toUpperCase()
      }
      return ""
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden bg-muted font-medium text-muted-foreground",
          avatarSizes[size],
          shape === "circle" ? "rounded-full" : "rounded-lg",
          className
        )}
        {...props}
      >
        {/* Image */}
        {src && !imageError && (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
        )}

        {/* Fallback */}
        {shouldShowFallback && (
          <div className="flex items-center justify-center w-full h-full">
            {fallbackIcon || (
              fallback || alt ? (
                <span className="font-semibold select-none">
                  {getFallbackText()}
                </span>
              ) : (
                <User className="w-1/2 h-1/2" />
              )
            )}
          </div>
        )}

        {/* Status indicator */}
        {status && (
          <span
            className={cn(
              "absolute -bottom-0 -right-0 block rounded-full ring-2 ring-background",
              statusColors[status],
              size === "xs" ? "w-2 h-2" :
              size === "sm" ? "w-2.5 h-2.5" :
              size === "md" ? "w-3 h-3" :
              size === "lg" ? "w-3.5 h-3.5" :
              size === "xl" ? "w-4 h-4" :
              "w-5 h-5"
            )}
          />
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: Array<{
    id: string | number
    src?: string
    alt?: string
    fallback?: string
  }>
  size?: AvatarProps['size']
  max?: number
  spacing?: 'normal' | 'tight'
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, avatars, size = "md", max = 5, spacing = 'normal', ...props }, ref) => {
    const visibleAvatars = avatars.slice(0, max)
    const remainingCount = Math.max(0, avatars.length - max)

    const spacingClass = spacing === 'tight' ? '-space-x-2' : '-space-x-1'

    return (
      <div
        ref={ref}
        className={cn("flex items-center", spacingClass, className)}
        {...props}
      >
        {visibleAvatars.map((avatar, index) => (
          <Avatar
            key={avatar.id}
            src={avatar.src}
            alt={avatar.alt}
            fallback={avatar.fallback}
            size={size}
            className="ring-2 ring-background"
            style={{ zIndex: visibleAvatars.length - index }}
          />
        ))}
        {remainingCount > 0 && (
          <Avatar
            size={size}
            fallback={`+${remainingCount}`}
            className="ring-2 ring-background bg-muted-foreground/10"
            style={{ zIndex: 0 }}
          />
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = "AvatarGroup"

export interface CharacterAvatarProps extends Omit<AvatarProps, 'fallbackIcon'> {
  characterClass?: string
  level?: number
}

const CharacterAvatar = React.forwardRef<HTMLDivElement, CharacterAvatarProps>(
  ({ characterClass, level, alt, fallback, className, ...props }, ref) => {
    const getClassIcon = (className: string) => {
      // You could import specific class icons here
      switch (className?.toLowerCase()) {
        case 'wizard':
        case 'mago':
          return "🧙‍♂️"
        case 'fighter':
        case 'guerriero':
          return "⚔️"
        case 'rogue':
        case 'ladro':
          return "🗡️"
        case 'cleric':
        case 'chierico':
          return "⚡"
        case 'ranger':
          return "🏹"
        case 'barbarian':
        case 'barbaro':
          return "🪓"
        default:
          return null
      }
    }

    const classIcon = characterClass ? getClassIcon(characterClass) : null

    return (
      <div className="relative">
        <Avatar
          ref={ref}
          className={className}
          alt={alt}
          fallback={fallback}
          fallbackIcon={classIcon ? <span className="text-lg">{classIcon}</span> : undefined}
          {...props}
        />
        {level && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {level}
          </span>
        )}
      </div>
    )
  }
)
CharacterAvatar.displayName = "CharacterAvatar"

export { Avatar, AvatarGroup, CharacterAvatar }