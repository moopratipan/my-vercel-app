"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { ProjectForm } from "@/components/project-form"

export default function AddProjectPage() {
  // ตรวจสอบว่า localStorage พร้อมใช้งานหรือไม่
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold"
          >
            เพิ่มโปรเจคใหม่
          </motion.h1>

          <Link href="/projects">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              กลับไปยังหน้าโปรเจค
            </Button>
          </Link>
        </div>

        <ProjectForm />
      </div>
    </div>
  )
}
