import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import { COLORS } from '../utils/colors';

export const toastConfig = {
  success: ({ text1 }: any) => (
    <View style={[styles.container, styles.success]}>
      <Text style={styles.text}>{text1}</Text>
    </View>
  ),

  error: ({ text1 }: any) => (
    <View style={[styles.container, styles.error]}>
      <Text style={styles.text}>{text1}</Text>
    </View>
  ),

  info: ({ text1 }: any) => (
    <View style={[styles.container, styles.info]}>
      <Text style={styles.text}>{text1}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    padding: scale(14),
    borderRadius: scale(10),
    marginTop: scale(10),
    elevation: 3,
  },
  text: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },

  success: {
    backgroundColor: COLORS.green,
  },
  error: {
    backgroundColor: COLORS.red
  },
  info: {
    backgroundColor: COLORS.blue
  },
});

export const showSuccess = (message: string) => {
  Toast.show({
    type: 'success',
    text1: message,
  });
};

export const showError = (message: string) => {
  Toast.show({
    type: 'error',
    text1: message,
  });
};

export const showInfo = (message: string) => {
  Toast.show({
    type: 'info',
    text1: message,
  });
};