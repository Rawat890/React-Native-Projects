import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import EmptyList from '../components/EmptyList';
import { COLORS } from '../utils/colors';
import { dummyData } from '../utils/dummyData';
import { fonts } from '../utils/fonts';
import { EXPENSE_COLORS } from '../utils/helper';

const Home = () => {
  const [text, setText] = useState<string>('');
  const [expenses, setExpenses] = useState([]);

  const totalSpentExpense = dummyData.reduce((sum, item) => item.expense + sum, 0)
  console.log("Total - ", totalSpentExpense)

  const renderExpense = ({ item, index }) => {
    const color = EXPENSE_COLORS[index % EXPENSE_COLORS.length];

    return (
      <View style={[styles.expenseItem, { borderLeftWidth: 4, borderLeftColor: color }]}>
        <Text style={styles.expenseImage}>{item.icon}</Text>

        <View style={styles.expenseInfo}>
          <Text style={styles.expenseName}>{item.title}</Text>
          <Text style={[styles.expenseType, { backgroundColor: color }]}>{item.type}</Text>
        </View>

        <View>
          <Text style={[styles.expense, { color }]}>${item.expense}</Text>
          <Text style={styles.created}>{item.dated}</Text>
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
          data={dummyData}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  expenseImage: {
    fontSize: scale(30)
  },
  expenseType: {
    elevation: 2,
    fontSize: scale(14),
    fontFamily: fonts.balooMedium,
    padding: scale(5),
    color: COLORS.white,
    alignSelf: 'flex-start',
    borderRadius: scale(5),
    marginVertical: scale(5)
  },
  expenseInfo: {
    width: '50%',
  },
  expenseName: {
    fontSize: scale(14),
    fontFamily: fonts.balooSemi
  },
  expense: {
    fontSize: scale(14),
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
  }

})
export default Home