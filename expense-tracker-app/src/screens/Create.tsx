import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedInput from '../components/AnimatedInput';
import { showError } from '../components/Notification';
import { useExpenses } from '../context/ExpenseContext';
import { COLORS } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { CATEGORIES } from '../utils/helper';
import Category from './Category';

const Create = () => {
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  console.log(selectedCategory)
  const { addExpense } = useExpenses();

  const handleAddExpense = () => {
    if (!amount || !title) {
      showError("Title and amount are required");
      return;
    }

    if (title.length <= 10) {
      showError("Please enter atleast 10 characters.");
      return;
    }

    if (Number(amount) < 0) {
      showError("Expense amount must be greater than 0.")
      return;
    }

    addExpense({
      title: title,
      amount: amount,
      category: selectedCategory,
      note: note
    })
    setAmount('');
    setTitle('');
    setNote('');
  }
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>Enter the details of your expenses to help you track your daily spendings</Text>
        <View style={styles.inputWrapper}>
          <AnimatedInput
            label='Enter amount'
            value={amount}
            onChangeText={setAmount}
            placeholder='$0.00'
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainer}
            textStyle={styles.textStyle}
            keyboardType='numeric'
          />
          <AnimatedInput
            label='Title'
            value={title}
            onChangeText={setTitle}
            placeholder='What was this for ?'
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainer}
            textStyle={styles.textStyle}
          />
          <AnimatedInput
            label='Enter description'
            value={note}
            onChangeText={setNote}
            placeholder='Enter description of the expense'
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainer}
            textStyle={styles.textStyle}
          />
          <Pressable style={styles.category} onPress={() => setModalVisible(true)}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>Category</Text>
            </View>
            <View style={styles.categoryInnerView}>
              <Text style={styles.icon}>{selectedCategory.icon}</Text>
              <Text style={styles.expenseType}>{selectedCategory.name}</Text>
            </View>
          </Pressable>

          <AnimatedButton
            title='Add Expense'
            onPress={handleAddExpense}
            inputContainerStyle={styles.buttonContainer}
            titleStyle={styles.buttonTitle}
          />
        </View>
      </View>
      <Category
        modalVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={(item) => setSelectedCategory(item)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: scale(10),
    marginTop: scale(20)
  },
  inputContainer: {
    padding: scale(15),
  },
  labelStyle: {
    fontSize: scale(16),
    fontFamily: fonts.balooMedium
  },
  textStyle: {
    fontSize: scale(14),
    fontFamily: fonts.balooMedium
  },
  header: {
    fontFamily: fonts.balooMedium,
    fontSize: scale(16),
    marginHorizontal: scale(12)
  },
  expenseImage: {
    width: scale(30),
    height: scale(30),
  },
  category: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: scale(10),
    padding: scale(20),
    position: 'relative',
    marginTop: scale(10)
  },
  labelContainer: {
    position: 'absolute',
    top: -scale(12),
    left: scale(15),
    backgroundColor: COLORS.white,
    paddingHorizontal: scale(6),
  },
  labelText: {
    fontSize: scale(16),
    fontFamily: fonts.balooSemi
  },
  expenseType: {
    fontSize: scale(16),
    fontFamily: fonts.balooSemi
  },
  categoryInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10)
  },
  buttonContainer: {
    backgroundColor: COLORS.black,
    padding: scale(20),
    borderWidth: 1,
    elevation: 2,
    marginTop: scale(25),
    borderRadius: scale(10)
  },
  buttonTitle: {
    color: COLORS.white,
    fontSize: scale(18),
    fontFamily: fonts.balooSemi,
    textAlign: 'center'
  },
  icon: {
    fontSize: scale(25)
  }
})
export default Create