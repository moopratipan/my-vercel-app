"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LightboxProps {
  images: Array<{
    src: string
    width: number
    height: number
    alt?: string
  }>
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}

export function Lightbox({ images, initialIndex, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Reset current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        navigatePrev()
      } else if (e.key === "ArrowRight") {
        navigateNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentIndex, images.length])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const navigateNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const navigatePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const handleDownload = () => {
    if (images[currentIndex]) {
      const link = document.createElement("a")
      link.href = images[currentIndex].src
      link.download = `image-${currentIndex + 1}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (!isOpen) return null

  const currentImage = images[currentIndex]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white z-50 hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        >
          <X size={24} />
        </Button>

        {/* Download button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-16 text-white z-50 hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation()
            handleDownload()
          }}
        >
          <Download size={20} />
        </Button>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 text-white z-50 hover:bg-white/10 h-12 w-12"
              onClick={(e) => {
                e.stopPropagation()
                navigatePrev()
              }}
            >
              <ChevronLeft size={32} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-white z-50 hover:bg-white/10 h-12 w-12"
              onClick={(e) => {
                e.stopPropagation()
                navigateNext()
              }}
            >
              <ChevronRight size={32} />
            </Button>
          </>
        )}

        {/* Image container */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative max-w-full max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={currentImage?.src || "/placeholder.svg"}
            alt={currentImage?.alt || `Image ${currentIndex + 1}`}
            className="max-h-[90vh] max-w-full object-contain"
            style={{
              aspectRatio: currentImage ? `${currentImage.width} / ${currentImage.height}` : "auto",
            }}
          />

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
