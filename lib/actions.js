"use server";

import { redirect } from "next/navigation";
import connection from "./database";
import bcrypt from "bcryptjs";



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
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    redirect('/login');
}

export async function getUsers() {
    const [users] = await connection.query("select * from users")

    return users
}
export async function getBooks() {
   const [books] = await connection.query(
    'SELECT * FROM books'
  )

  return books;
}
export async function getProductById() {
   const [books] = await connection.query(
    `SELECT * FROM books where book_id = ${id}`
  )

  return books;
}

export async function getUserbyEmail(email) {
    const [user] = await connection.query("select * from users where email = ?", [email])

    if (!user.length) return null
    
    return user[0];
}
export async function editUser(formData) {
  const id = formData.get("id");
  const username = formData.get("username");
  const email = formData.get("email");
  const password = bcrypt.hashSync(formData.get("password"));

    await connection.execute(
      "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?",
      [username, email, password, id]
    );
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
export async function getBookById(id) {
  const [rows] = await connection.execute(
    "SELECT * FROM books WHERE book_id = ?",
    [id]
  );

  return rows[0];
}
