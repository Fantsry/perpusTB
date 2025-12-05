// components/catalog/ClientBookGrid.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface Book {
  book_id: string
  title: string
  author: string
  publisher: string
  image: string
  genre: string
  year?: string
}

interface ClientBookGridProps {
  books: Book[]
}

const bookVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
}

export default function ClientBookGrid({ books }: ClientBookGridProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      {books.map((data, index) => (
        <motion.div
          key={data.book_id}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={bookVariants}
          whileHover={{ y: -8 }}
          className="h-full"
        >
          <Link 
            href={`/books/${data.book_id}`}
            className="group block h-full"
          >
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:border-neutral-200 h-full flex flex-col">
              {/* Image Container */}
              <div className="relative h-64 bg-gradient-to-br from-neutral-50 to-neutral-100">
                {data.image ? (
                  <Image
                    src={`/${data.image}`}
                    alt={data.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-neutral-300 text-5xl">📚</div>
                  </div>
                )}
                
                {/* Genre Badge Overlay */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
                    {data.genre}
                  </span>
                </div>
              </div>
              
              {/* Book Info */}
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="font-medium text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {data.title}
                </h3>
                
                <div className="mt-auto space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-600 font-medium">
                      {data.author}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {data.publisher}
                    </p>
                  </div>
                  
                  
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-600 text-sm font-medium">
                        Tersedia
                      </span>
                    </div>
                    
                    <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 flex items-center gap-1 transition-colors">
                      Detail
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}