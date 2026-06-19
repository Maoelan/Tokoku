# Tokoku - Point of Sale & Inventory Management System

**Tokoku** is a robust, lightweight, and responsive Point of Sale (POS) and Inventory Management System built to handle daily store operations efficiently. Designed with simplicity and reliability in mind, Tokoku allows cashiers, operators, and administrators to seamlessly process transactions, manage product stock, and monitor sales history.

## 🚀 Features

### Core Functionality
- **PIN-Based Authentication**: Secure role-based login system. Accounts are protected by custom PIN codes instead of complex passwords, optimized for fast checkout environments.
- **Role-Based Access Control (RBAC)**: 
  - *Admin*: Full access to add/edit products, restock inventory, view analytics, and manage the store.
  - *Operator (Cashier)*: Access to process sales, view products, and manage the active cart.
- **Real-Time POS (Point of Sale)**: A smooth checkout interface allowing cashiers to scan/select products, adjust quantities, calculate totals, and process payments instantly.
- **Inventory & Restock Management**: Automatically deducts stock upon sale and features a dedicated Restock panel for administrators to replenish items.
- **Sales Analytics & History**: A comprehensive dashboard showing total revenue, daily transactions, and detailed historical logs of every purchase made.
- **Supabase Storage Integration**: Seamless uploading and serving of product images directly via Supabase Buckets.

### Security Implementation
- **Strict Route Protection**: All critical API routes (`/api/products`, `/api/sales`, `/api/restock`) are secured behind a robust Next.js Middleware that enforces HTTP-only Session Cookies (`tokoku_session`). This prevents any unauthorized access or API spoofing.
- **Atomic SQL Transactions**: Sales operations use Drizzle ORM transactions. If a stock deduction fails or is insufficient, the entire sale is rolled back automatically, preventing data inconsistencies.
- **Environment Isolation**: Database URIs and API keys are strictly managed via environment variables and never exposed to the client.

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Hosted on [Supabase](https://supabase.com/))
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Styling**: Vanilla CSS Modules (Zero-dependency, high performance)
- **Testing**: Jest & React Testing Library
- **CI/CD**: GitHub Actions & Vercel

## 💻 Getting Started (Local Development)

### Prerequisites
- Node.js (v20+)
- npm or pnpm
- A Supabase Project (PostgreSQL database)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Maoelan/Tokoku.git
   cd Tokoku
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Environment Variables:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   # Supabase Database Connection (Use Pooler URI for serverless environments)
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:6543/postgres"

   # Supabase Project Credentials (For Storage)
   NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhb..."
   ```

4. Push the Database Schema:
   ```bash
   npx drizzle-kit push
   ```

5. Setup Default Users:
   ```bash
   npx tsx src/db/setup-users.ts
   ```

6. Run the Development Server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Testing

This project utilizes Jest for unit and integration testing. Database operations and Supabase Storage calls are mocked to ensure fast and isolated test execution.

```bash
# Run all tests
npm run test

# Run the linter
npm run lint
```

## 🌐 Deployment

Tokoku is optimized for deployment on Vercel. 
1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add the `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel's Environment Variables.
4. Deploy!

*Note: Vercel serverless functions require the Supabase Connection Pooler (`port 6543`) to operate reliably.*

---
*Built with ❤️ for Tokoku.*
