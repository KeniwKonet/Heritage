"use client"

import type React from "react"

interface LearnMorePageProps {
  page: string
  onBack: () => void
}

const LearnMorePages: React.FC<LearnMorePageProps> = ({ page, onBack }) => {
  const pageContent = {
    preservation: {
      title: "Cultural Preservation",
      subtitle: "Safeguarding Our Heritage for Future Generations",
      hero: "https://placehold.co/1200x400/amber-600/white?text=Cultural+Preservation",
      content: {
        overview:
          "Our preservation efforts focus on documenting, protecting, and maintaining the rich cultural heritage of the Yoruba people. We work tirelessly to ensure that traditional practices, languages, arts, and stories are not lost to time.",
        initiatives: [
          {
            title: "Oral History Documentation",
            description:
              "Recording and preserving the stories, wisdom, and experiences of Yoruba elders and community leaders.",
            impact: "Over 500 hours of oral histories documented from 150+ community elders",
          },
          {
            title: "Traditional Arts Archive",
            description:
              "Creating comprehensive digital archives of traditional Yoruba arts, crafts, and ceremonial objects.",
            impact: "3,000+ artifacts catalogued and preserved in our digital collection",
          },
          {
            title: "Language Preservation",
            description:
              "Developing resources and programs to maintain and teach the Yoruba language to younger generations.",
            impact: "15 language learning programs established across 8 communities",
          },
          {
            title: "Sacred Site Protection",
            description:
              "Working with communities to protect and maintain culturally significant locations and landmarks.",
            impact: "12 sacred sites officially recognized and protected through our advocacy",
          },
        ],
        callToAction:
          "Join our preservation efforts by volunteering for documentation projects, donating cultural artifacts, or supporting our digital archive initiatives.",
      },
    },
    diversity: {
      title: "Diversity & Inclusion",
      subtitle: "Celebrating All Voices in Yoruba Culture",
      hero: "https://placehold.co/1200x400/teal-600/white?text=Diversity+Inclusion",
      content: {
        overview:
          "We believe that Yoruba culture is enriched by the diverse experiences and perspectives of all its people. Our inclusion initiatives ensure that everyone has a voice and place in our cultural community.",
        initiatives: [
          {
            title: "Women's Cultural Leadership",
            description:
              "Empowering women to take leadership roles in cultural preservation and community development.",
            impact: "60% of our program leaders are women, with 25 women-led cultural initiatives launched",
          },
          {
            title: "Youth Engagement Programs",
            description:
              "Creating opportunities for young people to connect with their cultural heritage in meaningful ways.",
            impact: "2,500+ youth participants across 40 programs annually",
          },
          {
            title: "Diaspora Connection",
            description: "Building bridges between Yoruba communities worldwide, regardless of geographic location.",
            impact: "Cultural exchange programs connecting 15 countries and 50+ diaspora communities",
          },
          {
            title: "Accessibility Initiatives",
            description: "Ensuring our programs and events are accessible to people of all abilities and backgrounds.",
            impact: "100% of our events now include accessibility accommodations and multilingual support",
          },
        ],
        callToAction:
          "Help us build a more inclusive cultural community by participating in our diversity programs, sharing your story, or supporting inclusive event planning.",
      },
    },
    education: {
      title: "Education & Inspiration",
      subtitle: "Empowering Through Cultural Knowledge",
      hero: "https://placehold.co/1200x400/indigo-600/white?text=Education+Inspiration",
      content: {
        overview:
          "Education is at the heart of cultural preservation. We develop innovative programs that inspire curiosity, deepen understanding, and empower individuals to become cultural ambassadors.",
        initiatives: [
          {
            title: "School Partnership Programs",
            description: "Collaborating with schools to integrate Yoruba cultural education into curricula.",
            impact: "45 schools participating, reaching 8,000+ students annually",
          },
          {
            title: "Adult Learning Workshops",
            description:
              "Offering workshops for adults to reconnect with their cultural roots and learn traditional skills.",
            impact: "120 workshops conducted with 95% participant satisfaction rate",
          },
          {
            title: "Digital Learning Platform",
            description: "Creating online resources and courses accessible to learners worldwide.",
            impact: "50,000+ users from 30 countries accessing our digital learning materials",
          },
          {
            title: "Cultural Mentorship",
            description: "Connecting experienced cultural practitioners with eager learners for one-on-one guidance.",
            impact: "200+ active mentorship pairs with 85% completion rate",
          },
        ],
        callToAction:
          "Expand your cultural knowledge by enrolling in our programs, becoming a mentor, or helping develop educational resources for future learners.",
      },
    },
    artists: {
      title: "Artists & Creators",
      subtitle: "Supporting Creative Expression and Innovation",
      hero: "https://placehold.co/1200x400/purple-600/white?text=Artists+Creators",
      content: {
        overview:
          "Artists are the lifeblood of cultural expression. We provide platforms, resources, and support systems that enable Yoruba artists and creators to thrive while honoring traditional forms.",
        initiatives: [
          {
            title: "Artist Residency Program",
            description:
              "Providing dedicated time, space, and resources for artists to create and develop their craft.",
            impact: "50+ artists supported through residencies, with 200+ artworks created",
          },
          {
            title: "Creative Grants & Funding",
            description: "Offering financial support for artistic projects that celebrate and preserve Yoruba culture.",
            impact: "$500,000+ distributed to 75 artists and creative projects",
          },
          {
            title: "Exhibition & Performance Platforms",
            description: "Creating opportunities for artists to showcase their work to diverse audiences.",
            impact: "24 exhibitions and 60+ performances featuring 300+ artists annually",
          },
          {
            title: "Skills Development Workshops",
            description:
              "Providing training in both traditional techniques and contemporary business skills for artists.",
            impact: "180+ artists trained in business skills, 90% report increased income",
          },
        ],
        callToAction:
          "Support our artist community by attending exhibitions, purchasing artwork, applying for grants, or volunteering to mentor emerging artists.",
      },
    },
    community: {
      title: "Community Engagement",
      subtitle: "Building Stronger Cultural Communities",
      hero: "https://placehold.co/1200x400/green-600/white?text=Community+Engagement",
      content: {
        overview:
          "Strong communities are the foundation of cultural preservation. We foster collaboration, shared ownership, and collective action to strengthen Yoruba communities worldwide.",
        initiatives: [
          {
            title: "Community Cultural Centers",
            description:
              "Establishing and supporting local centers that serve as hubs for cultural activities and gatherings.",
            impact: "12 cultural centers established, serving 25,000+ community members",
          },
          {
            title: "Festival & Celebration Support",
            description: "Helping communities organize and enhance their cultural festivals and celebrations.",
            impact: "35+ festivals supported annually, attracting 100,000+ participants",
          },
          {
            title: "Volunteer Network",
            description: "Building a network of dedicated volunteers who support various cultural initiatives.",
            impact: "800+ active volunteers contributing 15,000+ hours annually",
          },
          {
            title: "Community Leadership Development",
            description: "Training local leaders to champion cultural initiatives in their own communities.",
            impact: "150+ community leaders trained, leading 200+ local cultural projects",
          },
        ],
        callToAction:
          "Strengthen your community by volunteering, organizing local events, joining our leadership program, or starting a cultural initiative in your area.",
      },
    },
    innovation: {
      title: "Innovation & Responsibility",
      subtitle: "Embracing Change While Honoring Tradition",
      hero: "https://placehold.co/1200x400/orange-600/white?text=Innovation+Responsibility",
      content: {
        overview:
          "We believe in the power of innovation to enhance and preserve cultural traditions. Our approach balances respect for traditional practices with creative applications of new technologies and methodologies.",
        initiatives: [
          {
            title: "Digital Heritage Projects",
            description:
              "Using technology to create immersive experiences and preserve cultural knowledge for future generations.",
            impact: "5 virtual reality experiences created, 3D scanning of 500+ cultural artifacts",
          },
          {
            title: "Sustainable Cultural Practices",
            description:
              "Developing environmentally responsible approaches to cultural events and preservation activities.",
            impact: "50% reduction in event waste, 100% renewable energy at our main facilities",
          },
          {
            title: "Cultural Innovation Labs",
            description:
              "Creating spaces where traditional practitioners and modern innovators collaborate on new approaches.",
            impact: "20+ innovative projects launched, blending traditional knowledge with modern solutions",
          },
          {
            title: "Ethical Guidelines Development",
            description: "Establishing standards for respectful cultural representation and responsible innovation.",
            impact: "Comprehensive ethical guidelines adopted by 30+ cultural organizations",
          },
        ],
        callToAction:
          "Join our innovation efforts by proposing new projects, participating in our labs, supporting sustainable practices, or helping develop ethical guidelines.",
      },
    },
  }

  const currentPage = pageContent[page as keyof typeof pageContent]

  if (!currentPage) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Page Not Found</h2>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-colors duration-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-amber-900 to-amber-700 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={currentPage.hero || "/placeholder.svg"}
            alt={currentPage.title}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white text-gradient-yoruba mb-4">
              {currentPage.title}
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 font-cultural">{currentPage.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="bg-amber-50 py-4">
        <div className="container mx-auto px-6">
          <button
            onClick={onBack}
            className="flex items-center text-amber-700 hover:text-amber-900 transition-colors duration-300"
          >
            <span className="mr-2">←</span>
            Back to Home
          </button>
        </div>
      </div>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {/* Overview */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold text-amber-900 mb-6">Our Approach</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{currentPage.content.overview}</p>
          </div>

          {/* Initiatives */}
          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold text-amber-900 mb-12 text-center">Key Initiatives</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {currentPage.content.initiatives.map((initiative, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg border border-amber-200 hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-xl font-bold text-amber-900 mb-4">{initiative.title}</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">{initiative.description}</p>
                  <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                    <h4 className="font-semibold text-amber-900 mb-2">Impact:</h4>
                    <p className="text-amber-800">{initiative.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-amber-100 to-orange-100 p-12 rounded-2xl border border-amber-300">
            <h2 className="text-3xl font-display font-bold text-amber-900 mb-6">Get Involved</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">{currentPage.content.callToAction}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onBack}
                className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-colors duration-300 transform hover:scale-105"
              >
                Learn About Other Commitments
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-amber-600 hover:bg-amber-600 hover:text-white text-amber-600 font-semibold rounded-full transition-all duration-300 transform hover:scale-105">
                Contact Us to Get Started
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LearnMorePages
