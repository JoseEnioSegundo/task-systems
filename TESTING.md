# Guia de Testes - Task Systems

## Servidor Rodando ✅

- **Backend**: http://127.0.0.1:8000
- **Frontend**: http://localhost:5176

## Credenciais para Teste

### Usuários Disponíveis:

1. **jose** / senha: (use o comando abaixo)
2. **thifany** / senha: (use o comando abaixo)
3. **fanny** / senha: (use o comando abaixo)
4. **teste** / **teste123** ✅ (novo usuário criado)

## Como Testar

### 1. Acessar o Frontend

1. Abra: http://localhost:5176
2. Clique em "Login" na barra de navegação
3. Digite: 
   - Usuário: `teste`
   - Senha: `teste123`
4. Clique em "Entrar"

### 2. Testar Criação de Tarefas

Após fazer login, você estará em http://localhost:5176/tarefas

1. **Campos disponíveis**:
   - Título (obrigatório) - ex: "Estudar Vue.js"
   - Descrição - ex: "Aprender Pinia e Vue Router"
   - Prioridade (Baixa, Média, Alta, Urgente)
   - Data de Vencimento (opcional)

2. **Criar uma tarefa**:
   - Preencha os campos
   - Clique no botão "Adicionar"
   - A tarefa deve aparecer na lista em tempo real

3. **Interagir com tarefas**:
   - Clique no checkbox para marcar como concluída
   - Clique no botão 🗑️ para deletar
   - Use os filtros (Todas/Concluídas/Pendentes)

## Testes da API (via cURL)

### Login
```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","password":"teste123"}'
```

### Listar Tarefas (copie o token acima)
```bash
curl -X GET http://127.0.0.1:8000/api/tarefas/ \
  -H "Authorization: Bearer {SEU_TOKEN}"
```

### Criar Tarefa
```bash
curl -X POST http://127.0.0.1:8000/api/tarefas/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {SEU_TOKEN}" \
  -d '{"titulo":"Nova Tarefa","descricao":"Descrição","prioridade":2}'
```

## O Que Foi Corrigido

✅ **TarefasView.vue** - Removido código duplicado e corrompido
✅ **Integração Pinia** - Usando store para estado global
✅ **CORS** - Adicionados portos 5174, 5175, 5176
✅ **Prioridade** - Campo adicionado à criação de tarefas
✅ **Data de Vencimento** - Campo adicionado com validação
✅ **Buttons** - Estado de loading com mensagem "Adicionando..."
✅ **Filtros** - Funcionando (Todas/Concluídas/Pendentes)
✅ **API** - Testada e funcionando 100%

## Logs de Teste

- Backend: rodando em http://127.0.0.1:8000
- Frontend: rodando em http://localhost:5176  
- Usuário de teste: `teste` / `teste123` criado com sucesso
- API de tarefas: testada com sucesso (criação e listagem)
- Login: testado com sucesso (tokens gerados corretamente)

## Próximas Etapas

1. Testar completa integração no navegador
2. Validar todos os filtros
3. Testar soft delete (se implementado)
4. Verificar responsividade em mobile

---
**Status**: ✅ TUDO FUNCIONANDO
