import { Sequelize } from 'sequelize';
import path from 'path';

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

// Eksportujemy instancję
export default sequelize;

// Funkcja do inicjalizacji połączenia
export async function initDatabase() {
  try {
    console.log('Sprawdzanie połączenia z bazą danych...');
    await sequelize.authenticate();
    console.log('Połączenie z bazą danych nawiązane.');
    
    console.log('Synchronizacja modeli...');
    // Synchronizujemy modele bez force: true, żeby zachować dane
    await sequelize.sync();
    console.log('Modele zsynchronizowane.');
    
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
