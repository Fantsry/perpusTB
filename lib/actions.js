"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import connection from "./database";
import bcrypt from "bcryptjs";

// ============ USER FUNCTIONS ============

export async function storeUser(formData) {
    const username = formData.get('username');
    const email = formData.get('email');
    const passwordConfirm = formData.get('password_confirm');
    const rawPassword = formData.get('password');

    if (rawPassword != passwordConfirm) {
      throw new Error("Passwords do not match");
    }

    const password = bcrypt.hashSync(rawPassword);

    await connection.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, 'student']
    );
    redirect('/login');
}

export async function getUsers() {
    const [users] = await connection.query("select * from users")
    return users
}

export async function getUserbyEmail(email) {
    const [user] = await connection.query("select * from users where email = ?", [email])
    if (!user.length) return null
    return user[0];
}

export async function getUserById(id) {
  const [rows] = await connection.execute(
    "SELECT * FROM users WHERE user_id = ?",
    [id]
  );
  return rows[0];
}

export async function editUser(formData) {
  const id = formData.get("id");
  const username = formData.get("username");
  const email = formData.get("email");
  const rawPassword = formData.get("password");

  let updateQuery = "UPDATE users SET username = ?, email = ?";
  const params = [username, email];

  if (rawPassword && rawPassword.trim() !== "") {
    const hashedPassword = bcrypt.hashSync(rawPassword);
    updateQuery += ", password = ?";
    params.push(hashedPassword);
  }

  updateQuery += " WHERE user_id = ?";
  params.push(id);

  await connection.execute(updateQuery, params);
  revalidatePath("/profile");
  revalidatePath("/dashboard");
}

// ============ BOOK FUNCTIONS ============


export async function getBookById(id) {
  const [rows] = await connection.execute(
    "SELECT * FROM books WHERE book_id = ?",
    [id]
  );
  return rows[0];
}

