# Instrukcja instalacji TiMo na MacBooku

## Wymagania wstępne

1. **Homebrew** (menedżer pakietów dla macOS)
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Node.js i npm**
   ```bash
   brew install node@18
   ```
   Po instalacji dodaj Node.js do PATH:
   ```bash
   echo 'export PATH="/usr/local/opt/node@18/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

3. **Git**
   ```bash
   brew install git
   ```

4. **MongoDB**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```
   Uruchom MongoDB jako usługę:
   ```bash
   brew services start mongodb-community
   ```

5. **SQLite**
   ```bash
   brew install sqlite3
   ```

## Instalacja aplikacji

1. **Przygotowanie katalogu**
   ```bash
   cd ~/Documents
   mkdir projekty
   cd projekty
   ```

2. **Klonowanie repozytorium**
   ```bash
   git clone https://github.com/zeusjoan/TiMo.git
   cd TiMo
   ```

3. **Instalacja zależności**
   ```bash
   npm install
   ```

4. **Konfiguracja środowiska**
   Stwórz plik .env w głównym katalogu projektu:
   ```bash
   touch .env
   ```
   
   Dodaj do niego wymagane zmienne środowiskowe:
   ```
   MONGODB_URI=mongodb://localhost:27017/timo
   ```

5. **Uruchomienie aplikacji**
   ```bash
   npm run dev
   ```

   Aplikacja będzie dostępna pod adresem: http://localhost:3000

## Rozwiązywanie problemów

### Problem z dostępem do MongoDB
Jeśli występują problemy z połączeniem do MongoDB, sprawdź czy usługa jest uruchomiona:
```bash
brew services list
```
Jeśli nie jest uruchomiona:
```bash
brew services restart mongodb-community
```

### Problem z zależnościami node_modules
W przypadku problemów z zależnościami, usuń folder node_modules i zainstaluj je ponownie:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Problem z uprawnieniami
Jeśli występują problemy z uprawnieniami podczas instalacji globalnych pakietów npm:
```bash
sudo chown -R $USER /usr/local/lib/node_modules
```

## Aktualizacja aplikacji

Aby zaktualizować aplikację do najnowszej wersji:
```bash
git pull origin master
npm install
```

## Użyteczne komendy

- Sprawdzenie wersji Node.js:
  ```bash
  node --version
  ```

- Sprawdzenie wersji npm:
  ```bash
  npm --version
  ```

- Czyszczenie cache npm:
  ```bash
  npm cache clean --force
  ```

- Uruchomienie z czyszczeniem cache:
  ```bash
  npm run dev --reset-cache
  ```

## Rozwój lokalny

1. **Visual Studio Code**
   Zalecamy używanie VS Code jako edytora:
   ```bash
   brew install --cask visual-studio-code
   ```

2. **Rozszerzenia VS Code**
   Zainstaluj przydatne rozszerzenia:
   - ESLint
   - Prettier
   - GitLens
   - TypeScript and JavaScript Language Features