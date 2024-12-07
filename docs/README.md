# Dokumentacja projektu TiMo

## Spis treści
1. [Wprowadzenie](#wprowadzenie)
2. [Wymagania systemowe](#wymagania-systemowe)
3. [Instalacja](#instalacja)
4. [Struktura projektu](#struktura-projektu)
5. [Technologie](#technologie)
6. [Bazy danych](#bazy-danych)
7. [Funkcjonalności](#funkcjonalności)
8. [API](#api)
9. [Rozwój projektu](#rozwój-projektu)

## Wprowadzenie
TiMo to aplikacja webowa zbudowana w oparciu o framework Next.js, służąca do zarządzania procesami w firmie. Aplikacja pozwala na generowanie raportów PDF, zarządzanie danymi w bazach MongoDB i SQLite, oraz oferuje intuicyjny interfejs użytkownika.

## Wymagania systemowe
- Node.js w wersji 18 lub wyższej
- npm (Node Package Manager)
- Dostęp do bazy danych MongoDB
- SQLite3

## Instalacja
1. Sklonuj repozytorium:
```bash
git clone https://github.com/zeusjoan/TiMo.git
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Uruchom aplikację w trybie developerskim:
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

## Struktura projektu
- `/components` - Komponenty React używane w aplikacji
- `/contexts` - Konteksty React do zarządzania stanem aplikacji
- `/hooks` - Własne hooki React
- `/lib` - Biblioteki i narzędzia pomocnicze
- `/models` - Modele danych dla baz danych
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
  
- **Bazy danych**:
  - MongoDB (mongoose)
  - SQLite (sequelize)

## Bazy danych
### MongoDB
MongoDB jest używane jako główna baza danych dla:
- Przechowywania danych klientów
- Zarządzania zamówieniami
- Przechowywania historii operacji

### SQLite
SQLite służy do:
- Przechowywania konfiguracji lokalnych
- Cachowania danych
- Tymczasowego przechowywania danych offline

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

## API
Dokumentacja API jest dostępna pod adresem `/api/docs` po uruchomieniu aplikacji w trybie developerskim.

## Rozwój projektu
### Dodawanie nowych funkcji
1. Utwórz nowy branch:
```bash
git checkout -b feature/nazwa-funkcji
```

2. Wprowadź zmiany i przetestuj je lokalnie

3. Wypchnij zmiany na serwer:
```bash
git push origin feature/nazwa-funkcji
```

4. Utwórz Pull Request

### Konwencje
- Nazewnictwo komponentów: PascalCase
- Nazewnictwo funkcji: camelCase
- Pliki komponentów: .tsx
- Pliki stylów: .css lub .module.css