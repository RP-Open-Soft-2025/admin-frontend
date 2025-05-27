# DeloConnect Admin Panel

A modern, feature-rich admin dashboard built with Next.js 15, TypeScript, and Tailwind CSS. This project serves as the administrative interface for DeloConnect platform.

## 📑 Table of Contents

- [Features](#-features)
- [Prerequisites](#️-prerequisites)
- [Installation](#-installation)
- [Development](#-development)
- [Available Scripts](#-available-scripts)
- [Project Structure](#️-project-structure)
- [Configuration Files](#-configuration-files)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

## 🚀 Features

- **Modern Tech Stack**

  - Next.js 15 with App Router
  - TypeScript for type safety
  - Tailwind CSS 4 for styling
  - Redux Toolkit for state management
  - FullCalendar for calendar functionality
  - ApexCharts for data visualization
  - React Dropzone for file uploads
  - WebSocket support for real-time features
  - React Vector Maps for geographical data visualization
  - React Day Picker for date selection
  - React Markdown for content rendering

- **UI Components**
  - Radix UI components for accessible interfaces
  - Heroicons and Lucide React for icons
  - Sonner for toast notifications
  - Dark mode support with next-themes
  - React Select for enhanced select inputs
  - Class Variance Authority for component variants

## 🛠️ Prerequisites

- Node.js (Latest LTS version recommended)
- npm package manager

## 📦 Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd deloconnect-admin-panel
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_URL=backend_url
```

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Check code formatting
- `npm run format:fix` - Fix code formatting issues

## 🏗️ Project Structure

```
deloconnect-admin-panel/
├── src/                    # Source code
│   ├── app/               # Next.js app router pages
│   ├── components/        # Reusable components
│   ├── lib/              # Utility functions and configurations
│   └── store/            # Redux store and slices
├── public/               # Static assets
├── .github/             # GitHub configuration
└── ...config files      # Various configuration files
```

## 🔧 Configuration Files

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `eslint.config.mjs` - ESLint configuration
- `.prettierrc.json` - Prettier configuration
- `postcss.config.mjs` - PostCSS configuration
- `components.json` - Component configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- All contributors and maintainers of the used libraries
