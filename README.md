## Требования

- [Node.js](https://nodejs.org/)

## Установка

### 1. Клонировать репозиторий

```bash
git clone <url_репозитория>
cd <папка_проекта>/main
```

### 2. Установить зависимости

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 3. Настройка окружения

Backend использует SQLite и файл `.env` для конфигурации.

В папке `backend` создайте файл `.env` со следующим содержимым:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-here
```

## Запуск

### Backend (открыть в папке `main/backend`)

```bash
npm run dev
```

Сервер запустится на `http://localhost:3000`

### Frontend (открыть в папке `main/frontend`)

```bash
npm run dev
```

Фронтенд запустится на `http://localhost:5173`
