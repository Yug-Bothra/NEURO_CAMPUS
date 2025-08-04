import React, { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Award, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  BookOpen, 
  Building, 
  Trophy,
  Star,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Calendar,
  TrendingUp,
  CheckCircle,
  Sparkles
} from "lucide-react";

const AboutUniversity = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const stats = [
    { icon: GraduationCap, number: "1,780+", label: "Programs Offered", color: "bg-blue-500" },
    { icon: Users, number: "15,000+", label: "Students", color: "bg-green-500" },
    { icon: Award, number: "Grade A", label: "NAAC Rating", color: "bg-purple-500" },
    { icon: Trophy, number: "90%", label: "Placement Rate", color: "bg-orange-500" }
  ];

  const highlights = [
    { icon: CheckCircle, text: "UGC Recognized University" },
    { icon: CheckCircle, text: "AICTE, COA, PCI Approved" },
    { icon: CheckCircle, text: "NBA Accredited Programs" },
    { icon: CheckCircle, text: "Research Centers of Excellence" }
  ];

  const sections = [
    {
      id: "overview",
      title: "Overview & History",
      icon: BookOpen,
      gradient: "from-blue-600 to-purple-600"
    },
    {
      id: "programs",
      title: "Institutes & Programs",
      icon: GraduationCap,
      gradient: "from-green-600 to-teal-600"
    },
    {
      id: "admissions",
      title: "Admissions & Fees",
      icon: Users,
      gradient: "from-orange-600 to-red-600"
    },
    {
      id: "research",
      title: "Research & Innovation",
      icon: Sparkles,
      gradient: "from-purple-600 to-pink-600"
    },
    {
      id: "infrastructure",
      title: "Infrastructure",
      icon: Building,
      gradient: "from-teal-600 to-cyan-600"
    },
    {
      id: "placements",
      title: "Placements",
      icon: TrendingUp,
      gradient: "from-indigo-600 to-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section with Parallax */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        <img
          src="https://www.svvv.edu.in/images/slider/slider-4.jpg"
          alt="SVVV Campus"
          className="w-full h-[70vh] object-cover"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/1920x800/1e40af/ffffff?text=SVVV+Campus";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="max-w-4xl px-6 animate-fade-in-up">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Shri Vaishnav Vidyapeeth Vishwavidyalaya
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Excellence in Education Since 1995 • NAAC Grade A • UGC Recognized
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <highlight.icon className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium">{highlight.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative -mt-20 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              >
                <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Interactive Sections */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 space-y-6">
            {sections.map((section, index) => (
              <div 
                key={section.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full p-6 text-left flex items-center justify-between bg-gradient-to-r ${section.gradient} text-white hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-center gap-4">
                    <section.icon className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                  </div>
                  {activeSection === section.id ? 
                    <ChevronDown className="w-6 h-6" /> : 
                    <ChevronRight className="w-6 h-6" />
                  }
                </button>
                
                {activeSection === section.id && (
                  <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                    {section.id === "overview" && (
                      <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                          SVVV is a <strong className="text-blue-600">private multidisciplinary university</strong> in Indore,
                          established in <strong className="text-blue-600">2015</strong>. It evolved from the Shri Vaishnav Institute
                          of Technology and Science (SVITS), founded in 1995. It's managed by the
                          <strong className="text-blue-600"> Shri Vaishnav Trust</strong>, which traces back to 1884, making it one of the
                          oldest educational institutions in the region.
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                          <p className="text-blue-800">
                            SVVV is <strong>UGC-recognized</strong> with accreditations from <strong>AICTE, COA, PCI</strong>,
                            and is graded <strong>'A' by NAAC</strong>. Many programs also carry <strong>NBA accreditation</strong>.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {section.id === "programs" && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          "Engineering (SVITS), Textile Tech, Forensic Science",
                          "Architecture, Planning, Design, Fine Arts",
                          "Management, Commerce, Law",
                          "Pharmacy, Home Science, Agriculture, Paramedical",
                          "Mass Communication, Education, Social Sciences",
                          "Research centers: Plasma, Gaming & Simulation, Sustainable Development"
                        ].map((program, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{program}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {section.id === "admissions" && (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl">
                          <h3 className="text-xl font-bold text-orange-800 mb-3">Programs & Entrance Exams</h3>
                          <p className="text-gray-700 mb-4">
                            SVVV offers <strong className="text-orange-600">1,780+ programs</strong> at UG, PG, diploma, and doctoral levels:
                          </p>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">Programs:</h4>
                              <p className="text-sm text-gray-600">B.Tech, M.Tech, B.Arch, BBA/MBA, M.Sc., BCA/MCA, M.Des, LL.M., Ph.D.</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">Entrance Exams:</h4>
                              <p className="text-sm text-gray-600">JEE, GATE, SVET, NATA, CAT/MAT/XAT</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-green-800">
                            <strong>Fee Structure:</strong> B.Tech: ₹85,000 - ₹1.6L | MBA: ₹1.1L (1st year)
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {section.id === "research" && (
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          Research areas include <strong className="text-purple-600">plasma physics, polymer/green chemistry, forensic
                          science</strong>, and sustainability. SVVV runs annual events like <strong className="text-purple-600">SHODH-2025</strong> for
                          doctoral research.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                          {[
                            "Centre of Excellence in Simulation & Gaming (COESAG)",
                            "Centers in Happiness Studies",
                            "Plasma Research Center", 
                            "Sustainable Development Center"
                          ].map((center, idx) => (
                            <div key={idx} className="bg-purple-50 p-4 rounded-lg text-center">
                              <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                              <p className="text-sm font-medium text-purple-800">{center}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {section.id === "infrastructure" && (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h3 className="font-bold text-teal-800 text-lg">Academic Facilities</h3>
                          {[
                            "Library: 48,000+ books, 11,000+ journals",
                            "Smart classrooms with modern tech",
                            "AC labs and seminar halls",
                            "Language and computer labs"
                          ].map((facility, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <Building className="w-5 h-5 text-teal-600" />
                              <span className="text-gray-700">{facility}</span>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-3">
                          <h3 className="font-bold text-teal-800 text-lg">Campus Life</h3>
                          {[
                            "Modern hostels with amenities",
                            "Multi-cuisine cafeteria",
                            "Gymnasium and sports ground",
                            "Transportation facilities"
                          ].map((facility, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <Users className="w-5 h-5 text-teal-600" />
                              <span className="text-gray-700">{facility}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {section.id === "placements" && (
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl">
                          <h3 className="text-xl font-bold text-indigo-800 mb-4">Placement Highlights</h3>
                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-indigo-600">₹4-6L</div>
                              <div className="text-sm text-gray-600">Average Package</div>
                            </div>
                            <div className="text-center">
                              <div className="text-3xl font-bold text-green-600">₹47L</div>
                              <div className="text-sm text-gray-600">Highest Package</div>
                            </div>
                            <div className="text-center">
                              <div className="text-3xl font-bold text-purple-600">90%</div>
                              <div className="text-sm text-gray-600">Placement Rate</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Top Recruiters:</h4>
                          <div className="flex flex-wrap gap-2">
                            {["TCS", "Infosys", "Wipro", "Capgemini", "Cognizant", "Accenture", "Tech Mahindra"].map((company, idx) => (
                              <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {company}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                Quick Facts
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Established", value: "2015" },
                  { label: "University Type", value: "Private" },
                  { label: "NAAC Grade", value: "A" },
                  { label: "Students", value: "15,000+" },
                  { label: "Faculty", value: "800+" }
                ].map((fact, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600">{fact.label}</span>
                    <span className="font-semibold text-gray-800">{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rankings */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-orange-600" />
                Rankings & Recognition
              </h3>
              <div className="space-y-3">
                {[
                  { rank: "Grade A", by: "NAAC" },
                  { rank: "#46", by: "Outlook (Private Universities)" },
                  { rank: "#90", by: "The Week" },
                  { rank: "#166", by: "IIRF MBA Rankings" }
                ].map((ranking, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/70 p-3 rounded-lg">
                    <span className="font-bold text-orange-800">{ranking.rank}</span>
                    <span className="text-sm text-gray-600">{ranking.by}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Life */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-purple-800 mb-4">🎭 Student Life</h3>
              <div className="space-y-3">
                <div className="bg-white/70 p-3 rounded-lg">
                  <h4 className="font-semibold text-purple-700">Annual Fest</h4>
                  <p className="text-sm text-gray-600">Spandan - Cultural Extravaganza</p>
                </div>
                <div className="bg-white/70 p-3 rounded-lg">
                  <h4 className="font-semibold text-purple-700">Active Clubs</h4>
                  <p className="text-sm text-gray-600">Dance, Media, Music, Tech, Innovation, Gaming</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl shadow-2xl p-8 text-white">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <MapPin className="w-8 h-8 text-blue-400" />
                Get in Touch
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-blue-100">Ujjain Road, Indore – 453111, Madhya Pradesh, India</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-blue-100">+91-731-4231000</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-red-400" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-blue-100">info@svvv.edu.in</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 pt-4">
                  <a 
                    href="https://www.svvv.edu.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    Official Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  
                  <a 
                    href="https://admissions.svvv.edu.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <GraduationCap className="w-5 h-5" />
                    Admissions Portal
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                title="SVVV Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.402062871964!2d75.79411457516377!3d22.59857613184657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd177b600ffb%3A0x3f2ae89972c55d7d!2sShri%20Vaishnav%20Vidyapeeth%20Vishwavidyalaya!5e0!3m2!1sen!2sin!4v1691056625792!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="filter contrast-125 saturate-110"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">
            <Calendar className="w-4 h-4 inline mr-2" />
            Last Updated: {new Date().toLocaleDateString()} | 
            Sources: Official SVVV Website, SHODH Portal, COESAG, Education Portals
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AboutUniversity;