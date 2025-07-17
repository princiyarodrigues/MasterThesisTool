# DTFT - Digital Twin Factory Tool

A comprehensive knowledge management portal for digital twin factory implementation, enabling strategic planning, business capabilities analysis, and process modeling for manufacturing excellence.

## 🏭 Overview

DTFT is a web-based knowledge portal that empowers manufacturing organizations to navigate their digital transformation journey. The platform provides structured workflows for strategic planning, capability assessment, and architectural design through interactive diagrams and comprehensive use case catalogs.

## ✨ Key Features

### 🎯 Strategic Goals Management
- Define and select strategic goals for factory digitalization
- Goal-based filtering across all platform components
- Real-time notifications when goals are updated

### 🏢 Business Capabilities Analysis
- Interactive capability mapping with strategic goal integration
- Cross-diagram filtering based on selected strategic goals
- Comprehensive capability assessment and exploration

### 🔧 Technical Capabilities
- Technical capability mapping with intelligent goal-based filtering
- Integration with strategic goals for targeted capability identification
- Empty state handling for better user experience

### 📋 Use Cases Catalog
- Comprehensive use case collection with detailed descriptions
- Advanced filtering by business capabilities
- Real-time search and categorization

### 🏗️ Reference Architecture
- Multi-perspective architecture diagrams (Factory, Product, Order, Manufacturing, Final View)
- Interactive drag-and-drop UC blocks functionality
- Cross-diagram element sharing and persistence

### 📚 IT Principles
- Foundational IT principles for digital factory implementation
- Supplementary resource with contextual guidance

## 🛠️ Technology Stack

- **Frontend**: React 18, Next.js 14 (App Router)
- **Authentication**: NextAuth.js
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Drag & Drop**: React DnD
- **Development**: Node.js, npm

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB instance
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd knowledge-portal
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/dtft
NEXTAUTH_URL=http://localhost:3004
NEXTAUTH_SECRET=your-secret-key
```

4. **Database Setup and Seeding**
```bash
# Seed the database with initial data
npm run seed
```

5. **Start the development server**
```bash
npm run dev
```

6. **Access the application**
Open [http://localhost:3004](http://localhost:3004) in your browser

## 📁 Project Structure

```
src/
├── app/                           # Next.js app router pages
│   ├── auth/signin/              # Authentication pages
│   ├── strategic-goals/          # Strategic goals management
│   ├── business-capabilities/    # Business capabilities analysis
│   ├── technical-capabilities/   # Technical capabilities mapping
│   ├── use-cases/               # Use cases catalog
│   ├── reference-architecture/   # Reference architecture diagrams
│   ├── it-principles/           # IT principles documentation
│   └── api/                     # API routes
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   ├── UseCases/                # Use case components
│   ├── ReferenceArchitecture/   # Architecture diagram components
│   └── [Feature]/               # Feature-specific components
└── lib/                         # Utility functions and data
```

## 🗄️ Database Schema

The application uses MongoDB with collections for:
- Users and authentication
- Strategic goals selections
- Diagram selections and UC block connections
- Use case data and relationships
- Business and technical capabilities

## 🔐 Authentication

The platform uses NextAuth.js for authentication with session-based user management. Users must authenticate to access personalized features like goal selection and diagram state persistence.

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Elements**: Hover states, transitions, and animations
- **Consistent Navigation**: Unified "Back to Dashboard" navigation
- **Visual Feedback**: Loading states, success notifications, and error handling
- **Accessibility**: ARIA labels and keyboard navigation support

## 🚀 Development

### Running the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3004`

### Building for Production
```bash
npm run build
npm start
```

### Common Development Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Kill process on port 3004 (if needed)
lsof -ti:3004 | xargs kill -9
```

## 📈 Features in Development

- Enhanced cross-diagram filtering
- Advanced use case search and categorization
- Expanded reference architecture perspectives
- Improved drag-and-drop functionality
- Enhanced mobile responsiveness

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Built with ❤️ for manufacturing excellence and digital transformation.
