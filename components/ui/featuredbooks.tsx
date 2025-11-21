"use client"

import { getBooks } from "@/lib/actions";
import { motion } from "motion/react"
import Image from 'next/image'



export default function FeaturedBooks() {
  return (
    <section id="featured" className="py-20 px-6 max-w-6xl mx-auto text-center">
    <h2 className="text-4xl font-light mb-12">Featured Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              img: '/atomic_habits.jpg',
              title: 'Atomic Habits',
              author: 'James Clear',
            },
            {
              img: '/book2.jpg',
              title: 'To Kill a Mockingbird',
              author: 'Harper Lee',
            },
            {
              img: '/book3.jpg',
              title: '1984',
              author: 'George Orwell',
            },
          ].map((book, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
                
              <Image
                src={book.img}
                alt={book.title}
                width={250}
                height={300}
                className="w-full h-72 object-contain rounded-xl shadow-md mb-4 bg-neutral-50 border border-neutral-200"
              />
              <h3 className="text-2xl font-medium mb-2">{book.title}</h3>
              <p className="text-neutral-500">By {book.author}</p>
            </motion.div>
          ))}
        </div>
        </section>
  )
} 