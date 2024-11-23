# NextJS Enterprise SaaS Starter Kit 🚀

A modern, full-featured SaaS starter template built with Next.js 15, MongoDB, and Shadcn/UI. Get your SaaS project up and running in minutes with enterprise-grade authentication, and role-based access control.


## ✨ Features

- **🔐 Authentication & Authorization**
  - Secure JWT-based authentication
  - Role-based access control (Admin, Owner, Member)

- **👥 Multi-tenancy**
  - Multiple organizations support
  - User organization management
  - Role-based permissions within organizations

- **🎨 Modern UI/UX**
  - Built with Shadcn/UI components
  - Light and dark mode support
  - Responsive design
  - Toast notifications system

- **⚡ Technical Features**
  - Next.js 15 with App Router
  - MongoDB with Mongoose ODM
  - Type-safe forms with React Hook Form + Zod
  - Robust notification system
  - Modern React patterns and hooks

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/atharvaarbat/ultimate-saas-starter-kit.git
cd ultimate-saas-starter-kit
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env.local
```

4. Update the `.env.local` file with your MongoDB connection string and other required variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

5. Run the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application running.

## 📁 Project Structure

```
src
├── app/
│   ├── (authenticated)/    # Protected dashboard routes
│   ├── (auth)/             # Authentication pages
│   ├── fonts/    
│   ├── layout.tsx          # Root layout
|   ├── globa.css
|   ├── not-found.tsx
|   └── page.tsx
├── components/             # Reusable components
├── hooks/                  # custom hooks
├── lib/                    # Mongoose models
└── server/
```

## 🔧 Configuration

### Database Setup

The template uses MongoDB as the primary database. Make sure to:
1. Create a MongoDB database
2. Update the connection string in `.env.local`
3. Run migrations if needed

### Authentication

JWT-based authentication is pre-configured. You can modify the token expiration and other settings in the auth configuration files.

## 🎨 Customization

### Styling

The template uses Tailwind CSS with the Shadcn/UI component library. You can:
- Modify the theme in `tailwind.config.js`
- Customize component styles in `components/ui`
- Add new themes or modify existing ones


### Technology Stack

- [Next.js 15](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://github.com/colinhacks/zod)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- [Shadcn/UI](https://ui.shadcn.com/) for the beautiful components
- [Vercel](https://vercel.com) for the amazing deployment platform
- All the amazing open-source contributors

## 💪 Support

If you find this template helpful, please consider:
- Starring the repository
- Sharing it with others
- Contributing to its improvement

## 📧 Contact

If you have any questions or suggestions, please open an issue or reach out to me at [mail](mailto:arbatatharva130@gmail.com) .

---

Made with ❤️ by Atharva Arbat