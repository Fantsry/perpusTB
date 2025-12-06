import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getUserBorrows, handleReturnBook } from "@/lib/actions"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default async function BorrowsPage() {
  const session = await getServerSession(authOptions)
  
  // Check authentication
  if (!session) {
    redirect('/login')
  }

  const user = session.user
  const borrows = await getUserBorrows(user.id)


  // Format date helper
  const formatDate = (date: Date | string | null) => {
    if (!date) return "-"
    const d = new Date(date)
    return d.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'borrowed':
        return (
          <Badge className="bg-blue-500 text-white hover:bg-blue-600">
            Dipinjam
          </Badge>
        )
      case 'progress':
        return (
          <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
            Proses
          </Badge>
        )
      case 'returned':
        return (
          <Badge className="bg-green-500 text-white hover:bg-green-600">
            Dikembalikan
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        )
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/books/list" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
            ← Kembali
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Riwayat Peminjaman</h1>
          <p className="text-neutral-600">Lihat semua buku yang pernah Anda pinjam</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {borrows.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Belum Ada Peminjaman
            </h2>
            <p className="text-neutral-600 mb-6">
              Anda belum pernah meminjam buku dari perpustakaan.
            </p>
            <Link
              href="/books/list"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Jelajahi Koleksi Buku
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>Daftar semua peminjaman Anda</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Cover</TableHead>
                    <TableHead>Judul Buku</TableHead>
                    <TableHead>Tanggal Pinjam</TableHead>
                    <TableHead>Tanggal Kembali</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrows.map((borrow: any) => (
                    <TableRow key={borrow.borrow_id}>
                      <TableCell>
                        <div className="relative w-16 h-24 bg-neutral-100 rounded overflow-hidden">
                          {borrow.image ? (
                            <Image
                              src={`/${borrow.image}`}
                              alt={borrow.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-2xl">
                              📚
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold text-neutral-900">
                            {borrow.title}
                          </div>
                          <div className="text-sm text-neutral-600 mt-1">
                            {borrow.author}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-neutral-700">
                          {formatDate(borrow.borrow_date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-neutral-700">
                          {formatDate(borrow.return_date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(borrow.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        {borrow.status === 'borrowed' || borrow.status === 'progress' ? (
                          <form action={handleReturnBook}>
                            <input type="hidden" name="borrowId" value={borrow.borrow_id} />
                            <Button
                              type="submit"
                              variant="default"
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              Kembalikan
                            </Button>
                          </form>
                        ) : (
                          <span className="text-neutral-400 text-sm">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
