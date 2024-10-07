# Logs streaming Demo

This is a simple demo to show how to stream logs.

## Deployment steps

1. Clone the repository
1. `cp .env.example .env`
1. Edit the `.env` file with your own values
1. Update `Caddyfile` with your own domain
1. `docker-compose up -d kafka1` and wait for the services to be up
1. `docker-compose up -d` to start the rest of the services

![image](https://github.com/user-attachments/assets/0cc8dd75-4237-4829-a822-0489cad1435b)
