# Quotana 📜

Quotana is an open-source **Quotes API** designed to serve inspirational quotes with ease.  
Whether you’re building a motivational app, a social media bot, or just love collecting wisdom, Quotana makes it simple.

---

## ✨ Features

- **RESTful API** for easy integration
- **Search & filter** quotes by keyword, author, or category
- **Random quote generator** for daily inspiration
- **Pagination support** for efficient data loading
- **Open-source** and community-driven

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 18.x recommended)
- npm

### Installation

```bash
git clone https://github.com/dhirajaryaa/quotana.git
cd quotana
npm install
```

### Run the server

```bash
npm start
```

### Run Development server

```bash
npm run dev
```

The server will start at `http://localhost:3000`.  
Visit the root URL in your browser for a quick overview.

---

## 📡 API Endpoints

**Base URL:** `/api`

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | `/quotes` | Get paginated quotes. Params: `page`, `limit`, `search`, `author`, `category` |
| GET    | `/quotes/random` | Get a random quote |

> **Note:** Only `GET` requests are supported. All other methods will return 405 Method Not Allowed.

## 🛠 Example Usage

### Fetch quotes (Default limit: 1)
```bash
curl http://localhost:3000/api/quotes
```

### Pagination
Fetch 5 quotes from page 1:
```bash
curl "http://localhost:3000/api/quotes?page=1&limit=5"
```

### Search quotes
```bash
curl http://localhost:3000/api/quotes?search=future
```

### Filter by Author
```bash
curl http://localhost:3000/api/quotes?author=Jobs
```

### Fetch a random quote
```bash
curl http://localhost:3000/api/quotes/random
```

Response:
```json
{
  "quote": "The best way to predict the future is to invent it.",
  "author": "Alan Kay",
  "category": "Technology",
  "id": "1"
}
```

---

## 🤝 Contributing

Contributions are welcome!

- Fork the repo
- Create a new branch (`feature/awesome-feature`)
- Commit your changes
- Open a Pull Request

---

## 📜 License

Quotana is released under the **MIT License**.  
Feel free to use, modify, and distribute with attribution.

---

## 🌟 Inspiration

Quotana was built to make sharing wisdom effortless.  
Because sometimes, a single quote can change your day.
