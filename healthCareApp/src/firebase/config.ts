
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export { auth, firestore };

export const usersCollection = () => firestore().collection('users');
export const prescriptionsCollection = () => firestore().collection('prescriptions');
