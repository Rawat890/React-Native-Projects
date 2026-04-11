import * as yup from 'yup';

export const signupSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Minimum 3 characters'),

  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email'),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Minimum 6 characters'),

  image: yup
    .string()
    .url('Enter a valid URL')
    .nullable()
    .notRequired()
});