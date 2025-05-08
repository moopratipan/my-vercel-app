import type { ProjectData } from "@/components/project-form"

// ข้อมูลโปรเจกต์เริ่มต้น
export const defaultProjects: ProjectData[] = [
  {
    id: 1,
    title: "Promotional Graphics",
    category: "Promotional Graphics",
    description: "Marketing & Promotional Materials",
    image: {
      src: "/placeholder.svg?height=800&width=800&text=Promotional+Graphics",
      width: 800,
      height: 800,
      alt: "Promotional Graphics",
    },
    orientation: "landscape",
    priority: 0,
    createdAt: Date.now(),
  },
  {
    id: 2,
    title: "UI/UX Design",
    category: "UX/UI Design",
    description: "Website and Application Design",
    image: {
      src: "/placeholder.svg?height=800&width=600&text=UI/UX+Design",
      width: 600,
      height: 800,
      alt: "UI/UX Design",
    },
    orientation: "portrait",
    priority: 0,
    createdAt: Date.now(),
  },
  {
    id: 3,
    title: "Social Media & Marketing Graphics",
    category: "Social Media Announcements",
    description: "Social Media and Online Advertising Graphics",
    image: {
      src: "/placeholder.svg?height=800&width=800&text=Social+Media",
      width: 800,
      height: 800,
      alt: "Social Media & Marketing Graphics",
    },
    orientation: "square",
    priority: 0,
    createdAt: Date.now(),
  },
]

// คีย์สำหรับเก็บข้อมูลใน localStorage
const DB_KEY = "portfolio_database"
const DB_VERSION_KEY = "portfolio_database_version"
const CURRENT_DB_VERSION = 1

// สถานะการเชื่อมต่อกับฐานข้อมูล
export type DatabaseStatus = "connected" | "disconnected" | "error" | "initializing"

// ข้อมูลสถิติของฐานข้อมูล
export interface DatabaseStats {
  totalProjects: number
  lastUpdated: number | null
  dbVersion: number
  dbSize: string // ขนาดข้อมูลในหน่วย KB
}

// ตรวจสอบว่าอยู่ในสภาพแวดล้อมที่มี localStorage หรือไม่
const isBrowser = typeof window !== "undefined"

