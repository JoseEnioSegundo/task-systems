# Task Systems

Uma aplicação moderna de gerenciamento de tarefas full-stack construída com Django REST Framework e Vue.js. Este projeto foi desenvolvido com o auxílio de IA para demonstrar as melhores práticas em desenvolvimento web.

## 🚀 Funcionalidades

- **Autenticação de Usuário**: Autenticação segura baseada em JWT com renovação de tokens
- **Gerenciamento de Tarefas**: Criar, ler, atualizar e deletar tarefas com operações CRUD completas
- **Sistema de Prioridade**: Organizar tarefas por níveis de prioridade (Baixa, Média, Alta, Urgente)
- **Datas de Vencimento**: Definir e acompanhar prazos de tarefas com indicadores visuais
- **Status em Tempo Real**: Marcar tarefas como concluídas com feedback visual instantâneo
- **Design Responsivo**: Interface moderna e limpa que funciona em todos os dispositivos
- **Documentação da API**: Documentação Swagger/OpenAPI gerada automaticamente
- **Busca e Filtragem**: Capacidades avançadas de filtragem e busca
- **Paginação**: Carregamento eficiente de dados com suporte a paginação

## 🛠️ Stack Tecnológico

### Backend
- **Django 6.0.2** - Framework web Python de alto nível
- **Django REST Framework** - Toolkit poderoso e flexível para construir APIs Web
- **Simple JWT** - Autenticação JSON Web Token
- **SQLite** - Banco de dados (facilmente configurável para PostgreSQL/MySQL)
- **django-filter** - Filtragem dinâmica para querysets
- **drf-yasg** - Documentação de API gerada automaticamente

### Frontend
- **Vue.js 3** - Framework JavaScript progressivo
- **Pinia** - Biblioteca de gerenciamento de estado
- **Vue Router 4** - Router oficial para Vue.js
- **Axios** - Cliente HTTP para requisições de API
- **Vite** - Ferramenta de build rápida e servidor de desenvolvimento
- **CSS3** - Estilização moderna com propriedades customizadas

## 📋 Pré-requisitos

- Python 3.8+
- Node.js 16+
- npm ou yarn

## 🔧 Instalação

### Configuração do Backend

1. **Clone o repositório**
   ```bash
   git clone https://github.com/JoseEnioSegundo/task-systems.git
   cd task-systems/backend
   ```

2. **Crie ambiente virtual**
   ```bash
   python -m venv venv
   source venv/bin/activate  # No Windows: venv\Scripts\activate
   ```

3. **Instale as dependências**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure variáveis de ambiente**
   Crie um arquivo `.env` no diretório backend:
   ```env
   SECRET_KEY=sua-chave-secreta-aqui
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   ```

5. **Execute as migrações**
   ```bash
   python manage.py migrate
   ```

6. **Crie superusuário (opcional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Inicie o servidor backend**
   ```bash
   python manage.py runserver
   ```

### Configuração do Frontend

1. **Navegue para o diretório frontend**
   ```bash
   cd ../frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

## 📖 Uso

1. **Acesse a aplicação** em `http://localhost:5173`
2. **Crie uma conta** ou faça login com credenciais existentes
3. **Crie tarefas** com títulos, descrições, prioridades e datas de vencimento
4. **Gerencie suas tarefas** marcando-as como concluídas ou excluindo-as
5. **Use filtros** para organizar sua lista de tarefas

## 🔗 Endpoints da API

### Autenticação
- `POST /api/token/` - Obter tokens de acesso e refresh
- `POST /api/token/refresh/` - Renovar token de acesso

### Tarefas
- `GET /api/tarefas/` - Listar todas as tarefas do usuário (com filtragem/paginação)
- `POST /api/tarefas/` - Criar uma nova tarefa
- `GET /api/tarefas/{id}/` - Obter detalhes de uma tarefa específica
- `PUT /api/tarefas/{id}/` - Atualizar uma tarefa completamente
- `PATCH /api/tarefas/{id}/` - Atualizar tarefa parcialmente
- `DELETE /api/tarefas/{id}/` - Deletar uma tarefa

### Documentação da API
- `GET /swagger/` - Documentação Swagger UI
- `GET /redoc/` - Documentação ReDoc

## 🔍 Funcionalidades da API

### Filtragem
```
GET /api/tarefas/?concluida=true
GET /api/tarefas/?prioridade=3
GET /api/tarefas/?search=reuniao
```

### Ordenação
```
GET /api/tarefas/?ordering=-prioridade
GET /api/tarefas/?ordering=criada_em
```

### Paginação
```
GET /api/tarefas/?page=2&page_size=10
```

## 🏗️ Estrutura do Projeto

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

## 🤝 Contribuição

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature-incrivel`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature incrível'`)
4. Push para a branch (`git push origin feature/nova-feature-incrivel`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- Construído com o auxílio de tecnologia de IA
- Inspirado em aplicações modernas de gerenciamento de tarefas
- Agradecimentos às comunidades Django e Vue.js pela excelente documentação

## 📞 Contato

Jose Enio Segundo - [GitHub](https://github.com/JoseEnioSegundo)

Link do Projeto: [https://github.com/JoseEnioSegundo/task-systems](https://github.com/JoseEnioSegundo/task-systems)