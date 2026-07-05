variable "aws_region" {
  description = "Região AWS"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Prefixo para nome e tags dos recursos"
  type        = string
  default     = "task-systems"
}

variable "ami_id" {
  description = "AMI Ubuntu Server (pegue a AMI Ubuntu 22.04 da região do Learner Lab)"
  type        = string
}

variable "instance_type" {
  description = "Tipo da instância EC2"
  type        = string
  default     = "t3.medium" # k3s com control-plane + apps precisa de mais que t3.micro
}

variable "key_name" {
  description = "Nome da chave SSH cadastrada na AWS (no Learner Lab é normalmente 'vockey')"
  type        = string
}

variable "allowed_ssh_cidr" {
  description = "IPs com acesso SSH, ex: 203.0.113.10/32"
  type        = string
}

variable "worker_count" {
  description = "Quantidade de nós worker (pede-se >= 2 além do control-plane, totalizando 3 nós)"
  type        = number
  default     = 2
}
