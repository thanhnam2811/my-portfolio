# My Portfolio - Backend Systems Portfolio

Localized portfolio website built with Next.js for a backend engineer focused on real-time systems and production
infrastructure.

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Animations**: GSAP + ScrollTrigger
- **Localization**: next-intl
- **UI Components**: Radix UI

## 📁 Project Structure

```
my-portfolio/
├── app/
│   ├── [locale]/
│   │   ├── _components/  # Homepage components
│   │   ├── _data/        # Homepage structured content
│   │   ├── layout.tsx    # Localized app shell
│   │   └── page.tsx      # Localized homepage
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   └── ui/         # UI components
├── messages/       # Locale dictionaries
├── docs/           # Documentation & Roadmap
├── lib/            # Motion helpers and utilities
└── public/         # Static files
```

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view the result.

## 📋 Roadmap

See the current maintenance roadmap at [docs/ROADMAP.md](./docs/ROADMAP.md).

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [GSAP](https://gsap.com/docs/v3/)
- [Vercel Deployment](https://vercel.com/docs)

## 📄 License

MIT License
