import * as React from "react"
import { Search, FileX, Users, Book, Dice6, Plus, RefreshCw } from "lucide-react"
import { cn } from '../../../lib/utils'
import { Button } from '../foundation/button'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "search" | "error" | "loading"
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline"
  }
  size?: "sm" | "md" | "lg"
}

const emptyStateVariants = {
  size: {
    sm: {
      container: "py-8",
      icon: "w-12 h-12 mb-3",
      title: "text-base font-medium",
      description: "text-sm",
    },
    md: {
      container: "py-12",
      icon: "w-16 h-16 mb-4",
      title: "text-lg font-semibold",
      description: "text-sm",
    },
    lg: {
      container: "py-16",
      icon: "w-20 h-20 mb-6",
      title: "text-xl font-semibold",
      description: "text-base",
    },
  },
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({
    className,
    variant = "default",
    icon,
    title,
    description,
    action,
    size = "md",
    ...props
  }, ref) => {
    const sizeConfig = emptyStateVariants.size[size]

    const defaultIcons = {
      default: <FileX className="w-full h-full" />,
      search: <Search className="w-full h-full" />,
      error: <FileX className="w-full h-full" />,
      loading: <RefreshCw className="w-full h-full animate-spin" />,
    }

    const displayIcon = icon || defaultIcons[variant]

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center",
          sizeConfig.container,
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "text-muted-foreground mb-4",
            sizeConfig.icon
          )}
        >
          {displayIcon}
        </div>

        <h3 className={cn("text-foreground mb-2", sizeConfig.title)}>
          {title}
        </h3>

        {description && (
          <p className={cn("text-muted-foreground max-w-sm mx-auto mb-6", sizeConfig.description)}>
            {description}
          </p>
        )}

        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || "default"}
            size={size === "sm" ? "sm" : "md"}
          >
            {action.label}
          </Button>
        )}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

export interface NoResultsProps extends Omit<EmptyStateProps, 'variant' | 'icon' | 'title'> {
  searchTerm?: string
  onClearSearch?: () => void
}

const NoResults = React.forwardRef<HTMLDivElement, NoResultsProps>(
  ({ searchTerm, onClearSearch, description, action, ...props }, ref) => {
    const defaultDescription = searchTerm
      ? `Nessun risultato trovato per "${searchTerm}". Prova con termini diversi.`
      : "Nessun risultato trovato. Prova a modificare i filtri di ricerca."

    const defaultAction = onClearSearch
      ? {
          label: "Cancella ricerca",
          onClick: onClearSearch,
          variant: "outline" as const,
        }
      : action

    return (
      <EmptyState
        ref={ref}
        variant="search"
        title="Nessun risultato"
        description={description || defaultDescription}
        action={defaultAction}
        {...props}
      />
    )
  }
)
NoResults.displayName = "NoResults"

export interface NoDataProps extends Omit<EmptyStateProps, 'variant' | 'icon' | 'title'> {
  entityType: 'characters' | 'campaigns' | 'spells' | 'items' | 'monsters' | 'sessions'
  onCreateNew?: () => void
}

const entityConfig = {
  characters: {
    icon: <Users className="w-full h-full" />,
    title: "Nessun personaggio",
    description: "Non hai ancora creato nessun personaggio. Inizia creandone uno nuovo.",
    actionLabel: "Crea Personaggio",
  },
  campaigns: {
    icon: <Book className="w-full h-full" />,
    title: "Nessuna campagna",
    description: "Non hai ancora creato nessuna campagna. Inizia la tua prima avventura.",
    actionLabel: "Nuova Campagna",
  },
  spells: {
    icon: <Dice6 className="w-full h-full" />,
    title: "Nessun incantesimo",
    description: "La lista degli incantesimi è vuota. Aggiungi alcuni incantesimi alla tua collezione.",
    actionLabel: "Aggiungi Incantesimo",
  },
  items: {
    icon: <FileX className="w-full h-full" />,
    title: "Nessun oggetto",
    description: "Non ci sono oggetti magici nella tua collezione. Inizia ad aggiungerne alcuni.",
    actionLabel: "Aggiungi Oggetto",
  },
  monsters: {
    icon: <FileX className="w-full h-full" />,
    title: "Nessun mostro",
    description: "Il tuo bestiario è vuoto. Aggiungi alcuni mostri per le tue avventure.",
    actionLabel: "Aggiungi Mostro",
  },
  sessions: {
    icon: <FileX className="w-full h-full" />,
    title: "Nessuna sessione",
    description: "Non ci sono sessioni programmate. Pianifica la tua prossima avventura.",
    actionLabel: "Nuova Sessione",
  },
}

const NoData = React.forwardRef<HTMLDivElement, NoDataProps>(
  ({ entityType, onCreateNew, description, action, ...props }, ref) => {
    const config = entityConfig[entityType]

    const defaultAction = onCreateNew
      ? {
          label: config.actionLabel,
          onClick: onCreateNew,
        }
      : action

    return (
      <EmptyState
        ref={ref}
        icon={config.icon}
        title={config.title}
        description={description || config.description}
        action={defaultAction}
        {...props}
      />
    )
  }
)
NoData.displayName = "NoData"

export interface LoadingStateProps extends Omit<EmptyStateProps, 'variant' | 'icon' | 'title'> {
  message?: string
}

const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ message = "Caricamento in corso...", ...props }, ref) => {
    return (
      <EmptyState
        ref={ref}
        variant="loading"
        title={message}
        {...props}
      />
    )
  }
)
LoadingState.displayName = "LoadingState"

export interface ErrorStateProps extends Omit<EmptyStateProps, 'variant' | 'icon' | 'title'> {
  error?: Error | string
  onRetry?: () => void
}

const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ error, onRetry, description, action, ...props }, ref) => {
    const errorMessage = error instanceof Error ? error.message : error
    const defaultDescription = description || errorMessage || "Si è verificato un errore durante il caricamento dei dati."

    const defaultAction = onRetry
      ? {
          label: "Riprova",
          onClick: onRetry,
          variant: "outline" as const,
        }
      : action

    return (
      <EmptyState
        ref={ref}
        variant="error"
        title="Errore di caricamento"
        description={defaultDescription}
        action={defaultAction}
        {...props}
      />
    )
  }
)
ErrorState.displayName = "ErrorState"

export { EmptyState, NoResults, NoData, LoadingState, ErrorState }