"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Autocomplete from "@mui/joy/Autocomplete"

export default function SearchBar({ books }) {
  const router = useRouter()
  const [selectedBook, setSelectedBook] = useState(null)

  const handleSearch = () => {
    if (!selectedBook) return
    router.push(`/books/${selectedBook.book_id}`)
  }

  return (
    <div className="flex justify-center items-center gap-3 max-w-xl mx-auto">
      <Autocomplete
        placeholder="Cari buku yang ingin kamu pinjam..."
        options={books}
        getOptionLabel={(b) => b.title}
        onChange={(e, newValue) => setSelectedBook(newValue)}
        className="flex-1 px-5 py-3 border border-neutral-300 rounded-lg bg-neutral-50"
        autoComplete="true"
        autoSelect="true"
      />

      <button
        onClick={handleSearch}
        className="px-7 py-3 bg-neutral-800 text-neutral-50 rounded-lg hover:bg-neutral-900 transition shadow"
      >
        Search
      </button>
    </div>
  )
}
