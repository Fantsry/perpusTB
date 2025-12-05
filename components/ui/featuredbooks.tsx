"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedBooks() {
  return (
    <section id="featured" className="py-20 px-6 max-w-6xl mx-auto text-center">
      <h2 className="text-4xl font-light mb-12">Koleksi Pilihan</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Book 1 */}
        <Link href="/books/2" className="block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center cursor-pointer hover:scale-[1.03] transition-transform"
          >
            <Image
              src="/atomic_habits.jpg"
              alt="Atomic Habits"
              width={250}
              height={300}
              className="w-full h-72 object-contain rounded-xl shadow-md mb-4 bg-neutral-50 border border-neutral-200"
            />
            <h3 className="text-2xl font-medium mb-2">Atomic Habits</h3>
            <p className="text-neutral-500">By James Clear</p>
          </motion.div>
        </Link>

        {/* Book 2 */}
        <Link href="/books/1" className="block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center cursor-pointer hover:scale-[1.03] transition-transform"
          >
            <Image
              src="/midnight_library.jpg"
              alt="The Midnight Library"
              width={250}
              height={300}
              className="w-full h-72 object-contain rounded-xl shadow-md mb-4 bg-neutral-50 border border-neutral-200"
            />
            <h3 className="text-2xl font-medium mb-2">The Midnight Library</h3>
            <p className="text-neutral-500">By Matt Haig</p>
          </motion.div>
        </Link>

        {/* Book 3 */}
        <Link href="/books/4" className="block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center cursor-pointer hover:scale-[1.03] transition-transform"
          >
            <Image
              src="/sapiens.jpg"
              alt="Sapiens"
              width={250}
              height={300}
              className="w-full h-72 object-contain rounded-xl shadow-md mb-4 bg-neutral-50 border border-neutral-200"
            />
            <h3 className="text-2xl font-medium mb-2">
              Sapiens: A Brief History of Humankind
            </h3>
            <p className="text-neutral-500">By Yuval Noah Harari</p>
          </motion.div>
        </Link>

      </div>
    </section>
  );
}
