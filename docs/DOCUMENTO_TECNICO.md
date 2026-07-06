# Task Systems — Infraestrutura Cloud com Terraform, Ansible, Kubernetes e GitOps

**Autor:** José Ênio Ardino Segundo

## 1. Visão Geral

Este projeto consiste na evolução do **task-systems**, uma aplicação full stack de gerenciamento de tarefas já existente, para um pipeline completo de infraestrutura como código e entrega contínua em nuvem. O trabalho cobre desde o provisionamento da infraestrutura até o deploy automatizado da aplicação em um cluster Kubernetes, seguindo práticas de GitOps.

**Stack da aplicação:**

| Camada | Tecnologia |
|---|---|
| Backend | Django REST Framework (JWT, CRUD de tarefas, Swagger/ReDoc) |
| Frontend | Vue.js 3 (Vite, Pinia, Vue Router) |
| Banco de dados | PostgreSQL (migrado de SQLite para produção) |

**Escopo técnico do trabalho:**
- Provisionamento de infraestrutura em nuvem com **Terraform**
- Configuração de servidores com **Ansible**
- Orquestração de containers com **Kubernetes (k3s)**
- Entrega contínua via **GitOps (ArgoCD)**

---

## 2. Ambiente de Infraestrutura

- **Provedor:** AWS (via AWS Academy Learner Lab)
- **Justificativa:** o Learner Lab foi o ambiente disponibilizado pela disciplina, com credenciais temporárias fornecidas via AWS Details. A escolha por instâncias EC2 reais — em vez de máquinas virtuais locais — permitiu um provisionamento automatizado mais próximo de um cenário produtivo real.
- **Topologia:** 3 instâncias `t3.medium` (Ubuntu 22.04):
  - 1 nó control-plane
  - 2 nós worker

---

## 3. Provisionamento de Infraestrutura

**Ferramentas:** Terraform (infraestrutura) + Ansible (configuração dos sistemas operacionais)

- `iac/terraform/*.tf`: provisiona as 3 instâncias EC2 e o Security Group correspondente, restringindo SSH ao IP do administrador, liberando HTTP/HTTPS externamente e permitindo comunicação interna irrestrita entre os nós.
- `iac/ansible/playbooks/prepare-servers.yml`: cria o usuário administrativo, aplica hardening de SSH (desabilita login root e autenticação por senha) e instala os pacotes básicos necessários.

### Desafios e soluções

