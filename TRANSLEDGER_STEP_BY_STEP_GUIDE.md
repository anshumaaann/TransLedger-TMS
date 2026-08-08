# TransLedger TMS — Step-by-Step Guide

This guide explains how to start TransLedger, use it, show it to someone else,
and keep the data safe. You do **not** need to be a programmer.

> Important: Docker Desktop must be running whenever you use TransLedger.

---

## Part 1 — Start TransLedger every day

### Step 1: Start Docker Desktop

1. Open the Windows **Start** menu.
2. Search for **Docker Desktop**.
3. Open it.
4. Wait until Docker Desktop says it is running. This can take one or two
   minutes after a computer restart.

### Step 2: Open PowerShell in the project folder

1. Press the Windows key.
2. Type **PowerShell** and open it.
3. Copy and paste this command, then press Enter:

```powershell
cd C:\Users\admin\Desktop\TransLedger-TMS
```

### Step 3: Start the system

Copy and paste this command, then press Enter:

```powershell
docker compose up -d
```

Wait about 20 seconds the first time after Docker Desktop starts.

### Step 4: Open TransLedger

Open Chrome, Edge, or another browser and go to:

```text
http://localhost:8080
```

Sign in with your TransLedger account.

If you changed the program after downloading a new version from GitHub, use
this command instead one time:

```powershell
docker compose up --build -d
```

---

## Part 2 — Check that it started correctly

In PowerShell, while you are in the TransLedger folder, run:

```powershell
docker compose ps
```

You should see three services: `db`, `api`, and `web`.

If you cannot open `http://localhost:8080`, wait one minute and try again. If
it still does not work, run:

```powershell
docker compose logs api
```

This shows the reason the system did not start.

---

## Part 3 — Everyday use inside TransLedger

### Add master data first

Before making a booking, add these items from the left-side menu:

1. **Customers**
2. **Brokers**
3. **Vehicles**
4. **Locations** (sites used for loading and unloading)

You can also use the `+` buttons inside the booking form to quickly add a
customer, broker, vehicle, or site without leaving the booking page.

### Create a booking

1. Open **Bookings**.
2. Click **+ Create Booking**.
3. Select the customer, broker, vehicle, loading site, and unloading site.
4. Enter freight amounts.
5. Under **Customer payment**, choose:
   - **Fully paid** if the customer has settled the full amount now; or
   - **Pending** if money is still due. Enter any amount received now.
6. Enter **TDS deducted from us** if the customer deducted TDS. TDS reduces
   the amount still pending from that customer.
7. Under **Broker payment**, choose **Fully paid** or **Pending**, then enter
   any amount paid to the broker now.
8. Check the displayed customer and broker pending amounts.
9. Click **Save Booking**.

### Record money later

When money is received from a customer or paid to a broker later:

1. Open **Payments**.
2. Click **+ Record Payment**.
3. Select the booking.
4. Choose either:
   - **Customer paid us**, or
   - **We paid broker**.
5. Enter the amount, date, payment method, and reference number.
6. For a customer, enter TDS if it was deducted from your payment.
7. Click **Save Payment**.

The booking balance updates automatically. The system will not allow a payment
larger than the amount still pending.

### View an account history

1. Open **Ledgers**.
2. Choose **Customer** or **Broker**.
3. Select the person/company.
4. Read the full list of freight, advances, TDS, payments, and the remaining
   balance.

---

## Part 4 — Give each person their own login

1. Sign in with the **admin** account.
2. Open **Staff accounts** from the left-side menu.
3. Create one account for each person.
4. Give each person their own email and password.
5. For staff who need to enter bookings, payments, and master data, choose the
   **Dispatcher** role in the current version.

Never share the admin password with staff. You can change your own password in
**Settings**.

---

## Part 5 — Show TransLedger to someone on the same Wi-Fi

This works when the other person is near you and connected to the same Wi-Fi
network.

### Step 1: Find your computer's local IP address

In PowerShell, run:

```powershell
ipconfig
```

Look for an **IPv4 Address** under the Wi-Fi section. It will look similar to:

```text
192.168.1.25
```

### Step 2: Send them this address

Replace the example number with your own IPv4 address:

```text
http://192.168.1.25:8080
```

Keep your computer awake and Docker Desktop running. If Windows asks whether to
allow network access, allow it on **Private networks**.

---

## Part 6 — Show TransLedger to someone far away (temporary link)

Use this only for a demonstration or short-term sharing. The address changes
when Docker or the computer restarts.

