import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, Calendar, Folder } from 'lucide-react'
import PageHeader from '../components/PageHeader'

function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Wszystkie' },
    { id: 'church', name: 'Kościół' },
    { id: 'events', name: 'Uroczystości' },
    { id: 'history', name: 'Archiwum' },
  ]

  // Placeholder images - in real app would come from CMS
  const images = [
    { id: 1, category: 'church', title: 'Widok kościoła', date: '2025' },
    { id: 2, category: 'church', title: 'Ołtarz główny', date: '2025' },
    { id: 3, category: 'church', title: 'Nawa główna', date: '2025' },
    { id: 4, category: 'events', title: 'Boże Ciało 2025', date: '2025' },
    { id: 5, category: 'events', title: 'Pasterka 2024', date: '2024' },
    { id: 6, category: 'events', title: 'I Komunia Święta', date: '2025' },
    { id: 7, category: 'history', title: 'Kościół - lata 60.', date: '1965' },
    { id: 8, category: 'history', title: 'Dawny ołtarz', date: '1970' },
    { id: 9, category: 'church', title: 'Wieża kościelna', date: '2025' },
    { id: 10, category: 'events', title: 'Bierzmowanie 2025', date: '2025' },
    { id: 11, category: 'church', title: 'Organy', date: '2025' },
    { id: 12, category: 'history', title: 'Parafianie - 1950', date: '1950' },
  ]

  const filteredImages = activeCategory === 'all'
    ? images
    : images.filter((img) => img.category === activeCategory)

  const openLightbox = (image) => setSelectedImage(image)
  const closeLightbox = () => setSelectedImage(null)

  const navigateImage = (direction) => {
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id)
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % filteredImages.length
      : (currentIndex - 1 + filteredImages.length) % filteredImages.length
    setSelectedImage(filteredImages[newIndex])
  }

  return (
    <>
      <PageHeader
        title="Galeria"
        subtitle="Zdjęcia z życia parafii i archiwalne fotografie"
      />

      <section className="py-12 md:py-16 bg-cream-100">
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
                    : 'bg-white text-gray-700 hover:bg-primary-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Gallery grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => openLightbox(image)}
                className="group aspect-square bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl overflow-hidden cursor-pointer relative"
              >
                {/* Placeholder - replace with actual image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <ZoomIn size={32} className="text-primary-300" />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/70 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                  <ZoomIn size={32} className="text-white mb-2" />
                  <span className="text-white font-medium text-sm text-center px-2">
                    {image.title}
                  </span>
                </div>

                {/* Date badge */}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {image.date}
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredImages.length === 0 && (
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
          >
            <X size={32} />
          </button>

          {/* Navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateImage('prev')
            }}
            className="absolute left-4 text-white hover:text-gold-400 transition-colors"
          >
            <ChevronLeft size={48} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateImage('next')
            }}
            className="absolute right-4 text-white hover:text-gold-400 transition-colors"
          >
            <ChevronRight size={48} />
          </button>

          {/* Image container */}
          <div
            className="max-w-4xl max-h-[80vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Placeholder for actual image */}
            <div className="bg-gradient-to-br from-primary-200 to-primary-300 rounded-lg aspect-video flex items-center justify-center min-w-[300px] md:min-w-[600px]">
              <span className="text-primary-500 font-medium">{selectedImage.title}</span>
            </div>

            {/* Caption */}
            <div className="text-center mt-4 text-white">
              <h3 className="font-serif text-xl mb-1">{selectedImage.title}</h3>
              <p className="text-gray-400 flex items-center justify-center gap-2">
                <Calendar size={14} />
                {selectedImage.date}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default GalleryPage
