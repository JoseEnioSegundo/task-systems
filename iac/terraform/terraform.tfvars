aws_region       = "us-east-1"
project_name     = "task-systems"
ami_id           = "ami-0d28727121d5d4a3c" # AMI Ubuntu 22.04 da sua região
instance_type    = "t3.medium"
key_name         = "vockey" # nome da chave no Learner Lab
allowed_ssh_cidr = "179.190.122.85/32" # seu IP público + /32 (descubra com: curl -s ifconfig.me)
worker_count     = 2
