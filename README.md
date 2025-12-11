# OPTIMUM - Adaptive Testing System

<div align="center">

![OPTIMUM Logo](public/optimum.png)

**A modern, AI-powered adaptive testing platform for educational institutions**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.0.0-orange.svg)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Firebase Setup](#-firebase-setup)
- [Environment Configuration](#-environment-configuration)
- [Running the Project](#-running-the-project)
- [Creating Admin Users](#-creating-admin-users)
- [Project Structure](#-project-structure)
- [Key Features Documentation](#-key-features-documentation)
- [EmailJS Configuration](#-emailjs-configuration)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**OPTIMUM** is a comprehensive Adaptive Testing System designed for educational institutions. It features intelligent difficulty adjustment, AI-powered question generation, real-time analytics, and a modern, responsive user interface.

The platform supports two user roles:
- **Students**: Take adaptive tests, track progress, view analytics
- **Administrators**: Create tests, manage questions, view student performance, generate AI questions

---

## ✨ Features

### For Students
- 🎓 **Adaptive Testing**: Questions adjust difficulty based on performance
- 📊 **Real-time Analytics**: Track progress, scores, and performance metrics
- 🏆 **Leaderboard**: Compete with peers
- 📈 **Performance Dashboard**: Visualize test history and improvements
- 🌓 **Dark Mode**: Comfortable testing experience
- 📱 **Responsive Design**: Works on all devices

### For Administrators
- 📝 **Test Creation**: Create tests with multiple question types
- 🤖 **AI Question Generation**: Upload PDF syllabi to auto-generate questions
- 📤 **Bulk Import**: Import questions via Excel/CSV
- 📊 **Analytics Dashboard**: View student performance and test statistics
- 👥 **User Management**: Monitor student progress
- ⚙️ **Adaptive Configuration**: Enable/disable adaptive mode per test
- 🎯 **Difficulty Assignment**: Assign difficulty levels to questions

### Core Features
- 🔐 **Secure Authentication**: Firebase Authentication
- 🔄 **Real-time Database**: Firebase Realtime Database
- 🎨 **Modern UI**: Clean, minimal design with smooth animations
- 📧 **Contact Form**: EmailJS integration for inquiries
- 🌐 **About/Contact Pages**: Comprehensive information pages
- 🔍 **Search & Filter**: Easy test and question management

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type-safe JavaScript
- **Vite 5.4.2** - Build tool and dev server
- **TailwindCSS 3.4.1** - Utility-first CSS framework
- **React Router DOM 7.7.1** - Client-side routing
- **Lucide React** - Icon library

### Backend & Services
- **Firebase 12.0.0**
  - Authentication
  - Realtime Database
  - Storage
- **EmailJS** - Contact form email service
- **OpenRouter AI** - AI question generation

### Additional Libraries
- **Chart.js** - Data visualization
- **React Toastify** - Notifications
- **XLSX** - Excel file processing
- **PDF.js** - PDF parsing
- **jsPDF** - PDF generation
- **html2canvas** - Screenshot generation

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **Firebase Account** (free tier works)
- **OpenRouter API Key** (for AI features - optional)
- **EmailJS Account** (for contact form - optional)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/optimum.git
cd optimum
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Then fill in your actual values (see [Environment Configuration](#-environment-configuration)).

---

## 🔥 Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "optimum-test")
4. Follow the setup wizard

### Step 2: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click "Get Started"
3. Enable **Email/Password** sign-in method

### Step 3: Create Realtime Database

1. Go to **Build** → **Realtime Database**
2. Click "Create Database"
3. Choose a location
4. Start in **Test Mode** (we'll add rules later)

### Step 4: Set Up Database Rules

Go to **Realtime Database** → **Rules** tab and paste the following:

```json
{
  "rules": {
    "tests": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'",
      "$testId": {
        "timesAttempted": {
          ".write": "auth != null"
        }
      }
    },
    "responses": {
      ".read": "auth != null",
      "$testId": {
        "$userId": {
          ".read": "auth != null && ($userId === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin')",
          ".write": "auth != null && ($userId === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin')"
        }
      }
    },
    "questions": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "userTestStates": {
      "$userId": {
        ".read": "auth != null && ($userId === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin')",
        ".write": "auth != null && ($userId === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin')"
      }
    },
    "users": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null && ($uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin')",
        "role": {
          ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
        },
        "testsCompleted": {
          ".write": "auth != null && $uid === auth.uid"
        }
      }
    }
  }
}
```

### Step 5: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click the web icon (`</>`)
4. Register your app
5. Copy the configuration values to your `.env` file

---

## ⚙️ Environment Configuration

Edit your `.env` file with the following values:

```env
# Firebase Configuration (from Firebase Console)
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_MESSAGE_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_app_id
VITE_MEASUREMENT_ID=your_measurement_id

# AI Service (Optional - for AI question generation)
VITE_AI_API_KEY=your_openrouter_api_key
```

### Getting OpenRouter API Key (Optional)

1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to API Keys section
4. Create a new API key
5. Add it to your `.env` file

---

## 🏃 Running the Project

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

---

## 👤 Creating Admin Users

### Method 1: Firebase Console (Recommended)

1. **Create a user account** through the app's registration page
2. **Get the User UID**:
   - Go to Firebase Console → Authentication
   - Find the user's UID
3. **Add admin role**:
   - Go to Realtime Database → Data tab
   - Navigate to `users` → `[USER_UID]`
   - Add a field: `role: "admin"`

### Method 2: Manual Database Entry

1. Go to Firebase Console → Realtime Database
2. Navigate to the `users` node
3. Add/Edit user with this structure:

```json
{
  "users": {
    "USER_UID_HERE": {
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "department": "IT",
      "registrationNumber": "ADMIN001"
    }
  }
}
```

### Default Test Credentials

For testing purposes, you can create these accounts:

**Admin Account:**
- Email: `admin@gmail.com`
- Password: `admin@123`
- Role: `admin` (set in database)

**Student Account:**
- Email: `student@gmail.com`
- Password: `student@123`
- Role: `student` (default)

---

## 📁 Project Structure

```
optimum/
├── public/
│   ├── optimum.png          # Logo
│   └── ...
├── src/
│   ├── components/
│   │   ├── admin/           # Admin components
│   │   │   ├── CreateTestModal.tsx
│   │   │   ├── AiGenerationModal.tsx
│   │   │   └── ...
│   │   ├── auth/            # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ...
│   │   ├── common/          # Shared components
│   │   │   ├── Navbar.tsx
│   │   │   ├── DifficultyBadge.tsx
│   │   │   └── ...
│   │   └── student/         # Student components
│   │       ├── Dashboard.tsx
│   │       ├── TestInterface.tsx
│   │       └── ...
│   ├── lib/
│   │   └── firebase.ts      # Firebase configuration
│   ├── pages/
│   │   ├── AboutUs.tsx
│   │   ├── ContactUs.tsx
│   │   └── ...
│   ├── services/
│   │   ├── adaptiveTestService.ts
│   │   ├── aiService.ts
│   │   └── ...
│   ├── utils/
│   │   ├── pdfUtils.ts
│   │   └── ...
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── .env.example             # Environment template
├── .gitignore
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 📚 Key Features Documentation

### 1. Adaptive Testing System

The platform uses an intelligent adaptive difficulty algorithm:

- **Initial Difficulty**: Tests start at medium difficulty
- **Performance Tracking**: Monitors correct/wrong answer streaks
- **Difficulty Adjustment**:
  - 2+ correct answers → difficulty increases
  - 2+ wrong answers → difficulty decreases
- **Weighted Scoring**: 
  - Easy: 1 point
  - Medium: 2 points
  - Hard: 3 points

**For Administrators:**
- Toggle adaptive mode when creating tests
- Assign difficulty levels to questions
- View difficulty distribution statistics

### 2. AI Question Generation

Upload PDF syllabi to automatically generate questions:

1. Click "Create with AI" in test creation
2. Upload PDF file (drag & drop supported)
3. Configure number of questions and difficulty
4. AI generates multiple-choice questions
5. Review and edit before adding to test

**Requirements:**
- OpenRouter API key in `.env`
- PDF file with text content

### 3. Bulk Question Import

Import questions via Excel/CSV:

1. Download the template
2. Fill in questions, options, and answers
3. Optional: Add difficulty column
4. Upload file in test creation modal

**Excel Format:**
```
Question | Option A | Option B | Option C | Option D | Correct Answer | Difficulty
---------|----------|----------|----------|----------|----------------|------------
What...  | Option 1 | Option 2 | Option 3 | Option 4 | A              | medium
```

### 4. Analytics Dashboard

**Student Analytics:**
- Test history and scores
- Performance trends
- Time spent per test
- Difficulty progression

**Admin Analytics:**
- Student performance overview
- Test completion rates
- Average scores by test
- Question difficulty distribution

---

## 📧 EmailJS Configuration

To enable the contact form:

### 1. Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account

### 2. Set Up Email Service

1. Go to **Email Services**
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Follow the setup wizard
5. Note your **Service ID** (e.g., `service_optimum`)

### 3. Create Email Template

1. Go to **Email Templates**
2. Click "Create New Template"
3. Set Template ID to `template_contact`
4. Use these variables in your template:
   - `{{from_name}}`
   - `{{from_email}}`
   - `{{subject}}`
   - `{{message}}`
   - `{{to_email}}`

### 4. Get Public Key

1. Go to **Account** → **General**
2. Copy your **Public Key**

### 5. Update Code

Edit `src/pages/ContactUs.tsx` (line 40):

```typescript
'YOUR_PUBLIC_KEY' // Replace with your actual public key
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use TailwindCSS for styling
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Firebase** for backend services
- **Vite** for the blazing-fast build tool
- **TailwindCSS** for the utility-first CSS framework
- **Lucide** for beautiful icons
- **OpenRouter** for AI capabilities

---

## 📞 Support

For support, email optimum-test@gmail.com or create an issue in the GitHub repository.

---

## 🚀 Deployment

### Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy!

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

<div align="center">

**Made with ❤️ by the OPTIMUM Team**

[Report Bug](https://github.com/yourusername/optimum/issues) · [Request Feature](https://github.com/yourusername/optimum/issues)

</div>
