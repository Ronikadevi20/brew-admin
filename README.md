# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)


brew-admin/
│
├── .git/                           # Git version control
├── .gitignore                      # Git ignore patterns
│
├── node_modules/                   # Dependencies (auto-generated)
│
├── public/                         # Static assets
│   ├── favicon.ico                # Site favicon
│   ├── placeholder.svg            # Placeholder images
│   └── robots.txt                 # SEO robots file
│
├── src/                           # Source code
│   │
│   ├── components/                # React components
│   │   │
│   │   ├── dashboard/             # Dashboard-specific components
│   │   │   ├── Charts.tsx         # Chart visualizations
│   │   │   ├── MetricCard.tsx     # Metric display cards
│   │   │   └── PeriodSelector.tsx # Time period selector
│   │   │
│   │   ├── layout/                # Layout components
│   │   │   └── DashboardLayout.tsx # Main dashboard layout wrapper
│   │   │
│   │   ├── ui/                    # shadcn-ui components (reusable)
│   │   │   ├── accordion.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── aspect-ratio.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── command.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── input-otp.tsx
│   │   │   ├── label.tsx
│   │   │   ├── menubar.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── resizable.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── toggle.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── use-toast.ts
│   │   │
│   │   └── NavLink.tsx            # Navigation link component
│   │
│   ├── contexts/                  # React contexts
│   │   └── AuthContext.tsx        # Authentication context provider
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-mobile.tsx         # Mobile detection hook
│   │   └── use-toast.ts           # Toast notification hook
│   │
│   ├── lib/                       # Utility libraries
│   │   └── utils.ts               # Utility functions (cn, etc.)
│   │
│   ├── pages/                     # Page components
│   │   │
│   │   ├── auth/                  # Authentication pages
│   │   │   ├── ForgotPasswordPage.tsx  # Forgot password flow
│   │   │   ├── LoginPage.tsx          # Login page
│   │   │   └── ResetPasswordPage.tsx  # Password reset page
│   │   │
│   │   ├── dashboard/             # Dashboard pages
│   │   │   ├── BDLInsights.tsx         # Business intelligence insights
│   │   │   ├── CafeProfile.tsx         # Café profile management
│   │   │   ├── DashboardOverview.tsx   # Main dashboard overview
│   │   │   ├── EventsPromotions.tsx    # Events & promotions management
│   │   │   ├── QRStaffManagement.tsx   # QR & staff management
│   │   │   └── StampsVisits.tsx        # Stamps & visits tracking
│   │   │
│   │   └── NotFound.tsx           # 404 error page
│   │
│   ├── App.tsx                    # Main app component & routing
│   ├── index.css                  # Global styles
│   ├── main.tsx                   # App entry point
│   └── vite-env.d.ts             # Vite TypeScript declarations
│
├── bun.lockb                      # Bun lock file
├── components.json                # shadcn-ui configuration
├── eslint.config.js              # ESLint configuration
├── index.html                     # HTML entry point
├── package.json                   # NPM package configuration
├── package-lock.json             # NPM lock file
├── postcss.config.js             # PostCSS configuration
├── README.md                      # Project documentation
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.app.json             # TypeScript app configuration
├── tsconfig.node.json            # TypeScript node configuration
└── vite.config.ts                # Vite build configuration
