# Trabalho Final – Fundamentos de DevOps

**Aluno:** José Ênio Segundo

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
- **Desafios e soluções:** *(preencher com o que você realmente enfrentar: ex. IP do
  Learner Lab expira, tive que reexportar as credenciais; tive que ajustar o tipo de
  instância porque t3.micro não aguentava o control-plane + apps, etc.)*

## 4. Cluster Kubernetes

- **Ferramenta usada:** k3s (instalado via Ansible, `install-k3s.yml`).
- **Configuração dos nós:** 1 control-plane + 2 workers, conectados via IP privado,
  usando o token gerado pelo control-plane para o join dos workers.
- **Testes de funcionamento:** `kubectl get nodes -o wide` confirmando os 3 nós `Ready`.

## 5. GitOps com ArgoCD

- **Instalação do ArgoCD:** via manifest oficial no namespace `argocd`.
- **Configuração do repositório Git:** manifests Kustomize na pasta `k8s/` do repositório
  `task-systems`, aplicados via `argocd/application.yaml` com sync automático
  (`prune` + `selfHeal`).
- **Deploy da aplicação:** ArgoCD monitora a branch `main`; qualquer alteração nos
  manifests é sincronizada automaticamente no cluster.
- **Screenshots do ArgoCD funcionando:** *(adicionar prints da UI do ArgoCD mostrando
  a Application "task-systems" Synced/Healthy)*

## 6. Aplicação

- **Descrição:** aplicação de tarefas (to-do list) com autenticação JWT, prioridades,
  datas de vencimento e filtros. Backend em Django REST Framework, frontend em Vue.js,
  dados persistidos em PostgreSQL.
- **Comunicação entre serviços:** o frontend consome a API via `/api`, roteado pelo
  Traefik (Ingress Controller nativo do k3s) via `IngressRoute`; o backend se conecta
  ao Postgres pelo nome do Service interno `postgres` (DNS interno do Kubernetes).
- **Como acessar:** `http://<IP_PUBLICO_CONTROL_PLANE>/` (frontend),
  `http://<IP_PUBLICO_CONTROL_PLANE>/api/` (API),
  `http://<IP_PUBLICO_CONTROL_PLANE>/swagger/` (documentação da API),
  `http://<IP_PUBLICO_CONTROL_PLANE>/pgadmin` (visualização do banco).

## 7. Conclusão

*(preencher após executar: lições aprendidas, dificuldades encontradas, o que faria diferente)*

## 8. Link para Repositório

https://github.com/JoseEnioSegundo/task-systems
