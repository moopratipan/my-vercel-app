import { NextResponse } from "next/server"
import { getDatabaseStats } from "@/lib/db"

// จำลองความล่าช้าของเครือข่าย
const simulateNetworkLatency = () => new Promise((resolve) => setTimeout(resolve, 300))

// GET /api/projects/stats - ดึงข้อมูลสถิติของฐานข้อมูล
export async function GET() {
  try {
    // จำลองความล่าช้าของเครือข่าย
    await simulateNetworkLatency()

    const stats = await getDatabaseStats()

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("Error fetching database stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch database stats" }, { status: 500 })
  }
}
