# Dokumentacja projektu TiMo

## Spis treści
1. [Wprowadzenie](#wprowadzenie)
2. [Instalacja na MacBooku](#instalacja-na-macbooku)
3. [Struktura projektu](#struktura-projektu)
4. [Technologie](#technologie)
5. [Bazy danych](#bazy-danych)
6. [Funkcjonalności](#funkcjonalności)

## Wprowadzenie
TiMo to aplikacja webowa zbudowana w oparciu o framework Next.js, służąca do zarządzania procesami w firmie. Aplikacja pozwala na generowanie raportów PDF, zarządzanie danymi w bazie SQLite, oraz oferuje intuicyjny interfejs użytkownika.

## Instalacja na MacBooku

### 1. Instalacja wymaganych narzędzi

Otwórz Terminal i wykonaj poniższe komendy:

a) Zainstaluj Homebrew (jeśli nie masz):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

b) Zainstaluj Node.js:
```bash
brew install node@18
```

c) SQLite jest już zainstalowany na MacOS, ale gdyby był potrzebny:
```bash
brew install sqlite3
```

### 2. Instalacja aplikacji

a) Przejdź do katalogu, gdzie chcesz zainstalować aplikację:
```bash
cd ~/Documents
mkdir projekty
cd projekty
```

b) Sklonuj repozytorium i zainstaluj zależności:
```bash
git clone https://github.com/zeusjoan/TiMo.git
cd TiMo
npm install
```

### 3. Uruchomienie aplikacji

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

### 4. Rozwiązywanie problemów

Jeśli wystąpią problemy z modułami node:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## Struktura projektu
- `/components` - Komponenty React używane w aplikacji
- `/contexts` - Konteksty React do zarządzania stanem aplikacji
- `/hooks` - Własne hooki React
- `/lib` - Biblioteki i narzędzia pomocnicze
- `/models` - Modele danych dla bazy SQLite
- `/pages` - Strony aplikacji i endpointy API
- `/public` - Zasoby statyczne (obrazy, ikony, itp.)
- `/styles` - Style CSS i konfiguracja Tailwind
- `/types` - Definicje typów TypeScript

## Technologie
- **Frontend**: 
  - Next.js 15.0.3
  - React 19.0.0-rc
  - TypeScript
  - Tailwind CSS
  
- **Biblioteki**:
  - date-fns - formatowanie i manipulacja datami
  - jspdf - generowanie dokumentów PDF
  - jspdf-autotable - tworzenie tabel w PDF
  - sequelize - ORM dla SQLite
  
- **Baza danych**:
  - SQLite3 - lekka, plikowa baza danych

## Baza danych
SQLite jest używany jako główna baza danych dla:
- Przechowywania danych klientów
- Zarządzania zamówieniami
- Przechowywania historii operacji
- Konfiguracji aplikacji

## Funkcjonalności
1. **Zarządzanie danymi**
   - Dodawanie, edycja i usuwanie rekordów
   - Wyszukiwanie i filtrowanie danych
   - Import i eksport danych

2. **Generowanie raportów**
   - Tworzenie raportów PDF
   - Automatyczne generowanie tabel
   - Eksport danych do różnych formatów

3. **Interfejs użytkownika**
   - Responsywny design
   - Intuicyjna nawigacja
   - Dostosowanie do różnych urządzeń