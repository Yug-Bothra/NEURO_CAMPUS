// src/components1/StudentProfile.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

const StudentProfile = ({ enrollmentNumber }) => {
  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState({
    attendance: "N/A",
    gpa: "N/A",
    feesStatus: "Unpaid",
    borrowedBooks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Enhanced notices data with more variety
const [notices] = useState([
  {
    id: 1,
    title: "Mid-Term Examination Schedule",
    date: "2025-08-25",
    priority: "high",
    category: "Academic",
    content: "Mid-term examinations will commence from September 15th, 2025. Please check your respective department notice boards for detailed schedules.",
    icon: "📝"
  },
  {
    id: 2,
    title: "Library Hours Extended",
    date: "2025-08-24",
    priority: "medium",
    category: "Facility",
    content: "Library hours have been extended till 11 PM on weekdays to support exam preparation.",
    icon: "📚"
  },
  {
    id: 3,
    title: "Campus Fest Registration Open",
    date: "2025-08-23",
    priority: "low",
    category: "Event",
    content: "Annual campus fest 'TechFiesta 2025' registration is now open. Visit the student portal to register.",
    icon: "🎉"
  },
  {
    id: 4,
    title: "Fee Payment Deadline",
    date: "2025-08-22",
    priority: "high",
    category: "Financial",
    content: "Semester fee payment deadline is September 5th, 2025. Late fees will be applicable after the deadline.",
    icon: "💳"
  },
  {
    id: 5,
    title: "Sports Day Event",
    date: "2025-08-21",
    priority: "medium",
    category: "Sports",
    content: "Annual sports day will be held on October 20th, 2025. Register for your favorite sports events.",
    icon: "🏆"
  },
  {
    id: 6,
    title: "Workshop on AI & ML",
    date: "2025-08-20",
    priority: "low",
    category: "Workshop",
    content: "Free workshop on Artificial Intelligence and Machine Learning this Saturday. Limited seats available.",
    icon: "🤖"
  },
]);


 // src/components/... (within your component, above return block)
// Enhanced holidays data — India 2025 (national + major festivals + key regional)
// Note: Islamic dates may shift by local moon sighting (±1 day).
// Enhanced holidays data — India 2025 (national + major festivals + key regional)
const [holidays] = useState([
  // ——— January 2025 ———
  { date: "2025-01-01", name: "New Year's Day", type: "observance" },
  { date: "2025-01-06", name: "Guru Gobind Singh Jayanti", type: "festival" },
  { date: "2025-01-13", name: "Lohri", type: "regional" },
  { date: "2025-01-14", name: "Makar Sankranti", type: "festival" },
  { date: "2025-01-15", name: "Pongal", type: "regional" },
  { date: "2025-01-16", name: "Mattu Pongal", type: "regional" },
  { date: "2025-01-17", name: "Kaanum Pongal", type: "regional" },
  { date: "2025-01-26", name: "Republic Day", type: "national" },

  // ——— February 2025 ———
  { date: "2025-02-02", name: "Vasant Panchami", type: "festival" },
  { date: "2025-02-26", name: "Maha Shivratri", type: "festival" },

  // ——— March 2025 ———
  { date: "2025-03-13", name: "Holika Dahan (Chhoti Holi)", type: "festival" },
  { date: "2025-03-14", name: "Holi (Dhulandi)", type: "festival" },
  { date: "2025-03-23", name: "Shaheed Diwas (Bhagat Singh, Rajguru, Sukhdev)", type: "observance" },
  { date: "2025-03-30", name: "Ugadi (Telugu/Kannada New Year)", type: "regional" },
  { date: "2025-03-30", name: "Gudi Padwa (Marathi New Year)", type: "regional" },
  { date: "2025-03-31", name: "Eid al-Fitr (Ramzan Eid)*", type: "festival" },

  // ——— April 2025 ———
  { date: "2025-04-06", name: "Ram Navami (Chaitra Navratri ends)", type: "festival" },
  { date: "2025-04-10", name: "Mahavir Jayanti", type: "festival" },
  { date: "2025-04-12", name: "Hanuman Jayanti (North India)", type: "festival" },
  { date: "2025-04-13", name: "Baisakhi / Vishu (Kerala New Year)", type: "festival" },
  { date: "2025-04-14", name: "Tamil Puthandu / Bengali Nobo Borsho / Bohag Bihu", type: "regional" },
  { date: "2025-04-18", name: "Good Friday", type: "festival" },
  { date: "2025-04-20", name: "Easter", type: "festival" },

  // ——— May 2025 ———
  { date: "2025-05-12", name: "Buddha Purnima", type: "festival" },

  // ——— June 2025 ———
  { date: "2025-06-07", name: "Eid al-Adha (Bakrid)*", type: "festival" },
  { date: "2025-06-21", name: "Rath Yatra (Jagannath Puri)", type: "festival" },

  // ——— July 2025 ———
  { date: "2025-07-05", name: "Muharram (Ashura)*", type: "festival" },
  { date: "2025-07-23", name: "Sawan Shivratri", type: "festival" },
  { date: "2025-07-29", name: "Haryali Teej", type: "festival" },

  // ——— August 2025 ———
  { date: "2025-08-09", name: "Raksha Bandhan", type: "festival" },
  { date: "2025-08-12", name: "Nag Panchami", type: "festival" },
  { date: "2025-08-15", name: "Independence Day", type: "national" },
  { date: "2025-08-16", name: "Krishna Janmashtami (Smarta)", type: "festival" },
  { date: "2025-08-17", name: "Janmashtami (ISKCON) / Atham (Onam begins)", type: "festival" },
  { date: "2025-08-27", name: "Thiruvonam (Onam)", type: "regional" },
  { date: "2025-08-27", name: "Ganesh Chaturthi", type: "festival" },

  // ——— September 2025 ———
  { date: "2025-09-05", name: "Milad un-Nabi (Id-e-Milad)*", type: "festival" },
  { date: "2025-09-22", name: "Sharad Navratri begins", type: "festival" },

  // ——— October 2025 ———
  { date: "2025-10-02", name: "Maha Navami & Dussehra (Vijayadashami) / Gandhi Jayanti", type: "national" },
  { date: "2025-10-18", name: "Dhanteras", type: "festival" },
  { date: "2025-10-20", name: "Naraka Chaturdashi (Choti Diwali)", type: "festival" },
  { date: "2025-10-21", name: "Diwali (Lakshmi Puja / Deepavali)", type: "festival" },
  { date: "2025-10-22", name: "Govardhan Puja / Annakut", type: "festival" },
  { date: "2025-10-23", name: "Bhai Dooj", type: "festival" },
  { date: "2025-10-31", name: "Chhath Puja (Nahay Khay)", type: "regional" },

  // ——— November 2025 ———
  { date: "2025-11-01", name: "Chhath Puja (Kharna)", type: "regional" },
  { date: "2025-11-02", name: "Chhath Puja (Sanjh Arghya)", type: "regional" },
  { date: "2025-11-03", name: "Chhath Puja (Usha Arghya)", type: "regional" },
  { date: "2025-11-05", name: "Kartik Purnima / Dev Deepawali (Varanasi)", type: "festival" },
  { date: "2025-11-24", name: "Guru Nanak Jayanti (Gurpurab)", type: "festival" },

  // ——— December 2025 ———
  { date: "2025-12-03", name: "Hanuman Jayanti (Kannada tradition)", type: "regional" },
  { date: "2025-12-19", name: "Hanumath Jayanti (Tamil tradition)", type: "regional" },
  { date: "2025-12-25", name: "Christmas", type: "festival" },

  // ——— 2026 Holidays ———
  // January
  { date: "2026-01-01", name: "New Year's Day", type: "observance" },
  { date: "2026-01-03", name: "Hazarat Ali's Birthday", type: "observance" }, // Timeanddate
  { date: "2026-01-14", name: "Makar Sankranti / Pongal", type: "festival" },
  { date: "2026-01-23", name: "Vasant Panchami", type: "festival" },
  { date: "2026-01-26", name: "Republic Day", type: "national" },

  // February to April
  { date: "2026-02-15", name: "Maha Shivratri", type: "festival" }, // Leavetrack
  { date: "2026-03-03", name: "Holika Dahan", type: "festival" },  // AstroSage
  { date: "2026-03-04", name: "Holi", type: "festival" },
  { date: "2026-03-19", name: "Ugadi / Gudi Padwa / Chaitra Navratri begins", type: "festival" },
  { date: "2026-03-20", name: "Cheti Chand", type: "regional" },
  { date: "2026-03-26", name: "Ram Navami", type: "festival" },
  { date: "2026-03-31", name: "Mahavir Jayanti", type: "festival" }, // Calendarific
  { date: "2026-04-03", name: "Good Friday", type: "festival" },     // Leavetrack
  { date: "2026-04-14", name: "Baisakhi / Ambedkar Jayanti", type: "festival" }, // AstroSage
  { date: "2026-04-19", name: "Akshaya Tritiya", type: "observance" },

  // June to August
  { date: "2026-05-01", name: "Buddha Purnima", type: "festival" },   // CalendarLabs
  { date: "2026-05-27", name: "Eid al-Adha (Bakrid)*", type: "festival" }, // India Post
  { date: "2026-06-26", name: "Muharram (Ashura)*", type: "festival" },  // India Post
  { date: "2026-07-16", name: "Jagannath Rath Yatra", type: "festival" }, // AstroSage
  { date: "2026-07-25", name: "Ashadhi Ekadashi", type: "festival" },
  { date: "2026-07-29", name: "Guru Purnima", type: "festival" },
  { date: "2026-08-15", name: "Independence Day", type: "national" },
  { date: "2026-08-17", name: "Nag Panchami", type: "festival" },
  { date: "2026-08-26", name: "Onam / Thiruvonam", type: "regional" },
  { date: "2026-08-28", name: "Raksha Bandhan", type: "festival" },

  // September to October
  { date: "2026-09-04", name: "Krishna Janmashtami", type: "festival" }, // Leavetrack
  { date: "2026-09-14", name: "Ganesh Chaturthi", type: "festival" },
  { date: "2026-10-02", name: "Gandhi Jayanti / Dussehra", type: "national" }, // Leavetrack
  { date: "2026-10-11", name: "Sharad Navratri begins", type: "festival" },
  { date: "2026-10-17", name: "Durga Saptami begins", type: "festival" },
  { date: "2026-10-19", name: "Durga Puja Ashtami", type: "festival" },
  { date: "2026-10-20", name: "Dussehra / Vijayadashami", type: "festival" },
  { date: "2026-10-29", name: "Karva Chauth", type: "observance" },

  // November to December
  { date: "2026-11-06", name: "Dhanteras", type: "festival" },   // AstroSage
  { date: "2026-11-08", name: "Diwali (Deepavali)", type: "festival" },  // CalendarDate / AstroSage
  { date: "2026-11-10", name: "Govardhan Puja", type: "festival" },
  { date: "2026-11-11", name: "Bhai Dooj", type: "festival" },
  { date: "2026-11-14", name: "Children's Day", type: "observance" },
  { date: "2026-11-15", name: "Chhath Puja", type: "regional" },
  { date: "2026-11-24", name: "Guru Nanak Jayanti", type: "festival" },
  { date: "2026-12-25", name: "Christmas", type: "festival" }
]);



  // Auto-slide notices every 5 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentNoticeIndex((prevIndex) => 
        prevIndex === notices.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [notices.length]);

  // Fetch student details
  const fetchStudent = async () => {
    setLoading(true);

    try {
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("enrollment_number", enrollmentNumber)
        .single();

      if (studentError) throw studentError;
      setStudent(studentData);

      const { data: attendanceData } = await supabase
        .from("attendance")
        .select("percentage")
        .eq("enrollment_number", enrollmentNumber)
        .single();

      const { data: gpaData } = await supabase
        .from("evaluations")
        .select("gpa")
        .eq("enrollment_number", enrollmentNumber)
        .single();

      const { count: borrowedBooks } = await supabase
        .from("library_records")
        .select("*", { count: "exact", head: true })
        .eq("enrollment_number", enrollmentNumber);

      setStats({
        attendance: attendanceData?.percentage || "N/A",
        gpa: gpaData?.gpa || "N/A",
        feesStatus:
          studentData.fees && studentData.fees > 0
            ? `₹${studentData.fees} / Paid`
            : "Unpaid",
        borrowedBooks: borrowedBooks || 0,
      });
    } catch (error) {
      console.error("Error loading profile:", error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (enrollmentNumber) fetchStudent();
  }, [enrollmentNumber]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-gradient-to-r from-red-50 to-red-100';
      case 'medium': return 'border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100';
      case 'low': return 'border-l-green-500 bg-gradient-to-r from-green-50 to-green-100';
      default: return 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-100';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Academic': 'bg-blue-100 text-blue-800',
      'Facility': 'bg-green-100 text-green-800',
      'Event': 'bg-purple-100 text-purple-800',
      'Financial': 'bg-red-100 text-red-800',
      'Sports': 'bg-orange-100 text-orange-800',
      'Workshop': 'bg-indigo-100 text-indigo-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

    // Calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Mark official holidays + weekends
  const isHoliday = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const holiday = holidays.find(holiday => holiday.date === dateStr);

    if (holiday) return holiday;

    // Check if Saturday or Sunday
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (checkDate.getDay() === 0) {
      return { date: dateStr, name: "Sunday", type: "weekend" };
    }
    if (checkDate.getDay() === 6) {
      return { date: dateStr, name: "Saturday", type: "weekend" };
    }

    return null;
  };

  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === currentDate.getMonth() && 
           today.getFullYear() === currentDate.getFullYear();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Get upcoming holidays for the next 30 days (only official holidays)
  const getUpcomingHolidays = () => {
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);
    
    return holidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate >= today && holidayDate <= next30Days;
    }).slice(0, 3);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
        <p className="text-lg text-gray-600 font-medium">Loading Profile...</p>
      </div>
    </div>
  );
  
  if (!student) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="text-6xl mb-4">😔</div>
        <p className="text-xl text-gray-600 font-medium">No profile found</p>
        <p className="text-base text-gray-500 mt-2">Enrollment: {enrollmentNumber}</p>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
         {/* Left Side - Profile & Dashboard */}
{/* Left Side - Profile & Dashboard */}
<div className="xl:col-span-7 flex flex-col space-y-6 h-full">

  {/* Profile Header */}
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-6 relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-10"></div>
      
      <div className="relative flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={`https://ui-avatars.com/api/?name=${student.name}&background=ffffff&color=3B82F6&size=120`}
            alt="Profile"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl border-4 border-white shadow-lg object-cover"
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        </div>

        {/* Student Info */}
        <div className="flex-1 text-white text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{student.name}</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-blue-200 text-xs font-medium">Enrollment Number</p>
              <p className="text-base sm:text-lg font-semibold">{student.enrollment_number}</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs font-medium">Branch</p>
              <p className="text-base sm:text-lg font-semibold">{student.branch}</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs font-medium">Semester</p>
              <p className="text-base sm:text-lg font-semibold">Semester {student.semester}</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs font-medium">Section</p>
              <p className="text-base sm:text-lg font-semibold">Section {student.section}</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
              Active Student
            </span>
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
              Academic Year 2024-25
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Performance Stats */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {[
      { title: "Attendance", value: stats.attendance !== "N/A" ? `${stats.attendance}%` : "N/A", icon: "📊", bgGradient: "from-blue-500 to-blue-600", trend: stats.attendance > 75 ? "+5%" : "-2%", trendColor: stats.attendance > 75 ? "text-green-600" : "text-red-500" },
      { title: "GPA", value: stats.gpa, icon: "🎯", bgGradient: "from-green-500 to-green-600", trend: "+0.2", trendColor: "text-green-600" },
      { title: "Fees", value: stats.feesStatus.includes("Paid") ? "Paid" : "Pending", icon: "💰", bgGradient: stats.feesStatus.includes("Paid") ? "from-green-500 to-green-600" : "from-red-500 to-red-600", trend: stats.feesStatus.includes("Paid") ? "✓" : "!", trendColor: stats.feesStatus.includes("Paid") ? "text-green-600" : "text-yellow-500" },
      { title: "Library", value: `${stats.borrowedBooks}`, icon: "📖", bgGradient: "from-purple-500 to-purple-600", trend: "→", trendColor: "text-gray-500" },
    ].map((stat, index) => (
      <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden border border-gray-100 transition-all duration-300">
        <div className={`bg-gradient-to-r ${stat.bgGradient} p-3`}>
          <div className="flex items-center justify-between">
            <span className="text-xl">{stat.icon}</span>
            <span className="text-xs font-bold px-2 py-1 bg-white bg-opacity-30 rounded-full text-white">{stat.trend}</span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-xs font-semibold text-gray-600 mb-1">{stat.title}</h3>
          <p className="text-lg font-bold text-gray-800">{stat.value}</p>
        </div>
      </div>
    ))}
  </div>

  {/* Quick Access */}
  <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
    <div className="mb-4">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Quick Access</h3>
      <p className="text-gray-600 text-sm">Access your academic tools and services</p>
    </div>
    
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
      {[
        { to: "attendance", bg: "blue", icon: "📅", title: "Attendance", desc: "Track presence" },
        { to: "canteen", bg: "yellow", icon: "🍔", title: "E-Canteen", desc: "Order meals" },
        { to: "library", bg: "green", icon: "📚", title: "E-Library", desc: "Digital resources" },
        { to: "resume", bg: "purple", icon: "📄", title: "Resume", desc: "Create resume" },
        { to: "accounts", bg: "indigo", icon: "💳", title: "Accounts", desc: "Payments" },
      ].map((feature, index) => (
        <Link
          key={index}
          to={`/student/panel/${enrollmentNumber}/${feature.to}`}
          className="group bg-gray-50 hover:bg-white rounded-xl p-3 sm:p-4 text-center transition-all duration-300 hover:shadow-md border border-gray-100 hover:border-gray-200"
        >
          <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${feature.bg}-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform duration-300`}>
            <span className="text-lg sm:text-xl">{feature.icon}</span>
          </div>
          <h4 className="font-bold text-gray-800 mb-1 text-xs sm:text-sm">{feature.title}</h4>
          <p className="text-xs text-gray-600 hidden sm:block">{feature.desc}</p>
        </Link>
      ))}
    </div>
  </div>
  {/* Recent Activity Section */}
<div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
  <div className="flex items-center space-x-2 mb-4">
    <span className="text-lg">🕐</span>
    <h3 className="font-bold text-gray-800">Recent Activity</h3>
  </div>
  <div className="space-y-3">
    {[
      { icon: "📚", text: "New book added to library" },
      { icon: "✅", text: "Attendance marked for today" },
      { icon: "💳", text: "Fee payment processed" },
      { icon: "📅", text: "New class session scheduled" }
    ].map((item, idx) => (
      <div key={idx} className="flex items-center space-x-2 text-gray-600">
        <span>{item.icon}</span>
        <p className="text-sm">{item.text}</p>
      </div>
    ))}
  </div>
</div>



</div>




        {/* Right Side - Notice Board & Calendar */}
<div className="xl:col-span-5 flex flex-col space-y-6 h-full">
  
  {/* Enhanced Notice Board */}
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <span className="text-lg">📢</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Notice Board</h3>
            <p className="text-blue-200 text-xs">{notices.length} active notices</p>
          </div>
        </div>
        <div className="flex space-x-1">
          {notices.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentNoticeIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentNoticeIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
    
    <div className="h-64 sm:h-72 overflow-hidden">
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentNoticeIndex * 100}%)` }}
      >
        {notices.map((notice) => (
          <div key={notice.id} className="w-full flex-shrink-0 h-full p-4">
            <div className={`${getPriorityColor(notice.priority)} border-l-4 p-4 rounded-r-xl h-full flex flex-col`}>
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{notice.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800 text-sm leading-tight">
                      {notice.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(notice.category)} ml-2 flex-shrink-0`}>
                      {notice.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {formatDate(notice.date)}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-3">
                {notice.content}
              </p>
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  notice.priority === 'high' ? 'bg-red-100 text-red-800 border border-red-200' :
                  notice.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                  'bg-green-100 text-green-800 border border-green-200'
                }`}>
                  {notice.priority.toUpperCase()}
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline">
                  Read More →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    <div className="p-3 bg-gray-50 border-t border-gray-100">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => setCurrentNoticeIndex(currentNoticeIndex > 0 ? currentNoticeIndex - 1 : notices.length - 1)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 text-sm"
        >
          <span>←</span>
          <span className="hidden sm:inline">Previous</span>
        </button>
        <button className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm">
          View All
        </button>
        <button 
          onClick={() => setCurrentNoticeIndex(currentNoticeIndex < notices.length - 1 ? currentNoticeIndex + 1 : 0)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 text-sm"
        >
          <span className="hidden sm:inline">Next</span>
          <span>→</span>
        </button>
      </div>
    </div>
  </div>

  {/* Enhanced Academic Calendar */}
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <span className="text-lg">🗓️</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Academic Calendar</h3>
            <p className="text-blue-200 text-xs">Track important dates</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={goToPreviousMonth}
            className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors flex items-center justify-center text-white"
          >
            ←
          </button>
          <button 
            onClick={goToNextMonth}
            className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors flex items-center justify-center text-white"
          >
            →
          </button>
        </div>
      </div>
      <div className="text-center">
        <h4 className="text-base font-bold text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
      </div>
    </div>
    
    <div className="p-4">
      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-bold text-gray-600 py-2 bg-gray-50 rounded-lg">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: getFirstDayOfMonth(currentDate) }, (_, index) => (
          <div key={`empty-${index}`} className="h-8"></div>
        ))}
        
        {/* Days of the month */}
        {Array.from({ length: getDaysInMonth(currentDate) }, (_, index) => {
          const day = index + 1;
          const holiday = isHoliday(day);
          const today = isToday(day);
          
          return (
            <div
              key={day}
              className={`h-8 flex items-center justify-center text-xs relative cursor-pointer rounded-lg transition-all duration-200 font-medium ${
                today
                  ? 'bg-blue-600 text-white font-bold shadow-lg scale-105'
                  : holiday
                  ? 'bg-red-100 text-red-800 font-semibold hover:bg-red-200 border border-red-200'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              title={holiday ? holiday.name : ''}
            >
              {day}
              {holiday && (
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Calendar Legend */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span className="text-gray-700 font-medium">Today</span>
        </div>
        <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg border border-red-200">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-700 font-medium">Holiday</span>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</div>
</div>
);
};

export default StudentProfile;
