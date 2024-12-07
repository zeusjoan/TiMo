# Dokumentacja projektu TiMo

## Spis treści
1. [Wprowadzenie](#wprowadzenie)
2. [Instalacja na MacBooku](#instalacja-na-macbooku)
3. [Struktura projektu](#struktura-projektu)
4. [Technologie](#technologie)
5. [Bazy danych](#bazy-danych)
6. [Funkcjonalności](#funkcjonalności)
7. [API](#api)
8. [Rozwój projektu](#rozwój-projektu)

## Wprowadzenie
TiMo to aplikacja webowa zbudowana w oparciu o framework Next.js, służąca do zarządzania procesami w firmie. Aplikacja pozwala na generowanie raportów PDF, zarządzanie danymi w bazach MongoDB i SQLite, oraz oferuje intuicyjny interfejs użytkownika.

## Instalacja na MacBooku

### 1. Instalacja wymaganych narzędzi

#### Homebrew (menedżer pakietów dla macOS)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Node.js i npm
```bash
brew install node@18
echo 'export PATH="/usr/local/opt/node@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

#### Git
```bash
brew install git
```

#### MongoDB
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### SQLite
```bash
brew install sqlite3
```

### 2. Instalacja aplikacji

#### Klonowanie repozytorium
```bash
cd ~/Documents
mkdir projekty
cd projekty
git clone https://github.com/zeusjoan/TiMo.git
cd TiMo
```

#### Instalacja zależności
```bash
npm install
```

#### Konfiguracja środowiska
```bash
touch .env
```
Dodaj do pliku .env:
```
MONGODB_URI=mongodb://localhost:27017/timo
```

#### Uruchomienie aplikacji
```bash
npm run dev
```
Aplikacja będzie dostępna pod adresem: http://localhost:3000

### 3. Rozwiązywanie problemów

#### Problem z MongoDB
Sprawdź status MongoDB:
```bash
brew services list
```
Restart MongoDB jeśli potrzebny:
```bash
brew services restart mongodb-community
```

#### Problem z node_modules
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

[Reszta dokumentacji pozostaje bez zmian]