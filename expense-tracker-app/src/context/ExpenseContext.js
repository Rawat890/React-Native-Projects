import { createContext, useContext, useState } from "react";
import { getCategoryColor, getDate, getId } from "../utils/helper";

export const ExpenseContext = createContext(null);

export const ExpenseContextProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);

  const addExpense = (expense) =>{
    const newExpense = {
      id: getId(),
      title: expense.title,
      amount: Number(expense.amount),
      category: expense.category.name,
      date: getDate(),
      color: getCategoryColor(expense.category.color),
      icon: expense.category.icon,
      description: expense.description
    }

    //update the list
    setExpenses([...expenses, newExpense]);
  }

  const deleteExpense = (expense) =>{
    const newExpenses = expenses.filter((item)=>item.id!==expense.id);

    //update the list
    setExpenses(newExpenses);
  }
  
  return (
    <ExpenseContext.Provider value={{ expenses, setExpenses, addExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);