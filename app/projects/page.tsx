"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ExternalLink, AlertCircle, RefreshCw, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Loader } from "@/components/loader"
import { Lightbox } from "@/components/lightbox"
import {
  type ProjectData,
  getAllProjects,
  sortProjectsByPriority,
  CATEGORIES,
  deleteProject,
  resetProjects,
} from "@/lib/data"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState("all")
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [sortedProjects, setSortedProjects] = useState<ProjectData[]>([])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const pathname = usePathname()
  const masonryRef = useRef(null)

  // ตรวจสอบว่า localStorage พร้อมใช้งานหรือไม่
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  // โหลดโปรเจคเมื่อหน้าถูกโหลด
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    // โหลดข้อมูล
    if (isClient) {
      loadProjects()
    }

    return () => clearTimeout(timer)
  }, [isClient])

  // โหลดโปรเจคจากข้อมูล static และ localStorage
  const loadProjects = () => {
    setIsLoadingProjects(true)
    try {
      const allProjects = getAllProjects()
      console.log("Loaded projects:", allProjects)
      setProjects(allProjects)
      setError(null)
    } catch (error) {
      console.error("Error loading projects:", error)
      setError("ไม่สามารถโหลดโปรเจคได้ กรุณาลองใหม่อีกครั้ง")
    } finally {
      setIsLoadingProjects(false)
    }
  }

  // จัดเรียงโปรเจคตามระดับความสำคัญเมื่อโหลดหน้าหรือเมื่อโปรเจคเปลี่ยนแปลง
  useEffect(() => {
    console.log("Sorting projects by priority:", projects)

    if (projects.length === 0) {
      console.log("No projects to display")
      setSortedProjects([])
      return
    }

    // เรียงลำดับโปรเจคตามระดับความสำคัญ
    const sorted = sortProjectsByPriority(projects)
    console.log("Sorted projects:", sorted)
    setSortedProjects(sorted)
  }, [projects])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const menuItems = [
    { name: "Profile", path: "/" },
    { name: "About", path: "/about" },
    { name: "Portfolio", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ]

  const filters = ["all", ...CATEGORIES]

  const filteredProjects =
    filter === "all" ? sortedProjects : sortedProjects.filter((project) => project.category === filter)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  // ฟังก์ชันสำหรับลบโปรเจค
  const handleDeleteProject = (id: number) => {
    setProjectToDelete(id)
  }

  // ฟังก์ชันสำหรับยืนยันการลบโปรเจค
  const confirmDeleteProject = () => {
    if (projectToDelete === null) return

    const success = deleteProject(projectToDelete)

    if (success) {
      toast({
        title: "ลบโปรเจคสำเร็จ",
        description: "โปรเจคถูกลบออกจากระบบเรียบร้อยแล้ว",
      })

      // โหลดข้อมูลใหม่
      loadProjects()
    } else {
      toast({
        title: "ไม่สามารถลบโปรเจคได้",
        description: "โปรเจคนี้เป็นโปรเจคเริ่มต้นหรือไม่พบในระบบ",
        variant: "destructive",
      })
    }

    setProjectToDelete(null)
  }

  // ฟังก์ชันสำหรับรีเซ็ตข้อมูลโปรเจค
  const handleResetProjects = () => {
    resetProjects()
    loadProjects()
    setIsResetDialogOpen(false)
    toast({
      title: "รีเซ็ตข้อมูลสำเร็จ",
      description: "ข้อมูลโปรเจคทั้งหมดถูกรีเซ็ตเรียบร้อยแล้ว",
    })
  }

  // ตรวจสอบว่าเป็นโปรเจคที่ผู้ใช้เพิ่มเข้ามาหรือไม่
  const isUserProject = (id: number) => {
    const savedProjectsJSON = localStorage.getItem("userProjects")
    const savedProjects: ProjectData[] = savedProjectsJSON ? JSON.parse(savedProjectsJSON) : []
    return savedProjects.some((p) => p.id === id)
  }

  // แสดงระดับความสำคัญของโปรเจค
  const getPriorityLabel = (priority: number) => {
    if (priority === 0) return "ไม่มี"
    if (priority === 1) return "ต่ำ"
    if (priority === 2) return "ปานกลาง"
    if (priority === 3) return "สูง"
    if (priority === 4) return "สูงมาก"
    if (priority === 5) return "สูงสุด"
    return "ไม่ระบุ"
  }

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <>
      {/* Loader */}
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {!loading && (
          <>
            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-md -z-10"></div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl font-bold"
              >
                <Link href="/">Pratipan</Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="hidden md:flex space-x-8"
              >
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    className={cn(
                      "text-sm uppercase tracking-widest hover:text-gray-400 transition-colors",
                      pathname === item.path ? "text-white" : "text-gray-300",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="md:hidden"
              >
                <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white">
                  <Menu size={24} />
                </Button>
              </motion.div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMenu}
                    className="absolute top-6 right-8 text-white"
                  >
                    <X size={24} />
                  </Button>

                  <nav className="flex flex-col items-center space-y-8">
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Link
                          href={item.path}
                          className="text-2xl uppercase tracking-widest hover:text-gray-400 transition-colors"
                          onClick={toggleMenu}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Projects Content */}
            <main className="pt-24 pb-20">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-6xl font-bold"
                  >
                    Portfolio
                  </motion.h1>

                  <div className="flex gap-2">
                    <Link href="/add-project">
                      <Button variant="default" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        เพิ่มโปรเจค
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={loadProjects} disabled={isLoadingProjects}>
                      {isLoadingProjects ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      รีเฟรช
                    </Button>
                    <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          รีเซ็ตข้อมูล
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>ยืนยันการรีเซ็ตข้อมูล</AlertDialogTitle>
                          <AlertDialogDescription>
                            คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตข้อมูลโปรเจคทั้งหมด?
                            การกระทำนี้จะลบโปรเจคทั้งหมดที่คุณเพิ่มเข้ามาและไม่สามารถย้อนกลับได้
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                          <AlertDialogAction onClick={handleResetProjects}>รีเซ็ตข้อมูล</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 flex items-center gap-3"
                  >
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Filters */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex justify-center mb-12"
                >
                  <div className="flex flex-wrap justify-center gap-4">
                    {filters.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setFilter(item)}
                        className={cn(
                          "px-6 py-2 rounded-full text-sm uppercase tracking-widest transition-colors",
                          filter === item
                            ? "bg-white text-black"
                            : "bg-transparent text-white border border-white/20 hover:border-white/50",
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Loading State */}
                {isLoadingProjects && (
                  <div className="flex justify-center items-center py-20">
                    <RefreshCw className="h-12 w-12 animate-spin text-gray-400" />
                  </div>
                )}

                {/* No Projects Message */}
                {!isLoadingProjects && filteredProjects.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                  >
                    <h3 className="text-2xl font-medium mb-4">ไม่พบโปรเจค</h3>
                    <p className="text-gray-400 mb-8">
                      {filter === "all" ? "ยังไม่มีโปรเจคใดๆ ในฐานข้อมูล" : `ไม่พบโปรเจคในหมวดหมู่ "${filter}"`}
                    </p>
                    <Link href="/add-project">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        เพิ่มโปรเจคใหม่
                      </Button>
                    </Link>
                  </motion.div>
                )}

                {/* Masonry Grid */}
                {!isLoadingProjects && filteredProjects.length > 0 && (
                  <div ref={masonryRef} className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    <AnimatePresence mode="wait">
                      {filteredProjects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={cn(
                            "break-inside-avoid mb-6 group relative overflow-hidden rounded-lg",
                            project.priority > 0 && "ring-2 ring-offset-2 ring-offset-black ring-white/20",
                          )}
                        >
                          <div
                            className="relative cursor-pointer"
                            onClick={() => openLightbox(filteredProjects.indexOf(project))}
                          >
                            {/* แสดงระดับความสำคัญ */}
                            {project.priority > 0 && (
                              <div className="absolute top-2 right-2 z-10 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                ความสำคัญ: {getPriorityLabel(project.priority)}
                              </div>
                            )}

                            <img
                              src={project.image.src || "/placeholder.svg"}
                              alt={project.image.alt || project.title}
                              className="w-full h-auto object-cover rounded-lg"
                              style={{ aspectRatio: `${project.image.width} / ${project.image.height}` }}
                              width={project.image.width}
                              height={project.image.height}
                              loading="lazy"
                              onError={(e) => {
                                console.error("Image failed to load:", project.image.src)
                                e.currentTarget.src = `/placeholder.svg?height=${project.image.height}&width=${project.image.width}&text=Image+Error`
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                              <p className="text-gray-300 mb-4">{project.description}</p>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-white text-white hover:bg-white/10 rounded-full text-xs uppercase tracking-widest"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openLightbox(filteredProjects.indexOf(project))
                                  }}
                                >
                                  <ExternalLink size={14} className="mr-1" />
                                  View Larger
                                </Button>
                                <span className="text-xs text-gray-400 capitalize px-2 py-1 bg-white/10 rounded-full">
                                  {project.category}
                                </span>

                                {/* ปุ่มลบโปรเจค (แสดงเฉพาะโปรเจคที่ผู้ใช้เพิ่มเข้ามา) */}
                                {isUserProject(project.id) && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        className="rounded-full text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                        }}
                                      >
                                        <Trash2 size={14} />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>ยืนยันการลบโปรเจค</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          คุณแน่ใจหรือไม่ว่าต้องการลบโปรเจค "{project.title}"? การกระทำนี้ไม่สามารถย้อนกลับได้
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteProject(project.id)}>
                                          ลบโปรเจค
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </main>

            {/* Footer */}
            <footer className="py-10 bg-black border-t border-white/10">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-xl font-bold mb-6 md:mb-0"
                  >
                    Pratipan
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex space-x-6 mb-6 md:mb-0"
                  >
                    {["Twitter", "Instagram", "Dribbble", "LinkedIn"].map((social, index) => (
                      <a key={index} href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                        {social}
                      </a>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-sm text-gray-400"
                  >
                    © 2023 Reframe. All rights reserved.
                  </motion.div>
                </div>
              </div>
            </footer>

            {/* Lightbox */}
            {filteredProjects.length > 0 && (
              <Lightbox
                images={filteredProjects.map((p) => p.image)}
                initialIndex={lightboxIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
              />
            )}

            {/* Alert Dialog สำหรับยืนยันการลบโปรเจค */}
            <AlertDialog open={projectToDelete !== null} onOpenChange={(open) => !open && setProjectToDelete(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>ยืนยันการลบโปรเจค</AlertDialogTitle>
                  <AlertDialogDescription>
                    คุณแน่ใจหรือไม่ว่าต้องการลบโปรเจคนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setProjectToDelete(null)}>ยกเลิก</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDeleteProject}>ลบโปรเจค</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
