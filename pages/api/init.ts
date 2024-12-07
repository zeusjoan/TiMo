import { NextApiRequest, NextApiResponse } from 'next';
import { initDatabase } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoda nie jest dozwolona' });
  }

  try {
    console.log('Rozpoczynanie inicjalizacji bazy danych...');
    const success = await initDatabase();
    
    if (success) {
      console.log('Baza danych zainicjalizowana pomyślnie');
      return res.status(200).json({ success: true });
    } else {
      console.error('Nie udało się zainicjalizować bazy danych');
      return res.status(500).json({ error: 'Błąd inicjalizacji bazy danych' });
    }
  } catch (error) {
    console.error('Błąd podczas inicjalizacji:', error);
    return res.status(500).json({ 
      error: 'Błąd podczas inicjalizacji',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
