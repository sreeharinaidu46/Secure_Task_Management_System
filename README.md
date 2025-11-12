
# 🚀 Secure Task Management System

A full-stack role-based task management system built using:

* **Angular 17** (Standalone Components + Tailwind)
* **NestJS** (API + RBAC + JWT Authentication)
* **Nx Monorepo**
* **PostgreSQL + TypeORM**
* **Role-based access control (Owner/Admin/Viewer)**
* **Personal vs Organizational Task Visibility**
* **Jest Unit Tests for both frontend & backend**

---

## 🧱 Features

### 🔐 Authentication & Authorization

* JWT authentication
* Login & Register with organization assignment
* Role-based access:

  * **Viewer:** Read-only tasks
  * **Admin:** Modify & delete only org tasks
  * **Owner:** Full organization rights

### 📝 Task System

* Create **Personal** or **Work** tasks
* Work tasks visible to **all users in same organization**
* Personal tasks visible only to the task owner
* Editable fields based on roles:

  * Work tasks → Only status + description editable
  * Personal tasks → Full edit allowed only for owner

### 📦 Frontend UI (Angular)

* Clean task board UI with Tailwind
* Create, Update, Delete tasks
* Search tasks
* Drag and Drop (Angular CDK)
* Logout + auth guard protected routes

### 🧪 Testing

* Jest tests for:

  * Task Service (NestJS)
  * Angular components (Login, Register, Tasks)

---

# 🛠️ Architecture Overview

```
secure-task-system/
│
├── apps/
│   ├── api/ → NestJS backend (Auth + Tasks)
│   └── dashboard/ → Angular frontend (Login + Tasks)
│
├── libs/
│   ├── data/ → TypeORM entities (User, Task, Organization)
│   └── auth/ → JWT Strategy, Guards, decorators
│
├── tools/ → Nx workspace tools
└── package.json
```

### Why This Architecture?

* **Nx Monorepo** → Shared code between backend & frontend
* **Data library** → Entities + enums re-used by API
* **Auth library** → Central auth logic for any future microservice
* **API decoupled from UI** → Allows mobile or other clients later

---

# 🚀 How to Run the Project

## 1️⃣ Install dependencies

```bash
npm install
```

## 2️⃣ Start PostgreSQL (Docker recommended)

```bash
docker run --name securetask-db -e POSTGRES_PASSWORD=password \
-p 5432:5432 -d postgres
```

## 3️⃣ Start the Backend (NestJS API)

```bash
npx nx serve api
```

Runs at:
👉 [http://localhost:3000/api](http://localhost:3000/api)

---

## 4️⃣ Start the Frontend (Angular Dashboard)

```bash
npx nx serve dashboard
```

Runs at:
👉 [http://localhost:4200/](http://localhost:4200/)

---

# 🔐 User Roles & Access Control (RBAC)

| Role   | Create Personal | Create Work | Update Personal | Update Work               | Delete Work | Visibility        |
| ------ | --------------- | ----------- | --------------- | ------------------------- | ----------- | ----------------- |
| Viewer | ❌               | ❌           | ❌               | ❌                         | ❌           | Only own personal |
| Admin  | ✔               | ✔           | ✔               | Status + Description only | ✔           | Org tasks only    |
| Owner  | ✔               | ✔           | ✔               | ✔                         | ✔           | Org tasks only    |

---

# 📡 Example API Requests

### 🔐 Login

```http
POST /api/auth/login
{
  "email": "owner@techmahindra.com",
  "password": "Owner@123"
}
```

### 📝 Create Task

```http
POST /api/tasks
{
  "title": "Prepare Report",
  "description": "Quarterly analysis",
  "type": "Work"
}
```

### ✏️ Update Task (Work)

```http
PUT /api/tasks/5
{
  "status": "In-Progress",
  "description": "Half completed"
}
```

### ❌ Delete Task

```http
DELETE /api/tasks/5
```

---

# 🧪 Running Tests

### Frontend Tests

```bash
npx nx test dashboard
```

### Backend Tests

```bash
npx nx test api
```

---

# 📌 Future Improvements (If More Time)

* 📊 Organization dashboards & analytics
* 👥 Invite users via email to organization
* 🔗 Task comments and file attachments
* 🔄 Real-time updates via WebSockets
* 🏢 Multi-tenancy with parent-child organizations
* ✔️ End-to-end Cypress tests
* 📱 Mobile app using Ionic or React Native

---

# 🎯 Summary

This project showcases:

* Full authentication flow
* Role-based access control (RBAC)
* Organization-aware task visibility
* Fully functional Angular UI
* Shared Nx monorepo architecture
* Tested backend and frontend services

t say the word!
