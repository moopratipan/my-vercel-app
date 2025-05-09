import { NextResponse } from "next/server"
import { resetDatabase } from "@/lib/db"

// จำลองความล่าช้าของเครือข่าย
const simulateNetworkLatency = () => new Promise((resolve) => setTimeout(resolve, 500))

// POST /api/projects/reset - รีเซ็ตฐานข้อมูล
export async function POST() {
  try {
    // จำลองความล่าช้าของเครือข่าย
    await simulateNetworkLatency()

    const result = await resetDatabase()

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Database reset successfully",
    })
  } catch (error) {
    console.error("Error resetting database:", error)
    return NextResponse.json({ success: false, error: "Failed to reset database" }, { status: 500 })
  }
}
