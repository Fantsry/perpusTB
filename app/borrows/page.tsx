import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"



export default async function BorrowsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')


  return(
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      
    </div>
  )
}