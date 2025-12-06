'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { handleBorrowBook } from "@/lib/actions"

export default function BorrowButton({ userId, bookId }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validasi
    if (!userId || !bookId) {
      setError('User ID atau Book ID tidak valid')
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('userId', userId.toString())
    formData.append('bookId', bookId.toString())

    try {
      const result = await handleBorrowBook(formData)
      
      if (result && result.success) {
        // Redirect to borrows page after successful borrow
        router.push('/borrows')
        router.refresh()
      } else {
        const errorMsg = result?.error || 'Gagal meminjam buku'
        setError(errorMsg)
        console.error('Borrow failed:', errorMsg)
      }
    } catch (err) {
      const errorMsg = err.message || 'Terjadi kesalahan saat meminjam buku'
      setError(errorMsg)
      console.error('Borrow error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memproses...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Pinjam Buku
          </>
        )}
      </Button>
    </form>
  )
}

