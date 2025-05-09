"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Project, getAllProjects } from "@/lib/data"
import { ProjectForm } from "@/components/project-form"

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // ดึงข้อมูลโปรเจค
    const allProjects = getAllProjects()
    setProjects(allProjects)
    setIsLoading(false)
  }, [])

  // ฟังก์ชันสำหรับเลือกโปรเจคเพื่อแก้ไข
  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setIsEditing(true)
  }

  // ฟังก์ชันสำหรับยกเลิกการแก้ไข
  const handleCancelEdit = () => {
    setSelectedProject(null)
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="add">Add New Project</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Manage Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                      <Card key={project.id} className="overflow-hidden">
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={project.imageUrl || "/placeholder.svg"}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{project.category}</p>
                          <p className="text-sm line-clamp-2 mb-4">{project.description}</p>
                          <div className="flex justify-between">
                            <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" disabled={true}>
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {isEditing && selectedProject && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Edit Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProjectForm
                    initialData={selectedProject}
                    onCancel={handleCancelEdit}
                    onSubmit={() => {
                      // ในโหมด Static Data เราไม่สามารถแก้ไขข้อมูลได้จริง
                      // แต่เราจะแสดงให้เห็นว่าฟอร์มทำงานได้
                      alert("In static mode, changes are not saved. This is just a demo.")
                      handleCancelEdit()
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Project</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectForm
                onCancel={() => {}}
                onSubmit={() => {
                  // ในโหมด Static Data เราไม่สามารถเพิ่มข้อมูลได้จริง
                  // แต่เราจะแสดงให้เห็นว่าฟอร์มทำงานได้
                  alert("In static mode, new projects are not saved. This is just a demo.")
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Note: This is running in static mode. Changes will not be saved.</p>
      </div>
    </div>
  )
}
