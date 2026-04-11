import { auth, usersCollection } from './config';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  createdAt: number;
}

export const authService = {
  async signUp(name: string, email: string, password: string): Promise<UserProfile> {
    const cred = await auth().createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: name });
    const profile: UserProfile = {
      uid: cred.user.uid,
      name,
      email,
      createdAt: Date.now(),
    };
    await usersCollection().doc(cred.user.uid).set(profile);
    return profile;
  },

  async signIn(email: string, password: string) {
    const cred = await auth().signInWithEmailAndPassword(email, password);
    return cred.user;
  },

  async forgotPassword(email: string) {
    await auth().sendPasswordResetEmail(email);
  },

  async signOut() {
    await auth().signOut();
  },

  currentUser() {
    return auth().currentUser;
  },

  onAuthStateChanged(cb: (user: any) => void) {
    return auth().onAuthStateChanged(cb);
  },
};
