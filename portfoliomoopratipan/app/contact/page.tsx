"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Menu, X, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Loader } from "@/components/loader"

export default function ContactPage() {
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log(formState)
    // Reset form
    setFormState({
      name: "",
      email: "",
      message: "",
    })
    // Show success message
    alert("Message sent successfully!")
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

            {/* Contact Content */}
            <main className="pt-24 pb-20 min-h-screen">
              <div className="container mx-auto px-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl md:text-6xl font-bold mb-16 text-center"
                >
                  Get In Touch
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-8"
                  >
                    <h2 className="text-2xl font-bold">Contact Information</h2>
                    <p className="text-gray-300 leading-relaxed">
                      Feel free to reach out if you're looking for a designer, have a question, or just want to connect.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-1">Email</h3>
                        <p className="text-white">contact@Pratipan.com</p>
                      </div>
                      <div>
                        <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-1">Location</h3>
                        <p className="text-white">Bangkok, Thailand</p>
                      </div>
                      <div>
                        <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-1">Follow</h3>
                        <div className="flex space-x-4 mt-2">
                          {["Twitter", "Instagram", "Dribbble", "LinkedIn"].map((social, index) => (
                            <a
                              key={index}
                              href="#"
                              className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                              {social}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="text-sm uppercase tracking-widest text-gray-400 mb-1 block">
                          Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleInputChange}
                          className="bg-white/5 border-white/10 focus:border-white/30 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="text-sm uppercase tracking-widest text-gray-400 mb-1 block">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleInputChange}
                          className="bg-white/5 border-white/10 focus:border-white/30 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="text-sm uppercase tracking-widest text-gray-400 mb-1 block">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleInputChange}
                          className="bg-white/5 border-white/10 focus:border-white/30 text-white min-h-[150px]"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="bg-white text-black hover:bg-gray-200 px-8 py-6 rounded-full text-sm uppercase tracking-widest w-full md:w-auto"
                      >
                        <Send size={16} className="mr-2" />
                        Send Message
                      </Button>
                    </form>
                  </motion.div>
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
