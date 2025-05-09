export interface ProjectData {
  id?: number
  title: string
  category: string
  description: string
  image: {
    src: string
    alt?: string
    width: number
    height: number
  }
  orientation?: "landscape" | "portrait" | "square"
  priority: number
  createdAt?: number
}

// กลับไปใช้หมวดหมู่เดิม
export const CATEGORIES = [
  "Promotional Graphics",
  "Social Media Announcements",
  "News & Updates Graphics",
  "Website Projects",
  "UX/UI Design",
  "Other Designs",
]

// ขนาดภาพที่มีให้เลือก
export const IMAGE_SIZES = [
  { width: 1200, height: 800, orientation: "landscape", label: "1200x800 (Landscape)" },
  { width: 800, height: 1200, orientation: "portrait", label: "800x1200 (Portrait)" },
  { width: 1200, height: 1200, orientation: "square", label: "1200x1200 (Square)" },
  { width: 1600, height: 900, orientation: "landscape", label: "1600x900 (Widescreen)" },
  { width: 900, height: 1600, orientation: "portrait", label: "900x1600 (Tall Portrait)" },
]

// ระดับความสำคัญที่มีให้เลือก
export const PRIORITY_LEVELS = [
  { value: 0, label: "ไม่มี (สุ่มตำแหน่ง)" },
  { value: 1, label: "ต่ำ" },
  { value: 2, label: "ปานกลาง" },
  { value: 3, label: "สูง" },
  { value: 4, label: "สูงมาก" },
  { value: 5, label: "สูงสุด" },
]

// โปรเจคเริ่มต้น (ว่างเปล่า)
export const DEFAULT_PROJECTS: ProjectData[] = []

// ฟังก์ชันสำหรับโหลดโปรเจคจาก localStorage
export function loadProjects(): ProjectData[] {
  if (typeof window === "undefined") {
    return DEFAULT_PROJECTS
  }

  try {
    const savedProjects = localStorage.getItem("projects")
    return savedProjects ? JSON.parse(savedProjects) : DEFAULT_PROJECTS
  } catch (error) {
    console.error("Error loading projects:", error)
    return DEFAULT_PROJECTS
  }
}

// ฟังก์ชัน getAllProjects เพื่อความเข้ากันได้กับโค้ดเดิม
export function getAllProjects(): ProjectData[] {
  return loadProjects()
}

// ฟังก์ชันสำหรับบันทึกโปรเจคลงใน localStorage
export function saveProjects(projects: ProjectData[]): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem("projects", JSON.stringify(projects))
  } catch (error) {
    console.error("Error saving projects:", error)
  }
}

// ฟังก์ชันสำหรับบันทึกโปรเจคใหม่หรืออัปเดตโปรเจคที่มีอยู่แล้ว
export function saveProject(
  project: Partial<ProjectData> & { title: string; image: ProjectData["image"] },
): ProjectData {
  if (typeof window === "undefined") {
    throw new Error("Cannot save project on server side")
  }

  const projects = loadProjects()

  // ถ้ามี id แสดงว่าเป็นการอัปเดตโปรเจคที่มีอยู่แล้ว
  if (project.id !== undefined) {
    const index = projects.findIndex((p) => p.id === project.id)

    if (index !== -1) {
      const updatedProject = { ...projects[index], ...project } as ProjectData
      projects[index] = updatedProject
      saveProjects(projects)
      return updatedProject
    }
  }

  // ถ้าไม่มี id หรือไม่พบโปรเจคที่มี id ตรงกัน แสดงว่าเป็นการเพิ่มโปรเจคใหม่
  const newId = Math.max(0, ...projects.map((p) => p.id || 0)) + 1
  const newProject: ProjectData = {
    id: newId,
    title: project.title,
    description: project.description || "",
    category: project.category || CATEGORIES[0],
    image: project.image,
    orientation: project.orientation || "landscape",
    priority: project.priority !== undefined ? project.priority : 0,
    createdAt: Date.now(),
  }

  projects.push(newProject)
  saveProjects(projects)

  return newProject
}

// ฟังก์ชันสำหรับลบโปรเจค
export function deleteProject(id: number): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const projects = loadProjects()
  const newProjects = projects.filter((p) => p.id !== id)

  if (newProjects.length !== projects.length) {
    saveProjects(newProjects)
    return true
  }

  return false
}

// ฟังก์ชันสำหรับรีเซ็ตโปรเจคกลับไปเป็นค่าเริ่มต้น
export function resetProjects(): void {
  if (typeof window === "undefined") {
    return
  }

  saveProjects(DEFAULT_PROJECTS)
}

// ฟังก์ชันสำหรับเรียงลำดับโปรเจคตามระดับความสำคัญ
export function sortProjectsByPriority(projects: ProjectData[]): ProjectData[] {
  // แยกโปรเจคที่มีระดับความสำคัญ (1-5) และไม่มีระดับความสำคัญ (0)
  const priorityProjects = projects.filter((p) => p.priority > 0)
  const nonPriorityProjects = projects.filter((p) => p.priority === 0)

  // เรียงลำดับโปรเจคที่มีระดับความสำคัญจากมากไปน้อย
  priorityProjects.sort((a, b) => b.priority - a.priority)

  // สุ่มลำดับโปรเจคที่ไม่มีระดับความสำคัญ
  const shuffledNonPriorityProjects = [...nonPriorityProjects].sort(() => Math.random() - 0.5)

  // รวมโปรเจคทั้งหมดเข้าด้วยกัน
  return [...priorityProjects, ...shuffledNonPriorityProjects]
}

// ฟังก์ชันสำหรับสุ่มลำดับโปรเจค (เพื่อความเข้ากันได้กับโค้ดเดิม)
export function shuffleProjects(projects: ProjectData[]): ProjectData[] {
  const shuffled = [...projects]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
