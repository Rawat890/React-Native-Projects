import { COLORS } from "./colors";

export const EXPENSE_COLORS = [
  "#FF3B30",
  "#34C759",
  "#007AFF",
  "#FFCC00",
  "#FF9500",
];

export const CATEGORIES = [
  {
    id: 1,
    name: "Food",
    label: "Food and snacks",
    icon: "🍔",
    color: COLORS.blueTint,
  },
  {
    id: 2,
    name: "Gym and Exercise",
    label: "Gym",
    icon: "🏋️",
    color: COLORS.red,
  },
  {
    id: 3,
    name: "Books",
    label: "Books",
    icon: "📚",
    color: COLORS.accentSoft,
  },
  {
    id: 4,
    name: "Daily Use",
    label: "Daily uses",
    icon: "🧴",
    color: COLORS.green,
  },
  {
    id: 5,
    name: "Clothes",
    label: "Clothes",
    icon: "👕",
    color: COLORS.blueSoft,
  },
  {
    id: 6,
    name: "Bills/Utilities",
    label: "Bills/Utilities",
    icon: "💡",
    color: COLORS.green,
  },
  {
    id: 7,
    name: "Entertainment",
    label: "Entertainment",
    icon: "🎬",
    color: COLORS.border,
  },
  {
    id: 8,
    name: "Shopping",
    label: "Shopping",
    icon: "🛍️",
    color: COLORS.green,
  },
  { id: 9, name: "Travel", label: "Travel", icon: "✈️", color: COLORS.green },
  {
    id: 10,
    name: "Phone/Internet",
    label: "Phone/Internet",
    icon: "📱",
    color: COLORS.green,
  },
  { id: 11, name: "Fuel", label: "Fuel", icon: "⛽", color: COLORS.green },
  {
    id: 12,
    name: "Education",
    label: "Education",
    icon: "🎓",
    color: COLORS.green,
  },
  {
    id: 13,
    name: "Transfer",
    label: "Transfer",
    icon: "💸",
    color: COLORS.green,
  },
  { id: 14, name: "Transportation", label: "Transportation", icon: "🚌" },
  {
    id: 15,
    name: "Housing",
    label: "Housing",
    icon: "🏠",
    color: COLORS.green,
  },
  {
    id: 16,
    name: "Miscellaneous",
    label: "Miscellaneous",
    icon: "📦",
    color: COLORS.green,
  },
];

export const getId = () => {
  return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
};

export const getDate = () => {
  return new Date().toLocaleDateString("en-GB");
};

export const getCategoryColor = (color: string) => {
  const category = CATEGORIES.find((cat) => cat.color === color);
  return category ? category.color : COLORS.white;
};

export const processDataForChart = (expenses) => {
  if (!Array.isArray(expenses) || EXPENSE_COLORS.length === 0) {
    return [];
  }

  const totalSpending = expenses.reduce(
    (acc, expense) => acc + expense.amount,
    0,
  );

  if (totalSpending === 0) {
    return [];
  }

  const spendingByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const pieChartData = Object.keys(spendingByCategory).map((categoryName) => {
    const amount = spendingByCategory[categoryName];
    const percentage = Math.round((amount / totalSpending) * 100);
    const categoryInfo = CATEGORIES.find((cat) => cat.name === categoryName);

    return {
      name: categoryName,
      amount,
      value: percentage,
      color: categoryInfo?.color || COLORS.white,
      text: `${percentage}%`,
    };
  });
  return pieChartData;
};
