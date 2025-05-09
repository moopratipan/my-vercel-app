import { NextResponse } from "next/server"
import { getProjectById, updateProject, deleteProject } from "@/lib/db"

// จำลองความล่าช้าของเครือข่าย
const simulateNetworkLatency = () => new Promise((resolve) => setTimeout(resolve, 300))

// GET /api/projects/[id] - ดึงข้อมูลโปรเจคตาม ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // จำลองความล่าช้าของเครือข่าย
    await simulateNetworkLatency()

    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid project ID" }, { status: 400 })
    }

    const project = await getProjectById(id)

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error) {
    console.error(`Error fetching project with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Failed to fetch project" }, { status: 500 })
  }
}

// PUT /api/projects/[id] - อัพเดทโปรเจค
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // จำลองความล่าช้าของเครือข่าย
    await simulateNetworkLatency()

    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid project ID" }, { status: 400 })
    }

    const projectData = await request.json()

    // ตรวจสอบว่า ID ตรงกัน
    if (projectData.id !== id) {
      return NextResponse.json({ success: false, error: "Project ID mismatch" }, { status: 400 })
    }

    const result = await updateProject(projectData)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: result.message.includes("not found") ? 404 : 400 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      project: result.project,
    })
  } catch (error) {
    console.error(`Error updating project with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 })
  }
}

// DELETE /api/projects/[id] - ลบโปรเจค
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // จำลองความล่าช้าของเครือข่าย
    await simulateNetworkLatency()

    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid project ID" }, { status: 400 })
    }

    const result = await deleteProject(id)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: result.message.includes("not found") ? 404 : 400 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    })
  } catch (error) {
    console.error(`Error deleting project with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 })
  }
}
