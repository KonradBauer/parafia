/**
 * Reusable Page Header component with proper contrast (WCAG AA)
 */
function PageHeader({ title, subtitle }) {
  return (
    <section
      className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 dark:from-primary-700 dark:via-primary-800 dark:to-primary-900 text-white py-16 md:py-24"
      aria-labelledby="page-title"
    >
      <div className="container mx-auto px-4 text-center">
        <h1
          id="page-title"
          className="text-4xl md:text-5xl font-serif font-bold mb-4"
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}

export default PageHeader
