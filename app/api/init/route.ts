import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"

// GET /api/init - เริ่มต้นฐานข้อมูล
export async function GET() {
  try {
    const result = await initializeDatabase()

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json({ success: false, error: "Failed to initialize database" }, { status: 500 })
  }
}
