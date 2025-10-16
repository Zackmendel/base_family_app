# Dashboard Components

This directory contains reusable UI components for the FamFunds family dashboard, built with TailwindCSS and Framer Motion.

## Components

### FamilyCard

A card component to display family member information with avatar, role, balance, and spending status.

#### Props

```typescript
interface FamilyCardProps {
  data: FamilyCardData;
  className?: string;
  onClick?: (id: string) => void;
  onEdit?: (id: string) => void;
  onToggleStatus?: (id: string, isActive: boolean) => void;
}

interface FamilyCardData {
  id: string;
  name: string;
  role: "parent" | "child" | "guardian";
  avatar?: string;
  balance: number;
  spendLimit: number;
  isActive: boolean;
}
```

#### Features

- Display member avatar (or initials if no avatar provided)
- Show member name, role, and current balance
- Visual progress bar showing spending vs limit
- Status indicator (active/inactive)
- Interactive buttons for editing and toggling status
- Smooth animations on hover and interactions

#### Example Usage

```tsx
import { FamilyCard } from "@/components";

const memberData = {
  id: "1",
  name: "John Doe",
  role: "parent",
  balance: 750.50,
  spendLimit: 1000,
  isActive: true,
};

<FamilyCard
  data={memberData}
  onClick={(id) => console.log("Clicked:", id)}
  onEdit={(id) => console.log("Edit:", id)}
  onToggleStatus={(id, status) => console.log("Toggle:", id, status)}
/>
```

---

### SpendChart

A visualization component for displaying spending data across categories with animated progress bars.

#### Props

```typescript
interface SpendChartProps {
  data: SpendChartData;
  className?: string;
  onCategoryClick?: (category: string) => void;
}

interface SpendChartData {
  categories: {
    name: string;
    amount: number;
    color: string;
  }[];
  totalSpent: number;
  totalBudget: number;
  period: "daily" | "weekly" | "monthly";
}
```

#### Features

- Overall spending progress with visual status indicators
- Category breakdown with color-coded progress bars
- Interactive category items (clickable)
- Percentage calculations for each category
- Empty state with helpful message
- Smooth animations for data visualization

#### Example Usage

```tsx
import { SpendChart } from "@/components";
import { CATEGORY_COLORS } from "@/lib/constants";

const chartData = {
  categories: [
    { name: "food", amount: 450.75, color: CATEGORY_COLORS.food },
    { name: "transport", amount: 125.50, color: CATEGORY_COLORS.transport },
  ],
  totalSpent: 576.25,
  totalBudget: 1500.00,
  period: "monthly",
};

<SpendChart
  data={chartData}
  onCategoryClick={(category) => console.log("Category:", category)}
/>
```

---

### SpendControl

A control panel component for managing and adjusting spending limits for family members.

#### Props

```typescript
interface SpendControlProps {
  data: SpendControlData;
  className?: string;
  onLimitChange?: (
    memberId: string,
    period: "daily" | "weekly" | "monthly",
    newLimit: number
  ) => void;
  onPeriodChange?: (
    memberId: string,
    period: "daily" | "weekly" | "monthly"
  ) => void;
}

interface SpendControlData {
  memberId: string;
  memberName: string;
  currentSpending: number;
  dailyLimit?: number;
  weeklyLimit?: number;
  monthlyLimit?: number;
  period: "daily" | "weekly" | "monthly";
}
```

#### Features

- Toggle between daily, weekly, and monthly periods
- Visual spending progress with status colors
- Inline editing of spending limits
- Real-time percentage calculations
- Status messages for spending levels
- Animated transitions between states

#### Example Usage

```tsx
import { SpendControl } from "@/components";

const controlData = {
  memberId: "3",
  memberName: "Emma Johnson",
  currentSpending: 140.50,
  dailyLimit: 20.00,
  weeklyLimit: 75.00,
  monthlyLimit: 200.00,
  period: "weekly",
};

<SpendControl
  data={controlData}
  onLimitChange={(id, period, limit) => console.log("Limit:", id, period, limit)}
  onPeriodChange={(id, period) => console.log("Period:", id, period)}
/>
```

---

## Shared Utilities

### Constants

- `CATEGORY_COLORS`: Predefined colors for spending categories
- `ROLE_LABELS`: Display labels for family member roles
- `ROLE_COLORS`: Color classes for role badges

### Utility Functions

- `formatCurrency(amount, currency)`: Format numbers as currency
- `getInitials(name)`: Extract initials from a name
- `calculatePercentage(value, total)`: Calculate percentage
- `getStatusColor(percentage)`: Get status color based on percentage

### Types

All TypeScript interfaces are available in `@/lib/types`.

---

## Mock Data

Mock data for testing and development is available in `@/lib/mockData`:

- `mockFamilyMembers`: Array of family member data
- `mockSpendChartData`: Sample spending chart data
- `mockSpendControlData`: Sample spending control data
- `mockEmptySpendChartData`: Empty state data

---

## Styling Guidelines

All components follow these conventions:

- Use Tailwind utility classes for styling
- Support dark mode with `dark:` prefix
- Include responsive design considerations
- Use Framer Motion for animations
- Follow the color palette from `@/lib/theme`

---

## Accessibility

All components include:

- Semantic HTML elements
- ARIA labels for icon buttons
- Keyboard navigation support
- Focus states for interactive elements
- Color contrast compliance

---

## Demo

See the dashboard demo page at `/dashboard` for a live example of all components in action.
