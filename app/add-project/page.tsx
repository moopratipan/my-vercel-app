"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { saveProject, CATEGORIES, IMAGE_SIZES, PRIORITY_LEVELS } from "@/lib/data"
import { ChevronLeft, Save, ImageIcon } from "lucide-react"

export default function AddProjectPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageSize, setImageSize] = useState("")
  const [priority, setPriority] = useState("0") // ค่าเริ่มต้นคือ 0 (สุ่มตำแหน่ง)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ตรวจสอบว่า localStorage พร้อมใช้งานหรือไม่
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  // ตรวจสอบ URL ของภาพเมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (imageUrl) {
      const img = new Image()
      img.onload = () => {
        setImagePreview(imageUrl)
        setErrors((prev) => ({ ...prev, imageUrl: "" }))
      }
      img.onerror = () => {
        setImagePreview(null)
        setErrors((prev) => ({ ...prev, imageUrl: "URL ภาพไม่ถูกต้องหรือไม่สามารถเข้าถึงได้" }))
      }
      img.src = imageUrl
    } else {
      setImagePreview(null)
    }
  }, [imageUrl])

  // ฟังก์ชันตรวจสอบข้อมูล
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "กรุณากรอกชื่อโปรเจค"
    }

    if (!description.trim()) {
      newErrors.description = "กรุณากรอกคำอธิบายโปรเจค"
    }

    if (!category) {
      newErrors.category = "กรุณาเลือกหมวดหมู่"
    }

    if (!imageUrl.trim()) {
      newErrors.imageUrl = "กรุณากรอก URL ของภาพ"
    } else if (!imagePreview) {
      newErrors.imageUrl = "URL ภาพไม่ถูกต้องหรือไม่สามารถเข้าถึงได้"
    }

    if (!imageSize) {
      newErrors.imageSize = "กรุณาเลือกขนาดภาพ"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ฟังก์ชันบันทึกโปรเจค
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // หาข้อมูลขนาดภาพที่เลือก
      const selectedSize = IMAGE_SIZES.find((size) => `${size.width}x${size.height}` === imageSize)

      if (!selectedSize) {
        throw new Error("ขนาดภาพไม่ถูกต้อง")
      }

      // บันทึกโปรเจค
      const newProject = saveProject({
        title,
        description,
        category,
        image: {
          src: imageUrl,
          alt: title,
          width: selectedSize.width,
          height: selectedSize.height,
        },
        orientation: selectedSize.orientation as "landscape" | "portrait" | "square",
        priority: Number.parseInt(priority, 10),
      })

      toast({
        title: "บันทึกโปรเจคสำเร็จ",
        description: `โปรเจค "${title}" ถูกบันทึกเรียบร้อยแล้ว`,
      })

      // นำทางกลับไปยังหน้า projects
      router.push("/projects")
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกโปรเจคได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold"
          >
            เพิ่มโปรเจคใหม่
          </motion.h1>

          <Link href="/projects">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              กลับไปยังหน้าโปรเจค
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลโปรเจค</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">ชื่อโปรเจค</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="กรอกชื่อโปรเจค"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">คำอธิบายโปรเจค</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="กรอกคำอธิบายโปรเจค"
                  className={errors.description ? "border-red-500" : ""}
                  rows={4}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">หมวดหมู่</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL ของภาพ</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className={errors.imageUrl ? "border-red-500" : ""}
                />
                {errors.imageUrl && <p className="text-red-500 text-sm">{errors.imageUrl}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageSize">ขนาดภาพ</Label>
                <Select value={imageSize} onValueChange={setImageSize}>
                  <SelectTrigger className={errors.imageSize ? "border-red-500" : ""}>
                    <SelectValue placeholder="เลือกขนาดภาพ" />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_SIZES.map((size) => (
                      <SelectItem key={`${size.width}x${size.height}`} value={`${size.width}x${size.height}`}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.imageSize && <p className="text-red-500 text-sm">{errors.imageSize}</p>}
              </div>

              <div className="space-y-2">
                <Label>ระดับความสำคัญ</Label>
                <RadioGroup
                  value={priority}
                  onValueChange={setPriority}
                  className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                >
                  {PRIORITY_LEVELS.map((level) => (
                    <div key={level.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={level.value.toString()} id={`priority-${level.value}`} />
                      <Label htmlFor={`priority-${level.value}`} className="cursor-pointer">
                        {level.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <p className="text-sm text-gray-500 mt-1">
                  ระดับความสำคัญ 1-5 จะแสดงด้านบนของหน้าโปรเจค (ยิ่งสูงยิ่งแสดงก่อน) ส่วนระดับ 0 จะสุ่มตำแหน่งการแสดงผล
                </p>
              </div>

              {/* ตัวอย่างภาพ */}
              {imagePreview ? (
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="ตัวอย่างภาพ"
                    className="w-full h-auto object-cover"
                  />
                </div>
              ) : (
                <div className="border rounded-lg p-8 flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon size={48} className="mb-4" />
                  <p>ตัวอย่างภาพจะแสดงที่นี่</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      บันทึกโปรเจค
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
