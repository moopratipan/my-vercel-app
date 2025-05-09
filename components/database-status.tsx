"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { RefreshCw, Database, AlertCircle, CheckCircle2 } from "lucide-react"
import { fetchDatabaseStats, resetDatabaseToDefault } from "@/lib/database-client"
import { toast } from "@/hooks/use-toast"

export type DatabaseStatusProps = {
  showDetails?: boolean
  showReset?: boolean
  onReset?: () => void
}

export function DatabaseStatus({ showDetails = false, showReset = false, onReset }: DatabaseStatusProps) {
  const [status, setStatus] = useState<"connected" | "disconnected" | "error" | "initializing">("initializing")
  const [stats, setStats] = useState<any | null>(null)
  const [isResetting, setIsResetting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    updateStats()
  }, [])

  const updateStats = async () => {
    setIsLoading(true)
    try {
      const dbStats = await fetchDatabaseStats()
      setStats(dbStats)
      setStatus("connected")
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ:", error)
      setStatus("error")
      toast({
        title: "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล",
        description: String(error),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    setIsResetting(true)
    try {
      const result = await resetDatabaseToDefault()
      if (result.success) {
        toast({
          title: "รีเซ็ตฐานข้อมูลสำเร็จ",
          description: "ฐานข้อมูลถูกรีเซ็ตกลับเป็นค่าเริ่มต้นเรียบร้อยแล้ว",
        })
        updateStats()
        if (onReset) onReset()
      } else {
        toast({
          title: "เกิดข้อผิดพลาดในการรีเซ็ตฐานข้อมูล",
          description: "ไม่สามารถรีเซ็ตฐานข้อมูลได้",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาดในการรีเซ็ตฐานข้อมูล",
        description: String(error),
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
    }
  }

  const handleRefresh = () => {
    updateStats()
    toast({
      title: "รีเฟรชข้อมูลสำเร็จ",
      description: "ข้อมูลสถิติถูกอัพเดทเรียบร้อยแล้ว",
    })
  }

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-500"
      case "disconnected":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      case "initializing":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "เชื่อมต่อแล้ว"
      case "disconnected":
        return "ไม่ได้เชื่อมต่อ"
      case "error":
        return "เกิดข้อผิดพลาด"
      case "initializing":
        return "กำลังเริ่มต้น"
      default:
        return "ไม่ทราบสถานะ"
    }
  }

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "ไม่มีข้อมูล"
    return new Date(timestamp).toLocaleString("th-TH")
  }

  if (!showDetails) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
        <span className="text-xs">สถานะฐานข้อมูล: {isLoading ? "กำลังโหลด..." : getStatusText()}</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          สถานะฐานข้อมูล
        </CardTitle>
        <CardDescription>ข้อมูลและสถิติของฐานข้อมูลโปรเจค</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">สถานะการเชื่อมต่อ:</span>
              <Badge variant={status === "connected" ? "default" : "destructive"} className="flex items-center gap-1">
                {status === "connected" ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                {getStatusText()}
              </Badge>
            </div>

            {stats && (
              <>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">จำนวนโปรเจคทั้งหมด</p>
                    <p className="text-2xl font-bold">{stats.totalProjects}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">เวอร์ชันฐานข้อมูล</p>
                    <p className="text-2xl font-bold">{stats.dbVersion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">อัพเดทล่าสุด</p>
                    <p className="text-sm">{formatDate(stats.lastUpdated)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ขนาดข้อมูล</p>
                    <p className="text-sm">{stats.dbSize}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          รีเฟรชข้อมูล
        </Button>
        {showReset && (
          <Button variant="destructive" size="sm" onClick={handleReset} disabled={isResetting || isLoading}>
            {isResetting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                กำลังรีเซ็ต...
              </>
            ) : (
              "รีเซ็ตฐานข้อมูล"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
