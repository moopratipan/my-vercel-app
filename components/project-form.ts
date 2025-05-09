export interface ProjectData {
  id: number
  title: string
  category: string
  description: string
  image: {
    src: string
    alt?: string
    width: number
    height: number
  }
  priority: number
}
