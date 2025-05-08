"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Loader } from "@/components/loader"

export default function AboutPage() {
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

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

  const skills = ["UI/UX Design", "Web Development", "Branding", "Mobile App Design", "3D Modeling", "Motion Graphics"]

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
                <Link href="/">Pratipan</Link>
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

            {/* About Content */}
            <main className="pt-24 pb-20">
              <div className="container mx-auto px-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl md:text-6xl font-bold mb-16 text-center"
                >
                  About Me
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-stretch">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative h-full flex flex-col"
                  >
                    <div className="aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden flex-grow">
                      <img
                        src="https://img2.pic.in.th/pic/b29ff26c-5093-4090-a47e-e05f32d6e4eacc71be2fff0883c2.jpg"
                        alt="Portrait"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-purple-500 rounded-full filter blur-[100px] opacity-20 z-[-1]"></div>
                  </motion.div>

                  <div className="space-y-6 h-full flex flex-col justify-between">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <h2 className="text-2xl font-bold mb-4">About Me</h2>
                      <div className="space-y-4">
                        <div className="border-l-2 border-purple-500 pl-4">
                          <h3 className="font-bold">Personal Information</h3>
                          <p className="text-gray-300 mt-2">
                            Name: Pratipan Boonpun
                            <br />
                            Nickname: Moo
                            <br />
                            Age: 27
                            <br />
                            Date of Birth: June 25, 1997
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
                      <div className="space-y-4">
                        <div className="border-l-2 border-purple-500 pl-4">
                          <h3 className="font-bold">Visual Designer & Operations</h3>
                          <p className="text-gray-400">IRASUBHOST CO., LTD | 06/2022 - 05/2025</p>
                          <p className="text-gray-300 mt-2">
                            Design graphic media (social, banners, websites) and UI/UX for company software.
                            <br />
                            Analyze market, plan, and determine service package pricing strategies.
                            <br />
                            Manage after-sales systems, provide support and solve customer problems.
                          </p>
                        </div>

                        <div className="border-l-2 border-purple-500 pl-4">
                          <h3 className="font-bold">Engineering Assistant</h3>
                          <p className="text-gray-400">Schneider (Thailand) Co., Ltd. | 03/2019 – 07/2019</p>
                          <p className="text-gray-300 mt-2">
                            Verify electrical equipment according to specifications before installation.
                            <br />
                            Prepare daily electrical equipment installation reports.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    >
                      <h2 className="text-2xl font-bold mb-4">My Skills</h2>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-2 bg-white/5 rounded-full text-sm">UI/UX Design</span>
                        <span className="px-4 py-2 bg-white/5 rounded-full text-sm">Web Development</span>
                        <span className="px-4 py-2 bg-white/5 rounded-full text-sm">Branding</span>
                        <span className="px-4 py-2 bg-white/5 rounded-full text-sm">Mobile App Design</span>
                        <span className="px-4 py-2 bg-white/5 rounded-full text-sm">Motion Graphics</span>
                        <span className="px-4 py-2 bg-white/5 rounded-full text-sm">
                          Social Media & Marketing Graphics
                        </span>
                        <span className="px-4 py-2 bg-white/5 rounded-full text-sm">Promotional Graphics</span>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                    >
                      <h2 className="text-2xl font-bold mb-4">Tools</h2>
                      <div className="space-y-2">
                        <h3 className="font-bold">Design Software</h3>
                        <div className="flex flex-wrap gap-3">
                          <span className="px-4 py-2 bg-white/5 rounded-full text-sm">Adobe Photoshop</span>
                          <span className="px-4 py-2 bg-white/5 rounded-full text-sm">Adobe Illustrator</span>
                          <span className="px-4 py-2 bg-white/5 rounded-full text-sm">Adobe Premiere Pro</span>
                          <span className="px-4 py-2 bg-white/5 rounded-full text-sm">Canva</span>
                          <span className="px-4 py-2 bg-white/5 rounded-full text-sm">Microsoft Office</span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                    >
                      <h2 className="text-2xl font-bold mb-4">Education</h2>
                      <div className="space-y-4">
                        <div className="border-l-2 border-purple-500 pl-4">
                          <h3 className="font-bold">Rajamangala University of Technology Lanna</h3>
                          <p className="text-gray-400">2016-2020</p>
                          <p className="text-gray-300 mt-2">
                            Bachelor of Engineering in Civil and Environmental Engineering
                          </p>
                        </div>
                        <div className="border-l-2 border-purple-500 pl-4">
                          <h3 className="font-bold">Rajamangala University of Technology</h3>
                          <p className="text-gray-400">2013-2015</p>
                          <p className="text-gray-300 mt-2">
                            Technology and Interdisciplinary, Pre-Engineering in Civil Engineering
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      className="flex flex-col items-center justify-center mt-12"
                    >
                      <div className="flex flex-wrap gap-4 justify-center">
                        <Button
                          variant="outline"
                          className="border-white text-white hover:bg-white/10 px-8 py-6 rounded-full text-sm uppercase tracking-widest"
                        >
                          <Link href="/">Profile</Link>
                        </Button>
                        <Button className="bg-white text-black hover:bg-gray-200 px-8 py-6 rounded-full text-sm uppercase tracking-widest">
                          <Link href="/projects">Portfolio</Link>
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </main>

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
                    © 2023 Reframe. All rights reserved.
                  </motion.div>
                </div>
              </div>
            </footer>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