export async function createBook(data) {
  const [result] = await connection.execute(
    `INSERT INTO books (title, author, publisher, genre, description, image, available) 
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
    [
      data.title,
      data.author,
      data.publisher,
      data.genre || 'Unknown',
      data.description || '',
      data.image || 'default-book.jpg',
    ]
  );
  revalidatePath("/dashboard");
  revalidatePath("/books/list");
  return result.insertId;
}

export async function updateBook(id, data) {
  const { title, author, publisher, genre, description } = data;

  // Pastikan urutan parameter sama dengan tanda tanya (?)
  const [result] = await connection.execute(
    `UPDATE books
     SET title = ?, author = ?, publisher = ?, genre = ?, description = ?
     WHERE book_id = ?`,
    [title, author, publisher, genre, description, id]
  );

  revalidatePath("/dashboard");
  revalidatePath("/books/list");
  return result;
}


export async function deleteBook(id) {
  await connection.execute(
    "DELETE FROM books WHERE book_id = ?",
    [id]
  );
  revalidatePath("/dashboard");
}

// ============ BORROW FUNCTIONS ============


export async function borrowBook(userId, bookId) {
  try {
    // Validasi input
    if (!userId || !bookId) {
      throw new Error("User ID dan Book ID harus diisi");
    }

    const book = await getBookById(bookId);
    
    if (!book) {
      throw new Error("Buku tidak ditemukan");
    }

    // Check if user already borrowed THIS SPECIFIC BOOK (tidak bisa pinjam 2 copy dari buku yang sama)
    // User BISA pinjam buku LAIN yang berbeda
    const [existingBorrow] = await connection.execute(
      "SELECT * FROM borrows WHERE user_id = ? AND book_id = ? AND status IN ('borrowed', 'progress')",
      [userId, bookId]
    );

    if (existingBorrow.length > 0) {
      throw new Error("Anda sudah meminjam buku ini. Satu user hanya bisa meminjam 1 copy dari buku yang sama.");
    }

    // Start transaction
    try {
      await connection.beginTransaction();

      // Create borrow record - BUKU TETAP TERSEDIA (tidak update available)
      // borrow_date akan otomatis diisi dengan current_timestamp dari default
      await connection.execute(
        `INSERT INTO borrows (user_id, book_id, status) 
         VALUES (?, ?, 'borrowed')`,
        [userId, bookId]
      );

      // TIDAK UPDATE AVAILABLE - BUKU SELALU TERSEDIA
      // Multiple users bisa pinjam buku yang sama, tapi 1 user hanya bisa pinjam 1 copy

      await connection.commit();
      return { success: true, message: "Buku berhasil dipinjam" };
    } catch (error) {
      await connection.rollback();
      console.error('Transaction error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error borrowing book:', error);
    throw error;
  }
}

// Fungsi untuk mendapatkan peminjaman aktif
export async function getActiveBorrows(userId) {
  try {
    const [borrows] = await connection.execute(
      `SELECT b.*, bk.title, bk.author, bk.image, bk.publisher
       FROM borrows b
       JOIN books bk ON b.book_id = bk.book_id
       WHERE b.user_id = ? AND b.status IN ('borrowed', 'progress')
       ORDER BY b.borrow_date DESC`,
      [userId]
    );
    return borrows;
  } catch (error) {
    console.error('Error fetching active borrows:', error);
    return [];
  }
}

// Fungsi untuk mendapatkan semua peminjaman user (semua status)
export async function getUserBorrows(userId) {
  try {
    const [borrows] = await connection.execute(
      `SELECT b.*, bk.title, bk.author, bk.image, bk.publisher
       FROM borrows b
       JOIN books bk ON b.book_id = bk.book_id
       WHERE b.user_id = ?
       ORDER BY b.borrow_date DESC`,
      [userId]
    );
    return borrows;
  } catch (error) {
    console.error('Error fetching user borrows:', error);
    return [];
  }
}

// Fungsi untuk mendapatkan riwayat peminjaman
export async function getBorrowHistory(userId) {
  try {
    const [borrows] = await connection.execute(
      `SELECT b.*, bk.title, bk.author, bk.image, bk.publisher
       FROM borrows b
       JOIN books bk ON b.book_id = bk.book_id
       WHERE b.user_id = ? AND b.status = 'returned'
       ORDER BY b.borrow_date DESC`,
      [userId]
    );
    return borrows;
  } catch (error) {
    console.error('Error fetching borrow history:', error);
    return [];
  }
}

// Fungsi untuk mendapatkan semua peminjaman (admin)
export async function getAllBorrows() {
  try {
    const [borrows] = await connection.execute(
      `SELECT 
        b.*, 
        u.username, 
        u.email, 
        bk.title,
        bk.author,
        bk.image
       FROM borrows b
       JOIN users u ON b.user_id = u.user_id
       JOIN books bk ON b.book_id = bk.book_id
       ORDER BY b.borrow_date DESC`
    );
    return borrows;
  } catch (error) {
    console.error('Error fetching all borrows:', error);
    return [];
  }
}

// Fungsi untuk mengembalikan buku
export async function returnBook(borrowId) {
  try {
    await connection.beginTransaction();

    // Update status peminjaman menjadi 'returned'
    await connection.execute(
      `UPDATE borrows 
       SET status = 'returned', return_date = NOW() 
       WHERE borrow_id = ? AND status IN ('borrowed', 'progress')`,
      [borrowId]
    );

    // TIDAK UPDATE AVAILABLE - BUKU SELALU TERSEDIA
    // Tidak perlu update available karena buku selalu tersedia

    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    console.error('Error returning book:', error);
    return { success: false, error: error.message };
  }
}

// create book
export async function getBooks() {
  try {
    const [books] = await connection.execute(
      `SELECT *, 
        CASE 
          WHEN image IS NULL OR image = '' THEN 'default-book.jpg'
          ELSE image
        END as image
       FROM books 
       ORDER BY title ASC`
    )
    return books
  } catch (error) {
    console.error('Error fetching books:', error)
    return []
  }
}

export async function handleReturnBook(formData) {
  "use server"
  const borrowId = parseInt(formData.get("borrowId"))
  await returnBook(borrowId)
  revalidatePath("/borrows")
}

// Fungsi untuk cek apakah user sudah meminjam buku
export async function checkUserBorrowedBook(userId, bookId) {
  try {
    const [borrows] = await connection.execute(
      "SELECT * FROM borrows WHERE user_id = ? AND book_id = ? AND status IN ('borrowed', 'progress')",
      [userId, bookId]
    );
    return borrows.length > 0;
  } catch (error) {
    console.error('Error checking user borrow:', error);
    return false;
  }
}

// Server action untuk handle borrow
export async function handleBorrowBook(formData) {
  "use server"
  try {
    const userIdStr = formData.get("userId")
    const bookIdStr = formData.get("bookId")
    
    if (!userIdStr || !bookIdStr) {
      return { success: false, error: "User ID dan Book ID harus diisi" }
    }

    const userId = parseInt(userIdStr)
    const bookId = parseInt(bookIdStr)

    if (isNaN(userId) || isNaN(bookId)) {
      return { success: false, error: "User ID dan Book ID harus berupa angka" }
    }

    const result = await borrowBook(userId, bookId)
    revalidatePath(`/books/${bookId}`)
    revalidatePath("/borrows")
    revalidatePath("/books/list")
    return { success: true, message: result.message }
  } catch (error) {
    console.error('handleBorrowBook error:', error)
    return { success: false, error: error.message || "Terjadi kesalahan saat meminjam buku" }
  }
}