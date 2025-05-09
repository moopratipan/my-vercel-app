import { kv } from "@vercel/kv"
import type { ProjectData } from "@/components/project-form"

// ค่าเริ่มต้นของโปรเจค
const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: 1,
    title: "Promotional Graphics for Summer Sale",
    category: "Promotional Graphics",
    description: "Created eye-catching promotional graphics for the annual summer sale campaign.",
    image: {
      src: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=2070&auto=format&fit=crop",
      alt: "Summer Sale Promotional Graphics",
      width: 1200,
      height: 800,
    },
    priority: 1,
  },
  {
    id: 2,
    title: "Social Media Announcement Templates",
    category: "Social Media Announcements",
    description: "Designed a set of templates for social media announcements that can be easily customized.",
    image: {
      src: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1974&auto=format&fit=crop",
      alt: "Social Media Templates",
      width: 1200,
      height: 1200,
    },
    priority: 2,
  },
  {
    id: 3,
    title: "Website Redesign for Local Business",
    category: "Website Projects",
    description:
      "Completely redesigned the website for a local business, improving user experience and conversion rates.",
    image: {
      src: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2064&auto=format&fit=crop",
      alt: "Website Redesign",
      width: 1200,
      height: 900,
    },
    priority: 0,
  },
]

// ฟังก์ชันสำหรับเริ่มต้นฐานข้อมูล
export async function initializeDatabase() {
  try {
    // ตรวจสอบว่ามีข้อมูลในฐานข้อมูลหรือไม่
    const exists = await kv.exists("projects")

    // ถ้าไม่มีข้อมูล ให้เพิ่มข้อมูลเริ่มต้น
    if (!exists) {
      await kv.set("projects", DEFAULT_PROJECTS)
      await kv.set("db_stats", {
        dbVersion: "1.0.0",
        lastUpdated: Date.now(),
        totalProjects: DEFAULT_PROJECTS.length,
        dbSize: "Unknown",
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Error initializing database:", error)
    return { success: false, message: String(error) }
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลโปรเจคทั้งหมด
export async function getAllProjects(): Promise<ProjectData[]> {
  try {
    const projects = (await kv.get<ProjectData[]>("projects")) || []
    return projects
  } catch (error) {
    console.error("Error getting all projects:", error)
    throw new Error("Failed to get projects")
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลโปรเจคตาม ID
export async function getProjectById(id: number): Promise<ProjectData | null> {
  try {
    const projects = await getAllProjects()
    return projects.find((project) => project.id === id) || null
  } catch (error) {
    console.error(`Error getting project with ID ${id}:`, error)
    throw new Error(`Failed to get project with ID ${id}`)
  }
}

// ฟังก์ชันสำหรับเพิ่มโปรเจคใหม่
export async function addProject(project: ProjectData) {
  try {
    const projects = await getAllProjects()

    // ตรวจสอบว่ามี ID ซ้ำหรือไม่
    if (projects.some((p) => p.id === project.id)) {
      return { success: false, message: `Project with ID ${project.id} already exists` }
    }

    // เพิ่มโปรเจคใหม่
    const newProjects = [...projects, project]
    await kv.set("projects", newProjects)

    // อัพเดทสถิติ
    await updateDatabaseStats()

    return { success: true, message: "Project added successfully", project }
  } catch (error) {
    console.error("Error adding project:", error)
    return { success: false, message: String(error) }
  }
}

// ฟังก์ชันสำหรับอัพเดทโปรเจค
export async function updateProject(project: ProjectData) {
  try {
    const projects = await getAllProjects()

    // ตรวจสอบว่ามีโปรเจคที่ต้องการอัพเดทหรือไม่
    const index = projects.findIndex((p) => p.id === project.id)
    if (index === -1) {
      return { success: false, message: `Project with ID ${project.id} not found` }
    }

    // อัพเดทโปรเจค
    projects[index] = project
    await kv.set("projects", projects)

    // อัพเดทสถิติ
    await updateDatabaseStats()

    return { success: true, message: "Project updated successfully", project }
  } catch (error) {
    console.error(`Error updating project with ID ${project.id}:`, error)
    return { success: false, message: String(error) }
  }
}

// ฟังก์ชันสำหรับลบโปรเจค
export async function deleteProject(id: number) {
  try {
    const projects = await getAllProjects()

    // ตรวจสอบว่ามีโปรเจคที่ต้องการลบหรือไม่
    const index = projects.findIndex((p) => p.id === id)
    if (index === -1) {
      return { success: false, message: `Project with ID ${id} not found` }
    }

    // ลบโปรเจค
    projects.splice(index, 1)
    await kv.set("projects", projects)

    // อัพเดทสถิติ
    await updateDatabaseStats()

    return { success: true, message: "Project deleted successfully" }
  } catch (error) {
    console.error(`Error deleting project with ID ${id}:`, error)
    return { success: false, message: String(error) }
  }
}

// ฟังก์ชันสำหรับรีเซ็ตฐานข้อมูล
export async function resetDatabase() {
  try {
    await kv.set("projects", DEFAULT_PROJECTS)

    // อัพเดทสถิติ
    await updateDatabaseStats()

    return { success: true, message: "Database reset successfully" }
  } catch (error) {
    console.error("Error resetting database:", error)
    return { success: false, message: String(error) }
  }
}

// ฟังก์ชันสำหรับสุ่มลำดับโปรเจค
export function shuffleProjects(projects: ProjectData[]): ProjectData[] {
  const shuffled = [...projects]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// ฟังก์ชันสำหรับดึงข้อมูลสถิติของฐานข้อมูล
export async function getDatabaseStats() {
  try {
    const stats = (await kv.get("db_stats")) || {
      dbVersion: "1.0.0",
      lastUpdated: Date.now(),
      totalProjects: 0,
      dbSize: "Unknown",
    }

    return stats
  } catch (error) {
    console.error("Error getting database stats:", error)
    throw new Error("Failed to get database stats")
  }
}

// ฟังก์ชันสำหรับอัพเดทสถิติของฐานข้อมูล
async function updateDatabaseStats() {
  try {
    const projects = await getAllProjects()
    const stats = await getDatabaseStats()

    const updatedStats = {
      ...stats,
      lastUpdated: Date.now(),
      totalProjects: projects.length,
    }

    await kv.set("db_stats", updatedStats)
  } catch (error) {
    console.error("Error updating database stats:", error)
  }
}

// ฟังก์ชันสำหรับดึง ID ถัดไปสำหรับโปรเจคใหม่
export async function getNextProjectId(): Promise<number> {
  try {
    const projects = await getAllProjects()

    if (projects.length === 0) {
      return 1
    }

    const maxId = Math.max(...projects.map((p) => p.id))
    return maxId + 1
  } catch (error) {
    console.error("Error getting next project ID:", error)
    throw new Error("Failed to get next project ID")
  }
}
