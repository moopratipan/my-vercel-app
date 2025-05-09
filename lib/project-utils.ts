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
const STORAGE_KEY = "portfolioProjects"

// ฟังก์ชันสำหรับโหลดโปรเจกต์ทั้งหมด
export function loadAllProjects(): ProjectData[] {
  try {
    // ตรวจสอบว่าอยู่ในสภาพแวดล้อมที่มี localStorage หรือไม่
    if (typeof window === "undefined") {
      return [...defaultProjects]
    }

    // พยายามโหลดข้อมูลจาก localStorage
    const savedData = localStorage.getItem(STORAGE_KEY)

    if (!savedData) {
      // ถ้าไม่มีข้อมูลใน localStorage ให้บันทึกข้อมูลเริ่มต้นลงไป
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects))
      console.log("Initialized localStorage with default projects")
      return [...defaultProjects]
    }

    // แปลงข้อมูลจาก JSON เป็น object
    const projects = JSON.parse(savedData) as ProjectData[]

    // ตรวจสอบว่าข้อมูลที่โหลดมาถูกต้องหรือไม่
    if (!Array.isArray(projects) || projects.length === 0) {
      console.log("Invalid or empty projects data, using defaults")
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects))
      return [...defaultProjects]
    }

    console.log("Loaded projects from localStorage:", projects)
    return projects
  } catch (error) {
    console.error("Error loading projects:", error)
    return [...defaultProjects]
  }
}

// ฟังก์ชันสำหรับบันทึกโปรเจกต์ทั้งหมด
export function saveAllProjects(projects: ProjectData[]): void {
  try {
    if (typeof window === "undefined") return

    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
    console.log("Saved projects to localStorage:", projects)
  } catch (error) {
    console.error("Error saving projects:", error)
  }
}

// ฟังก์ชันสำหรับเพิ่มหรืออัพเดทโปรเจกต์
export function saveProject(project: ProjectData): ProjectData[] {
  const allProjects = loadAllProjects()

  // ตรวจสอบว่าเป็นการอัพเดทหรือเพิ่มใหม่
  const existingIndex = allProjects.findIndex((p) => p.id === project.id)

  if (existingIndex >= 0) {
    // อัพเดทโปรเจกต์ที่มีอยู่แล้ว
    allProjects[existingIndex] = project
  } else {
    // เพิ่มโปรเจกต์ใหม่
    allProjects.push(project)
  }

  // บันทึกข้อมูลลงใน localStorage
  saveAllProjects(allProjects)

  return allProjects
}

// ฟังก์ชันสำหรับลบโ��รเจกต์
export function deleteProject(id: number): ProjectData[] {
  const allProjects = loadAllProjects()
  const updatedProjects = allProjects.filter((p) => p.id !== id)

  // บันทึกข้อมูลลงใน localStorage
  saveAllProjects(updatedProjects)

  return updatedProjects
}

// ฟังก์ชันสำหรับรีเซ็ตโปรเจกต์เป็นค่าเริ่มต้น
export function resetToDefaultProjects(): ProjectData[] {
  saveAllProjects(defaultProjects)
  return [...defaultProjects]
}

// ฟังก์ชันสำหรับหา ID ถัดไปสำหรับโปรเจกต์ใหม่
export function getNextProjectId(): number {
  const allProjects = loadAllProjects()
  const maxId = Math.max(...allProjects.map((p) => p.id), 0)
  return maxId + 1
}

// สลับตำแหน่งโปรเจกต์แบบสุ่ม
export function shuffleProjects(projects: ProjectData[]): ProjectData[] {
  const newArray = [...projects]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}
