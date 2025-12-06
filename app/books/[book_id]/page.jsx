import { getBookById, checkUserBorrowedBook } from "@/lib/actions"
import Image from "next/image";
import React from 'react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import AnimatedCover from '@/components/ui/AnimatedCover';
import AnimatedInfo from '@/components/ui/AnimatedInfo';
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import BorrowButton from "./BorrowButton";




export default async function BookDetailPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const { book_id } = await params
  const bookId = parseInt(book_id)
  const book = await getBookById(bookId)
  const user = session.user
  
  // Check if user already borrowed this book
  const alreadyBorrowed = await checkUserBorrowedBook(user.id, bookId)


  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-50">
        <h1 className="text-3xl">Book tidak ada</h1>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 py-16 px-4 sm:px-6 lg:px-8">
      <AnimatedContainer>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-neutral-200">
            <div className="grid md:grid-cols-5 gap-8 p-8 lg:p-12">
              
              {/* LEFT SIDE - BOOK COVER */}
              <div className="md:col-span-2 flex justify-center items-start">
                <AnimatedCover>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-400 to-neutral-600 rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                    {book.image ? (
                      <img
                        src={`/${book.image}`}
                        alt={book.title}
                        className="relative w-full max-w-sm aspect-[2/3] rounded-xl shadow-2xl border border-neutral-300 object-cover"
                      />
                    ) : (
                      <div className="relative bg-neutral-200 w-full max-w-sm aspect-[2/3] rounded-xl shadow-2xl border border-neutral-300 flex items-center justify-center overflow-hidden">
                        <span className="text-neutral-400 text-sm">No Cover Available</span>
                      </div>
                    )}
                  </div>
                </AnimatedCover>
              </div>

              {/* RIGHT SIDE - BOOK INFO */}
              <div className="md:col-span-3 flex flex-col justify-center space-y-6">
                <AnimatedInfo>
                  
                  {/* Title */}
                  <h1 className="text-5xl lg:text-6xl font-light text-neutral-900 leading-tight">
                    {book.title}
                  </h1>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-neutral-300 via-neutral-400 to-transparent" />

                  {/* Info Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm uppercase tracking-wider text-neutral-500 font-medium">Author</p>
                      <p className="text-lg text-neutral-800">{book.author}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm uppercase tracking-wider text-neutral-500 font-medium">Publisher</p>
                      <p className="text-lg text-neutral-800">{book.publisher}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm uppercase tracking-wider text-neutral-500 font-medium">Genre</p>
                      <p className="text-lg text-neutral-800">{book.genre}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-wider text-neutral-500 font-medium">Description</p>
                    <p className="text-neutral-700 leading-relaxed text-base">
                      {book.description}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="pt-4 border-t border-neutral-200">
                    <div className="flex items-center gap-3 mb-4">
                      <p className="text-sm uppercase tracking-wider text-neutral-500 font-medium">Status</p>
                      <Badge className="bg-green-500 text-white">Tersedia</Badge>
                      {alreadyBorrowed && (
                        <Badge className="bg-blue-500 text-white">Sudah Dipinjam</Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-neutral-200 space-y-3">
                    {user.role !== 'admin' && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        {alreadyBorrowed ? (
                          <Link href="/borrows" className="flex-1">
                            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Lihat Peminjaman
                            </Button>
                          </Link>
                        ) : (
                          <BorrowButton userId={user.id} bookId={bookId} />
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      <Link href="/books/list" className="flex-1">
                        <Button variant="outline" className="w-full">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Kembali ke Daftar Buku
                        </Button>
                      </Link>
                    </div>
                  </div>

                </AnimatedInfo>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
}