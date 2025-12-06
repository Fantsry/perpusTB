import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import LogoutButton from "@/components/LogoutButton"
import Link from "next/link"
import Image from "next/image"
import { getBooks, deleteBook } from "@/lib/actions"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export default async function Dashboard() {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      redirect('/login')
    }

    const user = session.user
    

    if (user.role !== 'admin') {
      redirect('/profile')
    }

    const books = await getBooks();
    const sortedBooks = books.sort((a, b) => a.book_id - b.book_id)


    async function handleDeleteBook(bookId) {
      "use server"
      await deleteBook(bookId);
      revalidatePath("/dashboard");
    }

    return(
        <div className="p-8">
          <div className="mb-8">
          <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali
            </Link>
            <div className="flex items-center justify-between mb-4">
              
              <div className="flex items-center gap-4">
                <Image
                  src={user.image ? `/${user.image}` : "/profile.jpg"}
                  alt="Profile Picture"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-3xl font-bold">Dashboard Admin</h1>
                  <p className="text-gray-600">Selamat Datang, {user.name}</p>
                </div>
              </div>
              <LogoutButton />
            </div>
          </div>

          <div className="mb-8 flex gap-4">
            <Link
              href="/dashboard/add-book"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              + Tambah Buku
            </Link>
            <Link
              href="/dashboard/borrowers"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Lihat Peminjam
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableCaption>Daftar Buku di Perpustakaan</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Penerbit</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Gambar</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBooks.map((data) => {
                  return(
                    <TableRow key={data.book_id}>
                      <TableCell className="font-medium">{data.book_id}</TableCell>
                      <TableCell>{data.title}</TableCell>
                      <TableCell>{data.author}</TableCell>
                      <TableCell>{data.publisher}</TableCell>
                      <TableCell>{data.genre}</TableCell>
                      <TableCell>
                        {data.image && (
                          <Image
                            src={`/${data.image}`}
                            alt={data.title}
                            width={50}
                            height={75}
                            className="object-cover"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link
                            href={`/dashboard/editbook/${data.book_id}`}
                            className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                          >
                            Edit
                          </Link>
                          <form
                            action={async () => {
                              "use server"
                              await handleDeleteBook(data.book_id)
                            }}
                            style={{ display: "inline" }}
                          >
                            <button
                              type="submit"
                              className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
    )
}