import { NextResponse } from "next/server"
import { getNextProjectId } from "@/lib/db"

// จำลองความล่าช้าของเครือข่าย
const simulateNetworkLatency = () => new Promise((resolve) => setTimeout(resolve, 200))

// GET /api/projects/next-id - ดึง ID ถัดไปสำหรับโปรเจคใหม่
export async function GET() {
  try {
    // จำลองความล่าช้าของเครือข่าย
    await simulateNetworkLatency()

    const nextId = await getNextProjectId()

    return NextResponse.json({
      success: true,
      nextId,
    })
  } catch (error) {
    console.error("Error fetching next project ID:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch next project ID" }, { status: 500 })
  }
}
