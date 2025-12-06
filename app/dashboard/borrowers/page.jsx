import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import { getAllBorrows } from "@/lib/actions"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function BorrowersPage() {
    const session = await getServerSession(authOptions)
    
    // Check authentication and admin role
    if (!session || session.user.role !== 'admin') {
      redirect('/login')
    }

    const borrows = await getAllBorrows()

    const formatDate = (date) => {
      if (!date) return "-"
      const d = new Date(date)
      return d.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getStatusBadge = (status) => {
      const baseClass = "px-3 py-1 rounded-full text-sm font-medium"
      switch(status) {
        case 'borrowed':
          return `${baseClass} bg-blue-100 text-blue-800`
        case 'returned':
          return `${baseClass} bg-green-100 text-green-800`
        case 'overdue':
          return `${baseClass} bg-red-100 text-red-800`
        default:
          return `${baseClass} bg-gray-100 text-gray-800`
      }
    }


    return (
      <div className="p-8">
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
            ← Kembali ke Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Daftar Peminjaman Buku</h1>
          <p className="text-gray-600">Kelola dan monitor semua peminjaman buku oleh pengguna</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableCaption>Total Peminjaman: {borrows?.length || 0}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama Peminjam</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Judul Buku</TableHead>
                <TableHead>Tanggal Pinjam</TableHead>
                <TableHead>Tanggal Kembali</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrows && borrows.length > 0 ? (
                borrows.map((borrow) => (
                  <TableRow key={borrow.borrow_id}>
                    <TableCell className="font-medium">{borrow.borrow_id}</TableCell>
                    <TableCell>{borrow.username}</TableCell>
                    <TableCell>{borrow.email}</TableCell>
                    <TableCell>{borrow.title}</TableCell>
                    <TableCell>{formatDate(borrow.borrow_date)}</TableCell>
                    <TableCell>{formatDate(borrow.return_date)}</TableCell>
                    <TableCell>
                      <span className={getStatusBadge(borrow.status)}>
                        {borrow.status === 'borrowed' ? 'Dipinjam' : 
                         borrow.status === 'returned' ? 'Dikembalikan' :
                         'Terlambat'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Tidak ada data peminjaman
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
}
