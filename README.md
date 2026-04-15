# Task Systems

A modern, full-stack task management application built with Django REST Framework and Vue.js. This project was developed with the assistance of AI to demonstrate best practices in web development.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with token refresh
- **Task Management**: Create, read, update, and delete tasks with full CRUD operations
- **Priority System**: Organize tasks by priority levels (Low, Medium, High, Urgent)
- **Due Dates**: Set and track task deadlines with visual indicators
- **Real-time Status**: Mark tasks as completed with instant visual feedback
- **Responsive Design**: Modern, clean UI that works on all devices
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Search & Filtering**: Advanced filtering and search capabilities
- **Pagination**: Efficient data loading with pagination support

## 🛠️ Tech Stack

### Backend
- **Django 6.0.2** - High-level Python web framework
- **Django REST Framework** - Powerful and flexible toolkit for building Web APIs
- **Simple JWT** - JSON Web Token authentication
- **SQLite** - Database (easily configurable for PostgreSQL/MySQL)
- **django-filter** - Dynamic filtering for querysets
- **drf-yasg** - Auto-generated API documentation

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Pinia** - State management library
- **Vue Router 4** - Official router for Vue.js
- **Axios** - HTTP client for API requests
- **Vite** - Fast build tool and development server
- **CSS3** - Modern styling with custom properties

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## 🔧 Installation

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/JoseEnioSegundo/task-systems.git
   cd task-systems/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   Create a `.env` file in the backend directory:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the backend server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 📖 Usage

1. **Access the application** at `http://localhost:5173`
2. **Create an account** or login with existing credentials
3. **Create tasks** with titles, descriptions, priorities, and due dates
4. **Manage your tasks** by marking them complete or deleting them
5. **Use filters** to organize your task list

## 🔗 API Endpoints

### Authentication
- `POST /api/token/` - Obtain access and refresh tokens
- `POST /api/token/refresh/` - Refresh access token

### Tasks
- `GET /api/tarefas/` - List all user tasks (with filtering/pagination)
- `POST /api/tarefas/` - Create a new task
- `GET /api/tarefas/{id}/` - Get specific task details
- `PUT /api/tarefas/{id}/` - Update a task completely
- `PATCH /api/tarefas/{id}/` - Update task partially
- `DELETE /api/tarefas/{id}/` - Delete a task

### API Documentation
- `GET /swagger/` - Swagger UI documentation
- `GET /redoc/` - ReDoc documentation

## 🔍 API Features

### Filtering
```
GET /api/tarefas/?concluida=true
GET /api/tarefas/?prioridade=3
GET /api/tarefas/?search=meeting
```

### Ordering
```
GET /api/tarefas/?ordering=-prioridade
GET /api/tarefas/?ordering=criada_em
```

### Pagination
```
GET /api/tarefas/?page=2&page_size=10
```

## 🏗️ Project Structure

```
task-systems/
├── backend/
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── core/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── views/
    │   ├── stores/
    │   ├── router/
    │   └── services/
    ├── public/
    └── package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the assistance of AI technology
- Inspired by modern task management applications
- Thanks to the Django and Vue.js communities for excellent documentation

## 📞 Contact

Jose Enio Segundo - [GitHub](https://github.com/JoseEnioSegundo)

Project Link: [https://github.com/JoseEnioSegundo/task-systems](https://github.com/JoseEnioSegundo/task-systems)