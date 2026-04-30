import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { scale } from 'react-native-size-matters';
import { useExpenses } from '../context/ExpenseContext';
import { COLORS } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { processDataForChart } from '../utils/helper';
const Insights = () => {
  const { expenses } = useExpenses();

  const chartData = processDataForChart(expenses)

  const renderData = ({ item }) => {
    console.log(item)
    return (
      <View>
        <View style={styles.dot} />
        <Text>{item.category}</Text>
      </View>

    )
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending summary</Text>
      <View style={styles.chartView}>
        <PieChart donut data={chartData} showText textColor={COLORS.black} innerRadius={50} />
      </View>
      <FlatList
        data={expenses}
        renderItem={renderData}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  chartView: {
    flex: 1,
    alignItems: 'center',
    marginTop: scale(20),
  },
  title: {
    fontFamily: fonts.balooBold,
    fontSize: scale(32),
    textAlign: 'center'
  }
})
export default Insights