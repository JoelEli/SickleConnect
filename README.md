# 🩸 SickleConnect Community Platform

A comprehensive community platform designed specifically for individuals living with sickle cell disease, their families, and healthcare providers. Built with modern web technologies and real-time features.

## 🌟 Features

### 🔐 Authentication & User Management
- **Custom Email/Password Authentication** - Secure user registration and login
- **Role-based Access Control** - Separate experiences for patients, doctors, and caregivers
- **User Profiles** - Comprehensive profile management with medical information
- **JWT Token Security** - Secure session management

### 📱 Real-time Community Features
- **Live Post Feed** - Real-time updates for new posts, likes, and comments
- **WebSocket Integration** - Instant notifications and live updates
- **Interactive Posts** - Like, comment, and share functionality
- **Image Upload** - Support for image attachments in posts
- **Infinite Scroll** - Smooth loading of community content

### 🎨 Modern UI/UX
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode** - Toggle between themes for user preference
- **Hamburger Menu** - Mobile-optimized navigation
- **Accessibility** - ARIA labels and keyboard navigation support
- **Loading States** - Skeleton loaders and smooth transitions

### 🔍 Search & Discovery
- **User Search** - Find other community members
- **Post Search** - Search through community content
- **Advanced Filtering** - Filter by role, genotype, and more

### 💳 Donation Integration
- **GoFundMe Integration** - Secure donation processing
- **Impact Tracking** - See how donations help the community
- **Multiple Payment Options** - Credit card, PayPal, bank transfer

### 🛡️ Security & Privacy
- **Input Sanitization** - Protection against XSS attacks
- **Data Validation** - Comprehensive form validation
- **Secure API** - Protected endpoints with authentication
- **Privacy Controls** - Anonymous posting options

## 🚀 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **WebSockets** - Real-time communication
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/JoelEli/SickleConnect.git
   cd SickleConnect/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sickleconnect
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../src
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

## 🏗️ Project Structure

```
SickleConnect/
├── backend/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── server.js        # Main server file
├── src/
│   ├── components/      # Reusable UI components
│   ├── features/        # Feature-based organization
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   └── shared/          # Shared components and hooks
├── public/              # Static assets
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Like/unlike post
- `GET /api/posts/:id/comments` - Get post comments
- `POST /api/posts/:id/comments` - Add comment

### WebSocket Events
- `new_post` - New post created
- `post_liked` - Post liked/unliked
- `new_comment` - New comment added

## 🎯 Key Features Implementation

### Real-time Updates
- WebSocket server for live communication
- Optimistic UI updates for better UX
- Global WebSocket instance management
- Event-driven architecture

### Mobile Responsiveness
- Hamburger menu for mobile navigation
- Touch-friendly interface
- Responsive grid layouts
- Mobile-optimized forms

### Security
- Input sanitization with DOMPurify
- JWT token validation
- Password hashing with bcrypt
- CORS configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the sickle cell community
- Inspired by the need for better support networks
- Thanks to all contributors and supporters

## 📞 Support

For support, email support@sickleconnect.com or join our community discussions.

---

**Made with ❤️ for the Sickle Cell Community**