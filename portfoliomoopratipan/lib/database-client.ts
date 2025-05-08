// ไฟล์นี้ใช้สำหรับการเชื่อมต่อกับฐานข้อมูลจาก client-side
import type { ProjectData } from "@/components/project-form"

// ตัวแปรสำหรับเก็บ base URL ของ API
const API_BASE_URL = "/api/projects"

// ฟังก์ชันสำหรับเริ่มต้นฐานข้อมูล
export async function initializeDatabase(): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch("/api/init")

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลโปรเจคทั้งหมด
export async function fetchAllProjects(): Promise<ProjectData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.projects
  } catch (error) {
    console.error("Error fetching projects:", error)
    throw error
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลโปรเจคตาม ID
export async function fetchProjectById(id: number): Promise<ProjectData> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.project
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error)
    throw error
  }
}

// ฟังก์ชันสำหรับเพิ่มโปรเจคใหม่
export async function addNewProject(project: ProjectData): Promise<ProjectData> {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.project
  } catch (error) {
    console.error("Error adding new project:", error)
    throw error
  }
}

// ฟังก์ชันสำหรับอัพเดทโปรเจค
export async function updateExistingProject(project: ProjectData): Promise<ProjectData> {
  try {
    const response = await fetch(`${API_BASE_URL}/${project.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.project
  } catch (error) {
    console.error(`Error updating project with ID ${project.id}:`, error)
    throw error
  }
}

// ฟังก์ชันสำหรับลบโปรเจค
export async function deleteExistingProject(id: number): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error deleting project with ID ${id}:`, error)
    throw error
  }
}

// ฟังก์ชันสำหรับรีเซ็ตฐานข้อมูล
export async function resetDatabaseToDefault(): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/reset`, {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error resetting database:", error)
    throw error
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลสถิติของฐานข้อมูล
export async function fetchDatabaseStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.stats
  } catch (error) {
    console.error("Error fetching database stats:", error)
    throw error
  }
}

// ฟังก์ชันสำหรับดึง ID ถัดไปสำหรับโปรเจคใหม่
export async function fetchNextProjectId(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/next-id`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.nextId
  } catch (error) {
    console.error("Error fetching next project ID:", error)
    throw error
  }
}
