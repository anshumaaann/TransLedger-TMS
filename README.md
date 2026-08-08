# TransLedger TMS

Transport management system for managing bookings, customers, brokers, vehicles, sites, and operational reporting.

## Quick start (recommended)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine with Compose)

### Start the system

1. Copy `.env.example` to `.env`.
2. Set long, unique values for `POSTGRES_PASSWORD`, `JWT_SECRET_KEY`, and `INITIAL_ADMIN_PASSWORD` in `.env`. Also replace the initial administrator email and name with yours.
3. From this folder, run `docker compose up --build -d`.
4. Open `http://localhost:8080` in a browser.

For another device on the same network, open `http://<server-ip>:8080`. Keep the host computer running and allow inbound TCP port 8080 through its firewall.

The database is stored in the Docker volume `postgres_data`, so application updates do not erase business data. Stop the system with `docker compose down`; do not add `-v` unless you intentionally want to erase the database.

## Development setup

The frontend runs on port 5173 and proxies `/api` to the backend on port 8000. Copy `backend/.env.example` to `backend/.env`, supply your local PostgreSQL credentials, then run Alembic migrations before starting the API.

## Accounts and permissions

The address and password in `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD` become the first administrator account when the system starts. Sign in with that account, then open **Staff accounts** to create individual accounts for your team. Never share the administrator password.

Roles in this first version are:

- **Admin**: creates and manages staff accounts, and can access all operational data.
- **Dispatcher**: works with bookings and the master data used for bookings.
- **Accountant** and **Viewer**: can access the dashboard only while dedicated accounting and reporting workflows are completed.

## Everyday use

Open `http://localhost:8080` to use the live system on this computer. Do not use the development address ending in `:5173` for normal work.

Your first administrator email and password are the `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD` values in the private `.env` file. After signing in, go to **Settings** and change the initial password, then open **Staff accounts** to make a separate account for every employee.

### Start and stop

Start the system after a computer restart:

```powershell
docker compose up -d
```

Stop it safely at the end of the day or before a computer restart:

```powershell
docker compose down
```

Stopping does not delete bookings or staff accounts. Do not use `docker compose down -v` because that deliberately erases the database.

### Backup

Before using TransLedger for real bookings, take a backup at least once per day. From this project folder, create a folder named `backups`, then run:

```powershell
docker compose exec -T db pg_dump -U transledger transledger > backups\transledger-backup.sql
```

Copy the `backups` folder to a safe external drive or cloud storage. Do not store `.env` with the backup because it contains passwords.

## Production note

Before exposing this system to the internet, place it behind HTTPS and add authentication/role-based access control. The current deployment is appropriate for a trusted office network while those features are completed.
