import Image from 'next/image'
import { motion } from 'framer-motion'
import Autocomplete from '@mui/joy/Autocomplete';
import { getBooks } from '@/lib/actions'
import Header1 from '@/components/ui/motion-h1';
import Community from '@/components/ui/community';
import FeaturedBooks from '@/components/ui/featuredbooks';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import NavBar from '@/components/NavBar';

export default async function Home() {
    // const session = await getServerSession(authOptions)
    // const user = session.user

    const books = await getBooks();
  
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      
      <NavBar />
      {/* Hero Section */}
      <section className="relative w-full bg-neutral-100 overflow-hidden">
        <div className="absolute inset-0 bg-neutral-900 opacity-20 mix-blend-multiply"></div>

        <div className="relative py-28 px-6 text-center max-w-4xl mx-auto">
          <Header1 />

          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
            Akses buku, jurnal, sumber daya elektronik, dan pengalaman belajar yang dikurasi.
          </p>

          <SearchBar books={books} />
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
        <p className="opacity-80 mb-2">&copy; Biblioteca</p>
        <p className="opacity-80">All rights reserved | <a className="underline hover:opacity-60" href="#">Privacy Policy</a></p>
      </footer>
    </div>
  )
}
