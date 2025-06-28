# 🧱 Briickly - Modern Real Estate Platform

*Briickly* is a modern full-stack real estate web application that connects property owners with potential buyers and renters. Built with the *MERN stack* (MongoDB, Express.js, React, Node.js), it features a responsive interface with a sleek dark theme and seamless user experience.

---

## ✨ Features

### 🔐 User Authentication

* Email/password signup & login
* Google OAuth integration
* Protected routes with authentication state management

### 🏡 Property Listings

* Full CRUD for property listings
* Image uploads via Cloudinary
* Advanced search & filter functionality
* Responsive cards with property image galleries

### 👤 User Profiles

* Manage personal information
* View and manage user-specific listings
* Upload and update profile picture

### 🎨 Modern UI/UX

* Modern theme with elegant transitions
* Mobile-first responsive design
* Streamlined forms and navigation

---

## 🚀 Tech Stack

### 🌐 Frontend

* *React 19*
* *Redux Toolkit* for global state
* *React Router* for routing
* *Tailwind CSS 4.0.9* for styling
* *React Icons* for iconography

### 🖥️ Backend

* *Node.js* with *Express.js*
* *MongoDB* with *Mongoose*
* *JWT* for secure authentication
* *Cloudinary* for image storage

### ⚙️ Development Tools

* *Vite* for lightning-fast development
* *PostCSS* for enhanced CSS processing
* *ESLint & Prettier* for code formatting and linting

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone [repository-url]
cd Briickly
```

### 2. Install Dependencies

#### Server

```bash
npm install
```

#### Client

```bash
cd client
npm install
```

### 3. Environment Variables

Create a `.env` file in the server directory with the following:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 4. Run the Application

⚠️ *Note:* You must run two servers for local development:

* *Frontend* is located in `briickly/client/` → run using:

```bash
npm run dev
```

* *Backend* is at the root `briickly/` → run using:

```bash
npm run dev
```

---

## 🧩 Current Challenges & Solutions

### 🔐 Authentication & Security

* *Challenge*: Secure JWT token handling
  *Solution*: HTTP-only cookies and token refresh logic

* *Challenge*: Route protection on both client & server
  *Solution*: Protected route components and backend middleware

### 🚀 Performance Optimization

* *Challenge*: Slow image loading
  *Solution*: Cloudinary optimizations + lazy loading

* *Challenge*: Large bundle sizes
  *Solution*: Code-splitting and dynamic imports

### 📦 State Management

* *Challenge*: Complex multi-step form states
  *Solution*: React Hook Form + Yup validation

* *Challenge*: Global state consistency
  *Solution*: Centralized with Redux Toolkit

---

## 🔭 Future Improvements

### 🧪 Code Quality & Architecture

* [ ] Add comprehensive test suite (Jest + RTL)
* [ ] Migrate to TypeScript
* [ ] Implement error boundaries
* [ ] Add centralized logging & monitoring

### ⚡ Performance

* [ ] Add SSR/SSG support
* [ ] WebP image delivery & responsive images
* [ ] Service worker for offline support
* [ ] Further bundle optimization

### 🛡️ Security

* [ ] API rate limiting
* [ ] Advanced input validation & sanitization
* [ ] HTTP security headers (CSP, etc.)
* [ ] Regular dependency auditing

---

## 🌟 Upcoming Features

### Core Features

* [ ] Messaging between buyers & sellers
* [ ] Saved searches with alerts
* [ ] 360° virtual property tours
* [ ] Neighborhood insights & analytics

### Enhanced UX

* [ ] Dark/light theme toggle
* [ ] Advanced filters for granular search
* [ ] Interactive map search
* [ ] AI-powered property recommendations

### Additional Functionality

* [ ] Multi-language support (i18n)
* [ ] Native mobile app (React Native)
* [ ] Broker/Agent portal
* [ ] Secure document exchange

---

### Optimization Goals

* [ ] Lighthouse score > 90 on all views
* [ ] Reduce bundle size by \[X]%
* [ ] Improve mobile responsiveness
* [ ] Reduce API latency

---

## 🤝 Community & Support

### 📘 Need Help?

* [Documentation](#)
* [GitHub Issues](#)
* [Community Forum](#)

### 🐛 Reporting Issues

Please include the following:

* Steps to reproduce
* Screenshots (if applicable)
* Browser & device details

---

## 🙏 Acknowledgments

* [React Icons](https://react-icons.github.io/react-icons/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Cloudinary](https://cloudinary.com/)
* [Vite](https://vitejs.dev/)

---

## 👥 Contributors

| Name          | Registration No. | Branch     |
| ------------- | ---------------- | ---------- |
| Guransh Goyal | 20233132         | B.Tech CSE |
| Ayush Pandey  | 20233331         | B.Tech CSE |
| Krishna Goyal | 20233169         | B.Tech CSE |

