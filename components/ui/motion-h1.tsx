"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export default function Header1() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-6xl font-light text-neutral-900 mb-6"
    >
      Your Digital Knowledge Hub
    </motion.h1>
  )
}

