# SRP Project

## Instalacija i pokretanje

### Preduvjeti

- Node.js 18+
- npm 9+
- PostgreSQL 13+

### Kloniranje

```
git clone <REPO_URL>
cd srp-project
```

## Backend

```
cd backend
npm install
```

### Konfiguracija baze

Kreiraj lokalnu bazu (npr. `srp_db`) i u `backend/.env` upisi svoj `DATABASE_URL`, npr.:

```
DATABASE_URL="postgresql://postgres:<lozinka>@localhost:5432/srp_db?schema=public"
```

baza se moze kreirati i napuniti inicijalnim podatcima sa skriptom iz 2. dz

### Pokretanje backenda

```
npm run dev
```

## Frontend

```
cd ../frontend
npm install
```

### Konfiguracija frontenda

U `frontend/.env` dodaj:

```
VITE_API_URL=http://localhost:3000/api
```

### Pokretanje frontenda

```
npm run dev
```

## Testovi (opcionalno)

```
cd backend
npm test
```
