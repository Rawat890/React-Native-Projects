import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { scale } from 'react-native-size-matters'
import AnimatedInput from '../components/AnimatedInput'
import { COLORS } from '../utils/colors'
import { fonts } from '../utils/fonts'

const Register = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <AnimatedInput
          label='First name'
          value={firstName}
          onChangeText={setFirstName}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.labelStyle}
          placeholder='Enter first name'
        />
        <AnimatedInput
          label='Last name'
          value={lastName}
          onChangeText={setLastName}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.labelStyle}
          placeholder='Enter last name'
        />
        <AnimatedInput
          label='Email'
          value={email}
          onChangeText={setEmail}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.labelStyle}
          placeholder='Enter email'
        />
        <AnimatedInput
          label='Password'
          value={password}
          onChangeText={setPassword}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.labelStyle}
          placeholder='Enter password'
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:COLORS.white
  },
  inputWrapper:{
    marginHorizontal: scale(10),
  },
  inputContainer: {
    padding: scale(8),
    marginVertical: scale(10)
  },
  labelStyle: {
    fontSize: scale(14),
    fontFamily: fonts.balooMedium
  }
})

export default Register