import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import connection from '@/lib/database'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    // Get form data
    const title = formData.get('title')
    const author = formData.get('author')
    const publisher = formData.get('publisher')
    const genre = formData.get('genre')
    const description = formData.get('description')
    const imageFile = formData.get('image')

    // Validate required fields
    if (!title || !author || !publisher) {
      return NextResponse.json(
        { error: 'Judul, Penulis, dan Penerbit wajib diisi' },
        { status: 400 }
      )
    }

    let imagePath = 'default-book.jpg' // Default image in public folder

    // Handle image upload if exists
    if (imageFile && imageFile.size > 0) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { error: 'Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP' },
          { status: 400 }
        )
      }

      // Validate file size (max 5MB)
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Ukuran file maksimal 5MB' },
          { status: 400 }
        )
      }

      // Generate unique filename with original extension
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Get file extension
      const originalName = imageFile.name
      const fileExtension = originalName.split('.').pop().toLowerCase()
      
      // Generate unique filename
      const uniqueFileName = `book-${uuidv4()}.${fileExtension}`
      
      // Path to save in public folder
      const publicDir = path.join(process.cwd(), 'public')
      const filePath = path.join(publicDir, uniqueFileName)
      
      try {
        // Write file to public directory
        await writeFile(filePath, buffer)
        console.log(`File saved to: ${filePath}`)
        
        // Set image path for database (just filename)
        imagePath = uniqueFileName
      } catch (writeError) {
        console.error('Error writing file:', writeError)
        return NextResponse.json(
          { error: 'Gagal menyimpan file' },
          { status: 500 }
        )
      }
    }

    // Save to database
    const [result] = await connection.execute(
      `INSERT INTO books (title, author, publisher, genre, description, image) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, author, publisher, genre || 'Unknown', description || '', imagePath]
    )

    const response = NextResponse.json({
      success: true,
      message: 'Buku berhasil ditambahkan',
      bookId: result.insertId,
      imagePath: imagePath
    })
    
    // Revalidate paths
    response.headers.set('Cache-Control', 'no-store')
    
    return response

  } catch (error) {
    console.error('Error uploading book:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menambahkan buku' },
      { status: 500 }
    )
  }
}