'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AddBookForm() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [previewImage, setPreviewImage] = useState(null)
  const [fileName, setFileName] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    genre: '',
    description: '',
    image: null
  })

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Hanya file gambar yang diperbolehkan (JPG, PNG, GIF)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB')
      return
    }

    setFormData(prev => ({
      ...prev,
      image: file
    }))
    
    setFileName(file.name)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // Remove image
  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }))
    setPreviewImage(null)
    setFileName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  setIsLoading(true)
  setError('')
  setSuccess('')

  try {
    // Validate required fields
    if (!formData.title || !formData.author || !formData.publisher) {
      throw new Error('Judul, Penulis, dan Penerbit wajib diisi')
    }

    // Create FormData for file upload
    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('author', formData.author)
    formDataToSend.append('publisher', formData.publisher)
    formDataToSend.append('genre', formData.genre || 'Unknown')
    formDataToSend.append('description', formData.description || '')
    
    if (formData.image) {
      formDataToSend.append('image', formData.image)
    }

    // Send to API dengan error handling yang lebih baik
    const response = await fetch('/api/books/upload', {
      method: 'POST',
      body: formDataToSend
    })

    // Cek content type response
    const contentType = response.headers.get('content-type')
    
    if (!response.ok) {
      // Coba parse sebagai JSON, jika gagal baca sebagai text
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
      } else {
        const errorText = await response.text()
        console.error('Non-JSON error response:', errorText)
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }
    }

    // Pastikan response adalah JSON
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response')
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message || 'Gagal menambahkan buku')
    }

    setSuccess('Buku berhasil ditambahkan!')
    
    // Reset form
    setFormData({
      title: '',
      author: '',
      publisher: '',
      genre: '',
      description: '',
      image: null
    })
    setPreviewImage(null)
    setFileName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/dashboard')
      router.refresh()
    }, 2000)

  } catch (error) {
    console.error('Submit error details:', error)
    setError(error.message || 'Terjadi kesalahan yang tidak diketahui')
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <form onSubmit={handleSubmit} className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center text-red-800">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center text-green-800">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">{success}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image Upload */}
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Cover Buku
              </label>
              
              <div className="space-y-4">
                {/* Image Preview */}
                {previewImage ? (
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-dashed border-neutral-300">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div 
                    className="aspect-[3/4] rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-neutral-400 mb-4">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-neutral-600 mb-1">
                        Klik untuk upload gambar
                      </p>
                      <p className="text-xs text-neutral-500">
                        JPG, PNG, atau GIF • Maksimal 5MB
                      </p>
                    </div>
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />

                {/* File info */}
                {fileName && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">File dipilih:</span> {fileName}
                    </p>
                  </div>
                )}

                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 border-2 border-blue-500 text-blue-500 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {previewImage ? 'Ganti Gambar' : 'Pilih File Gambar'}
                </button>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Biarkan kosong untuk menggunakan gambar default
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="space-y-6">
            {/* Book Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Judul Buku *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan judul buku"
              />
            </div>

            {/* Author & Publisher */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Penulis *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama penulis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Penerbit *
                </label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama penerbit"
                />
              </div>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Genre
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Genre</option>
                <option value="Fiksi">Fiksi</option>
                <option value="Non-Fiksi">Non-Fiksi</option>
                <option value="Fantasi">Fantasi</option>
                <option value="Romance">Romance</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Misteri">Misteri</option>
                <option value="Horror">Horror</option>
                <option value="Biografi">Biografi</option>
                <option value="Sejarah">Sejarah</option>
                <option value="Pendidikan">Pendidikan</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Deskripsi
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Deskripsi singkat tentang buku"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
              isLoading 
                ? 'bg-blue-400 cursor-wait' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Menyimpan...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Simpan Buku
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            disabled={isLoading}
            className="flex-1 py-4 border-2 border-neutral-300 text-neutral-700 rounded-xl font-bold text-lg hover:bg-neutral-50 transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}