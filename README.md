# Alpaca Health Software Engineering Take-Home Project

### Project Description

This project implements an AI-assisted ABA (Applied Behavior Analysis) session note generator designed to streamline the creation of professional, consistent notes. The application comprises a **FastAPI backend** and a **Next.js frontend**.

Visit the full project description here:  
[https://harviio.notion.site/ABA-Session-Note-Generator-Take-Home-Project-1411bfc50b90803382d4cae01f9bcf18?pvs=4](https://www.notion.so/harviio/ABA-Session-Note-Generator-Take-Home-Project-1411bfc50b90803382d4cae01f9bcf18?pvs=4)

---

## Setup Instructions

### Backend Setup (Python 3.11+ required)

```bash
# Create and activate virtual environment
python -m venv alpaca_venv
source alpaca_venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt
```

Add a `.env` file:

```bash
OPENAI_API_KEY="<your-api-key>"
```

Start the server
```bash
uvicorn app.main:app --reload
```

### Frontend Setup (Node.js 18+ required)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at:

- **Frontend**: [http://localhost:3000](http://localhost:3000)  
- **Backend API**: [http://localhost:8000](http://localhost:8000)  
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Project Structure

### Frontend (`frontend/`)

A **Next.js** application with the following structure:

- **`src/components/`**: Contains reusable React components, such as form inputs and utility functions.
- **`src/app/`**: Pages built using the Next.js app router.
  - `generate/`: Page for generating new session notes.
  - `view/`: Page for viewing previously saved notes.
- **Styling**: Tailwind CSS is used for consistent, responsive styling.

### Backend (`backend/`)

A **FastAPI** application structured as follows:

- **`/main.py`**:  
  - Contains API endpoints for note generation and storage.
  - Implements OpenAI API integration for generating professional session notes.
  - Includes database setup and models using SQLAlchemy.
- **Database**: SQLite is used for lightweight and local data storage.
  - **Tables**:
    - `notes`: Stores patient names, session dates, and the corresponding notes.

---

## Logic and Design Decisions

### Database: SQLite
- **Why SQLite?**
  - Lightweight and file-based, making it ideal for a take-home project.
  - Easy to set up with minimal configuration.
  - Meets the requirements for persisting session notes locally.

- **Table Design**:
  - Each note is uniquely identified by a combination of `name` (patient) and `date`.
  - The `notes` table ensures data integrity using unique constraints.

### Frontend: Next.js
- **Why Next.js?**
  - Supports both client-side and server-side rendering.
  - Streamlines the integration of React components.
  - Provides scalability and performance for future enhancements.

- **React Components**:
  - Modular and reusable components are used to simplify the UI logic.
  - Input fields and session management are handled with React's `useState`.

### Backend: FastAPI
- **Why FastAPI?**
  - High performance and easy-to-use framework for building APIs.
  - Automatic API documentation via OpenAPI standards.
  - Seamless integration with modern tools like SQLAlchemy and OpenAI APIs.

- **API Design**:
  - `/generate-notes`: Generates AI-based session notes.
  - `/save-notes`: Persists session notes in the database.
  - `/get-notes`: Retrieves all session notes, with filtering and sorting capabilities.

---

## Testing

### Frontend
- Uses **Jest** and **React Testing Library** for testing React components.
- Tests include:
  - Rendering components (`FormInput`).
  - Simulating user actions like form submission.

### Backend
- Includes tests for the FastAPI endpoints using **pytest** and **HTTPX**.
- Tests ensure:
  - Notes are generated correctly using mocked OpenAI responses.
  - Notes are saved and retrieved correctly from the SQLite database.

---

## Development Workflow

- **Frontend**:
  - Live reloading for faster UI development.
  - Modular React components for scalability.

- **Backend**:
  - Auto-reload enabled for iterative development.
  - API endpoints tested with FastAPI's `/docs` interface.

---

## Future Improvements
1. **Database Migration**: Integrate Alembic for schema migrations.
2. **Authentication**: Add user authentication for secure access.
3. **Cloud Deployment**: Use AWS or Heroku for deploying the backend and frontend.
4. **Enhanced Filtering**: Improve the UI for filtering notes by date range.
