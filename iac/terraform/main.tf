terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# 1 control-plane + N workers (dinâmico via var.worker_count, atendendo
# ao desafio do tutorial de não deixar a quantidade fixa)
locals {
  worker_nodes = {
    for i in range(var.worker_count) :
    "worker-${i + 1}" => { role = "worker" }
  }

  nodes = merge(
    { "control-plane" = { role = "control-plane" } },
    local.worker_nodes
  )
}

resource "aws_security_group" "nodes_sg" {
  name        = "${var.project_name}-sg"
  description = "SSH externo, HTTP/HTTPS e trafego interno do cluster k3s"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH do seu computador"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  ingress {
    description = "HTTP (Traefik / ArgoCD / apps)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS (Traefik)"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Acesso ao Kubernetes API (kubectl remoto)"
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  ingress {
    description = "Comunicacao interna entre os nos (k3s, flannel, etc.)"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    self        = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-sg"
  }
}

resource "aws_instance" "nodes" {
  for_each = local.nodes

  ami                         = var.ami_id
  instance_type               = var.instance_type
  key_name                    = var.key_name
  subnet_id                   = data.aws_subnets.default.ids[0]
  vpc_security_group_ids      = [aws_security_group.nodes_sg.id]
  associate_public_ip_address = true

  root_block_device {
    volume_size = 20
  }

  tags = {
    Name = "${var.project_name}-${each.key}"
    Role = each.value.role
  }
}
