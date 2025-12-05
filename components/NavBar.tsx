import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route"

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="bg-neutral-900 text-neutral-50 py-6 px-8 flex items-center justify-between sticky top-0 z-50 shadow-lg">
      <Link href="/" className="text-3xl font-light tracking-wide hover:opacity-80 transition">
        Biblioteca
      </Link>

      <nav className="flex items-center space-x-8 text-lg opacity-90">
        <a href="#about" className="hover:opacity-100 transition">Tentang</a>
        <a href="#services" className="hover:opacity-100 transition">Fitur</a>
        <a href="#featured" className="hover:opacity-100 transition">Koleksi</a>
        <a href="#contact" className="hover:opacity-100 transition">Kontak</a>

        {session ? (
          <div className="flex items-center space-x-4 pl-8 border-l border-neutral-700">
            {session.user.role === 'admin' && (
              <Link 
                href="/dashboard" 
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Dashboard Admin
              </Link>
            )}
            <Link 
              href="/books/list" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Koleksi Buku
            </Link>
            <Link 
              href="/borrows" 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Peminjaman
            </Link>
            <Link 
              href="/profile" 
              className="bg-neutral-700 text-white px-4 py-2 rounded hover:bg-neutral-600 transition"
            >
              Profil
            </Link>
          </div>
        ) : (
          <Link href="/login" className="bg-neutral-50 text-neutral-900 px-4 py-2 rounded hover:bg-neutral-100 transition">
            Masuk
          </Link>
        )}
      </nav>
    </header>
  );
}
