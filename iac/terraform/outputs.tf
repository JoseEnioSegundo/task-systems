output "public_ips" {
  description = "IPs públicos das instâncias"
  value = {
    for name, instance in aws_instance.nodes :
    name => instance.public_ip
  }
}

output "private_ips" {
  description = "IPs privados das instâncias"
  value = {
    for name, instance in aws_instance.nodes :
    name => instance.private_ip
  }
}

output "instance_ids" {
  description = "IDs das instâncias"
  value = {
    for name, instance in aws_instance.nodes :
    name => instance.id
  }
}

output "control_plane_public_ip" {
  description = "IP público do control-plane (use para acessar a aplicação e o ArgoCD)"
  value       = aws_instance.nodes["control-plane"].public_ip
}
