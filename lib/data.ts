export interface ProjectData {
  id: number
  title: string
  category: string
  description: string
  image: {
    src: string
    alt: string
    width: number
    height: number
  }
  orientation: "landscape" | "portrait" | "square"
  priority: number
  createdAt: number
}

// ข้อมูลเริ่มต้นของโปรเจค (ว่างเปล่า)
export const DEFAULT_PROJECTS: ProjectData[] = []

// หมวดหมู่ที่มีอยู่
export const CATEGORIES = [
  "Promotional Graphics",
  "Social Media Announcements",
  "News & Updates Graphics",
  "Website Projects",
  "UX/UI Design",
  "Other Designs",
]

// ขนาดภาพที่มีอยู่
export const IMAGE_SIZES = [
  { width: 1200, height: 800, label: "1200x800 (Landscape)", orientation: "landscape" },
  { width: 800, height: 1200, label: "800x1200 (Portrait)", orientation: "portrait" },
  { width: 1200, height: 1200, label: "1200x1200 (Square)", orientation: "square" },
  { width: 1600, height: 900, label: "1600x900 (Widescreen)", orientation: "landscape" },
  { width: 900, height: 1600, label: "900x1600 (Tall Portrait)", orientation: "portrait" },
]

// ระดับความสำคัญ
export const PRIORITY_LEVELS = [
  { value: 0, label: "ไม่มี (สุ่มตำแหน่ง)" },
  { value: 1, label: "ต่ำ" },
  { value: 2, label: "ปานกลาง" },
  { value: 3, label: "สูง" },
  { value: 4, label: "สูงมาก" },
  { value: 5, label: "สูงสุด" },
]

// ฟังก์ชันสำหรับดึงข้อมูลโปรเจคทั้งหมด (รวมที่เพิ่มใหม่)
export function getAllProjects(): ProjectData[] {
  // ดึงข้อมูลจาก localStorage
  const savedProjectsJSON = localStorage.getItem("userProjects")
  const savedProjects: ProjectData[] = savedProjectsJSON ? JSON.parse(savedProjectsJSON) : []

  // รวมข้อมูลเริ่มต้นกับข้อมูลที่บันทึกไว้
  return [...DEFAULT_PROJECTS, ...savedProjects]
}

// ฟังก์ชันสำหรับบันทึกโปรเจคใหม่
export function saveProject(project: Omit<ProjectData, "id" | "createdAt">): ProjectData {
  // ดึงข้อมูลที่มีอยู่
  const savedProjectsJSON = localStorage.getItem("userProjects")
  const savedProjects: ProjectData[] = savedProjectsJSON ? JSON.parse(savedProjectsJSON) : []

  // สร้าง ID ใหม่
  const maxId = Math.max(...DEFAULT_PROJECTS.map((p) => p.id), ...savedProjects.map((p) => p.id), 0)

  // สร้างโปรเจคใหม่
  const newProject: ProjectData = {
    ...project,
    id: maxId + 1,
    createdAt: Date.now(),
  }

  // บันทึกลงใน localStorage
  localStorage.setItem("userProjects", JSON.stringify([...savedProjects, newProject]))

  return newProject
}

// ฟังก์ชันสำหรับลบโปรเจค
export function deleteProject(id: number): boolean {
  // ดึงข้อมูลที่มีอยู่
  const savedProjectsJSON = localStorage.getItem("userProjects")
  const savedProjects: ProjectData[] = savedProjectsJSON ? JSON.parse(savedProjectsJSON) : []

  // ตรวจสอบว่าเป็นโปรเจคที่ผู้ใช้เพิ่มเข้ามาหรือไม่
  const projectIndex = savedProjects.findIndex((p) => p.id === id)

  if (projectIndex === -1) {
    // ไม่พบโปรเจคหรือเป็นโปรเจคเริ่มต้นที่ไม่สามารถลบได้
    return false
  }

  // ลบโปรเจค
  savedProjects.splice(projectIndex, 1)

  // บันทึกลงใน localStorage
  localStorage.setItem("userProjects", JSON.stringify(savedProjects))

  return true
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

// ฟังก์ชันสำหรับเรียงลำดับโปรเจคตามระดับความสำคัญ
export function sortProjectsByPriority(projects: ProjectData[]): ProjectData[] {
  // แยกโปรเจคตามระดับความสำคัญ
  const priorityProjects = projects.filter((p) => p.priority > 0).sort((a, b) => b.priority - a.priority)

  // สุ่มโปรเจคที่ไม่มีระดับความสำคัญ
  const randomProjects = shuffleProjects(projects.filter((p) => p.priority === 0))

  // รวมโปรเจคที่มีระดับความสำคัญกับโปรเจคที่สุ่ม
  return [...priorityProjects, ...randomProjects]
}

// ฟังก์ชันสำหรับรีเซ็ตข้อมูลโปรเจค
export function resetProjects(): void {
  localStorage.removeItem("userProjects")
}
