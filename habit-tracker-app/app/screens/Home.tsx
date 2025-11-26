import { View, Text, StyleSheet, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import TextButton from '../components/TextButton';
import { scale } from 'react-native-size-matters';
import { SCREENS } from '../utils/routes';
import { navigate } from '../utils/navigationService';
import axios from 'axios';

export default function Home() {
  const [option, setOption] = useState('Today');
  const [habits, setHabits] = useState([]);

  useEffect(()=>{
  fetchHabitsList();
  }, []);
  
  const fetchHabitsList = async ()=>{
    try {
      const response = await axios.get('http://192.168.29.24:3000/habitsList');

      if (response.status===200) {
        setHabits(response.data);;
        console.log('Habits - ', habits)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch the habits list.")
    }
  }

  console.log(habits)
  const createHabit = () => {
    navigate(SCREENS.CreateHabit);
  }
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.iconContainer}>
        <Ionicons name='logo-foursquare' size={24} color={COLORS.black} />
        <Text style={styles.text}>Habit Tracking App</Text>
        <AntDesign name='plus' size={24} color={COLORS.black} onPress={createHabit} />
      </View>
      <View style={styles.buttonContainer}>
        <TextButton
          title='Today'
          backgroundColor={option === "Today" ? COLORS.primary : COLORS.gray300}
          onPress={() => setOption('Today')}
          textStyle={styles.textButton}
        />
        <TextButton
          title='Weekly'
          backgroundColor={option === "Weekly" ? COLORS.secondary : COLORS.gray300}
          onPress={() => setOption('Weekly')}
          textStyle={styles.textButton}


        />
        <TextButton
          title='Overall'
          backgroundColor={option === "Overall" ? COLORS.success : COLORS.gray300}
          onPress={() => setOption('Overall')}
          textStyle={styles.textButton}

        />
      </View>

      {
        option === "Today" && 
        habits.length > 0? (
          <View style={styles.habitsContainer}>
            {habits.map((habit, index)=>(
              <TextButton
                key={index}
                backgroundColor={habit.color ? habit.color : COLORS.secondary}
                title={habit.title}
                style={styles.habitStyle}
              />
            ))}
          </View>
        ) :(
          <View style={styles.noHabitContainer}>
            <Image style={{width: 60, height: 60, resizeMode: 'contain'}}
            source={require('../../assets/icons/empty.png')}
            />
            <Text>No habits scheduled today</Text>
          </View>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(10),
    marginHorizontal: scale(10),
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: scale(20)
  },
  text: {
    fontSize: scale(16),
    fontWeight: '600',
    textAlign: 'center',
  },
  textButton: {
    fontSize: scale(11)
  },
  habitStyle:{
    marginVertical: scale(5),
    marginHorizontal: scale(10),
    borderRadius: scale(25)
  },
  habitsContainer:{
    marginTop: scale(15),
  },
  noHabitContainer:{
    flex:1,
    justifyContent:'center',
     alignItems:'center',
     marginTop: scale(-50),
  }
})