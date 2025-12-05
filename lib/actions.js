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
      [username, email, password, 'user']
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
  const password = bcrypt.hashSync(formData.get("password"));

  let updateQuery = "UPDATE users SET username = ?, email = ?";
  const params = [username, email];

  if (password) {
    const hashedPassword = bcrypt.hashSync(password);
    updateQuery += ", password = ?";
    params.push(hashedPassword);
  }

  updateQuery += " WHERE user_id = ?";
  params.push(id);

  await connection.execute(updateQuery, params);
  revalidatePath("/dashboard");
  redirect("/dashboard");
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
    `INSERT INTO books (title, author, publisher, genre, description, image ) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.author,
      data.publisher,
      data.genre,
      data.description,
      data.image,

    ]
  );
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

  return result;
  revalidatePath("/dashboard");
}


export async function deleteBook(id) {
  await connection.execute(
    "DELETE FROM books WHERE book_id = ?",
    [id]
  );
  revalidatePath("/dashboard");
}

// ============ BORROW FUNCTIONS ============

// Fungsi untuk meminjam buku - SEKARANG DENGAN due_date
export async function borrowBook(userId, bookId) {
  try {
    const book = await getBookById(bookId);
    
    if (!book) {
      throw new Error("Book not found");
    }

    // Check if book is available
    const [bookStatus] = await connection.execute(
      "SELECT available FROM books WHERE book_id = ?",
      [bookId]
    );
    
    if (bookStatus.length > 0 && bookStatus[0].available === 0) {
      throw new Error("Book is not available");
    }

    // Check if user already borrowed this book
    const [existingBorrow] = await connection.execute(
      "SELECT * FROM borrows WHERE user_id = ? AND book_id = ? AND status IN ('borrowed', 'progress')",
      [userId, bookId]
    );

    if (existingBorrow.length > 0) {
      throw new Error("You already borrowed this book");
    }

    // Start transaction
    const conn = await connection.getConnection();
    
    try {
      await conn.beginTransaction();

      // Calculate due date (14 days from now)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      // Create borrow record - SEKARANG DENGAN due_date
      await conn.execute(
        `INSERT INTO borrows (user_id, book_id, status, due_date) 
         VALUES (?, ?, 'borrowed', ?)`,
        [userId, bookId, dueDate]
      );

      // Update book availability
      await conn.execute(
        "UPDATE books SET available = 0 WHERE book_id = ?",
        [bookId]
      );

      await conn.commit();
      return { success: true, message: "Book borrowed successfully" };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error borrowing book:', error);
    throw error;
  }
}

// Fungsi untuk mendapatkan peminjaman aktif - SEKARANG ORDER BY due_date
export async function getActiveBorrows(userId) {
  try {
    const [borrows] = await connection.execute(
      `SELECT b.*, bk.title, bk.author, bk.image, bk.publisher
       FROM borrows b
       JOIN books bk ON b.book_id = bk.book_id
       WHERE b.user_id = ? AND b.status IN ('borrowed', 'progress')
       ORDER BY b.due_date ASC`,  // SEKARANG ORDER BY due_date
      [userId]
    );
    return borrows;
  } catch (error) {
    console.error('Error fetching active borrows:', error);
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
    const conn = await connection.getConnection();
    
    try {
      await conn.beginTransaction();

      // Update status peminjaman menjadi 'returned'
      await conn.execute(
        `UPDATE borrows 
         SET status = 'returned', return_date = NOW() 
         WHERE borrow_id = ? AND status IN ('borrowed', 'progress')`,
        [borrowId]
      );

      // Dapatkan book_id dari peminjaman
      const [borrowInfo] = await conn.execute(
        "SELECT book_id FROM borrows WHERE borrow_id = ?",
        [borrowId]
      );

      if (borrowInfo.length > 0) {
        const bookId = borrowInfo[0].book_id;
        
        // Update ketersediaan buku
        await conn.execute(
          "UPDATE books SET available = 1 WHERE book_id = ?",
          [bookId]
        );
      }

      await conn.commit();
      return { success: true };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
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