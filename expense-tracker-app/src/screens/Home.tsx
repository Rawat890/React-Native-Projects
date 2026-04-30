import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import AnimatedButton from "../components/AnimatedButton";
import EmptyList from '../components/EmptyList';
import { useExpenses } from '../context/ExpenseContext';
import { COLORS } from '../utils/colors';
import { fonts } from '../utils/fonts';

const Home = () => {
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { expenses, setExpenses } = useExpenses();
  console.log("Expense are - ", expenses);

  const totalSpentExpense = expenses.reduce((sum, item) => item.amount + sum, 0)

  useEffect(() => {
    const getData = async () => {
      try {
        const storedExpenses = await AsyncStorage.getItem("expensesList");
        if (storedExpenses !== null) {
          setExpenses(JSON.parse(storedExpenses))
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false);
      }
    }
    getData();
  }, [setExpenses])

  useEffect(() => {
    const saveExpense = async () => {
      if (!isLoading) {
        try {
          await AsyncStorage.setItem("expensesList", JSON.stringify(expenses));
        } catch (error) {
          console.log(error)
        }
      }
    }
    saveExpense();
  }, [expenses, isLoading]);

  const handleDeleteExpense = async (id: string) => {
    try {
      const updatedExpenses = expenses.filter((item) => item.id !== id);
      setExpenses(updatedExpenses);
    } catch (error) {
      console.log(error)
    }
  }


  const renderExpense = ({ item, index }) => {
    console.log("Item - ", item)
    return (
      <View style={[styles.expenseItem, { borderLeftWidth: 4, borderLeftColor: item.color }]}>
        <View style={styles.expenseItemInnerView}>
          <Text style={styles.expenseImage}>{item.icon}</Text>

          <View style={styles.expenseInfo}>
            <Text style={styles.expenseName}>{item.title}</Text>
            <Text style={[styles.expenseType, { backgroundColor: item.color }]}>{item.category}</Text>
          </View>

          <View style={styles.expenseAmount}>
            <Text style={[styles.expense, { color: item.color }]}>${item.amount}</Text>
            <Text style={styles.created}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <AnimatedButton
            title="Update expense"
            titleStyle={styles.buttonTitle}
            inputContainerStyle={styles.updateButton}
          />
          <AnimatedButton
            title="Delete expense"
            onPress={() => handleDeleteExpense(item.id)}
            titleStyle={styles.buttonTitle}
            inputContainerStyle={styles.deleteButton}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Text style={styles.user}>Hi, User</Text>
        <Text style={styles.startText}>Start tracking your daily expenses</Text>
        <View style={styles.totalView}>
          <Text style={styles.spentText}>Spent so far</Text>
          <Text style={styles.total}>${totalSpentExpense.toFixed(2)}</Text>
        </View>
        <FlatList
          data={expenses}
          keyExtractor={item => item.id}
          ListEmptyComponent={EmptyList}
          renderItem={renderExpense}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: scale(10),
  },
  inputContainer: {
    padding: scale(8),
    marginVertical: scale(10)
  },
  labelStyle: {
    fontSize: scale(14),
    fontFamily: fonts.balooMedium
  },
  user: {
    fontSize: scale(14),
    fontFamily: fonts.balooMedium
  },
  startText: {
    fontSize: scale(14),
    fontFamily: fonts.balooMedium
  },
  expenseItem: {
    elevation: 2,
    borderRadius: scale(5),
    backgroundColor: COLORS.background,
    padding: scale(10),
    marginVertical: scale(5),
  },
  expenseItemInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expenseImage: {
    fontSize: scale(30)
  },
  expenseType: {
    elevation: 2,
    fontSize: scale(16),
    fontFamily: fonts.balooMedium,
    padding: scale(5),
    color: COLORS.white,
    alignSelf: 'flex-start',
    borderRadius: scale(5),
    minWidth: scale(50),
    marginVertical: scale(5),
    textAlign: 'center',
  },
  expenseInfo: {
    width: '50%',
    marginLeft: scale(15)
  },
  expenseName: {
    fontSize: scale(18),
    fontFamily: fonts.balooSemi
  },
  expense: {
    fontSize: scale(18),
    fontFamily: fonts.balooExtraBold
  },
  created: {
    fontSize: scale(14),
    fontFamily: fonts.balooMedium
  },
  totalView: {
    padding: scale(15),
    backgroundColor: COLORS.black,
    borderRadius: scale(10),
    marginVertical: scale(10)
  },
  spentText: {
    color: COLORS.white,
    fontSize: scale(18),
    textAlign: 'center',
    fontFamily: fonts.balooMedium
  },
  total: {
    color: COLORS.white,
    fontSize: scale(26),
    fontFamily: fonts.balooBold,
    textAlign: 'center'
  },
  expenseAmount: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: scale(10),
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginTop: scale(20),
  },
  updateButton: {
    backgroundColor: COLORS.green,
    padding: scale(10),
    borderRadius: scale(5),
    marginBottom: scale(10),
  },
  deleteButton: {
    backgroundColor: COLORS.red,
    padding: scale(10),
    borderRadius: scale(5),
    marginBottom: scale(10),
  },
  buttonTitle: {
    fontFamily: fonts.balooBold,
    fontSize: scale(14),
    color: COLORS.white,
    textAlign: 'center'
  }

})
export default Home