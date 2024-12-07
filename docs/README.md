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
TiMo to aplikacja webowa zbudowana w oparciu o framework Next.js, służąca do zarządzania procesami w firmie. Aplikacja pozwala na generowanie raportów PDF, zarządzanie danymi w bazie MSSQL, oraz oferuje intuicyjny interfejs użytkownika.

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

#### Docker Desktop dla Mac
Pobierz i zainstaluj Docker Desktop ze strony: https://www.docker.com/products/docker-desktop

Po instalacji uruchom Docker Desktop.

#### MSSQL w Dockerze
```bash
docker pull mcr.microsoft.com/mssql/server
docker run -d --name mssql-server \
    -e "ACCEPT_EULA=Y" \
    -e "SA_PASSWORD=YourStrong@Passw0rd" \
    -p 1433:1433 \
    mcr.microsoft.com/mssql/server
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
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourStrong@Passw0rd
DB_NAME=TiMoDB
```

#### Uruchomienie aplikacji
```bash
npm run dev
```
Aplikacja będzie dostępna pod adresem: http://localhost:3000

### 3. Rozwiązywanie problemów

#### Problem z połączeniem do MSSQL
Sprawdź status kontenera:
```bash
docker ps
```
Restart kontenera jeśli potrzebny:
```bash
docker restart mssql-server
```

#### Problem z node_modules
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
- `/models` - Modele danych dla baz danych
- `/pages` - Strony aplikacji i endpointy API
- `/public` - Zasoby statyczne (obrazy, ikony, itp.)
- `/styles` - Style CSS i konfiguracja Tailwind
- `/types` - Definicje typów TypeScript

## Bazy danych
### Microsoft SQL Server
MSSQL jest używany jako główna baza danych dla:
- Przechowywania danych klientów
- Zarządzania zamówieniami
- Przechowywania historii operacji

[Reszta dokumentacji pozostaje bez zmian]