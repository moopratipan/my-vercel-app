"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const menuItems = [
    { name: "Profile", path: "/" },
    { name: "About", path: "/about" },
    { name: "Portfolio", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ]

  return (
    <>
      {/* Loader */}
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {!loading && (
          <>
            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl font-bold"
              >
                Pratipan
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="hidden md:flex space-x-8"
              >
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    className={cn(
                      "text-sm uppercase tracking-widest hover:text-gray-400 transition-colors",
                      pathname === item.path ? "text-white" : "text-gray-300",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="md:hidden"
              >
                <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white">
                  <Menu size={24} />
                </Button>
              </motion.div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMenu}
                    className="absolute top-6 right-8 text-white"
                  >
                    <X size={24} />
                  </Button>

                  <nav className="flex flex-col items-center space-y-8">
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Link
                          href={item.path}
                          className="text-2xl uppercase tracking-widest hover:text-gray-400 transition-colors"
                          onClick={toggleMenu}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hero Section */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-screen flex flex-col justify-center items-center relative overflow-hidden pt-16 sm:pt-0" // เพิ่ม padding-top บนมือถือ
            >
              {/* Background with blur + image */}
              <div
                className="absolute inset-0 bg-cover bg-center z-[-1]"
                style={{
                  backgroundImage: 'url("https://img2.pic.in.th/pic/883d4023fb16c8c35b76df7cf686a7b6.png")',
                }}
              >
                {/* ลบเอฟเฟคที่ทำกับภาพพื้นหลัง */}
              </div>

              {/* Content */}
              <div className="container mx-auto px-4 text-center mt-10 sm:mt-0">
                {" "}
                {/* เพิ่ม margin-top บนมือถือ */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
                >
                  Hello, I'm Pratipan Boonpun
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="text-xl text-gray-300 max-w-2xl mx-auto mb-10"
                >
                  I'm passionate about graphic design and love creating visuals that are both clear and creative. I also
                  have some experience in building websites, which helps me understand both the visual and functional
                  side of design. I'm looking for an opportunity to grow and learn more in the field of graphic design.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                  className="flex flex-col sm:flex-row justify-center gap-6 mb-24 sm:mb-0" // เพิ่ม margin ด้านล่างบนมือถือ
                >
                  <Button className="bg-white text-black hover:bg-gray-200 px-8 py-6 rounded-full text-sm uppercase tracking-widest h-14 sm:h-auto">
                    <Link href="/about" className="w-full h-full flex items-center justify-center">
                      About Me
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-8 py-6 rounded-full text-sm uppercase tracking-widest h-14 sm:h-auto"
                  >
                    <Link href="/projects" className="w-full h-full flex items-center justify-center">
                      Portfolio
                    </Link>
                  </Button>
                </motion.div>
              </div>

              {/* Scroll Down Indicator - ซ่อนบนมือถือ */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden sm:flex flex-col items-center"
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-400 mb-2">Scroll Down</span>
                  <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                    <motion.div
                      animate={{ y: [0, 12, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                      className="w-1 h-2 bg-white rounded-full mt-2"
                    ></motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Mobile Scroll Indicator - แสดงเฉพาะบนมือถือและอยู่ด้านล่างปุ่ม */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 sm:hidden"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400 mb-1">Scroll Down</span>
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    className="w-5 h-5 text-white"
                  >
                    ↓
                  </motion.div>
                </div>
              </motion.div>
            </motion.section>

            {/* Projects Preview Section */}
            <section className="py-20 bg-black">
              <div className="container mx-auto px-4">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-3xl md:text-4xl font-bold mb-16 text-center"
                >
                  Featured Works
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                  {/* Image 1 - ลบเอฟเฟคที่ทำกับภาพ */}
                  <div className="relative overflow-hidden rounded-lg">
                    <div className="aspect-square bg-gray-900 overflow-hidden">
                      <img
                        src="https://img5.pic.in.th/file/secure-sv1/rpa-.png"
                        alt="Project 1"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-xl font-bold mb-2">Promotional Graphics </h3>
                      <p className="text-gray-300 mb-4">Marketing & Promotional Materials</p>
                      <Button
                        variant="outline"
                        className="w-fit border-white text-white hover:bg-white/10 rounded-full text-xs uppercase tracking-widest"
                      >
                        View Project
                      </Button>
                    </div>
                  </div>

                  {/* Image 2 - ลบเอฟเฟคที่ทำกับภาพ */}
                  <div className="relative overflow-hidden rounded-lg">
                    <div className="aspect-square bg-gray-900 overflow-hidden">
                      <img
                        src="https://img2.pic.in.th/pic/Design-websit--app-2.png"
                        alt="Project 2"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-xl font-bold mb-2">UI/UX Design</h3>
                      <p className="text-gray-300 mb-4">Website and Application Design</p>
                      <Button
                        variant="outline"
                        className="w-fit border-white text-white hover:bg-white/10 rounded-full text-xs uppercase tracking-widest"
                      >
                        View Project
                      </Button>
                    </div>
                  </div>

                  {/* Image 3 - ลบเอฟเฟคที่ทำกับภาพ */}
                  <div className="relative overflow-hidden rounded-lg">
                    <div className="aspect-square bg-gray-900 overflow-hidden">
                      <img
                        src="https://i.postimg.cc/bw3LkZNy/image.png"
                        alt="Project 3"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-xl font-bold mb-2">Social Media & Marketing Graphics </h3>
                      <p className="text-gray-300 mb-4">Social Media and Online Advertising Graphics</p>
                      <Button
                        variant="outline"
                        className="w-fit border-white text-white hover:bg-white/10 rounded-full text-xs uppercase tracking-widest"
                      >
                        View Project
                      </Button>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex justify-center mt-16"
                >
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-8 py-6 rounded-full text-sm uppercase tracking-widest"
                  >
                    View All Projects
                  </Button>
                </motion.div>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-10 bg-black border-t border-white/10">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-xl font-bold mb-6 md:mb-0"
                  >
                    Pratipan
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex space-x-6 mb-6 md:mb-0"
                  >
                    {["Twitter", "Instagram", "Dribbble", "LinkedIn"].map((social, index) => (
                      <a key={index} href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                        {social}
                      </a>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-sm text-gray-400"
                  >
                    © 2024 Pratipan. All rights reserved.
                  </motion.div>
                </div>
              </div>
            </footer>

            {/* Mobile Fixed Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md p-3 sm:hidden z-50">
              <div className="flex justify-center space-x-4">
                <Button className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full text-sm uppercase tracking-widest flex-1">
                  <Link href="/about" className="w-full h-full flex items-center justify-center">
                    About Me
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-6 py-3 rounded-full text-sm uppercase tracking-widest flex-1"
                >
                  <Link href="/projects" className="w-full h-full flex items-center justify-center">
                    Portfolio
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
