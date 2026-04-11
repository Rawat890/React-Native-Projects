import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { authService } from '../firebase/authService';
import InputWithLabel from '../components/InputWithLabel';
import ButtonWithLabel from '../components/ButtonWithLabel';
import WaveLoader from '../components/WaveLoader';
import { COLORS } from '../utils/colors';
import { signupSchema } from '../utils/schemas/signUpSchema';
import { reset } from '../utils/navigationService';
import { scale } from 'react-native-size-matters';
import { emailIcon, lockIcon } from '../utils/images';
import { fonts } from '../utils/fonts';

const SignUpScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [firebaseError, setFirebaseError] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: yupResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setFirebaseError('');
      setLoading(true);
      await authService.signUp(data.name, data.email, data.password);
      setLoading(false);
      setShowLoader(true);
      setTimeout(() => { reset('HomeTabs'); }, 1800);
    } catch (e: any) {
      setLoading(false);
      setFirebaseError(e?.message ?? 'Sign up failed');
    }
  };

  if (showLoader) {
    return (
      <View style={styles.loaderScreen}>
        <WaveLoader loading size={80} color={COLORS.primary} secondaryColor={COLORS.secondary} ringColor={COLORS.primary} backgroundColor={COLORS.white} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <Text style={styles.loginLabel}>SIGN UP</Text>
          <Text style={styles.title}>Healthcare</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.card}>
          <Controller control={control} name="name" render={({ field: { onChange, value } }) => (
            <InputWithLabel label="Full Name" placeholder="Enter your name" value={value} onChangeText={onChange} secureTextEntry={false} error={errors.name?.message} />
          )} />

          <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
            <InputWithLabel label="Email" placeholder="Enter email" value={value} onChangeText={onChange} secureTextEntry={false} error={errors.email?.message} keyboardType="email-address" icon={emailIcon} />
          )} />

          <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
            <InputWithLabel label="Password" placeholder="Create password" value={value} onChangeText={onChange} secureTextEntry error={errors.password?.message} icon={lockIcon} />
          )} />

          {firebaseError ? <Text style={styles.fbError}>{firebaseError}</Text> : null}

          <View style={{ marginTop: scale(15) }}>
            <ButtonWithLabel title="REGISTER" onPress={handleSubmit(onSubmit)} loading={loading} backgroundColor={COLORS.splash} textStyle={styles.buttonText} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(350).duration(500)} style={styles.loginRow}>
          <Text style={styles.loginLabel2}>Already have an account: </Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}>Click to login</Text>
          </Pressable>
        </Animated.View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  loaderScreen: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: scale(24),
    paddingTop: scale(70),
    paddingBottom: scale(40),
  },

  header: {
    alignItems: 'center',
    marginBottom: scale(32),
  },

  loginLabel: {
    fontSize: scale(16),
    fontFamily: fonts.balooExtraBold,
    fontWeight: '600',
    color: COLORS.black,
    letterSpacing: scale(2.5),
    marginBottom: scale(16),
  },
  title: {
    fontSize: scale(36),
    fontFamily: fonts.balooExtraBold,
    color: COLORS.black,
    letterSpacing: scale(0.3),
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: scale(16),
    padding: scale(2),
  },
  fbError: {
    color: COLORS.danger,
    fontSize: scale(12),
    marginBottom: scale(12),
    textAlign: 'center',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scale(28),
  },
  loginLabel2: {
    color: COLORS.black,
    fontSize: scale(14),
    fontFamily: fonts.balooExtraBold,
  },
  loginLink: {
    color: COLORS.darkBlue,
    fontSize: scale(14),
    fontFamily: fonts.balooExtraBold,
  },
  buttonText: {
    fontFamily: fonts.balooExtraBold,
    fontSize: scale(20),
  }
});

export default SignUpScreen;