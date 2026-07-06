**Aluno:** José Ênio Ardino Segundo

## 1. Introdução

O projeto escolhido foi o **task-systems**, uma aplicação de gerenciamento de tarefas
full stack já existente no meu portfólio, composta por:
- **Backend:** Django REST Framework (autenticação JWT, CRUD de tarefas, documentação Swagger/ReDoc)
- **Frontend:** Vue.js 3 (Vite, Pinia, Vue Router)
- **Banco de dados:** originalmente SQLite, migrado para **PostgreSQL** para o deploy em produção

Objetivo do trabalho: provisionar a infraestrutura em nuvem via Terraform, configurar os
servidores via Ansible, montar um cluster Kubernetes (k3s) e realizar o deploy contínuo
da aplicação via GitOps com ArgoCD.

## 2. Escolha do Ambiente

- **Tipo de ambiente:** Cloud (AWS Learner Lab), usando EC2.
- **Justificativa:** o Learner Lab foi o ambiente disponibilizado pela disciplina, com
  credenciais temporárias via AWS Details. Usar EC2 real (em vez de VMs locais) permite
  provisionamento automatizado real com Terraform, mais próximo de um cenário produtivo.
- **Máquinas criadas:** 3 instâncias `t3.medium`, Ubuntu 22.04:
  - 1 control-plane
  - 2 workers

## 3. Provisionamento

- **Ferramentas:** Terraform (infraestrutura) + Ansible (configuração dos SOs).
- **Scripts:** `iac/terraform/*.tf` criam as 3 instâncias EC2 e o Security Group
  (SSH restrito ao meu IP, HTTP/HTTPS liberado, comunicação interna liberada entre os nós).
  `iac/ansible/playbooks/prepare-servers.yml` cria usuário administrativo, endurece o SSH
  (desativa login root e autenticação por senha) e instala pacotes básicos.
