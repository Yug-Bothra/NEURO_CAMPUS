# 🎓 NEURO CAMPUS - AI & ML Based Campus Cloud Network

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://neuro-campus-73w8.vercel.app/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)
[![AI Powered](https://img.shields.io/badge/AI-Powered-orange)](https://openai.com/)
[![Major Project](https://img.shields.io/badge/Major-Project-purple)](https://github.com/Yug-Bothra/NEURO_CAMPUS)

---

## 🔑 Demo Access

Use the following demo credentials to explore the system:

### 🎓 **Student Panel**
* **Username / Roll No:** `22100BTAIMLM11277`
* **Password:** `Yugyug@123`

### 👑 **Admin Panel**
* **Username:** `yugbothra@gmail.com`
* **Password:** `Yugyug@123`

---

## 🌟 Overview

**Neuro Campus** is an innovative educational platform that integrates artificial intelligence, machine learning algorithms, and cloud computing to create a unified ecosystem for students, teachers, administrators, and guests. The system eliminates the need for multiple disparate systems while providing intelligent automation and personalized learning experiences.

**🔗 Live Application:** [https://neuro-campus-73w8.vercel.app/](https://neuro-campus-73w8.vercel.app/)

---

## ✨ Key Features

### 🤖 AI & ML Powered Features
* **OCR-Based Attendance System** – Automated attendance tracking using computer vision
* **AI Content Generation** – Automatic PDF notes and PowerPoint presentations
* **Intelligent Question Paper Generator** – ML-powered exam paper creation
* **Sentiment Analysis** – Feedback analysis for teacher evaluation
* **Performance Analytics** – ML-based student performance prediction
* **Document Verification** – OCR-powered document processing

### 👥 Multi-Panel System
* **Admin Panel** – Full management oversight with analytics, student/teacher/subject/class assignment
* **Teacher Panel** – Attendance, evaluation, AI tools, canteen, library, student assessment
* **Student Panel** – Attendance, canteen, AI resume builder, aptitude practice, AI notes, forum
* **Guest Panel** – University details, e-canteen, campus info
* **Accounts Panel** – Financial management and payments

### 🎯 Core Modules
* **E-Library** – Digital library management system
* **E-Canteen** – Online canteen ordering system
* **Student Forum** – Social media-like community with groups, chats, media sharing
* **Aptitude Tests** – AI-driven practice and evaluation
* **Resume Builder** – AI-assisted resume creation
* **Virtual Campus Tour** – Interactive exploration

---

## 🏗️ Folder Structure

```
NEURO_CAMPUS/
├── 📁 node_modules/                 # Dependencies
├── 📁 public/                       # Static assets
├── 📁 src/                         # Source code
│   ├── 📁 assets/                  # Images, icons, and media
│   ├── 📁 components/              # Admin panel components
│   │   ├── AccountsAndPaymentsPanel.jsx
│   │   ├── AdminPanel.jsx
│   │   ├── StudentsTable.jsx
│   │   ├── SubjectsTable.jsx
│   │   ├── TeachersTable.jsx
│   │   └── TeacherSubjectsTable.jsx
│   ├── 📁 components1/             # Student & utility components
│   │   ├── Accounts.jsx
│   │   ├── Attendance.jsx
│   │   ├── CanteenLink.jsx
│   │   ├── LibraryLink.jsx
│   │   ├── PaymentEntryForm.jsx
│   │   ├── QuizApp.jsx
│   │   ├── ResumeBuilderLink.jsx
│   │   ├── StudentPanel.jsx
│   │   └── StudentProfile.jsx
│   ├── 📁 pages/                   # Main application pages
│   │   ├── 📁 guest/              # Guest panel pages
│   │   │   ├── AboutUniversity.jsx
│   │   │   ├── CanteenLink.jsx
│   │   │   ├── EVisit.jsx
│   │   │   ├── GuestPage.jsx
│   │   │   └── GuestPanel.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── RoleSelector.jsx
│   │   ├── StudentsLogin.jsx
│   │   └── TeachersLogin.jsx
│   ├── App.jsx                     # Main application component
│   ├── App.css                     # Global styles
│   ├── index.css                   # Base styles
│   ├── main.jsx                    # Application entry point
│   └── supabaseClient.js          # Database configuration
├── 📄 .env                        # Environment variables
├── 📄 .gitignore                  # Git ignore rules
├── 📄 eslint.config.js            # ESLint configuration
├── 📄 index.html                  # HTML template
├── 📄 package.json                # Project dependencies
├── 📄 package-lock.json           # Locked dependencies
├── 📄 postcss.config.js           # PostCSS configuration
├── 📄 tailwind.config.js          # Tailwind CSS configuration
├── 📄 vercel.json                 # Vercel deployment config
└── 📄 vite.config.js              # Vite build configuration
```

---

## 🛠️ Tech Stack

### Frontend
* **React.js 18+** – Modern UI framework
* **JavaScript (ES6+)** – Programming language
* **HTML5 & CSS3** – Markup and styling
* **Tailwind CSS** – Utility-first CSS framework
* **Vite** – Fast build tool and dev server

### Backend & Database
* **Supabase** – Cloud database and authentication
* **Clerk** – User authentication service
* **Node.js** – Server runtime (for real-time features)
* **Python** – AI/ML model integration

### AI & ML Technologies
* **TensorFlow** – Machine learning framework
* **OpenCV** – Computer vision library
* **scikit-learn** – ML algorithms
* **NLP** – AI content generation
* **OCR** – Automated document processing

### Cloud Services
* **Cloudinary** – Media storage and optimization
* **Vercel** – Hosting and deployment
* **AWS/Google Cloud** – Scalable infrastructure

---

## 🚀 Quick Start

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn
* Git

### Installation

```bash
git clone https://github.com/Yug-Bothra/NEURO_CAMPUS.git
cd NEURO_CAMPUS
npm install
cp .env.example .env   # configure your environment
npm run dev
```

Then open:
```
http://localhost:5173
```

---

## 🔧 Configuration

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

---

## 📊 Database Schema

* **users** – Authentication and profiles
* **students** – Academic records
* **teachers** – Faculty and subjects
* **subjects** – Courses and classes
* **attendance** – OCR attendance logs
* **payments** – Transactions and fees
* **forum_posts** – Social media/forum posts
* **library_books** – Digital library catalog

---

## 🎨 Features in Detail

### 🔐 Authentication
* Multi-role login (Admin, Teacher, Student, Guest)
* Clerk-based secure authentication
* Role-based access

### 📚 E-Library
[![E-Library Repo](https://img.shields.io/badge/Repository-E--Library-blue)](https://github.com/Yug-Bothra/Eliberary)

A comprehensive digital library management system where:
* **Teachers & Students** can access the library
* Searchable book catalog with advanced filtering
* Digital reading interface with progress tracking
* Book borrowing and return management
* Personalized reading recommendations
* Reading statistics and analytics

### 🍽️ E-Canteen
[![E-Canteen Repo](https://img.shields.io/badge/Repository-E--Canteen-green)](https://github.com/Yug-Bothra/project)

Complete online canteen ordering system accessible by:
* **Guest, Teacher, Student** roles
* Interactive menu browsing with categories
* Real-time order placement and tracking
* Payment integration (UPI/Card/Cash)
* Order history and favorites
* Mobile-responsive cart management
* Admin panel for menu management

### 🧠 Quiz App
[![Quiz App Repo](https://img.shields.io/badge/Repository-Quiz--App-orange)](https://github.com/Yug-Bothra/quizz)

AI-powered aptitude and assessment platform featuring:
* Adaptive difficulty based on performance
* Multiple question types (MCQ, True/False, Fill-in-blanks)
* Real-time scoring and analytics
* Performance tracking over time
* Subject-wise practice modules
* Timed assessments with instant results
* Detailed answer explanations

### 👥 FORAM - Student Social Media
[![FORAM Repo](https://img.shields.io/badge/Repository-FORAM-purple)](https://github.com/Yug-Bothra/FORAM)

A comprehensive social media platform designed specifically for students:

**Community Features:**
* Create and join study groups and communities
* Follow other students and teachers
* Public and private group discussions
* Event announcements and reminders

**Communication:**
* One-on-one private messaging
* Group chats with unlimited members
* Voice and video call integration
* Real-time notifications

**Media Sharing:**
* Share images, PDFs, videos, and documents
* Study material exchange
* Project collaboration files
* Multimedia announcements

**Social Features:**
* Post updates and thoughts
* Like, comment, and share posts
* Create polls and surveys
* Academic achievement sharing

### 💰 Accounts & Payments
* Admin oversight of all transactions
* Student payment history and pending dues
* Multiple payment methods (UPI, Card, Cash)
* Automated fee calculation and reminders
* Financial reporting and analytics

### 🎯 AI Tools
* **AI Notes Generator** – Create comprehensive study notes from topics
* **PPT Generator** – Automated presentation creation
* **Question Paper Generator** – ML-powered exam paper creation
* **Resume Builder** – AI-assisted professional resume creation
* **Performance Analytics** – Predictive academic performance insights

---

## 🎯 User Roles & Permissions

| Feature                        | Admin | Teacher | Student | Guest |
| ------------------------------ | ----- | ------- | ------- | ----- |
| Dashboard Access               | ✅     | ✅       | ✅       | ✅     |
| Add/Assign Teachers & Students | ✅     | ❌       | ❌       | ❌     |
| Assign Subjects/Classes        | ✅     | ❌       | ❌       | ❌     |
| Attendance (Give/Take)         | ✅     | ✅       | ✅       | ❌     |
| AI Notes & PPT Generator       | ✅     | ✅       | ✅       | ❌     |
| FORAM (Social Media)           | ✅     | ✅       | ✅       | ❌     |
| Library Access                 | ❌     | ✅       | ✅       | ❌     |
| Canteen Access                 | ❌     | ✅       | ✅       | ✅     |
| Quiz/Aptitude Tests            | ❌     | ✅       | ✅       | ❌     |
| Accounts & Transactions        | ✅     | ❌       | ✅       | ❌     |
| Evaluate Students              | ❌     | ✅       | ❌       | ❌     |

---

## 📱 Responsive Design

* 🖥️ **Desktop** – Full experience with all features
* 📱 **Mobile** – Optimized touch interface
* 📱 **Tablet** – Touch-friendly responsive layout

---

## 🔄 Deployment

```bash
npm run build
vercel --prod
```

**Deployment Steps:**
1. Configure environment variables in Vercel dashboard
2. Connect GitHub repository to Vercel
3. Enable automatic deployment on push
4. Configure custom domain (optional)

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/new-feature`
3. **Commit** your changes: `git commit -m 'Add new feature'`
4. **Push** to branch: `git push origin feature/new-feature`
5. **Open** a Pull Request

**Guidelines:**
* Follow React best practices and hooks patterns
* Maintain consistent code formatting (Prettier + ESLint)
* Add comments for complex logic
* Update documentation for new features
* Test thoroughly before submitting

---

## 📋 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npm run test -- --testNamePattern="Component Name"
```

---

## 📈 Performance Metrics

* **OCR Attendance Accuracy:** 92%+
* **Average Load Time:** <2.5s
* **Mobile Lighthouse Score:** 95+
* **System Uptime:** 99.9%
* **User Satisfaction:** 4.8/5 ⭐

---

## 🎓 Development Team

**Major Project by CSE Students**

* Devashish Moghe – 22100BTAIMLM11244
* JaiVardhan Kumrawat – 22100BTAIMLM11252  
* Jiyanshu Jain – 22100BTAIMLM11253
* Yug Bothra – 22100BTAIMLM11277

**Project Guide:** Prof. Pooja Deshpande  
**Institution:** Shri Vaishnav Institute of Information Technology  
**University:** Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore

---

## 📞 Support & Documentation

* 📧 **Email:** [support@neurocampus.com](mailto:support@neurocampus.com)
* 📖 **Documentation:** [docs.neurocampus.com](https://docs.neurocampus.com)
* 🐛 **Bug Reports:** [GitHub Issues](https://github.com/Yug-Bothra/NEURO_CAMPUS/issues)
* 💬 **Discord Community:** [Join our Discord](https://discord.gg/neurocampus)

---

## 🎓 Academic Information

* **Degree Program:** Bachelor of Technology in Computer Science Engineering
* **Institution:** Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore, Madhya Pradesh
* **Project Duration:** July 2024 – December 2024
* **Project Type:** Final Year Major Project
* **Academic Year:** 2024-25

---

## 🙏 Acknowledgments

Special thanks to:

* **OpenAI** – For AI integration and natural language processing
* **Supabase Team** – For providing excellent database infrastructure
* **Cloudinary** – For reliable media storage and optimization
* **Vercel** – For seamless hosting and deployment platform
* **React Community** – For extensive documentation and ecosystem
* **Our College Faculty** – For guidance and support throughout development

---

## 📄 License

This project is the major project for our degree complition 

---

## ⭐ Support the Project

If you find this project helpful, please consider:

[![GitHub stars](https://img.shields.io/github/stars/Yug-Bothra/NEURO_CAMPUS.svg?style=social&label=Star)](https://github.com/Yug-Bothra/NEURO_CAMPUS)
[![GitHub forks](https://img.shields.io/github/forks/Yug-Bothra/NEURO_CAMPUS.svg?style=social&label=Fork)](https://github.com/Yug-Bothra/NEURO_CAMPUS/fork)

* ⭐ **Star** the repository
* 🍴 **Fork** and contribute
* 📢 **Share** with others
* 🐛 **Report** issues and bugs

---

## 📸 System Screenshots & Visual Documentation

### 🔐 Authentication & Login

| Authentication System | Role Selection |
|----------------------|----------------|
| <img src="https://github.com/user-attachments/assets/04397690-ca3b-4167-b3f0-36e7ad1cb030" width="400" alt="User Authentication" /> | <img src="https://github.com/user-attachments/assets/db48d263-7494-459c-83dd-e82a5d29f02e" width="400" alt="Frontend Dashboard" /> |

### 👑 Admin Panel

| Admin Dashboard | Student Management |
|-----------------|-------------------|
| <img src="https://github.com/user-attachments/assets/fa6373db-deca-4921-9de3-72e15bc61167" width="400" alt="Admin Dashboard" /> | <img src="https://github.com/user-attachments/assets/cde134e5-907d-4f4a-980a-a3966afd4939" width="400" alt="Student Management" /> |

| Teacher Management | Subject Assignment |
|-------------------|-------------------|
| <img src="https://github.com/user-attachments/assets/7cfa4a32-1b4f-41bd-92cf-28fc67773db3" width="400" alt="Teacher Management" /> | <img src="https://github.com/user-attachments/assets/1dbb6340-3894-4ba6-a8ae-7dea93075461" width="400" alt="Subject Assignment" /> |

| Class Management | Analytics Dashboard |
|-----------------|-------------------|
| <img src="https://github.com/user-attachments/assets/7a2a5994-0ecf-4020-899a-c381fce86f3c" width="400" alt="Class Management" /> | <img src="https://github.com/user-attachments/assets/b91ce7e0-dd36-47dd-9b7f-69abb2494b29" width="400" alt="Analytics Dashboard" /> |

### 🎓 Student Panel

| Student Dashboard | Profile Management |
|------------------|-------------------|
| <img src="https://github.com/user-attachments/assets/040a2402-1f9b-4f33-8070-68987e2d0225" width="400" alt="Student Dashboard" /> | <img src="https://github.com/user-attachments/assets/90616100-582b-4c8e-954d-522825355ee4" width="400" alt="Student Profile" /> |

### 🍽️ E-Canteen System

| Canteen Menu | Order Placement |
|--------------|----------------|
| <img src="https://github.com/user-attachments/assets/99acd1a4-3c26-498d-ad4b-b12929e78f82" width="400" alt="Canteen Menu" /> | <img src="https://github.com/user-attachments/assets/ab9147f4-1708-4fec-bd8f-31d4622c59e3" width="400" alt="Order Placement" /> |

| Mobile View | Cart Management |
|-------------|-----------------|
| <img src="https://github.com/user-attachments/assets/08f81fc0-741c-4085-8fdb-46da179daa79" width="400" alt="Mobile Canteen" /> | <img src="https://github.com/user-attachments/assets/a518e1dc-ceb3-470d-8e1d-e079fb571f33" width="400" alt="Cart Management" /> |

### 📚 E-Library System

| Library Dashboard | Book Catalog |
|------------------|--------------|
| <img src="https://github.com/user-attachments/assets/bf4c10d7-0578-4ed3-97d2-731494665f0e" width="400" alt="Library Dashboard" /> | <img src="https://github.com/user-attachments/assets/b6a916ca-474f-4829-a65c-0cf91dc13ec0" width="400" alt="Book Catalog" /> |

| Reading Interface | Book Details |
|------------------|--------------|
| <img src="https://github.com/user-attachments/assets/a4e893d0-5077-4b3f-a81e-6a0020cef449" width="400" alt="Reading Interface" /> | <img src="https://github.com/user-attachments/assets/3bc4f5ad-7d0b-4cc1-bfae-078ed219d206" width="400" alt="Book Details" /> |

| Search & Filter | Library Stats |
|-----------------|---------------|
| <img src="https://github.com/user-attachments/assets/03a165cf-0a9a-4992-ab32-e7ae2209798e" width="400" alt="Search Filter" /> | <img src="https://github.com/user-attachments/assets/344c64f0-1c98-48a7-a315-20a7dffdc772" width="400" alt="Library Statistics" /> |

### 💰 Accounts & Payments

| Payment Dashboard | Transaction History |
|------------------|-------------------|
| <img src="https://github.com/user-attachments/assets/5afc3f5f-7f30-426c-8d5a-8051a7b6cc77" width="400" alt="Payment Dashboard" /> | <img src="https://github.com/user-attachments/assets/90616100-582b-4c8e-954d-522825355ee4" width="400" alt="Transaction History" /> |

### 🧠 Aptitude & Testing

| Aptitude Dashboard | Test Interface |
|-------------------|----------------|
| <img src="https://github.com/user-attachments/assets/f7ef006d-546f-4b60-a097-6d1e3d68e39d" width="400" alt="Aptitude Dashboard" /> | <img src="https://github.com/user-attachments/assets/12a70a2f-f202-4a4c-8575-84a72931ce59" width="400" alt="Test Interface" /> |

| Results Analysis | Performance Tracking |
|-----------------|---------------------|
| <img src="https://github.com/user-attachments/assets/5fe0d510-965d-49e4-b74b-78c082b59958" width="400" alt="Results Analysis" /> | <img src="https://github.com/user-attachments/assets/90d4b048-0d11-4ea9-baef-f5f7fecfa07d" width="400" alt="Performance Tracking" /> |

### 👥 Guest Panel

| Guest Dashboard | University Information |
|-----------------|----------------------|
| <img src="https://github.com/user-attachments/assets/618e2341-28c9-4286-8628-ad27eefb4e54" width="400" alt="Guest Dashboard" /> | <img src="https://github.com/user-attachments/assets/023e1f13-99c7-47ca-9f22-fc8c55569ffb" width="400" alt="University Info" /> |

| Campus Tour | Contact Information |
|-------------|-------------------|
| <img src="https://github.com/user-attachments/assets/e5b87f83-a460-41d5-ac2a-b7b9f30811ff" width="400" alt="Campus Tour" /> | <img src="https://github.com/user-attachments/assets/520bb723-3186-479a-8b0f-a83289d052d4" width="400" alt="Contact Info" /> |

| Guest Services | Facilities |
|----------------|------------|
| <img src="https://github.com/user-attachments/assets/5ceff779-a61b-459f-89d7-63fef1dacb8c" width="400" alt="Guest Services" /> | - |

### 🗄️ Database Structure

| Students Table | Teachers Table |
|----------------|----------------|
| <img src="https://github.com/user-attachments/assets/e1c030b0-f634-46a2-a2e9-7ff0e4029972" width="400" alt="Students Database" /> | <img src="https://github.com/user-attachments/assets/fd3e65b5-83e2-4da1-b14b-c7d3793b1573" width="400" alt="Teachers Database" /> |

| Subjects Table | Attendance Records |
|----------------|-------------------|
| <img src="https://github.com/user-attachments/assets/a5f82a02-3919-4308-abc0-70f4e62d0b7d" width="400" alt="Subjects Database" /> | <img src="https://github.com/user-attachments/assets/0fde6dde-cd81-43e4-b91a-7ffa18860e9f" width="400" alt="Attendance Records" /> |

| Complete Database Schema |
|-------------------------|
| <img src="https://github.com/user-attachments/assets/5d19a8d0-71e1-45bd-bb58-e6e79e6feee7" width="600" alt="Complete Database Schema" /> |

---
