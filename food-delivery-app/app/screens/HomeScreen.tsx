import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import InputWithLabel from '../components/InputWithLabel';

export default function HomeScreen() {
  const [restaurantName, setRestaurantName] = useState('');

  return (
    <SafeAreaView>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <InputWithLabel
            label=''
            placeholder='Restaurants'
            secureTextEntry={false}
            value={restaurantName}
            onChangeText={setRestaurantName}
            leftIcon={<EvilIcons name="search" size={20} color="black" />}
            rightIcon={
              <View style={styles.rightLocationIcon}>
                <FontAwesome name="map-marker" size={20} color="black" />
                <Text style={{ marginLeft: 4 }}>New York, NYC</Text>
              </View>
            }
            onRightIconPress={() => console.log("Mic pressed")}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(10)
  },
  searchBar: {
    flexDirection: 'row'
  },
  rightLocationIcon:{
    flexDirection:'row',
    gap: scale(4)
  },

})