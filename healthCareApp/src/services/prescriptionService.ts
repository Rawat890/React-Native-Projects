import { prescriptionsCollection } from '../firebase/config';
import { authService } from '../firebase/authService';

export interface Prescription {
  id: string;
  uid: string;
  url: string;
  publicId: string;
  format: string;
  fileName: string;
  bytes: number;
  uploadedAt: number;
  type: 'file' | 'link';
}

export const prescriptionService = {
  async save(data: Omit<Prescription, 'id' | 'uid' | 'uploadedAt'>): Promise<Prescription> {
    const uid = authService.currentUser()?.uid;
    if (!uid) throw new Error('Not authenticated');
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
};