// ฟังก์ชันสำหรับเริ่มต้นฐานข้อมูล
export function initializeDatabase(): { success: boolean; message: string } {
  try {
    if (!isBrowser) {
      return { success: false, message: "ไม่สามารถเริ่มต้นฐานข้อมูลได้: ไม่พบ localStorage" }
    }

    // ตรวจสอบเวอร์ชันของฐานข้อมูล
    const dbVersion = localStorage.getItem(DB_VERSION_KEY)

    // ถ้าไม่มีข้อมูลหรือเวอร์ชันไม่ตรงกับปัจจุบัน ให้เริ่มต้นฐานข้อมูลใหม่
    if (!dbVersion || Number.parseInt(dbVersion) < CURRENT_DB_VERSION) {
      localStorage.setItem(DB_KEY, JSON.stringify(defaultProjects))
      localStorage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION.toString())
      console.log("เริ่มต้นฐานข้อมูลใหม่ด้วยข้อมูลเริ่มต้น")
      return { success: true, message: "เริ่มต้นฐานข้อมูลใหม่สำเร็จ" }
    }

    // ตรวจสอบว่ามีข้อมูลในฐานข้อมูลหรือไม่
    const dbData = localStorage.getItem(DB_KEY)
    if (!dbData) {
      localStorage.setItem(DB_KEY, JSON.stringify(defaultProjects))
      console.log("ไม่พบข้อมูลในฐานข้อมูล เริ่มต้นด้วยข้อมูลเริ่มต้น")
      return { success: true, message: "เริ่มต้นฐานข้อมูลด้วยข้อมูลเริ่มต้นสำเร็จ" }
    }

    return { success: true, message: "เชื่อมต่อกับฐานข้อมูลสำเร็จ" }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเริ่มต้นฐานข้อมูล:", error)
    return { success: false, message: `เกิดข้อผิดพลาดในการเริ่มต้นฐานข้อมูล: ${error}` }
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลสถิติของฐานข้อมูล
export function getDatabaseStats(): DatabaseStats {
  try {
    if (!isBrowser) {
      return {
        totalProjects: 0,
        lastUpdated: null,
        dbVersion: 0,
        dbSize: "0 KB",
      }
    }

    const dbData = localStorage.getItem(DB_KEY)
    const dbVersion = localStorage.getItem(DB_VERSION_KEY) || "0"

    if (!dbData) {
      return {
        totalProjects: 0,
        lastUpdated: null,
        dbVersion: Number.parseInt(dbVersion),
        dbSize: "0 KB",
      }
    }

    const projects = JSON.parse(dbData) as ProjectData[]
    const lastUpdated = projects.length > 0 ? Math.max(...projects.map((p) => p.createdAt || 0)) : null

    // คำนวณขนาดข้อมูลโดยประมาณ
    const dbSize = (dbData.length / 1024).toFixed(2) + " KB"

    return {
      totalProjects: projects.length,
      lastUpdated,
      dbVersion: Number.parseInt(dbVersion),
      dbSize,
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ:", error)
    return {
      totalProjects: 0,
      lastUpdated: null,
      dbVersion: 0,
      dbSize: "0 KB",
    }
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลโปรเจคทั้งหมด
export function getAllProjects(): ProjectData[] {
  try {
    if (!isBrowser) {
      return [...defaultProjects]
    }

    const dbData = localStorage.getItem(DB_KEY)
    if (!dbData) {
      return [...defaultProjects]
    }

    const projects = JSON.parse(dbData) as ProjectData[]
    return projects
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลโปรเจค:", error)
    return [...defaultProjects]
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลโปรเจคตาม ID
export function getProjectById(id: number): ProjectData | null {
  try {
    if (!isBrowser) {
      return defaultProjects.find((p) => p.id === id) || null
    }

    const projects = getAllProjects()
    return projects.find((p) => p.id === id) || null
  } catch (error) {
    console.error(`เกิดข้อผิดพลาดในการดึงข้อมูลโปรเจค ID ${id}:`, error)
    return null
  }
}

// ฟังก์ชันสำหรับเพิ่มโปรเจคใหม่
export function addProject(project: ProjectData): { success: boolean; message: string; project?: ProjectData } {
  try {
    if (!isBrowser) {
      return { success: false, message: "ไม่สามารถเพิ่มโปรเจคได้: ไม่พบ localStorage" }
    }

    const projects = getAllProjects()

    // ตรวจสอบว่ามี ID ซ้ำหรือไม่
    if (projects.some((p) => p.id === project.id)) {
      return { success: false, message: `มีโปรเจค ID ${project.id} อยู่แล้ว` }
    }

    // เพิ่มเวลาที่สร้าง
    const newProject = {
      ...project,
      createdAt: Date.now(),
    }

    // เพิ่มโปรเจคใหม่
    const updatedProjects = [...projects, newProject]
    localStorage.setItem(DB_KEY, JSON.stringify(updatedProjects))

    return { success: true, message: "เพิ่มโปรเจคสำเร็จ", project: newProject }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเพิ่มโปรเจค:", error)
    return { success: false, message: `เกิดข้อผิดพลาดในการเพิ่มโปรเจค: ${error}` }
  }
}

// ฟังก์ชันสำหรับอัพเดทโปรเจค
export function updateProject(project: ProjectData): { success: boolean; message: string; project?: ProjectData } {
  try {
    if (!isBrowser) {
      return { success: false, message: "ไม่สามารถอัพเดทโปรเจคได้: ไม่พบ localStorage" }
    }

    const projects = getAllProjects()
    const index = projects.findIndex((p) => p.id === project.id)

    if (index === -1) {
      return { success: false, message: `ไม่พบโปรเจค ID ${project.id}` }
    }

    // อัพเดทโปรเจค
    projects[index] = {
      ...project,
      createdAt: projects[index].createdAt, // คงค่า createdAt เดิม
    }

    localStorage.setItem(DB_KEY, JSON.stringify(projects))

    return { success: true, message: "อัพเดทโปรเจคสำเร็จ", project: projects[index] }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัพเดทโปรเจค:", error)
    return { success: false, message: `เกิดข้อผิดพลาดในการอัพเดทโปรเจค: ${error}` }
  }
}

// ฟังก์ชันสำหรับลบโปรเจค
export function deleteProject(id: number): { success: boolean; message: string } {
  try {
    if (!isBrowser) {
      return { success: false, message: "ไม่สามารถลบโปรเจคได้: ไม่พบ localStorage" }
    }

    const projects = getAllProjects()
    const filteredProjects = projects.filter((p) => p.id !== id)

    if (filteredProjects.length === projects.length) {
      return { success: false, message: `ไม่พบโปรเจค ID ${id}` }
    }

    localStorage.setItem(DB_KEY, JSON.stringify(filteredProjects))

    return { success: true, message: "ลบโปรเจคสำเร็จ" }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการลบโปรเจค:", error)
    return { success: false, message: `เกิดข้อผิดพลาดในการลบโปรเจค: ${error}` }
  }
}

// ฟังก์ชันสำหรับรีเซ็ตฐานข้อมูลเป็นค่าเริ่มต้น
export function resetDatabase(): { success: boolean; message: string } {
  try {
    if (!isBrowser) {
      return { success: false, message: "ไม่สามารถรีเซ็ตฐานข้อมูลได้: ไม่พบ localStorage" }
    }

    localStorage.setItem(DB_KEY, JSON.stringify(defaultProjects))

    return { success: true, message: "รีเซ็ตฐานข้อมูลสำเร็จ" }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการรีเซ็ตฐานข้อมูล:", error)
    return { success: false, message: `เกิดข้อผิดพลาดในการรีเซ็ตฐานข้อมูล: ${error}` }
  }
}

// ฟังก์ชันสำหรับหา ID ถัดไปสำหรับโปรเจคใหม่
export function getNextProjectId(): number {
  const projects = getAllProjects()
  return projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1
}

// ฟังก์ชันสำหรับสลับตำแหน่งโปรเจคแบบสุ่ม
export function shuffleProjects(projects: ProjectData[]): ProjectData[] {
  const newArray = [...projects]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}
