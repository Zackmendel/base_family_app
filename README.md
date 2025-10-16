# FamFunds - Family Financial Management Prototype

A prototype application for collaborative family financial management, enabling families to pool resources, track expenses, and make collective financial decisions with AI-powered assistance.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Demo Walkthrough](#demo-walkthrough)
- [Mock Data & Testing](#mock-data--testing)
- [BaseBot Simulation](#basebot-simulation)
- [Extending the Prototype](#extending-the-prototype)
- [Future Enhancements](#future-enhancements)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview

FamFunds is a prototype application designed to demonstrate how families can collaboratively manage shared financial resources. The application provides:

- **Shared Family Accounts**: Pool resources for common expenses
- **Expense Tracking**: Monitor spending across categories
- **Transaction History**: Complete audit trail of all financial activities
- **AI Assistant (BaseBot)**: Intelligent financial guidance and insights
- **Role-Based Access**: Different permissions for parents and children
- **Real-time Updates**: Instant synchronization across family members

This prototype serves as a proof-of-concept for validating the core user experience and technical feasibility of family-oriented financial management tools.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **State Management**: React Context API / Redux Toolkit
- **UI Library**: Tailwind CSS + shadcn/ui components
- **Charts & Visualizations**: Recharts
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **API Design**: RESTful

### AI/ML (BaseBot)
- **LLM Integration**: OpenAI API (GPT-4)
- **Prompt Engineering**: Custom financial advisory prompts
- **Context Management**: Conversation history tracking
- **Safety**: Content filtering and guardrails

### DevOps & Tools
- **Package Manager**: npm / yarn
- **Build Tool**: Vite
- **Code Quality**: ESLint + Prettier
- **Testing**: Jest (unit) + React Testing Library
- **Version Control**: Git
- **API Documentation**: Swagger/OpenAPI

## ✨ Features

### Current Implementation (Prototype)

1. **Family Account Management**
   - Create and manage family accounts
   - Add/remove family members
   - Set role-based permissions (Admin, Parent, Child)

2. **Transaction Processing**
   - Record deposits and withdrawals
   - Categorize expenses (Groceries, Entertainment, Education, etc.)
   - Attach notes and receipts to transactions

3. **Dashboard & Analytics**
   - Real-time balance overview
   - Spending trends by category
   - Monthly budget tracking
   - Visual charts and graphs

4. **BaseBot AI Assistant**
   - Natural language financial queries
   - Spending analysis and insights
   - Budget recommendations
   - Financial literacy tips for children

5. **Notifications**
   - Transaction alerts
   - Low balance warnings
   - Budget threshold notifications

## 📦 Prerequisites

Before installing, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **PostgreSQL**: v15.0 or higher ([Download](https://www.postgresql.org/download/))
- **Git**: Latest version ([Download](https://git-scm.com/downloads))

Optional but recommended:
- **Docker**: For containerized PostgreSQL
- **VS Code**: Recommended IDE with TypeScript support

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Zackmendel/base_family_app.git
cd base_family_app
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker run --name famfunds-db \
  -e POSTGRES_PASSWORD=famfunds_dev \
  -e POSTGRES_USER=famfunds \
  -e POSTGRES_DB=famfunds \
  -p 5432:5432 \
  -d postgres:15-alpine
```

#### Option B: Local PostgreSQL Installation

```bash
# Create database
psql -U postgres
CREATE DATABASE famfunds;
CREATE USER famfunds WITH PASSWORD 'famfunds_dev';
GRANT ALL PRIVILEGES ON DATABASE famfunds TO famfunds;
\q
```

### 4. Environment Configuration

Create environment files for both frontend and backend:

**Backend** (`backend/.env`):
```env
# Database
DATABASE_URL="postgresql://famfunds:famfunds_dev@localhost:5432/famfunds"

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# OpenAI (BaseBot)
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4

# CORS
CORS_ORIGIN=http://localhost:5173

# Mock Data
USE_MOCK_DATA=true
SEED_DATABASE=true
```

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ENABLE_MOCK_MODE=false
VITE_APP_NAME=FamFunds
```

### 5. Database Migration

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 6. Seed Mock Data (Optional)

```bash
cd backend
npm run seed
```

This will populate the database with:
- 2 demo families (Smith Family, Johnson Family)
- 8 user accounts with various roles
- 50+ sample transactions
- Pre-configured expense categories

## ▶️ Running the Application

### Development Mode

Open two terminal windows:

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
The API server will start at `http://localhost:3001`

**Terminal 2 - Frontend Application:**
```bash
cd frontend
npm run dev
```
The web app will start at `http://localhost:5173`

### Production Build

```bash
# Build backend
cd backend
npm run build
npm start

# Build frontend
cd frontend
npm run build
npm run preview
```

### Using Docker Compose (Full Stack)

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Backend API server
- Frontend application
- Nginx reverse proxy

Access the application at `http://localhost:8080`

## 🎬 Demo Walkthrough

Follow this guided tour to explore all prototype features:

### Step 1: Login with Demo Accounts

The application comes with pre-configured demo accounts:

| Email | Password | Role | Family |
|-------|----------|------|--------|
| john.smith@example.com | demo123 | Admin | Smith Family |
| jane.smith@example.com | demo123 | Parent | Smith Family |
| emma.smith@example.com | demo123 | Child | Smith Family |
| mike.johnson@example.com | demo123 | Admin | Johnson Family |

**Action**: Login as `john.smith@example.com` (Admin role)

### Step 2: Explore the Dashboard

After logging in, you'll see:
- **Current Balance**: Total family funds available
- **Recent Transactions**: Last 10 transactions
- **Spending by Category**: Pie chart visualization
- **Monthly Trends**: Line graph of spending over time
- **Budget Status**: Progress bars for each category

**Action**: Navigate through the dashboard widgets and hover over charts for details.

### Step 3: View Transaction History

Click on **"Transactions"** in the navigation:
- Browse all family transactions
- Filter by date range, category, or member
- Sort by amount, date, or description
- Export to CSV for external analysis

**Action**: Try filtering transactions by "Groceries" category.

### Step 4: Create a New Transaction

Click **"Add Transaction"** button:
1. Select transaction type (Income/Expense)
2. Enter amount: `$75.50`
3. Choose category: "Groceries"
4. Add description: "Weekly grocery shopping"
5. Optional: Upload receipt image
6. Click **"Submit"**

**Action**: Observe the dashboard update in real-time.

### Step 5: Interact with BaseBot

Click on the **BaseBot icon** (bottom right):

Try these example queries:
- *"How much did we spend on groceries this month?"*
- *"What's our biggest expense category?"*
- *"Give me tips for saving money on entertainment"*
- *"Should we increase our grocery budget?"*

**BaseBot Response**: The AI will analyze your family's data and provide contextualized answers with specific insights and recommendations.

**Action**: Ask follow-up questions to test conversation continuity.

### Step 6: Manage Family Members

Navigate to **"Family"** section:
- View all family members
- See each member's role and permissions
- Add new members (email invitation)
- Update roles and access levels
- Remove members

**Action**: Click on a family member to view their transaction history.

### Step 7: Configure Budgets

Go to **"Budgets"** section:
1. View existing category budgets
2. Click **"Edit Budget"** for "Entertainment"
3. Set new monthly limit: `$200`
4. Set alert threshold: `80%`
5. Save changes

**Action**: Create a new transaction that exceeds the threshold and observe the warning.

### Step 8: Test Child Account Restrictions

Logout and login as `emma.smith@example.com` (Child role):

Observe limited features:
- ✅ Can view transactions
- ✅ Can ask BaseBot questions
- ✅ Can request transactions (requires approval)
- ❌ Cannot edit budgets
- ❌ Cannot manage family members
- ❌ Cannot delete transactions

**Action**: Try to access restricted features and see permission warnings.

### Step 9: Review Notifications

Click the **bell icon** (top right):
- See transaction alerts
- Budget threshold warnings
- New family member notifications
- Pending approval requests (if child account)

**Action**: Mark notifications as read.

### Step 10: Mobile Responsiveness

Resize browser window or use device emulation:
- Hamburger menu appears on mobile
- Charts adapt to smaller screens
- Touch-friendly buttons and inputs
- Bottom navigation bar on mobile

**Action**: Test the full workflow on mobile viewport.

## 🧪 Mock Data & Testing

### Understanding Mock Data

The prototype uses mock data in two scenarios:

1. **Database Seeding**: Pre-populate with realistic demo data
2. **API Mocking**: Simulate backend responses without running server

### Mock Data Configuration

In `backend/.env`:
```env
USE_MOCK_DATA=true
SEED_DATABASE=true
```

In `frontend/.env`:
```env
VITE_ENABLE_MOCK_MODE=false
```

### Seed Data Structure

The seed script (`backend/src/seed.ts`) creates:

**Families**:
- Smith Family (4 members)
- Johnson Family (4 members)

**Users per Family**:
- 1 Admin (full permissions)
- 1 Parent (most permissions)
- 2 Children (limited permissions)

**Transactions**:
- Income: Salary deposits, allowances
- Expenses: Groceries, utilities, entertainment, education
- Date range: Last 90 days
- Amounts: $5 - $500 (realistic ranges)

**Categories**:
- Groceries
- Entertainment
- Education
- Transportation
- Healthcare
- Utilities
- Dining Out
- Shopping
- Savings

### Re-seeding Database

To reset and re-seed:

```bash
cd backend
npx prisma migrate reset
npm run seed
```

⚠️ **Warning**: This will delete all existing data!

### Custom Mock Data

Edit `backend/src/seed.ts` to customize:

```typescript
// Add your own family
const customFamily = await prisma.family.create({
  data: {
    name: "Your Family Name",
    balance: 5000.00,
    currency: "USD"
  }
});

// Add custom transactions
await prisma.transaction.create({
  data: {
    amount: 150.00,
    type: "EXPENSE",
    category: "Custom Category",
    description: "Your description",
    familyId: customFamily.id
  }
});
```

## 🤖 BaseBot Simulation

### What is BaseBot?

BaseBot is an AI-powered financial assistant integrated into FamFunds. It uses Large Language Models (LLM) to provide:

- Natural language query processing
- Financial insights and analysis
- Budget recommendations
- Educational content for children
- Contextual advice based on family data

### Architecture

```
User Input → Frontend → API → BaseBot Service → OpenAI API → Response
                                     ↓
                              Family Data Context
                              Transaction History
                              Budget Information
```

### How BaseBot Works

1. **Context Building**: 
   - Retrieves relevant family financial data
   - Summarizes recent transactions
   - Includes budget status and goals

2. **Prompt Engineering**:
   - System prompt defines BaseBot personality
   - User message includes query + context
   - Safety guardrails prevent harmful advice

3. **Response Generation**:
   - OpenAI API processes the prompt
   - Returns natural language response
   - Response is logged for audit

4. **Conversation Memory**:
   - Maintains conversation history
   - Enables follow-up questions
   - Context window management

### BaseBot Configuration

In `backend/src/services/basebot.service.ts`:

```typescript
const BASEBOT_SYSTEM_PROMPT = `
You are BaseBot, a friendly AI financial advisor for families.
Your role is to:
- Help families understand their spending
- Provide budget recommendations
- Teach financial literacy to children
- Be encouraging and supportive
- Never provide investment or legal advice
`;

const BASEBOT_CONFIG = {
  model: "gpt-4",
  temperature: 0.7,
  maxTokens: 500,
  contextWindow: 5 // Last 5 messages
};
```

### Mock Mode (Without OpenAI API)

For development without an OpenAI API key, BaseBot uses rule-based responses:

```typescript
// backend/src/services/basebot.mock.ts
const MOCK_RESPONSES = {
  spending: "Based on your recent transactions, you've spent ${amount} on {category} this month.",
  budget: "Your current budget for {category} is ${amount}. You've used {percentage}% so far.",
  tips: "Here are some tips for saving on {category}..."
};
```

Set in `.env`:
```env
OPENAI_API_KEY=mock
```

### Testing BaseBot

**Test Queries**:

1. **Data Queries**:
   - "How much have we spent this month?"
   - "What's our current balance?"
   - "Show me grocery expenses"

2. **Analysis**:
   - "What are our top 3 expense categories?"
   - "Are we on track with our budget?"
   - "Compare this month to last month"

3. **Recommendations**:
   - "How can we reduce our food costs?"
   - "Should we adjust our entertainment budget?"
   - "Give me savings tips"

4. **Educational**:
   - "Explain what a budget is" (for children)
   - "Why is saving important?"
   - "How do I earn more allowance?"

**Expected Behavior**:
- Response time: 1-3 seconds
- Responses reference actual family data
- Follow-up questions maintain context
- Age-appropriate language for child accounts

### Extending BaseBot

#### Add New Capabilities

```typescript
// backend/src/services/basebot.service.ts

async function detectIntent(query: string): string {
  if (query.includes("predict") || query.includes("forecast")) {
    return "FORECAST";
  }
  // Add more intent detection
}

async function handleForecast(familyId: string): Promise<string> {
  // Implement forecasting logic
  const transactions = await getRecentTransactions(familyId);
  const forecast = calculateForecast(transactions);
  return `Based on trends, you'll likely spend $${forecast} next month.`;
}
```

#### Customize Personality

```typescript
const BASEBOT_PERSONALITY = {
  tone: "friendly", // casual, professional, playful
  expertise: "medium", // beginner, medium, expert
  verbosity: "concise", // concise, balanced, detailed
  emoji: true // Use emojis in responses
};
```

#### Add Safety Filters

```typescript
const PROHIBITED_TOPICS = [
  "stock picks",
  "crypto investment",
  "legal advice",
  "tax evasion"
];

function validateQuery(query: string): boolean {
  return !PROHIBITED_TOPICS.some(topic => 
    query.toLowerCase().includes(topic)
  );
}
```

## 🔧 Extending the Prototype

### Adding New Features

#### 1. Add a New Transaction Category

**Backend** (`backend/prisma/schema.prisma`):
```prisma
enum TransactionCategory {
  GROCERIES
  ENTERTAINMENT
  EDUCATION
  TRANSPORTATION
  HEALTHCARE
  UTILITIES
  DINING_OUT
  SHOPPING
  SAVINGS
  INVESTMENTS  // New category
}
```

Run migration:
```bash
npx prisma migrate dev --name add-investments-category
```

**Frontend** (`frontend/src/constants/categories.ts`):
```typescript
export const CATEGORIES = [
  // ...existing categories
  { value: "INVESTMENTS", label: "Investments", icon: "📈" }
];
```

#### 2. Add Recurring Transactions

**Database Schema**:
```prisma
model RecurringTransaction {
  id          String   @id @default(uuid())
  familyId    String
  family      Family   @relation(fields: [familyId], references: [id])
  amount      Decimal
  category    TransactionCategory
  description String
  frequency   RecurrenceFrequency // DAILY, WEEKLY, MONTHLY
  nextDate    DateTime
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
}

enum RecurrenceFrequency {
  DAILY
  WEEKLY
  MONTHLY
  YEARLY
}
```

**API Endpoint** (`backend/src/routes/recurring.routes.ts`):
```typescript
router.post("/recurring", async (req, res) => {
  const { familyId, amount, category, description, frequency } = req.body;
  
  const recurring = await prisma.recurringTransaction.create({
    data: {
      familyId,
      amount,
      category,
      description,
      frequency,
      nextDate: calculateNextDate(frequency)
    }
  });
  
  res.json(recurring);
});
```

**Cron Job** (`backend/src/jobs/recurring.job.ts`):
```typescript
import cron from "node-cron";

// Run daily at midnight
cron.schedule("0 0 * * *", async () => {
  const due = await prisma.recurringTransaction.findMany({
    where: {
      active: true,
      nextDate: { lte: new Date() }
    }
  });
  
  for (const recurring of due) {
    await createTransaction(recurring);
    await updateNextDate(recurring);
  }
});
```

#### 3. Add Goal Tracking

**Create Goal Model**:
```prisma
model Goal {
  id          String   @id @default(uuid())
  familyId    String
  family      Family   @relation(fields: [familyId], references: [id])
  title       String
  description String?
  targetAmount Decimal
  currentAmount Decimal @default(0)
  deadline    DateTime?
  category    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**React Component** (`frontend/src/components/Goals.tsx`):
```typescript
export function GoalTracker() {
  const [goals, setGoals] = useState([]);
  
  return (
    <div className="goals">
      {goals.map(goal => (
        <GoalCard 
          key={goal.id}
          goal={goal}
          progress={(goal.currentAmount / goal.targetAmount) * 100}
        />
      ))}
    </div>
  );
}
```

#### 4. Add Export Functionality

**Export Service** (`backend/src/services/export.service.ts`):
```typescript
import { Parser } from "json2csv";

export async function exportTransactionsToCsv(familyId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { familyId },
    include: { user: true }
  });
  
  const fields = ["date", "amount", "category", "description", "user"];
  const parser = new Parser({ fields });
  const csv = parser.parse(transactions);
  
  return csv;
}
```

### Customizing the UI

#### Theme Customization

Edit `frontend/tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a8a"
        },
        accent: "#f59e0b"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    }
  }
};
```

#### Custom Components

Create reusable components in `frontend/src/components/ui/`:

```typescript
// frontend/src/components/ui/Card.tsx
export function Card({ title, children, actions }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {actions}
      </div>
      {children}
    </div>
  );
}
```

### API Integration

#### Adding External Services

**Plaid Integration** (Bank Account Linking):
```typescript
import { Configuration, PlaidApi } from "plaid";

const plaidClient = new PlaidApi(configuration);

export async function createLinkToken(userId: string) {
  const response = await plaidClient.linkTokenCreate({
    user: { client_user_id: userId },
    client_name: "FamFunds",
    products: ["transactions"],
    country_codes: ["US"],
    language: "en"
  });
  
  return response.data.link_token;
}
```

**Email Notifications** (SendGrid):
```typescript
import sgMail from "@sendgrid/mail";

export async function sendTransactionAlert(user, transaction) {
  const msg = {
    to: user.email,
    from: "noreply@famfunds.app",
    subject: "New Transaction Alert",
    html: `<p>A new transaction of $${transaction.amount} was recorded.</p>`
  };
  
  await sgMail.send(msg);
}
```

### Testing

#### Unit Tests

```typescript
// backend/src/services/__tests__/transaction.service.test.ts
import { createTransaction } from "../transaction.service";

describe("Transaction Service", () => {
  it("should create a transaction", async () => {
    const transaction = await createTransaction({
      familyId: "test-family-id",
      amount: 100,
      type: "EXPENSE",
      category: "GROCERIES"
    });
    
    expect(transaction.amount).toBe(100);
    expect(transaction.category).toBe("GROCERIES");
  });
  
  it("should update family balance", async () => {
    // Test balance update logic
  });
});
```

#### Integration Tests

```typescript
// backend/src/routes/__tests__/transactions.test.ts
import request from "supertest";
import app from "../../app";

describe("POST /api/transactions", () => {
  it("should create a new transaction", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        amount: 50,
        type: "EXPENSE",
        category: "GROCERIES",
        description: "Test transaction"
      });
    
    expect(response.status).toBe(201);
    expect(response.body.amount).toBe(50);
  });
});
```

#### E2E Tests

```typescript
// frontend/cypress/e2e/transaction-flow.cy.ts
describe("Transaction Flow", () => {
  it("should create and view a transaction", () => {
    cy.login("john.smith@example.com", "demo123");
    cy.visit("/dashboard");
    cy.get("[data-testid='add-transaction-btn']").click();
    cy.get("#amount").type("75.50");
    cy.get("#category").select("GROCERIES");
    cy.get("#description").type("Test transaction");
    cy.get("form").submit();
    cy.contains("Transaction created successfully");
  });
});
```

## 🚀 Future Enhancements

### Short-term (Next 3-6 months)

1. **Enhanced Security**
   - Two-factor authentication (2FA)
   - Biometric login (fingerprint/face ID)
   - Enhanced audit logging
   - Session management improvements

2. **Mobile Applications**
   - Native iOS app (React Native)
   - Native Android app (React Native)
   - Push notifications
   - Offline mode support

3. **Advanced Analytics**
   - Predictive spending forecasts
   - Anomaly detection (unusual transactions)
   - Spending pattern insights
   - Custom report builder

4. **Improved BaseBot**
   - Voice interaction support
   - Multi-language support
   - Proactive insights (weekly summaries)
   - Integration with financial education content

5. **Collaboration Features**
   - Transaction approval workflows
   - Family polls for major purchases
   - Shared shopping lists with budget tracking
   - Comments/discussions on transactions

### Medium-term (6-12 months)

6. **Bank Integration**
   - Plaid/Yodlee integration for account linking
   - Automatic transaction import
   - Real-time balance synchronization
   - Multi-account management

7. **Goal Management**
   - Savings goals with progress tracking
   - Automated goal contributions
   - Visual goal timelines
   - Milestone celebrations

8. **Smart Budgeting**
   - AI-powered budget suggestions
   - Automatic budget adjustments
   - Rollover unused budget
   - Zero-based budgeting option

9. **Receipt Management**
   - OCR for receipt scanning
   - Automatic data extraction
   - Receipt storage and search
   - Tax category tagging

10. **Allowance & Chores**
    - Chore assignment system
    - Automatic allowance distribution
    - Performance-based rewards
    - Educational gamification

### Long-term (12+ months)

11. **Investment Tracking**
    - Portfolio management
    - Real-time market data
    - Investment recommendations
    - Tax-loss harvesting alerts

12. **Bill Payment**
    - Bill reminder system
    - Integrated payment processing
    - Autopay management
    - Subscription tracking

13. **Financial Education**
    - Interactive learning modules
    - Age-appropriate content
    - Quizzes and achievements
    - Certifications

14. **Multi-Family Networks**
    - Connect with extended family
    - Gift pooling for special occasions
    - Lending/borrowing between families
    - Shared expense splitting (trips, gifts)

15. **Advanced AI Features**
    - Personalized financial coaching
    - Behavioral insights and nudges
    - Scenario planning ("What if?" analysis)
    - Natural language reporting

16. **Compliance & Legal**
    - COPPA compliance for children
    - Financial advisor access
    - Estate planning integration
    - Tax document generation

17. **White-Label Solution**
    - Customizable branding
    - Multi-tenancy architecture
    - Admin dashboard for organizations
    - Plugin marketplace

## 📁 Project Structure

```
base_family_app/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Auth, validation, etc.
│   │   ├── models/           # Database models (Prisma)
│   │   ├── utils/            # Helper functions
│   │   ├── jobs/             # Cron jobs
│   │   ├── seed.ts           # Database seeding
│   │   └── server.ts         # Entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── migrations/       # Migration files
│   ├── tests/                # Test files
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/           # Reusable UI components
│   │   │   ├── dashboard/    # Dashboard widgets
│   │   │   ├── transactions/ # Transaction components
│   │   │   └── basebot/      # BaseBot chat interface
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── context/          # React Context providers
│   │   ├── services/         # API client
│   │   ├── utils/            # Helper functions
│   │   ├── types/            # TypeScript types
│   │   ├── constants/        # App constants
│   │   ├── App.tsx           # Root component
│   │   └── main.tsx          # Entry point
│   ├── public/               # Static assets
│   ├── .env                  # Environment variables
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── docker-compose.yml        # Docker services
├── .gitignore
├── README.md                 # This file
└── LICENSE
```

## 🤝 Contributing

We welcome contributions to improve FamFunds! Here's how you can help:

### Development Workflow

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/base_family_app.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Test your changes**
   ```bash
   # Backend tests
   cd backend && npm test
   
   # Frontend tests
   cd frontend && npm test
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add recurring transactions feature"
   ```

6. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- **TypeScript**: Use strict mode, avoid `any` types
- **Naming**: camelCase for variables, PascalCase for components
- **Comments**: Explain "why", not "what"
- **Functions**: Keep functions small and focused
- **Imports**: Group by external, internal, relative

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test additions or updates
- `chore:` Build process or auxiliary tool changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

If you encounter any issues or have questions:

- **GitHub Issues**: [Create an issue](https://github.com/Zackmendel/base_family_app/issues)
- **Documentation**: Check this README and inline code comments
- **Community**: Join discussions in GitHub Discussions

---

## 🙏 Acknowledgments

- OpenAI for GPT-4 API powering BaseBot
- Prisma team for excellent ORM
- React and Vite communities
- All open-source contributors

---

**Built with ❤️ for families managing finances together**