- **Desafios e soluções:**
  - As credenciais temporárias do AWS Learner Lab exigem três variáveis
    (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`); ao exportar
    manualmente, o `AWS_SESSION_TOKEN` ficou vazio ou incompleto em algumas tentativas,
    causando erros como `InvalidClientTokenId` e `ExpiredToken`. A sessão do Learner Lab
    também expira/reinicia periodicamente, exigindo reexportar as credenciais.
  - A AWS rejeita descrições de Security Group com acentuação
    (`ingress.description doesn't comply with restrictions`). Foi necessário remover
    acentos das descrições no `main.tf`.
  - O diretório `.terraform/` gerado pelo `terraform init` (com o binário do provider
    AWS, ~674MB) foi commitado por engano na primeira tentativa de `git push`, excedendo
    o limite de 100MB do GitHub. Resolvido com `.gitignore` e `git reset --soft` para
    recriar o commit sem o histórico problemático.
  - Quando a sessão do Learner Lab é totalmente reiniciada (não apenas renovada), a AWS
    atribui **novos IPs públicos** às instâncias EC2, mesmo elas continuando no ar. Isso
    exige reconfigurar o `kubeconfig` local, atualizar a URL de acesso, e liberar o novo
    IP no Security Group via `terraform apply`.

## 4. Cluster Kubernetes

- **Ferramenta usada:** k3s (instalado via Ansible, `install-k3s.yml`).
- **Configuração dos nós:** 1 control-plane + 2 workers, conectados via IP privado,
  usando o token gerado pelo control-plane para o join dos workers.
- **Testes de funcionamento:** `kubectl get nodes -o wide` confirmando os 3 nós `Ready`.
- **Desafio:** o certificado TLS gerado pelo k3s por padrão só inclui o IP privado e
  `127.0.0.1` como destinos válidos, não o IP público. Isso impede o `kubectl` local de
  validar a conexão remota (`x509: certificate is valid for ..., not <IP_PÚBLICO>`).
  Contornado configurando `insecure-skip-tls-verify: true` no kubeconfig local — uma
  solução aceitável para ambiente de estudo, mas que em produção real exigiria gerar o
  certificado do k3s já incluindo o IP público via `--tls-san`.

## 5. GitOps com ArgoCD

- **Instalação do ArgoCD:** via manifest oficial no namespace `argocd`.
- **Configuração do repositório Git:** manifests Kustomize na pasta `k8s/` do repositório
  `task-systems`, aplicados via `argocd/application.yaml` com sync automático
  (`prune` + `selfHeal`).
- **Deploy da aplicação:** ArgoCD monitora a branch `main`; qualquer alteração nos
  manifests é sincronizada automaticamente no cluster.
- **Desafio:** o `IngressRoute` do Traefik inicialmente só cobria `/api`, `/swagger`,
  `/redoc` e `/`. Isso quebrou o carregamento do CSS/JS do Swagger e do Django admin
  (ambos servidos em `/static/`) e o próprio acesso ao `/admin/`, que caía no fallback do
  frontend por falta de regra própria. Resolvido adicionando rotas explícitas para
  `/static` e `/admin` no `IngressRoute`. A correção foi aplicada só com `git push` para
  o repositório — o ArgoCD detectou e sincronizou a mudança automaticamente, sem nenhum
  comando manual no cluster, demonstrando o GitOps funcionando na prática.
- **Screenshots do ArgoCD funcionando:** *(adicionar prints da UI do ArgoCD mostrando
  a Application "task-systems" Synced/Healthy)*

## 6. Aplicação

- **Descrição:** aplicação de tarefas (to-do list) com autenticação JWT, prioridades,
  datas de vencimento e filtros. Backend em Django REST Framework, frontend em Vue.js,
  dados persistidos em PostgreSQL.
- **Comunicação entre serviços:** o frontend consome a API via `/api`, roteado pelo
  Traefik (Ingress Controller nativo do k3s) via `IngressRoute`; o backend se conecta
  ao Postgres pelo nome do Service interno `postgres` (DNS interno do Kubernetes).
- **Desafios:**
  - O `settings.py` original do projeto tinha `INSTALLED_APPS` declarado duas vezes — a
    segunda sobrescrevia a primeira, deixando `rest_framework_simplejwt.token_blacklist`,
    `django_filters` e `drf_yasg` fora da aplicação de fato, apesar de aparecerem no
    arquivo. Corrigido mesclando as duas listas em uma só.
  - As migrations nunca haviam sido aplicadas no banco PostgreSQL do cluster (o
    Dockerfile não roda `migrate` automaticamente). Isso só foi percebido ao tentar
    criar um superusuário (`relation "auth_user" does not exist`). Resolvido rodando
    `kubectl exec ... -- python manage.py migrate` manualmente; o ideal para produção
    seria automatizar isso com um `initContainer` no Deployment do backend.
- **Como acessar:** `http://<IP_PUBLICO_CONTROL_PLANE>/` (frontend),
  `http://<IP_PUBLICO_CONTROL_PLANE>/api/` (API),
  `http://<IP_PUBLICO_CONTROL_PLANE>/swagger/` (documentação da API),
  `http://<IP_PUBLICO_CONTROL_PLANE>/admin/` (Django admin).
  Observação: o IP público muda a cada reinício completo da sessão do Learner Lab.

## 7. Conclusão

- **Lições aprendidas:** a maior parte dos problemas não veio da infraestrutura em si
  (Terraform e Ansible rodaram sem grandes surpresas), e sim de detalhes de integração
  entre as camadas — rotas de Ingress faltando, migrations não aplicadas, configuração
  de banco que nunca tinha sido testada fora do SQLite local. Isso reforçou a importância
  de testar a aplicação localmente com Docker Compose antes de gastar tempo provisionando
  a infraestrutura de verdade.
- **Dificuldades encontradas:** a maior parte do tempo não foi gasta criando a
  infraestrutura, e sim depurando pequenos detalhes de configuração (Security Group,
  certificado TLS, roteamento do Traefik, autenticação do Git com token, IPs mudando
  a cada reinício do Learner Lab) que só aparecem na prática, não em tutoriais.
- **O que faria diferente:** automatizaria a execução de `migrate` e `collectstatic`
  como parte do processo de deploy (via `initContainer` ou `Job` do Kubernetes) em vez
  de rodar manualmente, e geraria o certificado do k3s já com `--tls-san` apontando para
  o IP público desde a instalação, evitando o `insecure-skip-tls-verify`.