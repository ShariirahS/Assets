# Ansible Playbooks

Automation for provisioning the Docker hosts described in `docs/devops-deployment.md`.

## Usage

```bash
ansible-galaxy install -r requirements.yml  # TODO: add role dependencies
ansible-playbook -i inventory/hosts.yml playbooks/site.yml --limit staging
```

Roles are wired for future expansion; enable the Docker role once credentials and hosts are available.
