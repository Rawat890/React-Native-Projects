import { prescriptionsCollection } from '../firebase/config';
import { authService } from '../firebase/authService';

export interface Prescription {
  id: string;
  uid: string;
  email: string;
  url: string;
  format: string;
  fileName: string;
  uploadedAt: number;
  type: 'file' | 'link';
}

export const prescriptionService = {
  async save(
    data: Omit<Prescription, 'id' | 'uid' | 'uploadedAt'>,
  ): Promise<Prescription> {
    const user = authService.currentUser();
    if (!user) throw new Error('Not authenticated');
    const uid = user.uid;
    const doc = prescriptionsCollection().doc();
    const prescription: Prescription = {
      id: doc.id,
      uid,
      uploadedAt: Date.now(),
      ...data,
    };
    await doc.set(prescription);
    return prescription;
  },

  subscribe(uid: string, cb: (items: Prescription[]) => void) {
    return prescriptionsCollection()
      .where('uid', '==', uid)
      .orderBy('uploadedAt', 'desc')
      .onSnapshot(snap => {
        const items = snap.docs.map(d => d.data() as Prescription);
        cb(items);
      });
  },
  subscribeByEmail(email: string, cb: (items: Prescription[]) => void) {
    return prescriptionsCollection()
      .where('email', '==', email)
      .orderBy('uploadedAt', 'desc')
      .onSnapshot(snap => {
        const items = snap.docs.map(d => d.data() as Prescription);
        cb(items);
      });
  },
};
