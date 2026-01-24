import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, Calendar, Folder, Loader2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useGallery } from '../hooks/useApi'

function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')

  const { data: images, loading, error } = useGallery(activeCategory)

  const getMediaUrl = (url) => url
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const categories = [
    { id: 'all', name: 'Wszystkie' },
    { id: 'church', name: 'Kościół' },
    { id: 'events', name: 'Uroczystości' },
    { id: 'community', name: 'Wspólnota' },
    { id: 'other', name: 'Inne' },
  ]

  const openLightbox = (image) => setSelectedImage(image)
  const closeLightbox = () => setSelectedImage(null)

  const navigateImage = (direction) => {
    if (!images || images.length === 0) return
    const currentIndex = images.findIndex((img) => img.id === selectedImage.id)
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % images.length
      : (currentIndex - 1 + images.length) % images.length
    setSelectedImage(images[newIndex])
  }

  return (
    <>
      <PageHeader
        title="Galeria"
        subtitle="Zdjęcia z życia parafii i archiwalne fotografie"
      />

      <section className="py-12 md:py-16 bg-cream-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={48} className="text-primary-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-4">Wystąpił błąd podczas ładowania galerii.</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Spróbuj ponownie
              </button>
            </div>
          ) : images && images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => {
                const imageUrl = getMediaUrl(image.image)
                return (
                  <div
                    key={image.id}
                    onClick={() => openLightbox(image)}
                    className="group aspect-square bg-gradient-to-br from-primary-100 to-primary-200 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden cursor-pointer relative"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ZoomIn size={32} className="text-primary-300" />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/70 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                      <ZoomIn size={32} className="text-white mb-2" />
                      <span className="text-white font-medium text-sm text-center px-2">
                        {image.title}
                      </span>
                    </div>

                    {/* Date badge */}
                    {image.date && (
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {new Date(image.date).getFullYear()}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Folder size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Brak zdjęć w tej kategorii</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gold-400 transition-colors z-10"
            aria-label="Zamknij"
          >
            <X size={32} />
          </button>

          {/* Navigation */}
          {images && images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage('prev')
                }}
                className="absolute left-4 text-white hover:text-gold-400 transition-colors"
                aria-label="Poprzednie zdjęcie"
              >
                <ChevronLeft size={48} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage('next')
                }}
                className="absolute right-4 text-white hover:text-gold-400 transition-colors"
                aria-label="Następne zdjęcie"
              >
                <ChevronRight size={48} />
              </button>
            </>
          )}

          {/* Image container */}
          <div
            className="max-w-4xl max-h-[80vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {getMediaUrl(selectedImage.image) ? (
              <img
                src={getMediaUrl(selectedImage.image)}
                alt={selectedImage.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            ) : (
              <div className="bg-gradient-to-br from-primary-200 to-primary-300 rounded-lg aspect-video flex items-center justify-center min-w-[300px] md:min-w-[600px]">
                <span className="text-primary-500 font-medium">{selectedImage.title}</span>
              </div>
            )}

            {/* Caption */}
            <div className="text-center mt-4 text-white">
              <h3 className="font-serif text-xl mb-1">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-gray-300 text-sm mb-2">{selectedImage.description}</p>
              )}
              {selectedImage.date && (
                <p className="text-gray-400 flex items-center justify-center gap-2">
                  <Calendar size={14} />
                  {formatDate(selectedImage.date)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default GalleryPage
