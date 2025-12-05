import { getBookById, updateBook } from "@/lib/actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";

export default async function EditBookPage({ params }) {
      const session = await getServerSession(authOptions)
      
      // Check authentication and admin role
      if (!session || session.user.role !== 'admin') {
        redirect('/login')
      }

      const { book_id } = await params;
      const book = await getBookById(book_id);

      if (!book) return <div className="p-8">Buku tidak ditemukan.</div>;

      async function handleSubmit(formData) {
        "use server";

        const title = formData.get("title");
        const author = formData.get("author");
        const publisher = formData.get("publisher");
        const genre = formData.get("genre");
        const description = formData.get("description");

        await updateBook(book_id, {
          title,
          author,
          publisher,
          genre,
          description,
        });

        redirect('/dashboard');
      }

      return (
        <div className="max-w-2xl mx-auto p-8">
          <div className="mb-6">
            <Link href="/dashboard" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
              ← Kembali ke Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Edit Buku</h1>
          </div>

          <form action={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Buku
              </label>
              <input
                name="title"
                defaultValue={book.title}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Judul buku"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penulis
                </label>
                <input
                  name="author"
                  defaultValue={book.author}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Penulis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penerbit
                </label>
                <input
                  name="publisher"
                  defaultValue={book.publisher}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Penerbit"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <input
                  name="genre"
                  defaultValue={book.genre}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Genre"
                />
              </div>

            
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                name="description"
                defaultValue={book.description}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Deskripsi"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit"
                className="flex-1 bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Simpan Perubahan
              </button>
              <Link
                href="/dashboard"
                className="flex-1 bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-400 transition text-center"
              >
                Batal
              </Link>
            </div>
          </form>
        </div>
      );
}
