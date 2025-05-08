"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Plus, Edit, Trash2, ArrowLeft, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { Loader } from "@/components/loader"
import ProjectForm, { type ProjectData } from "@/components/project-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatabaseStatus } from "@/components/database-status"
import {
  fetchAllProjects,
  addNewProject,
  updateExistingProject,
  deleteExistingProject,
  resetDatabaseToDefault,
  fetchNextProjectId,
} from "@/lib/database-client"

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [nextId, setNextId] = useState(4)
  const [isResetting, setIsResetting] = useState(false)
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    // โหลดข้อมูลเริ่มต้น
    loadInitialData()

    return () => clearTimeout(timer)
  }, [])

  // โหลดข้อมูลเริ่มต้น
  const loadInitialData = async () => {
    try {
      await loadProjects()
      await loadNextId()
    } catch (error) {
      console.error("Error loading initial data:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลเริ่มต้นได้",
        variant: "destructive",
      })
    }
  }

  // โหลดโปรเจคจากฐานข้อมูล
  const loadProjects = async () => {
    setIsLoadingProjects(true)
    try {
      const allProjects = await fetchAllProjects()
      setProjects(allProjects)
    } catch (error) {
      console.error("Error loading projects:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดโปรเจคได้",
        variant: "destructive",
      })
    } finally {
      setIsLoadingProjects(false)
    }
  }

  // โหลด ID ถัดไปสำหรับโปรเจคใหม่
  const loadNextId = async () => {
    try {
      const id = await fetchNextProjectId()
      setNextId(id)
    } catch (error) {
      console.error("Error loading next ID:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลด ID ถัดไปได้",
        variant: "destructive",
      })
    }
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const menuItems = [
    { name: "Profile", path: "/" },
    { name: "About", path: "/about" },
    { name: "Portfolio", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ]

  // จัดการการบันทึกโปรเจค
  const handleSaveProject = async (project: ProjectData) => {
    setIsSaving(true)
    try {
      let result

      if (editingProject) {
        // อัพเดทโปรเจค
        result = await updateExistingProject(project)
      } else {
        // เพิ่มโปรเจคใหม่
        result = await addNewProject(project)
      }

      // โหลดโปรเจคใหม่
      await loadProjects()
      // อัพเดท ID ถัดไป
      await loadNextId()

      setEditingProject(null)
      setIsDialogOpen(false)

      toast({
        title: editingProject ? "อัพเดทโปรเจคสำเร็จ" : "เพิ่มโปรเจคสำเร็จ",
        description: editingProject ? "อัพเดทโปรเจคเรียบร้อยแล้ว" : "เพิ่มโปรเจคใหม่เรียบร้อยแล้ว",
      })
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกโปรเจคได้",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditProject = (project: ProjectData) => {
    setEditingProject(project)
    setIsDialogOpen(true)
  }

  // จัดการการลบโปรเจค
  const handleDeleteProject = async (id: number) => {
    setIsDeleting(true)
    try {
      const result = await deleteExistingProject(id)

      if (result.success) {
        // โหลดโปรเจคใหม่
        await loadProjects()
        // อัพเดท ID ถัดไป
        await loadNextId()

        toast({
          title: "ลบโปรเจคสำเร็จ",
          description: "ลบโปรเจคเรียบร้อยแล้ว",
        })
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถลบโปรเจคได้",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบโปรเจคได้",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  // จัดการการรีเซ็ตฐานข้อมูล
  const handleResetDefaultProjects = async () => {
    setIsResetting(true)
    try {
      const result = await resetDatabaseToDefault()

      if (result.success) {
        // โหลดโปรเจคใหม่
        await loadProjects()
        // อัพเดท ID ถัดไป
        await loadNextId()

        toast({
          title: "รีเซ็ตฐานข้อมูลสำเร็จ",
          description: "รีเซ็ตกลับไปใช้โปรเจคเริ่มต้นเรียบร้อยแล้ว",
        })

        // รีโหลดหน้าเพื่อให้เห็นการเปลี่ยนแปลง
        setTimeout(() => {
          router.refresh()
        }, 1000)
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถรีเซ็ตฐานข้อมูลได้",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error resetting database:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถรีเซ็ตฐานข้อมูลได้",
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
    }
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

            {/* Admin Content */}
            <main className="pt-24 pb-20">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/projects">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        กลับไปหน้าโปรเจค
                      </Link>
                    </Button>
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="text-3xl md:text-4xl font-bold"
                    >
                      จัดการฐานข้อมูลโปรเจค
                    </motion.h1>
                  </div>

                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-500 border-red-500">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          รีเซ็ตฐานข้อมูล
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>ยืนยันการรีเซ็ตฐานข้อมูล</AlertDialogTitle>
                          <AlertDialogDescription>
                            คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตฐานข้อมูลทั้งหมด? การกระทำนี้จะลบโปรเจคที่คุณสร้างทั้งหมดและไม่สามารถย้อนกลับได้
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleResetDefaultProjects}
                            disabled={isResetting}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {isResetting ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                กำลังรีเซ็ต...
                              </>
                            ) : (
                              "รีเซ็ตฐานข้อมูล"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setEditingProject(null)}
                          className="bg-white text-black hover:bg-gray-200"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          เพิ่มโปรเจคใหม่
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{editingProject ? "แก้ไขโปรเจค" : "เพิ่มโปรเจคใหม่"}</DialogTitle>
                          <DialogDescription>
                            {editingProject ? "แก้ไขข้อมูลโปรเจคตามต้องการ แล้วกดบันทึก" : "กรอกข้อมูลโปรเจคใหม่ แล้วกดบันทึก"}
                          </DialogDescription>
                        </DialogHeader>
                        <ProjectForm
                          onSave={handleSaveProject}
                          existingProject={editingProject || undefined}
                          nextId={nextId}
                          isSaving={isSaving}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Database Status */}
                <div className="mb-8">
                  <DatabaseStatus showDetails={true} showReset={true} onReset={loadProjects} />
                </div>

                <Tabs defaultValue="list" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="list">รายการโปรเจค</TabsTrigger>
                    <TabsTrigger value="add">เพิ่มโปรเจคใหม่</TabsTrigger>
                  </TabsList>

                  <TabsContent value="list">
                    {isLoadingProjects ? (
                      <div className="flex justify-center items-center py-20">
                        <RefreshCw className="h-12 w-12 animate-spin text-gray-400" />
                      </div>
                    ) : projects.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
                          >
                            <div className="aspect-video bg-gray-100 dark:bg-gray-900 relative">
                              <img
                                src={project.image.src || "/placeholder.svg"}
                                alt={project.image.alt || project.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error("Image failed to load:", project.image.src)
                                  e.currentTarget.src = `/placeholder.svg?height=${project.image.height}&width=${project.image.width}&text=Image+Error`
                                }}
                              />
                              <div className="absolute top-2 right-2 flex gap-2">
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className="h-8 w-8 bg-white/80 hover:bg-white text-black"
                                  onClick={() => handleEditProject(project)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      className="h-8 w-8 bg-white/80 hover:bg-red-500 hover:text-white text-red-500"
                                      onClick={() => setDeleteId(project.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>ยืนยันการลบโปรเจค</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        คุณแน่ใจหรือไม่ว่าต้องการลบโปรเจคนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteProject(project.id)}
                                        disabled={isDeleting}
                                      >
                                        {isDeleting ? (
                                          <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            กำลังลบ...
                                          </>
                                        ) : (
                                          "ลบโปรเจค"
                                        )}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold truncate">{project.title}</h3>
                                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                                  {project.category}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                                {project.description || "ไม่มีคำอธิบาย"}
                              </p>
                              <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>ลำดับความสำคัญ: {project.priority === 0 ? "สุ่ม" : project.priority}</span>
                                <span>ID: {project.id}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        <h3 className="text-xl font-medium mb-2">ยังไม่มีโปรเจค</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                          คุณยังไม่ได้เพิ่มโปรเจคใดๆ กดปุ่ม "เพิ่มโปรเจคใหม่" เพื่อเริ่มต้น
                        </p>
                        <Button
                          onClick={() => {
                            setEditingProject(null)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          เพิ่มโปรเจคใหม่
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="add">
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                      <h2 className="text-2xl font-bold mb-6">เพิ่มโปรเจคใหม่</h2>
                      <ProjectForm onSave={handleSaveProject} nextId={nextId} isSaving={isSaving} />
                    </div>
                  </TabsContent>
                </Tabs>
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
          </>
        )}
      </AnimatePresence>
    </>
  )
}
