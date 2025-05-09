import { NextResponse } from "next/server"
import { getAllProjects, addProject } from "@/lib/db"

// จำลองความล่าช้าของเครือข่าย
const simulateNetworkLatency = () => new Promise((resolve) => setTimeout(resolve, 300))

// GET /api/projects - ดึงข้อมูลโปรเจคทั้งหมด
export async function GET() {
  try {
    // จำลองความล่าช้าของเครือข่าย
    await simulateNetworkLatency()

    const projects = await getAllProjects()

    return NextResponse.json({
      success: true,
      projects,
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 })
  }
}

// POST /api/projects - เพิ่มโปรเจคใหม่
export async function POST(request: Request) {
  try {
    // จำลองความล่าช้าของเครือข่าย
    await simulateNetworkLatency()

    const projectData = await request.json()

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!projectData.title || !projectData.category) {
      return NextResponse.json({ success: false, error: "Title and category are required" }, { status: 400 })
    }

    const result = await addProject(projectData)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Project added successfully",
      project: result.project,
    })
  } catch (error) {
    console.error("Error adding project:", error)
    return NextResponse.json({ success: false, error: "Failed to add project" }, { status: 500 })
  }
}