### Step 1: Make sure TransLedger is running

```powershell
cd C:\Users\admin\Desktop\TransLedger-TMS
docker compose up -d
```

### Step 2: Create the temporary sharing link

Copy and paste this single command:

```powershell
docker run -d --rm --name transledger-temp-tunnel cloudflare/cloudflared:latest tunnel --no-autoupdate --url http://host.docker.internal:8080
```

If PowerShell says a container with that name already exists, use this command
first, then run the command above again:

```powershell
docker stop transledger-temp-tunnel
```

### Step 3: Get the link

Run:

```powershell
docker logs transledger-temp-tunnel
```

Find the line containing a link similar to this:

```text
https://something.trycloudflare.com
```

Send that complete link to the other person. They can sign in using the account
you created for them.

### Rules for the temporary link

- Keep Docker Desktop and your computer running.
- Do not share your admin password.
- The link will stop when Docker stops or the computer restarts.
- Make a new link using these same steps when needed.
- Use a permanent HTTPS hosting setup before relying on remote access for daily
  business work.

---

## Part 7 — Set it up on another computer

Use this only when the other computer should run its **own separate copy** of
TransLedger. It will have its own database and its own users.

### Step 1: Install Docker Desktop

Install Docker Desktop on the new computer and restart Windows if Docker asks
you to. Open Docker Desktop and wait for it to be running.

### Step 2: Download your project from GitHub

Install Git if it is not already installed. Then open PowerShell and run:

```powershell
cd C:\Users\YourWindowsUserName\Desktop
git clone https://github.com/anshumaaann/TransLedger-TMS.git
cd TransLedger-TMS
```

### Step 3: Create the private settings file

Run:

```powershell
Copy-Item .env.example .env
notepad .env
```

In Notepad, replace these values with your own private values:

- `POSTGRES_PASSWORD`
- `JWT_SECRET_KEY`
- `INITIAL_ADMIN_EMAIL`
- `INITIAL_ADMIN_PASSWORD`
- `INITIAL_ADMIN_NAME`

Use a long, unique admin password. To create a random JWT secret, run this in a
separate PowerShell window and paste the result into `JWT_SECRET_KEY`:

```powershell
[Guid]::NewGuid().ToString('N') + [Guid]::NewGuid().ToString('N')
```

Save the file and close Notepad. Never upload or share this `.env` file.

### Step 4: Start the new copy

Back in the project PowerShell window, run:

```powershell
docker compose up --build -d
```

Then open:

```text
http://localhost:8080
```

Sign in with the administrator email and password you put in the new `.env`
file.

> Note: This creates a separate database. Bookings entered on this new computer
> will not automatically appear on the first computer. For one shared database
> across distant devices, use one main server and a permanent secure hosting
> setup.

---

## Part 8 — Back up your data

Make a backup before important work and at least once each day.

### Step 1: Create the backup folder (only once)

```powershell
cd C:\Users\admin\Desktop\TransLedger-TMS
mkdir backups
```

If PowerShell says the folder already exists, that is fine.

### Step 2: Make the backup file

```powershell
docker compose exec -T db pg_dump -U transledger transledger > "backups\transledger-backup-$(Get-Date -Format yyyy-MM-dd).sql"
```

Copy the `backups` folder to a USB drive or private cloud storage. Do **not**
copy the `.env` file with it because `.env` contains passwords.

---

## Part 9 — Stop TransLedger safely

At the end of the day, or before restarting Windows, run:

```powershell
cd C:\Users\admin\Desktop\TransLedger-TMS
docker stop transledger-temp-tunnel
docker compose down
```

If you did not create a temporary sharing link, the first command may show an
error. You can ignore that error and run the second command.

Stopping the system does **not** remove your bookings, payments, users, or
database.

> Never run `docker compose down -v`. The `-v` option deliberately removes the
> saved database.

---

## Quick reference

| What you want to do | Command or address |
| --- | --- |
| Start normally | `docker compose up -d` |
| Start after downloading an update | `docker compose up --build -d` |
| Open on this computer | `http://localhost:8080` |
| Check services | `docker compose ps` |
| See error messages | `docker compose logs api` |
| Make a temporary remote link | `docker run -d --rm --name transledger-temp-tunnel cloudflare/cloudflared:latest tunnel --no-autoupdate --url http://host.docker.internal:8080` |
| Show the temporary link | `docker logs transledger-temp-tunnel` |
| Back up data | See Part 8 |
| Stop safely | `docker compose down` |
