import Image from 'next/image'
import { motion } from 'framer-motion'
import Autocomplete from '@mui/joy/Autocomplete';
import { getBooks } from '@/lib/actions'
import Header1 from '@/components/ui/motion-h1';
import Community from '@/components/ui/community';
import FeaturedBooks from '@/components/ui/featuredbooks';

export default async function Home() {
    // const session = await getServerSession(authOptions)
    // const user = session.user

    const books = await getBooks();
  
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="bg-neutral-900 text-neutral-50 py-6 px-8 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <h1 className="text-3xl font-light tracking-wide">City Library</h1>
        <nav className="space-x-8 text-lg opacity-90">
          <a href="#about" className="hover:opacity-60 transition">About</a>
          <a href="#services" className="hover:opacity-60 transition">Services</a>
          <a href="#featured" className="hover:opacity-60 transition">Books</a>
          <a href="#contact" className="hover:opacity-60 transition">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative w-full bg-neutral-100 overflow-hidden">
        <div className="absolute inset-0 bg-neutral-900 opacity-20 mix-blend-multiply"></div>

        <div className="relative py-28 px-6 text-center max-w-4xl mx-auto">
          <Header1 />

          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
            Access books, journals, e‑resources, and curated learning experiences.
          </p>

          <div className="flex justify-center items-center gap-3 max-w-xl mx-auto">
            <Autocomplete
              type="text"
              placeholder="Search for anything..."
              options={books.map((book) => book.title)}
              className="flex-1 px-5 py-3 border border-neutral-300 rounded-lg bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500"

          
            />
            
            <button
              className="px-7 py-3 bg-neutral-800 text-neutral-50 rounded-lg hover:bg-neutral-900 transition shadow"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-light mb-6">About City Library</h2>
        <p className="text-lg text-neutral-600 leading-relaxed max-w-3xl mx-auto">
          City Library blends modern digital convenience with the timeless value of reading. From physical books to curated e‑resources, we support students, creators, researchers, and everyday learners.
        </p>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-6 bg-neutral-50 border-y border-neutral-200">
      <Community />
      </section>

      {/* Featured Books */}
      <section id="featured" className="py-20 px-6 max-w-6xl mx-auto text-center">
        <FeaturedBooks />
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-neutral-900 text-neutral-50 py-10 px-6 text-center mt-10">
        <p className="opacity-80 mb-2">&copy; 2025 City Library</p>
        <p className="opacity-80">All rights reserved | <a className="underline hover:opacity-60" href="#">Privacy Policy</a></p>
      </footer>
    </div>
  )
}
