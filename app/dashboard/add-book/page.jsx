import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import { createBook } from "@/lib/actions"
import { redirect } from "next/navigation"
import Link from "next/link"
import AddBookForm from "@/components/addbook/AddBookForm"

export default async function AddBookPage() {
    const session = await getServerSession(authOptions)
    
    // Check authentication and admin role
    if (!session || session.user.role !== 'admin') {
      redirect('/login')
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Dashboard
            </Link>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-8">
              <h1 className="text-3xl font-bold mb-3">Tambah Buku Baru</h1>
              <p className="opacity-90">
                Lengkapi informasi buku untuk menambah koleksi perpustakaan
              </p>
            </div>
          </div>

          {/* Client Component untuk Form */}
          <AddBookForm />
        </div>
      </div>
    )
}