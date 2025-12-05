// components/catalog/ClientHeroSection.tsx
'use client'

import { motion } from 'framer-motion'
import SearchBar from '@/components/SearchBar'

interface ClientHeroSectionProps {
  books: any[]
}

export default function ClientHeroSection({ books }: ClientHeroSectionProps) {
  return (
    <section className="relative w-full bg-neutral-100 overflow-hidden">
      <div className="absolute inset-0 bg-neutral-900 opacity-10 mix-blend-multiply"></div>
        
      <div className="relative py-20 px-6 text-center max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-light mb-6"
        >
          Katalog Buku
        </motion.h1>
          
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-neutral-600 max-w-2xl mx-auto mb-10"
        >
          Jelajahi koleksi lengkap buku kami. Temukan bacaan yang sesuai dengan minat Anda.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SearchBar books={books} />
        </motion.div>
          
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-neutral-500"
        >
          Menampilkan {books.length} buku tersedia
        </motion.p>
      </div>
    </section>
  )
}