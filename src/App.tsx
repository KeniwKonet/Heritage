"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import LearnMorePages from "./components/LearnMorePages"
import ChairmanPage from "./components/ChairmanPage"

const App = () => {
  const [currentPage, setCurrentPage] = useState("home")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [activeSection, setActiveSection] = useState("home") // Added active section tracking

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  })
  const [donationForm, setDonationForm] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
  })
  const [selectedDonationAmount, setSelectedDonationAmount] = useState("")
  const [formSubmissions, setFormSubmissions] = useState<{
    contact: { isSubmitting: boolean; isSubmitted: boolean; error: string | null }
    donation: { isSubmitting: boolean; isSubmitted: boolean; error: string | null }
  }>({
    contact: { isSubmitting: false, isSubmitted: false, error: null },
    donation: { isSubmitting: false, isSubmitted: false, error: null },
  })
  const [copiedTooltip, setCopiedTooltip] = useState<string | null>(null)

  // Create refs for each section
  const heroRef = useRef<HTMLElement>(null)
  const commitmentsRef = useRef<HTMLElement>(null)
  const eventsRef = useRef<HTMLElement>(null)
  const testimonialsRef = useRef<HTMLElement>(null)
  const membershipRef = useRef<HTMLElement>(null)
  const donateRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  // Testimonials data
  const testimonials = [
    {
      text: "For testimony",
      author: "Otunba Samson A.Agboola",
      role: "SSG to Ileoluji Okeigbo local government",
    },
    {
      text: "For testimony",
      author: "Oba Adeyeye Enitan Ogunwusi",
      role: "Ooni of Ife",
    },
    {
      text: "For testimony",
      author: "The Royal Grand father",
      role: "Hon.Engr.Festus Adefiranye",
    },
    {
      text: "For testimony",
      author: "MHR, Ileoluji/Okeigbo/Odigbo fed.Constituency",
      role: "Prince Tunde Fisayo",
    },
  ]

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setLastScrollTop(scrollTop)
    }

    // Intersection Observer for active section detection
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute("data-section")
          if (sectionId) {
            setActiveSection(sectionId)
            // Only update currentPage if we're on the home page (not on learn more pages)
            if (
              currentPage === "home" ||
              ["home", "commitments", "events", "testimonials", "membership", "donate", "contact"].includes(currentPage)
            ) {
              setCurrentPage(sectionId)
            }
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all sections
    const sections = [
      { ref: heroRef, id: "home" },
      { ref: commitmentsRef, id: "commitments" },
      { ref: eventsRef, id: "events" },
      { ref: testimonialsRef, id: "testimonials" },
      { ref: membershipRef, id: "membership" },
      { ref: donateRef, id: "donate" },
      { ref: contactRef, id: "contact" },
    ]

    sections.forEach(({ ref, id }) => {
      if (ref.current) {
        ref.current.setAttribute("data-section", id)
        observer.observe(ref.current)
      }
    })

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      observer.disconnect()
    }
  }, [currentPage])

  // Nav Item Component
  const NavItem = ({ page, label, onClick }: { page: string; label: string; onClick: () => void }) => (
    <button
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
      className={`px-4 py-2 mx-2 rounded-full transition-all duration-300 hover:bg-amber-100 hover:text-amber-800 font-medium ${
        activeSection === page ? "bg-amber-200 text-amber-900" : "text-white" // Use activeSection instead of currentPage
      }`}
    >
      {label}
    </button>
  )

  const scrollToSection = (sectionId: string) => {
    const sectionMap: Record<string, HTMLElement | null> = {
      home: heroRef.current,
      commitments: commitmentsRef.current,
      events: eventsRef.current,
      testimonials: testimonialsRef.current,
      membership: membershipRef.current,
      donate: donateRef.current,
      contact: contactRef.current,
    }

    const targetSection = sectionMap[sectionId]
    if (targetSection) {
      // Calculate offset for fixed navbar
      const navbarHeight = 80
      const elementPosition = targetSection.offsetTop - navbarHeight

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })

      setActiveSection(sectionId)
      setCurrentPage(sectionId)
      setIsMenuOpen(false) // Close mobile menu after navigation
    }
  }

  // Fix for Learn More buttons
  const handleLearnMoreClick = (page: string) => {
    setCurrentPage(page)
  }

  const returnToHome = () => {
    setCurrentPage("home")
    setActiveSection("home")
    // Scroll to top when returning home
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleContactFormChange = (field: string, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleDonationFormChange = (field: string, value: string) => {
    setDonationForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleDonationAmountSelect = (amount: string) => {
    setSelectedDonationAmount(amount)
    if (amount !== "Other") {
      setDonationForm((prev) => ({ ...prev, amount }))
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setFormSubmissions((prev) => ({
        ...prev,
        contact: { ...prev.contact, error: "Please fill in all required fields." },
      }))
      return
    }

    if (!validateEmail(contactForm.email)) {
      setFormSubmissions((prev) => ({
        ...prev,
        contact: { ...prev.contact, error: "Please enter a valid email address." },
      }))
      return
    }

    setFormSubmissions((prev) => ({
      ...prev,
      contact: { isSubmitting: true, isSubmitted: false, error: null },
    }))

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setFormSubmissions((prev) => ({
        ...prev,
        contact: { isSubmitting: false, isSubmitted: true, error: null },
      }))
      // Reset form
      setContactForm({ name: "", email: "", subject: "General Inquiry", message: "" })
    } catch (error) {
      setFormSubmissions((prev) => ({
        ...prev,
        contact: { isSubmitting: false, isSubmitted: false, error: "Failed to send message. Please try again." },
      }))
    }
  }

  const handleDonationFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!donationForm.name.trim() || !donationForm.email.trim() || !donationForm.amount.trim()) {
      setFormSubmissions((prev) => ({
        ...prev,
        donation: { ...prev.donation, error: "Please fill in all required fields." },
      }))
      return
    }

    if (!validateEmail(donationForm.email)) {
      setFormSubmissions((prev) => ({
        ...prev,
        donation: { ...prev.donation, error: "Please enter a valid email address." },
      }))
      return
    }

    setFormSubmissions((prev) => ({
      ...prev,
      donation: { isSubmitting: true, isSubmitted: false, error: null },
    }))

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setFormSubmissions((prev) => ({
        ...prev,
        donation: { isSubmitting: false, isSubmitted: true, error: null },
      }))
      // Reset form
      setDonationForm({ name: "", email: "", phone: "", amount: "" })
      setSelectedDonationAmount("")
    } catch (error) {
      setFormSubmissions((prev) => ({
        ...prev,
        donation: { isSubmitting: false, isSubmitted: false, error: "Failed to process donation. Please try again." },
      }))
    }
  }

  // Yoruba Pattern Component
  const YorubaPattern = () => (
    <div className="absolute inset-0 opacity-5">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="yoruba-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M10,10 L70,10 L70,70 L10,70 Z" fill="none" stroke="#D97706" strokeWidth="2" />
            <circle cx="40" cy="40" r="15" fill="none" stroke="#D97706" strokeWidth="2" />
            <path d="M25,25 L55,55 M55,25 L25,55" stroke="#D97706" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#yoruba-pattern)" />
      </svg>
    </div>
  )

  // Hero Section
  const HeroSection = () => (
    <section ref={heroRef} className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Background Image with Gradient Overlay - Fixed */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1632948056627-41482f69c38c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eW9ydWJhfGVufDB8fDB8fHww"
          alt="Traditional Yoruba Culture"
          className="w-full h-full object-cover"
        />
        {/* Black gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0">
        {/* Floating Yoruba Drums */}
        <div className="absolute top-20 left-4 sm:left-10 floating-cultural" style={{ animationDelay: "0s" }}>
          <div className="w-12 h-18 sm:w-16 sm:h-24 bg-amber-800 rounded-lg shadow-lg relative">
            <div className="absolute top-0 left-0 w-full h-3 sm:h-4 bg-amber-700 rounded-t-lg"></div>
            <div className="absolute top-3 sm:top-4 left-0 w-full h-3 sm:h-4 bg-amber-600"></div>
            <div className="absolute top-6 sm:top-8 left-0 w-full h-3 sm:h-4 bg-amber-500"></div>
            <div className="absolute top-9 sm:top-12 left-0 w-full h-3 sm:h-4 bg-amber-400"></div>
            <div className="absolute top-12 sm:top-16 left-0 w-full h-3 sm:h-4 bg-amber-300 rounded-b-lg"></div>
            <div className="absolute top-6 sm:top-8 left-1 sm:left-2 w-1.5 sm:w-2 h-6 sm:h-8 bg-amber-300 rounded-full"></div>
            <div className="absolute top-6 sm:top-8 right-1 sm:right-2 w-1.5 sm:w-2 h-6 sm:h-8 bg-amber-300 rounded-full"></div>
          </div>
        </div>

        {/* Floating Yoruba Masks */}
        <div className="absolute top-40 right-4 sm:right-20 floating-cultural" style={{ animationDelay: "2s" }}>
          <div className="w-10 h-14 sm:w-14 sm:h-18 bg-amber-700 rounded-lg shadow-lg relative">
            <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 w-7 sm:w-10 h-1.5 sm:h-2 bg-amber-300 rounded-full"></div>
            <div className="absolute top-4 sm:top-6 left-3 sm:left-4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-300 rounded-full"></div>
            <div className="absolute top-4 sm:top-6 right-3 sm:right-4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-300 rounded-full"></div>
            <div className="absolute top-7 sm:top-10 left-1.5 sm:left-2 w-7 sm:w-10 h-3 sm:h-4 bg-amber-300 rounded-full"></div>
            <div className="absolute top-10 sm:top-14 left-0 w-10 sm:w-14 h-3 sm:h-4 bg-amber-600 rounded-b-lg"></div>
          </div>
        </div>

        {/* Floating Adire Patterns */}
        <div className="absolute bottom-32 left-4 sm:left-20 floating-cultural" style={{ animationDelay: "4s" }}>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-600 rounded-full shadow-lg relative adire-pattern">
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 bg-amber-300 rounded-full"></div>
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8 w-3 h-3 sm:w-4 sm:h-4 bg-amber-800 rounded-full"></div>
          </div>
        </div>

        {/* Floating Beads */}
        <div className="absolute bottom-40 right-4 sm:right-10 floating-cultural" style={{ animationDelay: "1s" }}>
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-500 rounded-full shadow-lg relative">
            <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 w-7 h-7 sm:w-10 sm:h-10 bg-amber-300 rounded-full"></div>
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-4 h-4 sm:w-6 sm:h-6 bg-amber-700 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Content - Ensure consistent layout across all screen sizes */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8">
            <div className="text-center lg:text-left">
              <div className="yoruba-text-effect mb-6">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-tight text-gradient-yoruba text-shadow-cultural mb-4">
                  Omo Oduduwa
                </h1>
                <div className="h-1 kente-border rounded-full mx-auto lg:mx-0 w-3/4"></div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-cultural font-semibold text-white text-glow-amber mt-6">
                Global Heritage Ltd
              </h2>
            </div>

            <div>
              <p className="text-lg sm:text-xl md:text-2xl text-amber-100 leading-relaxed max-w-lg font-cultural text-center lg:text-left mx-auto lg:mx-0">
                Preserving the rich cultural heritage of the Yoruba people while fostering creativity, diversity, and
                community engagement for future generations.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => scrollToSection("commitments")}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg cultural-border text-sm sm:text-base"
              >
                Explore Our Commitments
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-amber-300 hover:bg-amber-300 hover:text-amber-900 text-amber-300 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                Get Involved
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1665646155658-bdcd66e854db?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8eW9ydWJhfGVufDB8fDB8fHww"
              alt="Yoruba Cultural Artifact"
              className="w-64 sm:w-80 md:w-96 h-auto object-contain rounded-2xl shadow-2xl border-4 border-amber-200"
            />
          </div>
        </div>
      </div>
    </section>
  )

  // Commitments Section
  const CommitmentsSection = () => (
    <section ref={commitmentsRef} className="py-20 bg-white relative">
      <YorubaPattern />
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 font-display">Our Sacred Commitments</h2>
          <p className="text-lg text-gray-700">
            We are dedicated to preserving, celebrating, and sharing the rich cultural heritage of the Yoruba people
            with the world.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Preservation",
              icon: "🏛️",
              desc: "Safeguarding cultural heritage, traditions, and stories for future generations.",
              page: "preservation",
            },
            {
              title: "Diversity & Inclusion",
              icon: "🌈",
              desc: "Celebrating diversity and creating inclusive spaces where all voices are heard.",
              page: "diversity",
            },
            {
              title: "Education & Inspiration",
              icon: "📚",
              desc: "Inspiring curiosity and empowering individuals through cultural engagement.",
              page: "education",
            },
            {
              title: "Artists & Creators",
              icon: "🎨",
              desc: "Supporting artists by providing platforms and resources to share their work.",
              page: "artists",
            },
            {
              title: "Community Engagement",
              icon: "🤝",
              desc: "Fostering collaboration and shared ownership of cultural experiences.",
              page: "community",
            },
            {
              title: "Innovation & Responsibility",
              icon: "⚡",
              desc: "Embracing innovation while respecting tradition and cultural integrity.",
              page: "innovation",
            },
          ].map((commitment, index) => (
            <div
              key={index}
              onClick={() => handleLearnMoreClick(commitment.page)}
              className="bg-white p-8 shadow-lg border border-amber-200 hover:shadow-xl transition-all duration-500 cursor-pointer group transform hover:-translate-y-2"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {commitment.icon}
              </div>
              <h3 className="text-2xl font-bold text-amber-900 mb-4">{commitment.title}</h3>
              <p className="text-gray-700 leading-relaxed">{commitment.desc}</p>
              <div className="mt-4 text-amber-600 font-semibold group-hover:underline learn-more-btn">Learn More →</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  // Events Section
  const EventsSection = () => (
    <section ref={eventsRef} className="py-20 bg-amber-50 relative">
      <YorubaPattern />
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 font-display">Upcoming Events</h2>
          <p className="text-lg text-gray-700">
            Join us for a vibrant calendar of cultural experiences that celebrate Yoruba heritage through art, music,
            dance, food, and community.
          </p>
        </div>
        <div className="space-y-8">
          {[
            {
              title: "Oduduwa Festival 2024",
              date: "March 15-17, 2024",
              location: "Ile-Ife Cultural Center",
              description:
                "Our flagship annual festival celebrating the legacy of Oduduwa with traditional ceremonies, contemporary performances, art exhibitions, and community feasts.",
              image: "https://placehold.co/800x400/amber-600/white?text=Oduduwa+Festival",
              category: "Festival",
            },
            {
              title: "Adire Textile Workshop",
              date: "April 5, 2024",
              location: "Lagos Art Studio",
              description:
                "Learn the ancient art of Adire textile dyeing from master artisans. Create your own patterned fabric using traditional techniques.",
              image: "https://placehold.co/800x400/blue-600/white?text=Adire+Workshop",
              category: "Workshop",
            },
            {
              title: "Ọ̀rọ̀ Àṣà: Yoruba Language Night",
              date: "April 20, 2024",
              location: "Online & Ibadan Community Center",
              description:
                "An evening of Yoruba poetry, storytelling, and conversation. Perfect for language learners and fluent speakers alike.",
              image: "https://placehold.co/800x400/indigo-600/white?text=Language+Night",
              category: "Educational",
            },
          ].map((event, index) => (
            <div
              key={index}
              className="bg-white p-6 shadow-lg border border-teal-100 hover:shadow-xl transition-all duration-500"
            >
              <div className="md:flex gap-6">
                <div className="md:w-1/3 mb-4 md:mb-0">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-48 md:h-32 object-cover rounded-xl"
                  />
                </div>
                <div className="md:w-2/3">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                      {event.category}
                    </span>
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">{event.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-amber-900 mb-2">{event.title}</h3>
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  <div className="flex items-center text-gray-600 mb-4">
                    <span className="font-medium">📍</span>
                    <span className="ml-2">{event.location}</span>
                  </div>
                  <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full transition-colors duration-300 transform hover:scale-105">
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const TestimonialsSection = () => (
    <section ref={testimonialsRef} className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50 relative">
      <YorubaPattern />
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 font-display">What Our Community Says</h2>
          <p className="text-lg text-gray-700">
            Hear from the artists, educators, and cultural enthusiasts who are part of our vibrant community.
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-teal-200 relative">
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 text-6xl text-teal-200 font-serif">"</div>

            <div className="relative z-10">
              <blockquote className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8 font-cultural italic pl-8">
                {testimonials[currentTestimonial].text}
              </blockquote>

              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                    {testimonials[currentTestimonial].author
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </div>
                  <h4 className="text-xl font-bold text-amber-900 mb-1">{testimonials[currentTestimonial].author}</h4>
                  <p className="text-teal-600 font-medium">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? "bg-amber-600 scale-125" : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white p-6 rounded-xl shadow-lg border transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${
                index === currentTestimonial
                  ? "border-amber-400 shadow-xl scale-105"
                  : "border-teal-100 hover:border-teal-300"
              }`}
              onClick={() => setCurrentTestimonial(index)}
            >
              <div className="text-3xl text-teal-400 mb-4">"</div>
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                {testimonial.text.length > 120 ? `${testimonial.text.substring(0, 120)}...` : testimonial.text}
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                  {testimonial.author
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </div>
                <div>
                  <h4 className="font-bold text-amber-900">{testimonial.author}</h4>
                  <p className="text-sm text-teal-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-amber-100 to-teal-100 rounded-2xl p-8 border border-amber-200">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">Join Our Community</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Become part of a vibrant community dedicated to preserving and celebrating Yoruba culture. Share your
              story and help us build a stronger cultural legacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection("membership")}
                className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Become a Member
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Share Your Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  // Membership Section
  const MembershipSection = () => (
    <section ref={membershipRef} className="py-20 bg-white relative">
      <YorubaPattern />
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 font-display">Become a Member</h2>
          <p className="text-lg text-gray-700">
            Join our community of cultural stewards and help preserve and celebrate Yoruba heritage for generations to
            come.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Ọmọ",
              price: "$50/year",
              description: "For students and young adults",
              features: [
                "Monthly cultural newsletter",
                "10% discount on events",
                "Access to member-only online content",
              ],
              popular: false,
            },
            {
              name: "Ológun",
              price: "$150/year",
              description: "For cultural enthusiasts and supporters",
              features: [
                "All Ọmọ benefits",
                "25% discount on events",
                "Invitations to special events",
                "Annual gift (art print or recording)",
              ],
              popular: true,
            },
            {
              name: "Bàbáláwo",
              price: "$500/year",
              description: "For institutional supporters and patrons",
              features: [
                "All Ológun benefits",
                "50% discount on events",
                "Voting rights in annual meeting",
                "Recognition in annual report",
                "Private tour for you and guests",
              ],
              popular: false,
            },
          ].map((plan, index) => (
            <div
              key={index}
              className={`bg-white p-8 shadow-lg border ${plan.popular ? "border-2 border-amber-500" : "border-indigo-100"} hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 relative`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg font-bold text-sm">
                  MOST POPULAR
                </div>
              )}
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-amber-600 mb-2">{plan.name}</div>
                <div className="text-4xl font-bold text-amber-900 mb-2">{plan.price}</div>
                <div className="text-gray-600">{plan.description}</div>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className={`${plan.popular ? "text-amber-600" : "text-indigo-600"} mr-3 mt-1`}>✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full px-6 py-3 ${plan.popular ? "bg-amber-600 hover:bg-amber-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white font-semibold rounded-full transition-colors duration-300`}
              >
                Join as {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  // Donate Section
  const DonateSection = () => (
    <section ref={donateRef} className="py-20 bg-amber-50 relative">
      <YorubaPattern />
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 font-display">Support Our Mission</h2>
          <p className="text-lg text-gray-700">
            Your generous support enables us to continue our vital work in preserving Yoruba cultural heritage,
            supporting artists, educating communities, and creating vibrant cultural experiences for all.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-bold text-amber-900 mb-6">How Your Donation Helps</h3>
            <div className="space-y-6">
              {[
                { amount: "₦5,000", desc: "Provides art supplies for one student in our youth workshops" },
                { amount: "₦25,000", desc: "Supports documentation of one elder's oral history" },
                { amount: "₦100,000", desc: "Funds a community cultural event for 200+ participants" },
                { amount: "₦500,000+", desc: "Establishes a year-long artist residency or major preservation project" },
              ].map((donation, index) => (
                <div key={index} className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h4 className="text-xl font-bold text-red-900 mb-3">{donation.amount}</h4>
                  <p className="text-gray-700">{donation.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img
              src="https://placehold.co/600x500/red-600/white?text=Community+Impact"
              alt="Community Impact"
              className="rounded-2xl shadow-lg w-full h-auto"
            />
            <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-xl p-6 mt-6">
              <h4 className="text-xl font-bold text-amber-900 mb-3">Our Impact</h4>
              <p className="text-gray-700 mb-4">Last year, with the support of donors like you, we:</p>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Supported 47 artists through residencies and grants</li>
                <li>• Reached 15,000+ students through educational programs</li>
                <li>• Preserved 23 endangered cultural practices</li>
                <li>• Hosted 32 community events across 8 cities</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl p-8 border border-red-300">
          <h3 className="text-2xl font-bold text-amber-900 mb-6">Make a Donation</h3>

          {/* Bank Account Details */}
          <div className="bg-white rounded-xl p-6 mb-8 border border-red-200">
            <h4 className="text-lg font-bold text-amber-900 mb-4">Bank Account Details</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-700">Account Name:</p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600 select-all">Omo Oduduwa Global Heritage Ltd</p>
                  <button
                    onClick={() => copyToClipboard("Omo Oduduwa Global Heritage Ltd", "Account Name")}
                    className="text-blue-600 hover:text-blue-800 text-xs underline relative"
                  >
                    {copiedTooltip === "Account Name" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Bank Name:</p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600 select-all">First Bank of Nigeria</p>
                  <button
                    onClick={() => copyToClipboard("First Bank of Nigeria", "Bank Name")}
                    className="text-blue-600 hover:text-blue-800 text-xs underline relative"
                  >
                    {copiedTooltip === "Bank Name" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Account Number:</p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600 font-mono select-all">2034567890</p>
                  <button
                    onClick={() => copyToClipboard("2034567890", "Account Number")}
                    className="text-blue-600 hover:text-blue-800 text-xs underline relative"
                  >
                    {copiedTooltip === "Account Number" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Sort Code:</p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600 font-mono select-all">011-152-003</p>
                  <button
                    onClick={() => copyToClipboard("011-152-003", "Sort Code")}
                    className="text-blue-600 hover:text-blue-800 text-xs underline relative"
                  >
                    {copiedTooltip === "Sort Code" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => {
                  const allDetails = `Account Name: Omo Oduduwa Global Heritage Ltd
Bank Name: First Bank of Nigeria
Account Number: 2034567890
Sort Code: 011-152-003`
                  copyToClipboard(allDetails, "All Account Details")
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300 relative"
              >
                {copiedTooltip === "All Account Details" ? "Copied!" : "Copy All Details"}
              </button>
            </div>
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Please use the form below for online donations or transfer directly to our
                account and send us your details for proper acknowledgment.
              </p>
            </div>
          </div>

          {formSubmissions.donation.isSubmitted ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6">
              <h4 className="font-bold text-lg mb-2">Thank You for Your Donation! 🙏</h4>
              <p>
                Your generous contribution will help us continue preserving Yoruba cultural heritage. You will receive a
                confirmation email shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleDonationFormSubmit}>
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                {[
                  { amount: "₦5,000", desc: "Support a student" },
                  { amount: "₦25,000", desc: "Preserve a story" },
                  { amount: "₦100,000", desc: "Fund an event" },
                  { amount: "Other", desc: "Choose your amount" },
                ].map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDonationAmountSelect(option.amount)}
                    className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                      selectedDonationAmount === option.amount
                        ? "border-red-500 bg-red-50 shadow-lg"
                        : "border-red-200 hover:border-red-400 hover:bg-red-50"
                    }`}
                  >
                    <div className="font-bold text-lg">{option.amount}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </button>
                ))}
              </div>

              {selectedDonationAmount === "Other" && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Custom Amount (₦)</label>
                  <input
                    type="number"
                    value={donationForm.amount}
                    onChange={(e) => handleDonationFormChange("amount", e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    min="1000"
                  />
                </div>
              )}

              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    value={donationForm.name}
                    onChange={(e) => {
                      console.log("[v0] Donation form name change:", e.target.value)
                      handleDonationFormChange("name", e.target.value)
                    }}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white pointer-events-auto relative z-10"
                    required
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={donationForm.email}
                    onChange={(e) => {
                      console.log("[v0] Donation form email change:", e.target.value)
                      handleDonationFormChange("email", e.target.value)
                    }}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white pointer-events-auto relative z-10"
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={donationForm.phone}
                    onChange={(e) => {
                      console.log("[v0] Donation form phone change:", e.target.value)
                      handleDonationFormChange("phone", e.target.value)
                    }}
                    placeholder="+234 800 000 0000"
                    className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white pointer-events-auto relative z-10"
                    autoComplete="tel"
                  />
                </div>
              </div>

              {formSubmissions.donation.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {formSubmissions.donation.error}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  formSubmissions.donation.isSubmitting ||
                  !selectedDonationAmount ||
                  !donationForm.name ||
                  !donationForm.email ||
                  (selectedDonationAmount !== "Other" ? false : !donationForm.amount)
                }
                className="w-full px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:scale-105"
              >
                {formSubmissions.donation.isSubmitting ? "Processing..." : "Complete Donation"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )

  // Contact Section
  const ContactSection = () => (
    <section ref={contactRef} className="py-20 bg-white relative">
      <YorubaPattern />
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 font-display">Contact Us</h2>
          <p className="text-lg text-gray-700">
            We'd love to hear from you! Whether you have questions about our programs, want to collaborate, or are
            interested in supporting our mission, our team is here to help.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-bold text-amber-900 mb-6">Get in Touch</h3>
            <div className="space-y-6 mb-8">
              {[
                {
                  icon: "📍",
                  title: "Office Address",
                  content: "29, Salau Rasaq street Ikorodu Lagos State",
                  link: "https://maps.google.com/?q=29,+Salau+Rasaq+street+Ikorodu+Lagos+State",
                  isClickable: true,
                },
                {
                  icon: "📞",
                  title: "Phone",
                  content: "08100355606\n09022089999",
                  link: "tel:08100355606",
                  isClickable: true,
                },
                {
                  icon: "✉️",
                  title: "Email",
                  content: "omooduduwaheritage@gmail.com",
                  link: "mailto:omooduduwaheritage@gmail.com?subject=Inquiry%20from%20Website",
                  isClickable: true,
                },
                {
                  icon: "🕒",
                  title: "Hours",
                  content: "Monday - Friday: 9am - 5pm\nSaturday: 10am - 2pm\nSunday: Closed",
                  isClickable: false,
                },
              ].map((contact, index) => (
                <div key={index} className="flex items-start">
                  <div className="text-2xl text-green-600 mr-4">{contact.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-amber-900 mb-1">{contact.title}</h3>
                    {contact.isClickable ? (
                      <a
                        href={contact.link}
                        target={contact.title === "Headquarters" ? "_blank" : "_self"}
                        rel={contact.title === "Headquarters" ? "noopener noreferrer" : undefined}
                        className="text-gray-700 whitespace-pre-line hover:text-amber-600 transition-colors duration-300 cursor-pointer"
                      >
                        {contact.content}
                      </a>
                    ) : (
                      <p className="text-gray-700 whitespace-pre-line">{contact.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-4">
              {[
                {
                  icon: "📱",
                  label: "WhatsApp",
                  link: "https://wa.me/2348000000000?text=Hello%20Omo%20Oduduwa%20Global%20Heritage",
                },
                { icon: "📘", label: "Facebook", link: "https://facebook.com/omooduduwa" },
                { icon: "📸", label: "Instagram", link: "https://instagram.com/omooduduwa" },
                { icon: "🎬", label: "YouTube", link: "https://youtube.com/@omooduduwa" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center text-green-700 hover:text-green-900 transition-colors duration-300 transform hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-amber-900 mb-6">Send Us a Message</h3>

            {formSubmissions.contact.isSubmitted ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-8 rounded-lg">
                <h4 className="font-bold text-xl mb-3">Message Sent Successfully! ✅</h4>
                <p className="text-lg">Thank you for reaching out to us. We'll get back to you within 24 hours.</p>
                <button
                  onClick={() =>
                    setFormSubmissions((prev) => ({
                      ...prev,
                      contact: { isSubmitting: false, isSubmitted: false, error: null },
                    }))
                  }
                  className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-colors duration-300"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => {
                      console.log("[v0] Contact form name change:", e.target.value)
                      handleContactFormChange("name", e.target.value)
                    }}
                    className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white pointer-events-auto relative z-10"
                    placeholder="Your full name"
                    required
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => {
                      console.log("[v0] Contact form email change:", e.target.value)
                      handleContactFormChange("email", e.target.value)
                    }}
                    className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white pointer-events-auto relative z-10"
                    placeholder="your.email@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Subject</label>
                  <select
                    value={contactForm.subject}
                    onChange={(e) => {
                      console.log("[v0] Contact form subject change:", e.target.value)
                      handleContactFormChange("subject", e.target.value)
                    }}
                    className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white pointer-events-auto relative z-10"
                  >
                    <option>General Inquiry</option>
                    <option>Membership Questions</option>
                    <option>Donation Information</option>
                    <option>Event Partnership</option>
                    <option>Artist Opportunities</option>
                    <option>Press & Media</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Message *</label>
                  <textarea
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => {
                      console.log("[v0] Contact form message change:", e.target.value)
                      handleContactFormChange("message", e.target.value)
                    }}
                    className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white pointer-events-auto relative z-10 resize-vertical"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>

                {formSubmissions.contact.error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {formSubmissions.contact.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formSubmissions.contact.isSubmitting}
                  className="w-full px-8 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  {formSubmissions.contact.isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-green-100 to-teal-100 rounded-2xl p-8 border border-green-300">
          <h3 className="text-2xl font-bold text-amber-900 mb-6 text-center">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: "How can I volunteer with your organization?",
                answer:
                  "We welcome volunteers for our events, educational programs, and administrative support. Please fill out our volunteer application form on our website or contact our volunteer coordinator at volunteer@omooduduwa.org",
              },
              {
                question: "Do you offer internships?",
                answer:
                  "Yes! We offer internships in various departments including arts programming, education, preservation, and administration. Check our careers page for current opportunities.",
              },
              {
                question: "Can I donate artifacts or artworks?",
                answer:
                  "We are honored when individuals wish to donate cultural items to our collection. Please contact our curatorial team at collections@omooduduwa.org to discuss potential donations.",
              },
              {
                question: "How can I bring your programs to my community?",
                answer:
                  "We love partnering with communities! Please contact our community engagement team at community@omooduduwa.org to discuss possibilities for collaboration.",
              },
            ].map((faq, index) => (
              <div key={index}>
                <h4 className="text-lg font-bold text-green-900 mb-2">{faq.question}</h4>
                <p className="text-gray-700">
                  {faq.answer.includes("@") ? (
                    <>
                      {faq.answer.split("@")[0]}
                      <a
                        href={`mailto:${faq.answer.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0]}?subject=Inquiry%20from%20Website`}
                        className="text-amber-600 hover:text-amber-800 transition-colors duration-300"
                      >
                        @{faq.answer.split("@")[1]}
                      </a>
                    </>
                  ) : (
                    faq.answer
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedTooltip(label)
        setTimeout(() => setCopiedTooltip(null), 2000)
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        try {
          document.execCommand("copy")
          setCopiedTooltip(label)
          setTimeout(() => setCopiedTooltip(null), 2000)
        } catch (err) {
          console.error("Fallback copy failed", err)
        }
        document.body.removeChild(textArea)
      })
  }

  if (
    currentPage !== "home" &&
    ["preservation", "diversity", "education", "artists", "community", "innovation"].includes(currentPage)
  ) {
    return <LearnMorePages page={currentPage} onBack={returnToHome} />
  }

  if (currentPage === "chairman") {
    return <ChairmanPage onBack={returnToHome} />
  }

  return (
    <div className="font-sans">
      {/* Navigation - Fixed with company logo and Get Involved button */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-amber-900/90 backdrop-blur-md border-b border-amber-700 transition-all duration-300 ${lastScrollTop > 50 ? "py-2" : "py-4"}`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => scrollToSection("home")}
                className="flex items-center space-x-4 hover:opacity-80 transition-opacity duration-300"
              >
                {" "}
                {/* Made logo clickable to return home */}
                <img
                  src="https://placehold.co/50x50/amber-600/white?text=OO"
                  alt="Omo Oduduwa Logo"
                  className="w-10 h-10 rounded-full border-2 border-amber-300"
                />
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <NavItem page="home" label="Home" onClick={() => scrollToSection("home")} />
              <NavItem page="commitments" label="Commitments" onClick={() => scrollToSection("commitments")} />
              <NavItem page="events" label="Events" onClick={() => scrollToSection("events")} />
              <NavItem page="testimonials" label="Testimonials" onClick={() => scrollToSection("testimonials")} />
              <NavItem page="membership" label="Membership" onClick={() => scrollToSection("membership")} />
              <NavItem page="donate" label="Donate" onClick={() => scrollToSection("donate")} />
              <NavItem page="contact" label="Contact" onClick={() => scrollToSection("contact")} />
              <NavItem page="chairman" label="Meet Our Chairman" onClick={() => setCurrentPage("chairman")} />
              <button
                onClick={() => scrollToSection("contact")}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Get Involved
              </button>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white p-2">
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div
                  className={`w-full h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
                ></div>
                <div
                  className={`w-full h-0.5 bg-white transition-opacity duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
                ></div>
                <div
                  className={`w-full h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
                ></div>
              </div>
            </button>
          </div>
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-amber-800 border-t border-amber-700 py-4 mt-2">
              <div className="flex flex-col space-y-2 px-4">
                <button
                  onClick={() => {
                    scrollToSection("home")
                    setIsMenuOpen(false)
                  }}
                  className="text-left px-4 py-2 text-white hover:bg-amber-700 rounded-md transition-colors duration-300"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    scrollToSection("commitments")
                    setIsMenuOpen(false)
                  }}
                  className="text-left px-4 py-2 text-white hover:bg-amber-700 rounded-md transition-colors duration-300"
                >
                  Commitments
                </button>
                <button
                  onClick={() => {
                    scrollToSection("events")
                    setIsMenuOpen(false)
                  }}
                  className="text-left px-4 py-2 text-white hover:bg-amber-700 rounded-md transition-colors duration-300"
                >
                  Events
                </button>
                <button
                  onClick={() => {
                    scrollToSection("testimonials")
                    setIsMenuOpen(false)
                  }}
                  className="text-left px-4 py-2 text-white hover:bg-amber-700 rounded-md transition-colors duration-300"
                >
                  Testimonials
                </button>
                <button
                  onClick={() => {
                    scrollToSection("membership")
                    setIsMenuOpen(false)
                  }}
                  className="text-left px-4 py-2 text-white hover:bg-amber-700 rounded-md transition-colors duration-300"
                >
                  Membership
                </button>
                <button
                  onClick={() => {
                    scrollToSection("donate")
                    setIsMenuOpen(false)
                  }}
                  className="text-left px-4 py-2 text-white hover:bg-amber-700 rounded-md transition-colors duration-300"
                >
                  Donate
                </button>
                <button
                  onClick={() => {
                    scrollToSection("contact")
                    setIsMenuOpen(false)
                  }}
                  className="text-left px-4 py-2 text-white hover:bg-amber-700 rounded-md transition-colors duration-300"
                >
                  Contact
                </button>
                <button
                  onClick={() => {
                    setCurrentPage("chairman")
                    setIsMenuOpen(false)
                  }}
                  className="text-left px-4 py-2 text-white hover:bg-amber-700 rounded-md transition-colors duration-300"
                >
                  Meet Our Chairman
                </button>
                <button
                  onClick={() => {
                    scrollToSection("contact")
                    setIsMenuOpen(false)
                  }}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-colors duration-300 mt-4"
                >
                  Get Involved
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <div className="pt-20">
        <HeroSection />
        <CommitmentsSection />
        <EventsSection />
        <TestimonialsSection />
        <MembershipSection />
        <DonateSection />
        <ContactSection />
      </div>

      {/* Footer */}
      <footer className="bg-amber-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img
                  src="https://placehold.co/60x60/amber-600/white?text=OO"
                  alt="Omo Oduduwa Logo"
                  className="w-12 h-12 rounded-full border-2 border-amber-300 mr-3"
                />
                <h3 className="text-2xl font-bold">Omo Oduduwa</h3>
              </div>
              <p className="text-amber-200 mb-4">
                Preserving the rich cultural heritage of the Yoruba people while fostering creativity, diversity, and
                community engagement.
              </p>
              <div className="flex space-x-4">
                {[
                  {
                    icon: "📱",
                    label: "WhatsApp",
                    link: "https://wa.me/2348000000000?text=Hello%20Omo%20Oduduwa%20Global%20Heritage",
                  },
                  { icon: "📘", label: "Facebook", link: "https://facebook.com/omooduduwa" },
                  { icon: "📸", label: "Instagram", link: "https://instagram.com/omooduduwa" },
                  { icon: "🎬", label: "YouTube", link: "https://youtube.com/@omooduduwa" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.label}
                    className="w-10 h-10 bg-amber-800 hover:bg-amber-700 rounded-full flex items-center justify-center transition-colors duration-300 transform hover:scale-110"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { label: "Home", action: () => scrollToSection("home") },
                  { label: "Commitments", action: () => scrollToSection("commitments") },
                  { label: "Events", action: () => scrollToSection("events") },
                  { label: "Testimonials", action: () => scrollToSection("testimonials") },
                  { label: "Membership", action: () => scrollToSection("membership") },
                  { label: "Donate", action: () => scrollToSection("donate") },
                  { label: "Contact", action: () => scrollToSection("contact") },
                ].map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        link.action()
                      }}
                      className="text-amber-200 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Commitments</h4>
              <ul className="space-y-2">
                {[
                  { label: "Preservation", action: () => handleLearnMoreClick("preservation") },
                  { label: "Diversity & Inclusion", action: () => handleLearnMoreClick("diversity") },
                  { label: "Education & Inspiration", action: () => handleLearnMoreClick("education") },
                  { label: "Artists & Creators", action: () => handleLearnMoreClick("artists") },
                  { label: "Community Engagement", action: () => handleLearnMoreClick("community") },
                  { label: "Innovation & Responsibility", action: () => handleLearnMoreClick("innovation") },
                ].map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        link.action()
                      }}
                      className="text-amber-200 hover:text-white transition-colors duration-300 text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Info</h4>
              <div className="space-y-3 text-amber-200">
                <div>
                  <a
                    href="https://maps.google.com/?q=29,+Salau+Rasaq+street+Ikorodu+Lagos+State"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-300"
                  >
                    📍 29, Salau Rasaq street Ikorodu Lagos State
                  </a>
                </div>
                <div>
                  <a href="tel:08100355606" className="hover:text-white transition-colors duration-300">
                    📞 08100355606
                  </a>
                </div>
                <div>
                  <a
                    href="mailto:omooduduwaheritage@gmail.com?subject=Inquiry%20from%20Website"
                    className="hover:text-white transition-colors duration-300"
                  >
                    ✉️ omooduduwaheritage@gmail.com
                  </a>
                </div>
                <div>🕒 Mon-Fri: 9am-5pm</div>
              </div>
            </div>
          </div>
          <div className="border-t border-amber-800 mt-8 pt-8 text-center text-amber-300">
            <p>&copy; 2024 Omo Oduduwa Global Heritage Ltd. All rights reserved.</p>
            <p className="text-sm mt-2">Preserving culture, inspiring generations.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
