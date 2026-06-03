# 🌿 Madre Tierra — Catálogo Digital

Catálogo digital de productos para **Madre Tierra** — Verdulería Boutique · Almacén & Más.

## Stack

| Componente | Tecnología | Deploy |
|---|---|---|
| Frontend | Next.js 14 | Vercel |
| Backend | NestJS | Render |
| Data Source | Google Sheets API v4 | Google Cloud |

## Estructura

```
├── frontend/   → Next.js (catálogo web)
├── backend/    → NestJS (API REST + Google Sheets)
└── docs/       → Documentación
```

## Desarrollo Local

```bash
# Backend
cd backend && npm install && npm run start:dev

# Frontend (en otra terminal)
cd frontend && npm install && npm run dev
```

## Variables de Entorno

Ver `backend/.env.example` y `frontend/.env.example` para las variables necesarias.
