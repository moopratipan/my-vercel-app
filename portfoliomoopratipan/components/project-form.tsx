"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Loader2, Save, ImageIcon } from "lucide-react"

// ประเภทของข้อมูลโปรเจกต์
export interface ProjectData {
  id: number
  title: string
  category: string
  description: string
  image: {
    src: string
    width: number
    height: number
    alt?: string
  }
  orientation: "landscape" | "portrait" | "square"
  priority: number
  createdAt: number
}

// ประเภทของ props ที่ส่งเข้ามา
interface ProjectFormProps {
  onSave?: (project: ProjectData) => void
  existingProject?: ProjectData
  nextId?: number
}

export default function ProjectForm({ onSave, existingProject, nextId }: ProjectFormProps) {
  // สถานะของฟอร์ม
  const [formData, setFormData] = useState<Omit<ProjectData, "id" | "createdAt">>({
    title: "",
    category: "Promotional Graphics",
    description: "",
    image: {
      src: "",
      width: 800,
      height: 600,
      alt: "",
    },
    orientation: "landscape",
    priority: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // หมวดหมู่ที่มีให้เลือก
  const categories = [
    "Promotional Graphics",
    "Social Media Announcements",
    "News & Updates Graphics",
    "Website Projects",
    "UX/UI Design",
    "Other Designs",
  ]

  // ลำดับความสำคัญที่มีให้เลือก
  const priorities = [
    { value: 0, label: "สุ่ม (Random)" },
    { value: 1, label: "ลำดับที่ 1 (สูงสุด)" },
    { value: 2, label: "ลำดับที่ 2" },
    { value: 3, label: "ลำดับที่ 3" },
    { value: 4, label: "ลำดับที่ 4" },
    { value: 5, label: "ลำดับที่ 5" },
  ]

  // ขนาดภาพที่มีให้เลือก
  const orientations = [
    { value: "landscape", label: "แนวนอน (Landscape - 800x600)" },
    { value: "portrait", label: "แนวตั้ง (Portrait - 600x800)" },
    { value: "square", label: "สี่เหลี่ยมจัตุรัส (Square - 800x800)" },
  ]

  // โหลดข้อมูลโปรเจกต์ที่มีอยู่แล้ว (ถ้ามี)
  useEffect(() => {
    if (existingProject) {
      setFormData({
        title: existingProject.title,
        category: existingProject.category,
        description: existingProject.description,
        image: existingProject.image,
        orientation: existingProject.orientation,
        priority: existingProject.priority,
      })
      setImagePreview(existingProject.image.src)
    }
  }, [existingProject])

  // อัพเดทขนาดภาพตามการเลือก orientation
  useEffect(() => {
    let width = 800
    let height = 600

    if (formData.orientation === "portrait") {
      width = 600
      height = 800
    } else if (formData.orientation === "square") {
      width = 800
      height = 800
    }

    setFormData((prev) => ({
      ...prev,
      image: {
        ...prev.image,
        width,
        height,
      },
    }))
  }, [formData.orientation])

  // จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.startsWith("image.")) {
      const imageField = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        image: {
          ...prev.image,
          [imageField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // จัดการการเปลี่ยนแปลงข้อมูลใน select
  const handleSelectChange = (name: string, value: string) => {
    if (name === "priority") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number.parseInt(value),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // ตรวจสอบ URL ของภาพและแสดงตัวอย่าง
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setFormData((prev) => ({
      ...prev,
      image: {
        ...prev.image,
        src: url,
        alt: prev.image.alt || prev.title,
      },
    }))

    // แสดงตัวอย่างภาพ
    if (url) {
      setImagePreview(url)
    } else {
      setImagePreview(null)
    }
  }

  // บันทึกข้อมูลโปรเจกต์
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // ตรวจสอบข้อมูลที่จำเป็น
      if (!formData.title || !formData.image.src) {
        toast({
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          description: "ชื่อโปรเจกต์และ URL ของภาพเป็นข้อมูลที่จำเป็น",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // ดึงโปรเจกต์ที่มีอยู่เพื่อหา ID ถัดไป
      const existingProjects = JSON.parse(localStorage.getItem("customProjects") || "[]") as ProjectData[]

      // กำหนด ID ให้กับโปรเจกต์ใหม่
      let newId: number

      if (existingProject) {
        // ถ้าเป็นการแก้ไข ใช้ ID เดิม
        newId = existingProject.id
      } else if (nextId !== undefined) {
        // ถ้ามีการส่ง nextId มา ใช้ค่านั้น
        newId = nextId
      } else {
        // หา ID สูงสุดจากโปรเจกต์ที่มีอยู่ แล้วบวก 1
        const maxId = Math.max(
          ...existingProjects.map((p) => p.id),
          ...[1, 2, 3], // ID เริ่มต้นของโปรเจกต์ default
        )
        newId = maxId + 1
      }

      // สร้างข้อมูลโปรเจกต์ใหม่
      const newProject: ProjectData = {
        id: newId,
        ...formData,
        image: {
          ...formData.image,
          alt: formData.image.alt || formData.title,
        },
        createdAt: existingProject?.createdAt || Date.now(),
      }

      // บันทึกข้อมูลโปรเจกต์
      if (onSave) {
        onSave(newProject)
      }

      // บันทึกลงใน localStorage
      if (existingProject) {
        // อัพเดทโปรเจกต์ที่มีอยู่แล้ว
        const updatedProjects = existingProjects.map((p: ProjectData) => (p.id === newProject.id ? newProject : p))
        localStorage.setItem("customProjects", JSON.stringify(updatedProjects))
        console.log("Updated project in localStorage:", updatedProjects)
      } else {
        // เพิ่มโปรเจกต์ใหม่
        const newProjects = [...existingProjects, newProject]
        localStorage.setItem("customProjects", JSON.stringify(newProjects))
        console.log("Added new project to localStorage:", newProjects)
      }

      toast({
        title: "บันทึกโปรเจกต์สำเร็จ",
        description: existingProject ? "อัพเดทโปรเจกต์เรียบร้อยแล้ว" : "เพิ่มโปรเจกต์ใหม่เรียบร้อยแล้ว",
      })

      // รีเซ็ตฟอร์มถ้าเป็นการเพิ่มโปรเจกต์ใหม่
      if (!existingProject) {
        setFormData({
          title: "",
          category: "Promotional Graphics",
          description: "",
          image: {
            src: "",
            width: 800,
            height: 600,
            alt: "",
          },
          orientation: "landscape",
          priority: 0,
        })
        setImagePreview(null)
      }
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกโปรเจกต์ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">ชื่อโปรเจกต์ *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="ชื่อโปรเจกต์"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">หมวดหมู่ *</Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">คำอธิบาย</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="คำอธิบายโปรเจกต์"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="image.src">URL ของภาพ *</Label>
            <Input
              id="image.src"
              name="image.src"
              value={formData.image.src}
              onChange={handleImageUrlChange}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div>
            <Label htmlFor="image.alt">คำอธิบายภาพ (Alt Text)</Label>
            <Input
              id="image.alt"
              name="image.alt"
              value={formData.image.alt}
              onChange={handleChange}
              placeholder="คำอธิบายภาพสำหรับผู้พิการทางสายตา"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="orientation">ขนาดภาพ *</Label>
            <Select
              value={formData.orientation}
              onValueChange={(value) => handleSelectChange("orientation", value as "landscape" | "portrait" | "square")}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกขนาดภาพ" />
              </SelectTrigger>
              <SelectContent>
                {orientations.map((orientation) => (
                  <SelectItem key={orientation.value} value={orientation.value}>
                    {orientation.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">ลำดับความสำคัญ *</Label>
            <Select
              value={formData.priority.toString()}
              onValueChange={(value) => handleSelectChange("priority", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกลำดับความสำคัญ" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value.toString()}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">ลำดับที่ 1-5 จะแสดงที่ด้านบนสุด, 0 คือสุ่มตำแหน่ง</p>
          </div>

          <div className="mt-4">
            <Label>ตัวอย่างภาพ</Label>
            <div className="mt-2 border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              {imagePreview ? (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="max-h-[200px] max-w-full object-contain rounded"
                  onError={() => {
                    setImagePreview(null)
                    toast({
                      title: "ไม่สามารถโหลดภาพได้",
                      description: "URL ของภาพไม่ถูกต้องหรือไม่สามารถเข้าถึงได้",
                      variant: "destructive",
                    })
                  }}
                />
              ) : (
                <div className="text-center p-6">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">ยังไม่มีภาพตัวอย่าง</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              กำลังบันทึก...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              บันทึกโปรเจกต์
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
