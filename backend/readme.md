
---

# Backend README.md

```md id="backendreadme"
# Support CRM Backend API

A production-style backend API for a Customer Support CRM System built using FastAPI and NocoDB.

This backend manages support tickets, customer issue workflows, ticket updates, notes/comments, and search/filter operations through clean RESTful APIs.

---

# Features

## Core Features

- Create support tickets
- List all tickets
- Search tickets
- Filter tickets by status
- View single ticket details
- Update ticket status
- Add notes/comments

---

# Backend Features

- RESTful API architecture
- FastAPI framework
- NocoDB integration
- Pydantic validation
- Centralized error handling
- Environment-based configuration
- Swagger/OpenAPI documentation
- CORS middleware support
- Modular service architecture

---

# Tech Stack

## Backend

- FastAPI
- Python
- HTTPX
- Pydantic
- Uvicorn
- NocoDB

---

# Architecture Overview

```text
React Frontend
        |
        v
FastAPI Backend
        |
        v
NocoDB REST APIs
        |
        v
Database

```
# Project Structure

```text
backend/
├── app/
│   ├── main.py
│   ├── config/
│   │   └── settings.py
│   ├── middleware/
│   │   └── cors_middleware.py
│   ├── routes/
│   │   └── tickets.py
│   ├── schemas/
│   │   └── ticket.py
│   ├── services/
│   │   ├── nocodb_service.py
│   │   └── ticket_service.py
│   └── utils/
│       ├── exceptions.py
│       └── ticket_id_generator.py
├── requirements.txt
└── README.md
```