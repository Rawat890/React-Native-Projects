import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Minimum 6 characters are required')
    .max(10, 'Maximum 10 characters are allowed')
});