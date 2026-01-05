import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTIONS = {
  TRANSLATIONS: 'translations',
  LANGUAGES: 'languages',
  SETTINGS: 'settings',
} as const;

// Translations data structure
interface TranslationValue {
  [lang: string]: string | number | boolean | null;
}

interface Space {
  translations: { [key: string]: TranslationValue };
  spaces: { [key: string]: Space };
  isArray?: boolean;
}

interface Translations {
  [pageKey: string]: Space;
}

// Get translations from Firestore
export async function getTranslations(): Promise<Translations> {
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'data');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().translations || {};
    }
    return {};
  } catch (error) {
    console.error('Error getting translations:', error);
    return {};
  }
}

// Save translations to Firestore
export async function saveTranslations(translations: Translations): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'data');
    await setDoc(docRef, { translations }, { merge: true });
  } catch (error) {
    console.error('Error saving translations:', error);
    throw error;
  }
}

// Get languages from Firestore
export async function getLanguages(): Promise<string[]> {
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'data');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().languages || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting languages:', error);
    return [];
  }
}

// Save languages to Firestore
export async function saveLanguages(languages: string[]): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'data');
    await setDoc(docRef, { languages }, { merge: true });
  } catch (error) {
    console.error('Error saving languages:', error);
    throw error;
  }
}

// Subscribe to real-time updates
export function subscribeToData(
  callback: (data: { translations: Translations; languages: string[] }) => void
): Unsubscribe {
  const docRef = doc(db, COLLECTIONS.SETTINGS, 'data');
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      callback({
        translations: data.translations || {},
        languages: data.languages || [],
      });
    } else {
      callback({
        translations: {},
        languages: [],
      });
    }
  }, (error) => {
    console.error('Error subscribing to data:', error);
  });
}

// Backup: Save to a backup document
export async function createBackup(translations: Translations, languages: string[]): Promise<void> {
  try {
    const backupRef = doc(db, COLLECTIONS.SETTINGS, 'backup_' + Date.now());
    await setDoc(backupRef, {
      translations,
      languages,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating backup:', error);
  }
}

