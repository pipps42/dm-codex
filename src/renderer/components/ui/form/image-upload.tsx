import React, { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../foundation/button'

export interface ImageUploadProps {
  value?: string
  onChange?: (file: File | null, dataUrl?: string) => void
  onError?: (error: string) => void
  accept?: string
  maxSize?: number // in MB
  disabled?: boolean
  className?: string
  placeholder?: string
  previewClassName?: string
}

const ACCEPTED_FORMATS = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']
const DEFAULT_MAX_SIZE = 10 // MB

export function ImageUpload({
  value,
  onChange,
  onError,
  accept = 'image/png,image/jpg,image/jpeg,image/webp',
  maxSize = DEFAULT_MAX_SIZE,
  disabled = false,
  className,
  placeholder = 'Trascina qui un\'immagine o clicca per selezionare',
  previewClassName
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      return `Formato non supportato. Usa: ${ACCEPTED_FORMATS.join(', ')}`
    }

    if (file.size > maxSize * 1024 * 1024) {
      return `File troppo grande. Massimo ${maxSize}MB`
    }

    return null
  }, [maxSize])

  const processFile = useCallback(async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      onError?.(validationError)
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      // Create preview
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      setPreview(dataUrl)
      onChange?.(file, dataUrl)
    } catch (err) {
      const errorMsg = 'Errore durante il caricamento dell\'immagine'
      setError(errorMsg)
      onError?.(errorMsg)
    } finally {
      setIsUploading(false)
    }
  }, [validateFile, onChange, onError])

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    processFile(files[0])
  }, [processFile])

  const handleDragEvents = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    handleDragEvents(e)
    setIsDragging(true)
  }, [handleDragEvents])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    handleDragEvents(e)
    setIsDragging(false)
  }, [handleDragEvents])

  const handleDrop = useCallback((e: React.DragEvent) => {
    handleDragEvents(e)
    setIsDragging(false)

    if (disabled) return

    const files = e.dataTransfer.files
    handleFileSelect(files)
  }, [handleDragEvents, disabled, handleFileSelect])

  const handleClick = useCallback(() => {
    if (disabled) return
    fileInputRef.current?.click()
  }, [disabled])

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    setError(null)
    onChange?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onChange])

  return (
    <div className={cn('relative', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files)}
        disabled={disabled}
        className="sr-only"
        aria-describedby={error ? 'upload-error' : undefined}
      />

      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragEvents}
        onDrop={handleDrop}
        className={cn(
          'relative overflow-hidden rounded-lg border-2 border-dashed border-border transition-all duration-200 cursor-pointer',
          'hover:border-primary/50 hover:bg-accent/50',
          'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
          isDragging && 'border-primary bg-primary/10',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-destructive',
          preview && 'border-solid border-border'
        )}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label="Upload image"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        {preview ? (
          <div className={cn('relative group', previewClassName)}>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              icon={<X className="w-4 h-4" />}
              aria-label="Remove image"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className={cn(
              'mb-4 p-3 rounded-full transition-colors duration-200',
              isDragging ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}>
              {isUploading ? (
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <p className="text-sm font-medium text-foreground mb-1">
              {isUploading ? 'Caricamento...' : placeholder}
            </p>

            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP fino a {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div
          id="upload-error"
          className="mt-2 flex items-center gap-2 text-sm text-destructive"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}