| Desafio | Solução |
|---|---|
| Credenciais temporárias do Learner Lab (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`) geravam erros como `InvalidClientTokenId` e `ExpiredToken` quando exportadas incorretamente | Reexportação cuidadosa das três variáveis a cada expiração/reinício de sessão |
| AWS rejeita descrições de Security Group com acentuação (`ingress.description doesn't comply with restrictions`) | Remoção de acentos nas descrições do `main.tf` |
| Diretório `.terraform/` (~674MB, incluindo binário do provider AWS) commitado por engano, excedendo o limite de 100MB do GitHub | Adição ao `.gitignore` e reescrita do histórico com `git reset --soft` |
| Reinícios completos da sessão do Learner Lab atribuem novos IPs públicos às instâncias | Reconfiguração do `kubeconfig`, atualização da URL de acesso e liberação do novo IP no Security Group via `terraform apply` |

---

## 4. Cluster Kubernetes (k3s)

- **Ferramenta:** k3s, instalado via Ansible (`install-k3s.yml`)
- **Topologia:** 1 control-plane + 2 workers, comunicando-se via IP privado; join dos workers realizado com o token gerado pelo control-plane
- **Validação:** `kubectl get nodes -o wide` confirmando os 3 nós no estado `Ready`

### Desafio técnico

O certificado TLS gerado por padrão pelo k3s inclui apenas o IP privado e `127.0.0.1` como destinos válidos, o que impede a validação da conexão remota pelo `kubectl` local (`x509: certificate is valid for ..., not <IP_PÚBLICO>`).

**Solução adotada:** `insecure-skip-tls-verify: true` no kubeconfig local — aceitável em ambiente de estudo, mas que em produção exigiria gerar o certificado do k3s já incluindo o IP público via `--tls-san`.

---

## 5. GitOps com ArgoCD

- **Instalação:** manifest oficial do ArgoCD, no namespace `argocd`
- **Repositório:** manifests Kustomize versionados na pasta `k8s/` do repositório `task-systems`, aplicados via `argocd/application.yaml` com sincronização automática (`prune` + `selfHeal`)
- **Fluxo de deploy:** o ArgoCD monitora a branch `main`; qualquer alteração nos manifests é sincronizada automaticamente no cluster, sem intervenção manual

### Desafio técnico

O `IngressRoute` do Traefik cobria inicialmente apenas `/api`, `/swagger`, `/redoc` e `/`, o que quebrava o carregamento de CSS/JS do Swagger e do Django admin (servidos em `/static/`) e o próprio acesso a `/admin/`, que caía no fallback do frontend por falta de regra própria.

**Solução:** adição de rotas explícitas para `/static` e `/admin` no `IngressRoute`. A correção foi propagada via `git push`, com o ArgoCD detectando e sincronizando a mudança automaticamente — validando o funcionamento do fluxo GitOps na prática.

*(Espaço reservado para prints da UI do ArgoCD mostrando a Application "task-systems" com status Synced/Healthy)*

---

## 6. Aplicação

**Descrição:** aplicação de gerenciamento de tarefas (to-do list) com autenticação JWT, prioridades, datas de vencimento e filtros.

**Comunicação entre serviços:**
- Frontend → Backend: via `/api`, roteado pelo Traefik (Ingress Controller nativo do k3s) através do `IngressRoute`
- Backend → Banco de dados: conexão ao PostgreSQL pelo nome do Service interno `postgres` (DNS interno do Kubernetes)

### Desafios técnicos

| Desafio | Causa raiz | Solução |
|---|---|---|
| Apps como `rest_framework_simplejwt.token_blacklist`, `django_filters` e `drf_yasg` não funcionavam apesar de aparecerem no `settings.py` | `INSTALLED_APPS` estava declarado duas vezes; a segunda declaração sobrescrevia a primeira | Mesclagem das duas listas em uma única declaração |
| Erro `relation "auth_user" does not exist` ao criar superusuário | Migrations nunca haviam sido aplicadas ao banco PostgreSQL do cluster (o Dockerfile não executa `migrate` automaticamente) | Execução manual de `kubectl exec ... -- python manage.py migrate` |

**Acesso à aplicação:**
- Frontend: `http://<IP_PUBLICO_CONTROL_PLANE>/`
- API: `http://<IP_PUBLICO_CONTROL_PLANE>/api/`
- Documentação (Swagger): `http://<IP_PUBLICO_CONTROL_PLANE>/swagger/`
- Django Admin: `http://<IP_PUBLICO_CONTROL_PLANE>/admin/`

> **Observação:** o IP público muda a cada reinício completo da sessão do Learner Lab.

---

## 7. Conclusão

**Lições aprendidas:** a maior parte dos problemas enfrentados não teve origem na infraestrutura em si — Terraform e Ansible executaram sem grandes surpresas —, mas sim em detalhes de integração entre as camadas da aplicação: rotas de Ingress incompletas, migrations não aplicadas e configurações de banco de dados nunca testadas fora do ambiente local com SQLite. Isso reforça a importância de validar a aplicação localmente com Docker Compose antes de investir tempo no provisionamento de infraestrutura real.

**Principais dificuldades:** a maior parte do esforço não foi consumida na criação da infraestrutura, mas na depuração de detalhes de configuração — Security Group, certificado TLS, roteamento do Traefik, autenticação Git via token e mudança de IPs a cada reinício do Learner Lab — problemas que raramente aparecem em tutoriais e só se manifestam na prática.

**Melhorias futuras:**
- Automatizar a execução de `migrate` e `collectstatic` como parte do processo de deploy, via `initContainer` ou `Job` do Kubernetes, eliminando a necessidade de execução manual
- Gerar o certificado do k3s já configurado com `--tls-san` apontando para o IP público desde a instalação, eliminando a necessidade de `insecure-skip-tls-verify`