import { getBooks } from '@/lib/actions'
import NavBarList from '@/components/listbook/NavBarList'
import SearchBar from '@/components/SearchBar'
import ClientHeroSection from '@/components/listbook/ClientHeroSection'
import ClientBookGrid from '@/components/listbook/ClientBookGrid'
import ClientCallToAction from '@/components/listbook/ClientCallToAction'

export default async function CatalogPage() {
  const books = await getBooks()

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <NavBarList />
      
      {/* Hero Section */}
      <ClientHeroSection books={books} />

      {/* Grid Buku */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <ClientBookGrid books={books} />
      </section>

      {/* Call to Action */}
      <ClientCallToAction />

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-50 py-10 px-6 text-center">
        <p className="opacity-80 mb-2">&copy; Biblioteca</p>
        <p className="opacity-80">
          All rights reserved |{" "}
          <a className="underline hover:opacity-60" href="#">
            Privacy Policy
          </a>
        </p>
      </footer>
    </div>
  )
}