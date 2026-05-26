# Support CRM Frontend

A modern SaaS-style Customer Support CRM frontend built using React, TypeScript, Vite, Tailwind CSS, and Axios.

This application provides a clean and responsive support ticket management interface where support teams can create, manage, search, filter, and update customer support tickets efficiently.

---

# Features

## Core Features

- Create support tickets
- View all tickets
- Search tickets in real-time
- Filter tickets by status
- View detailed ticket information
- Update ticket status
- Add notes/comments to tickets

---

# UI Features

- Modern SaaS dashboard design
- Responsive layout for desktop/tablet/mobile
- Sidebar navigation
- Sticky top navbar
- Status badges
# Project Structure

```text
frontend/
├── public/
│   └── use.txt
├── src/
│   ├── api/
│   │   └── tickets.ts
│   ├── components/
│   │   ├── ErrorBoundary.tsx
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── NotesSection.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatusFilter.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── TicketCard.tsx
│   │   ├── TicketDetails.tsx
│   │   ├── TicketForm.tsx
│   │   ├── TicketTable.tsx
│   │   └── ui/
│   │       ├── Avatar.tsx
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorMessage.tsx
│   │       ├── FormField.tsx
│   │       ├── Input.tsx
│   │       ├── Label.tsx
│   │       ├── Select.tsx
│   │       ├── Skeleton.tsx
│   │       ├── Spinner.tsx
│   │       ├── Textarea.tsx
│   │       └── TicketSkeleton.tsx
│   ├── context/
│   │   └── AppContext.tsx
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── useApp.ts
│   │   └── useTheme.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── CreateTicket.tsx
│   │   ├── Dashboard.tsx
│   │   ├── TicketDetail.tsx
│   │   ├── Customers.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
│   │   ├── CreateTicket.tsx
│   │   └── TicketPage.tsx
│   │
│   ├── services/
│   │   └── api.ts
│   │
│   ├── hooks/
│   │   └── useTickets.ts
│   │
│   ├── layouts/
│   │   └── MainLayout.tsx
│   │
│   ├── utils/
│   │   └── helpers.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── public/
├── package.json
├── vite.config.ts
└── README.md