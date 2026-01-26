import { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { X, ChevronLeft, ChevronRight, ZoomIn, Calendar, Folder, Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useGalleryCategories } from '../hooks/useApi'
import { getImageUrl, getGallery } from '../services/api'

function GalleryPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null) // null = show categories, id = show photos

  // Categories
  const { data: categories, loading: categoriesLoading } = useGalleryCategories()

  // Photos - fetch manually when category is selected
  const [photos, setPhotos] = useState([])
  const [photosLoading, setPhotosLoading] = useState(false)

  // Fetch photos when entering a category
  useEffect(() => {
    if (activeCategory !== null) {
      setPhotosLoading(true)
      getGallery(activeCategory)
        .then(data => {
          setPhotos(data || [])
        })
        .catch(err => {
          console.error('Failed to fetch photos:', err)
          setPhotos([])
        })
        .finally(() => {
          setPhotosLoading(false)
        })
    } else {
      setPhotos([])
    }
  }, [activeCategory])

  // Embla carousel for lightbox
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: selectedImageIndex || 0,
  })

  // Sync embla with selected image
  useEffect(() => {
    if (emblaApi && selectedImageIndex !== null) {
      emblaApi.scrollTo(selectedImageIndex, true)
    }
  }, [emblaApi, selectedImageIndex])

  // Update selected index when carousel scrolls
  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      if (selectedImageIndex !== null) {
        setSelectedImageIndex(emblaApi.selectedScrollSnap())
      }
    }

    emblaApi.on('select', onSelect)
    return () => emblaApi.off('select', onSelect)
  }, [emblaApi, selectedImageIndex])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // Keyboard navigation
  useEffect(() => {
    if (selectedImageIndex === null) return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') scrollPrev()
      if (e.key === 'ArrowRight') scrollNext()
      if (e.key === 'Escape') closeLightbox()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImageIndex, scrollPrev, scrollNext])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const openLightbox = (index) => setSelectedImageIndex(index)
  const closeLightbox = () => setSelectedImageIndex(null)

  const enterCategory = (categoryId) => {
    setActiveCategory(categoryId)
  }

  const goBack = () => {
    setActiveCategory(null)
    setPhotos([])
  }

  const getCurrentCategoryName = () => {
    if (!activeCategory || !categories) return ''
    const cat = categories.find(c => c.id === activeCategory)
    return cat?.name || ''
  }

  // INSIDE ALBUM VIEW
  if (activeCategory !== null) {
    return (
      <>
        <PageHeader
          title={getCurrentCategoryName()}
          subtitle="Galeria zdjęć"
        />

        <section className="py-12 md:py-16 bg-cream-100 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            {/* Back button */}
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-gold-600 dark:hover:text-gold-400 transition-colors mb-8"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Powrót do albumów</span>
            </button>

            {photosLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 size={48} className="text-primary-500 animate-spin" />
              </div>
            ) : photos && photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((image, index) => {
                  const imageUrl = getImageUrl(image.imageUrl)
                  return (
                    <div
                      key={image.id}
                      onClick={() => openLightbox(index)}
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
                <ImageIcon size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Brak zdjęć w tym albumie</p>
              </div>
            )}
          </div>
        </section>

        {/* Lightbox with Embla Carousel */}
        {selectedImageIndex !== null && photos && photos.length > 0 && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex flex-col"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gold-400 transition-colors z-20"
              aria-label="Zamknij"
            >
              <X size={32} />
            </button>

            {/* Navigation buttons */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    scrollPrev()
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gold-400 transition-colors z-20 p-2"
                  aria-label="Poprzednie zdjęcie"
                >
                  <ChevronLeft size={48} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    scrollNext()
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gold-400 transition-colors z-20 p-2"
                  aria-label="Następne zdjęcie"
                >
                  <ChevronRight size={48} />
                </button>
              </>
            )}

            {/* Embla Carousel */}
            <div
              className="flex-1 flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-5xl mx-auto" ref={emblaRef}>
                <div className="flex">
                  {photos.map((image, index) => (
                    <div
                      key={image.id}
                      className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-center px-4"
                    >
                      <div className="max-h-[70vh] flex items-center justify-center">
                        {getImageUrl(image.imageUrl) ? (
                          <img
                            src={getImageUrl(image.imageUrl)}
                            alt={image.title}
                            className="max-w-full max-h-[70vh] object-contain rounded-lg"
                            draggable={false}
                          />
                        ) : (
                          <div className="bg-gradient-to-br from-primary-200 to-primary-300 rounded-lg aspect-video flex items-center justify-center min-w-[300px] md:min-w-[600px]">
                            <span className="text-primary-500 font-medium">{image.title}</span>
                          </div>
                        )}
                      </div>

                      {/* Caption */}
                      <div className="text-center mt-4 text-white px-4">
                        <h3 className="font-serif text-xl mb-1">{image.title}</h3>
                        {image.description && (
                          <p className="text-gray-300 text-sm mb-2">{image.description}</p>
                        )}
                        {image.date && (
                          <p className="text-gray-400 flex items-center justify-center gap-2">
                            <Calendar size={14} />
                            {formatDate(image.date)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {selectedImageIndex + 1} / {photos.length}
            </div>
          </div>
        )}
      </>
    )
  }

  // CATEGORIES (ALBUMS) LIST VIEW
  return (
    <>
      <PageHeader
        title="Galeria"
        subtitle="Zdjęcia z życia parafii i archiwalne fotografie"
      />

      <section className="py-12 md:py-16 bg-cream-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {categoriesLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={48} className="text-primary-500 animate-spin" />
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category) => {
                const coverUrl = getImageUrl(category.coverImage)
                return (
                  <div
                    key={category.id}
                    onClick={() => enterCategory(category.id)}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center relative overflow-hidden">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Folder size={64} className="text-primary-300 dark:text-primary-400 group-hover:scale-110 transition-transform" />
                      )}
                      <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/20 transition-colors" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-lg font-semibold text-primary-600 dark:text-primary-300 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Kliknij aby zobaczyć zdjęcia
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Folder size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Galeria jest pusta</p>
              <p className="text-gray-400 text-sm mt-2">Zdjęcia zostaną dodane wkrótce</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default GalleryPage
