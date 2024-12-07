import { Sequelize } from 'sequelize';
import path from 'path';
import fs from 'fs';

// Tworzymy instancję Sequelize z bazą SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), 'database.sqlite'),
  logging: (msg) => console.log(`[Sequelize] ${msg}`), // Dodajemy prefix do logów SQL
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Funkcja do sprawdzania czy baza danych istnieje
async function checkDatabaseExists() {
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  return fs.existsSync(dbPath);
}

// Funkcja do inicjalizacji połączenia
export async function initDatabase() {
  try {
    console.log('Sprawdzanie połączenia z bazą danych...');
    await sequelize.authenticate();
    console.log('Połączenie z bazą danych nawiązane.');
    
    const dbExists = await checkDatabaseExists();
    console.log('Status bazy danych:', dbExists ? 'Istnieje' : 'Nie istnieje');

    if (!dbExists) {
      console.log('Tworzenie nowej bazy danych...');
      // Przy pierwszym uruchomieniu tworzymy tabele
      await sequelize.sync({ force: true });
      console.log('Utworzono nową bazę danych i tabele.');
    } else {
      console.log('Synchronizacja istniejących modeli...');
      // Przy kolejnych uruchomieniach tylko synchronizujemy modele
      await sequelize.sync();
      console.log('Synchronizacja modeli zakończona.');
    }
    
    return true;
  } catch (error) {
    console.error('Błąd podczas inicjalizacji bazy danych:', error);
    // Próba zamknięcia połączenia w przypadku błędu
    try {
      await sequelize.close();
      console.log('Połączenie z bazą danych zamknięte po błędzie.');
    } catch (closeError) {
      console.error('Błąd podczas zamykania połączenia:', closeError);
    }
    return false;
  }
}

// Funkcja do zamykania połączenia
export async function closeDatabase() {
  try {
    await sequelize.close();
    console.log('Połączenie z bazą danych zamknięte.');
    return true;
  } catch (error) {
    console.error('Błąd podczas zamykania połączenia:', error);
    return false;
  }
}

export default sequelize;
