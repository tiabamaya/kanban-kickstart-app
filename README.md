Kanban Kickstart App

A full-stack task management system with AI task prioritization and GitHub OAuth login.

---
Live Demo
                                                                       
- **Backend (Django API)**: [https://kanban-kickstart-app.onrender.com](https://kanban-kickstart-app.onrender.com)
- **Frontend (React App)**: [https://kanban-kickstart-app-1.onrender.com](https://kanban-kickstart-app-1.onrender.com)

---

GitHub Repository

[https://github.com/tiabamaya/kanban-kickstart-app](https://github.com/tiabamaya/kanban-kickstart-app)

---

Features

- OAuth Login with GitHub
- AI Recommender System (Gemini API)
- Task board with columns and cards
- Django REST API
- React frontend
- PostgreSQL integration

---

## Project Structure
kanban-kickstart-app/
├── backend/ # Django backend
│ ├── api/ # DRF app
│ ├── backend/ # settings, wsgi
│ ├── manage.py
│ └── requirements.txt
├── frontend/ # React frontend
├── README.md


---

## Technologies Used

- Python 3.13+
- Django
- Django REST Framework
- Django AllAuth (GitHub OAuth)
- scikit-learn
- pandas
- OpenAI / Gemini API
- React
- PostgreSQL
- Render (for deployment)

---

## Deployment Setup (Render)

### Backend (Django)

**Render Web Service**
- Root Directory: `backend/`
- Build Command:
   ```bash
  pip install -r requirements.txt && python manage.py migrate
- Start Command:
   ```bash
  gunicorn backend.wsgi

### Frontend (React)

**Render Static Site**
- Root Directory: frontend/
- Build Command:
   ```bash
  npm run build
- Publish Directory:
   ```bash
  dist

**Environment Variables (/frontend/.env):**
  REACT_APP_API_URL=https://kanban-kickstart-app.onrender.com/api

### How to Run Locally
  **Backend**
  
    cd backend
    python -m venv .venv
    source .venv/bin/activate  # or .\.venv\Scripts\activate on Windows
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver

  **Frontend**
  
    cd frontend
    npm install
    npm start
