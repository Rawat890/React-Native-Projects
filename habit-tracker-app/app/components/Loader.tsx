import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { scale } from 'react-native-size-matters';
import { COLORS } from '../utils/colors';

interface LoaderProps {
  visible: boolean;
  text?: string;
  size?: 'small' | 'large';
  color?: string;
  backgroundColor?: string;
  textStyle?: object;
}

const Loader: React.FC<LoaderProps> = ({
  visible,
  text = 'Loading...',
  size = 'large',
  color = COLORS.primary,
  backgroundColor = 'rgba(0,0,0,0.4)',
  textStyle = {},
}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={[styles.overlay, { backgroundColor }]}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={size} color={color} />
          {text ? <Text style={[styles.text, textStyle]}>{text}</Text> : null}
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    backgroundColor: COLORS.white,
    padding: scale(20),
    borderRadius: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: {
    marginTop: scale(10),
    fontSize: scale(14),
    fontWeight: '500',
    color: COLORS.black,
    textAlign: 'center',
  },
});
