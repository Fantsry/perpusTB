"use client"

import { motion } from "motion/react"



export default function Community() {
  return (
    <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              'Book borrowing & returns',
              'Digital e‑books & journals',
              'Quiet study rooms',
              'Community events & workshops',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-neutral-100 p-6 rounded-xl border border-neutral-200 shadow-sm text-neutral-700"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
  )
} 