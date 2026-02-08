# sheets-exporter

Библиотека для экспорта данных в Google Sheets. Данные дописываются в конец таблицы (append).

Проект предоставляет класс `SheetsExporter` с простым API.

## Подключение к Google Sheets

### 1. Создать Service Account

1. Перейти в [Google Cloud Console](https://console.cloud.google.com/)
2. Создать новый проект (или использовать существующий)
3. Включить **Google Sheets API**: APIs & Services → Library → найти "Google Sheets API" → Enable
4. Создать Service Account: APIs & Services → Credentials → Create Credentials → Service Account
5. Создать ключ: открыть созданный Service Account → Keys → Add Key → Create new key → JSON
6. Скачанный JSON-файл положить в корень проекта как `credentials.json`

### 2. Подготовить таблицу

1. Создать Google Spreadsheet
2. Создать два листа (tabs): `BadAppointments` и `Reviews`
3. Расшарить таблицу на email сервисного аккаунта (поле `client_email` в JSON-ключе) с правами **Editor**
4. Скопировать ID таблицы из URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

### 3. Настроить .env

```bash
cp .env.example .env
```

Заполнить `.env`:

```
SPREADSHEET_ID=ваш-id-таблицы
GOOGLE_SERVICE_ACCOUNT_PATH=./credentials.json
```

## Установка

```bash
npm install
```

## Скрипты

```bash
npm run dev        # Запуск тестового скрипта (экспорт каждые 60 сек)
npm run build      # Компиляция TypeScript в dist/
npm run typecheck  # Проверка типов
```

## Использование как библиотеки

```typescript
import { SheetsExporter } from "sheets-export";

// Конфигурация из .env
const exporter = new SheetsExporter();

// Или с явными параметрами (переопределяют .env)
const exporter = new SheetsExporter({
  spreadsheetId: "1ABC...xyz",
  credentialsPath: "./my-credentials.json",
});

// Экспорт данных
await exporter.appendRows({ sheetName: "BadAppointments", rows: badAppointmentsFormatted });
await exporter.appendRows({ sheetName: "Reviews", rows: reviewsFormatted });
```
