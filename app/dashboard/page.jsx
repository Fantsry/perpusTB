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
import { getBooks } from "@/lib/actions"

export default async function Dashboard() {
    const session = await getServerSession(authOptions)
    const user = session.user
    const books = await getBooks();
    console.log(user)
    return(
        <div className="flex flex-col items-center justify-center gap-4 h-screen">
          <Image
            src={user.image ? user.image : "/default-profile.png"}
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full"
          />
            <span>Selamat Datang, {user.name}</span>
            <LogoutButton></LogoutButton>
            <Link
          href={`/dashboard/${user.id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit Profil
        </Link>
        <Table>
          <TableCaption>Books</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Author</TableHead>
              <TableHead className="text-right">Publisher</TableHead>
              <TableHead className="text-right">Image</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              books.map((data) => {
                return(
                  <TableRow key={data.id}>
                    <TableCell className="font-medium">{data.book_id}</TableCell>
                    <TableCell>{data.title}</TableCell>
                    <TableCell className="text-right">{data.author}</TableCell>
                    <TableCell className="text-right">{data.publisher}</TableCell>
                    <TableCell className="text-right">
                      <Image
                        src={`/${data.image}`}
                        alt={data.image}
                        width={50}
                        height={75}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/dashboard/editbook/${data.book_id}`}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-2"
                      >
                        Pinjem Woi
                      </Link>
                      <Link
                        href={`/dashboard/deletebook/${data.book_id}`}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
        </div>
    )
}