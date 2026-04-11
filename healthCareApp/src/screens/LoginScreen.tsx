import React, { useState } from 'react';
import {
  Image, KeyboardAvoidingView, Platform, Pressable, ScrollView,
  StyleSheet, Text, View,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { authService } from '../firebase/authService';
import InputWithLabel from '../components/InputWithLabel';
import ButtonWithLabel from '../components/ButtonWithLabel';
import WaveLoader from '../components/WaveLoader';
import { COLORS } from '../utils/colors';
import { loginSchema } from '../utils/schemas/loginSchema';
import { reset } from '../utils/navigationService';
import { scale } from 'react-native-size-matters';
import { emailIcon, lockIcon } from '../utils/images';

const LoginScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [firebaseError, setFirebaseError] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setFirebaseError('');
      setLoading(true);
      await authService.signIn(data.email, data.password);
      setLoading(false);
      setShowLoader(true);
      setTimeout(() => { reset('HomeTabs'); }, 1800);
    } catch (e: any) {
      setLoading(false);
      setFirebaseError(e?.message ?? 'Login failed');
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

        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <Text style={styles.loginLabel}>LOGIN</Text>
          <Text style={styles.title}>Healthcare</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.card}>
          <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
            <InputWithLabel label="Email" placeholder="Enter email" value={value} onChangeText={onChange} secureTextEntry={false} error={errors.email?.message} keyboardType="email-address" icon={emailIcon}/>
          )} />

          <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
            <InputWithLabel label="Password" placeholder="Enter password" value={value} onChangeText={onChange} secureTextEntry error={errors.password?.message} icon={lockIcon} />
          )} />

          <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>

          {firebaseError ? <Text style={styles.fbError}>{firebaseError}</Text> : null}

          <ButtonWithLabel title="LOGIN" onPress={handleSubmit(onSubmit)} loading={loading} backgroundColor={COLORS.splash}/>
        </Animated.View>

        {/* Sign up link */}
        <Animated.View entering={FadeInUp.delay(350).duration(500)} style={styles.signupRow}>
          <Text style={styles.signupLabel}>Don't Have An Account: </Text>
          <Pressable onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}>Click here to register</Text>
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
    fontWeight: '600',
    color: COLORS.black,
    letterSpacing: scale(2.5),
    marginBottom: scale(6),
  },

  title: {
    fontSize: scale(36),
    fontWeight: '800',
    color: COLORS.black,
    marginTop: scale(15),
    letterSpacing: scale(0.3),
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: scale(16),
    padding: scale(2),
    borderColor: COLORS.black,
  },

  forgotRow: {
    alignItems: 'flex-end',
    marginTop: -scale(4),
    marginBottom: scale(20),
  },

  forgotText: {
    color: COLORS.darkBlue,
    fontSize: scale(12),
    fontWeight: '600'
  },

  fbError: {
    color: COLORS.danger,
    fontSize: scale(12),
    marginBottom: scale(12),
    textAlign: 'center',
  },

  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scale(28),
  },

  signupLabel: {
    color: COLORS.black,
    fontSize: scale(13),
    fontWeight: '700'
  },
  signupLink: {
    color: COLORS.darkBlue,
    fontSize: scale(13),
    fontWeight: '700',
  },
});

export default LoginScreen;