import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { getUserById, editUser } from "@/lib/actions"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import LogoutButton from "@/components/LogoutButton"
import bcrypt from "bcryptjs"

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)
    
    // Check authentication
    if (!session) {
      redirect('/login')
    }

    const user = session.user
    const userDetails = await getUserById(user.id)

    async function handleSubmit(formData) {
      "use server"
      
      const id = user.id
      const username = formData.get("username")
      const email = formData.get("email")
      const password = formData.get("password")   
      
      const newFormData = new FormData()
      newFormData.append("id", id)
      newFormData.append("username", username)
      newFormData.append("email", email)
      if (password) {
    const hashpassword = bcrypt.hashSync(password);
    newFormData.append("password", hashpassword);
  }

      await editUser(newFormData)
    }

    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200">
          <div className="max-w-2xl mx-auto px-6 py-6">
            <Link href="/books/list" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
              ← Kembali ke Koleksi
            </Link>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Profil Saya</h1>
            <p className="text-neutral-600">Kelola informasi akun dan preferensi Anda</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-neutral-200">
              <Image
                src={user.image ? `/${user.image}` : "/profile.jpg"}
                alt="Profile Picture"
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">{user.name}</h2>
                <p className="text-neutral-600">{user.email}</p>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'admin'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? '👨‍💼 Admin' : '👤 User'}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <form action={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="username"
                  defaultValue={userDetails?.username || user.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nama lengkap Anda"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email Anda"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Baru (Opsional)
                </label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Kosongkan jika tidak ingin mengubah password"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Biarkan kosong untuk tetap menggunakan password lama
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                >
                  Simpan Perubahan
                </button>
                <Link
                  href="/books"
                  className="flex-1 bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-400 transition text-center"
                >
                  Batal
                </Link>
              </div>
              <LogoutButton />
            </form>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/borrows"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center"
            >
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-bold text-neutral-900 mb-1">Peminjaman Saya</h3>
              <p className="text-sm text-neutral-600">Lihat buku yang sedang dipinjam</p>
            </Link>

            <Link
              href="/books"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center"
            >
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-bold text-neutral-900 mb-1">Cari Buku</h3>
              <p className="text-sm text-neutral-600">Jelajahi koleksi perpustakaan</p>
            </Link>
          </div>
        </div>
      </div>
    )
}
