import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import TextButton from '../components/TextButton';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '../utils/routes';

export default function Home() {
  const [option, setOption] = useState('Today');
  const navigation = useNavigation();
  
  const createHabit = () =>{
    navigation.navigate(SCREENS.CreateHabit);
  }
  return (
    <View style={{flex:1, backgroundColor: COLORS.white}}>
      <View style={styles.iconContainer}>
        <Ionicons name='logo-foursquare' size={24} color={COLORS.black} />
        <Text style={styles.text}>Habit Tracking App</Text>
        <AntDesign name='plus' size={24} color={COLORS.black} onPress={createHabit}/>
      </View>
      <View style={styles.buttonContainer}>
        <TextButton
          title='Today'
          backgroundColor={option === "Today" ? COLORS.primary : COLORS.gray300}
          onPress={() => setOption('Today')}

        />
        <TextButton
          title='Weekly'
          backgroundColor={option === "Weekly" ? COLORS.secondary : COLORS.gray300}
          onPress={() => setOption('Weekly')}
        />
        <TextButton
          title='Overall'
          backgroundColor={option === "Overall" ? COLORS.success : COLORS.gray300}
          onPress={() => setOption('Overall')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(10),
    marginHorizontal: scale(10),
    alignItems:'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: scale(20)
  },
  text: {
    fontSize: scale(20),
    fontWeight: 'bold',
    textAlign: 'center',
  }
})