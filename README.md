# CMS Dashboard with News Management

A modern React-based Content Management System for managing news content, built with TypeScript, Tailwind CSS, and shadcn/ui components.

![CMS Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmQlMjBjbXMlMjBuZXdzfGVufDF8fHx8MTc1NTcwNzY5MXww&ixlib=rb-4.1.0&q=80&w=1080)

## 🚀 Live Demo

[View Live Demo](https://your-username.github.io/cms-dashboard-news-management)

## ✨ Features

### 📰 News Publishing Management
- **Article Management**: View, filter, and manage news articles with different statuses
- **Bulk Operations**: Select and perform bulk actions on multiple articles
- **Smart Suggestions**: AI-powered bulk publishing suggestions based on safety scores
- **Advanced Filtering**: Filter by source, date, news type, tags, and custom filters
- **Search Functionality**: Search across titles, excerpts, sources, and tags

### 📖 News Stories Creation
- **Story Builder**: Create curated news stories by selecting multiple articles
- **Category Management**: Organize stories by categories and subcategories
- **Publishing Workflow**: Complete creation → pre-publish → publish workflow
- **Scheduling**: Schedule publication and set expiration times

### 📋 News Roundups
- **Roundup Creation**: Create themed news collections
- **Content Curation**: Organize articles into curated roundups
- **Publishing Controls**: Schedule and manage roundup publication

### 🛡️ Content Safety & Quality
- **Safety Scoring**: 5-tier safety scoring system for content assessment
- **Content Moderation**: Review and approval workflows
- **Publisher Statistics**: Analytics and performance tracking

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Notifications**: Sonner

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cms-dashboard-news-management.git
   cd cms-dashboard-news-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The build files will be generated in the `build/` directory.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   └── [feature].tsx   # Feature-specific components
├── data/               # Mock data files
├── assets/             # Static assets
├── imports/            # Icon and SVG imports
├── styles/             # Global styles
└── guidelines/         # Development guidelines
```

## 🎯 Key Features in Detail

### Article Management
- **Status Tracking**: Pending → Review → Published/Rejected workflow
- **Bulk Selection**: Select up to 5 articles for bulk operations
- **Smart Filtering**: Filter by safety score, source, date, and content type
- **Real-time Search**: Instant search across all article fields

### Content Creation
- **Story Creation**: Combine multiple articles into cohesive stories
- **Roundup Building**: Create themed collections of related articles
- **Preview System**: Preview content before publishing
- **Scheduling**: Set publication and expiration times

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Intuitive Navigation**: Clear tab-based interface
- **Toast Notifications**: Rich feedback for all user actions
- **Loading States**: Smooth transitions and loading indicators

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Component-based architecture

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the amazing component library
- [Unsplash](https://unsplash.com) for the beautiful images
- [Figma](https://figma.com) for the original design inspiration

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and modern web technologies.**