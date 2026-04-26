# OneReserve 🏨

A smart parking and space reservation system built with **React.js** (frontend) and **Flask** (backend).

---

## Project Structure

```
onereserve/
├── client/        # React.js frontend
└── server/        # Flask backend
```

## Getting Started

### Frontend
```bash
cd client
npm install
npm start
```

### Backend
```bash
cd server
python -m venv venv
venv\Scripts\activate     # Windows
pip install -r requirements.txt
python run.py
```

## Environment Variables

- `client/.env` — Google Maps API key, backend base URL
- `server/.env` — Database URL, JWT secret, etc.
