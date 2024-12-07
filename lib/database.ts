import { Sequelize } from 'sequelize';
import path from 'path';

// Tworzymy instancję Sequelize z bazą SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), 'database.sqlite'), // Plik bazy danych będzie w głównym katalogu
  logging: false // Wyłączamy logi SQL dla przejrzystości
});

// Funkcja do inicjalizacji połączenia
export async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Połączenie z bazą danych nawiązane.');
    await sequelize.sync(); // Synchronizuje modele z bazą danych
    return true;
  } catch (error) {
    console.error('Błąd podczas łączenia z bazą danych:', error);
    return false;
  }
}

export default sequelize;
