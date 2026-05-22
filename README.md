# AI Code Review - Web Extension & Native App

A comprehensive AI-powered platform for code review, text assistance, and resume building with web extension and native app support.

## 📋 Project Overview

ReviewAI is a high-performance platform designed to elevate code quality, streamline professional communication, and optimize career assets using advanced Artificial Intelligence. This monorepo contains:

- **Frontend**: Next.js 16 (App Router) with TypeScript & Tailwind CSS
- **Backend**: Laravel API with PHP
- **Web Extension**: Browser extension for seamless code review integration
- **Native App**: Cross-platform desktop application

## 🎯 Core Features

### 1. AI Code Review
- Deep-dive diagnostics for bugs, performance leaks, and security vulnerabilities
- Expert-level analysis with one-click refactoring suggestions
- Support for multiple programming languages

### 2. AI Text Assistant
- Linguistic processing for documentation, READMEs, and professional communication
- Grammar fixing, tone adjustment, and instant log summarization

### 3. AI Resume Builder
- Generate impact-optimized resumes with AI scoring
- Industry-standard templates with one-click PDF generation

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, Recharts |
| Backend | Laravel, PHP |
| Web Extension | TypeScript, JavaScript |
| Icons | Lucide React |
| API Communication | REST API |

## 📦 Language Composition

- **TypeScript**: 60.2%
- **PHP**: 24.5%
- **JavaScript**: 11.6%
- **Blade**: 3.2%
- **Other**: 0.5%

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ (for frontend and extension)
- PHP 8.1+ (for backend)
- Composer (for Laravel dependencies)
- npm or yarn package manager

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/naeemliaqatweb/ai-code-review-web-extention-native-app.git
cd ai-code-review-web-extention-native-app
```

#### 2. Setup Frontend
```bash
cd ai-code-review-frontend
npm install
npm run dev
```

Environment variables (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### 3. Setup Backend
```bash
cd ai-code-review-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## 📋 Workflow Commands

### Development Workflow

#### Frontend Development
```bash
# Install dependencies
cd ai-code-review-frontend
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

#### Backend Development
```bash
# Navigate to backend
cd ai-code-review-backend

# Install dependencies
composer install

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Start development server
php artisan serve

# Run tests
php artisan test

# Clear caches
php artisan cache:clear
php artisan config:clear
```

#### Web Extension Development
```bash
# Build extension
cd ai-code-review-extension
npm install
npm run build

# Watch mode for development
npm run watch
```

### Git Workflow

#### Creating a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

#### Committing Changes
```bash
git add .
git commit -m "feat: description of your changes"
git push origin feature/your-feature-name
```

#### Creating a Pull Request
```bash
# Push your branch and create a PR through GitHub UI
# Ensure your PR includes:
# - Clear description of changes
# - Related issue references
# - Test results
```

### Database Management

```bash
# Create migration
php artisan make:migration create_table_name

# Run migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Refresh database (warning: destructive)
php artisan migrate:refresh

# Seed database
php artisan db:seed
```

### Code Quality

#### Run Tests
```bash
# Frontend tests
cd ai-code-review-frontend
npm test

# Backend tests
cd ai-code-review-backend
php artisan test
```

#### Code Standards
```bash
# Format code (frontend)
npm run format

# Lint code (frontend)
npm run lint

# Laravel code style
php artisan pint
```

## 🔧 Environment Setup

### Backend `.env` Configuration
```env
APP_NAME="ReviewAI"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=reviewai
DB_USERNAME=root
DB_PASSWORD=

# API Configuration
API_KEY=your_api_key_here
```

### Frontend `.env.local` Configuration
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 Project Structure

```
ai-code-review-web-extention-native-app/
├── ai-code-review-frontend/          # Next.js frontend application
│   ├── app/                          # Next.js App Router
│   ├── components/                   # React components
│   ├── public/                       # Static assets
│   └── package.json
├── ai-code-review-backend/           # Laravel API backend
│   ├── app/                          # Laravel application code
│   ├── routes/                       # API routes
│   ├── database/                     # Migrations & seeders
│   └── composer.json
└── README.md                         # This file
```

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd ai-code-review-frontend
npm run build
# Deploy the `.next` folder
```

### Backend Deployment (Laravel Hosting)
```bash
cd ai-code-review-backend
composer install --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Commit Convention

Please follow these commit message conventions:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Build, dependency, or tooling changes

Example: `feat: add AI code review functionality`

## 🐛 Troubleshooting

### Frontend Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

### Backend Issues
```bash
# Clear all Laravel caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Reinstall dependencies
composer install --no-cache
```

## 📄 License

This project is open-sourced software licensed under the MIT license.

## 👨‍💻 Author

**Naeem Liaquat** - [GitHub Profile](https://github.com/naeemliaqatweb)

## 📞 Support

For issues, questions, or suggestions, please open an GitHub issue or contact the maintainers.

---

Built with ❤️ for modern engineering teams.
