# AxonAdmin

Ett modernt administrationsystem med rollbaserad åtkomstkontroll, byggt med Vue.js och Express.js mikroservices.

## Innehållsförteckning

- [Om projektet](#om-projektet)
- [Funktioner](#funktioner)
- [Teknikstack](#teknikstack)
- [Komma igång](#komma-igång)
- [Användarguide](#användarguide)
- [Utveckling](#utveckling)
- [API-dokumentation](#api-dokumentation)

## Om projektet

AxonAdmin är ett fullstack-administrationsystem som tillhandahåller säker autentisering och rollbaserad åtkomstkontroll. Systemet är uppdelat i mikroservices för att möjliggöra skalbarhet och enkel underhåll.

### Användarroller

Systemet stödjer tre användarroller med olika behörighetsnivåer:

| Roll | Beskrivning | Åtkomst |
|------|-------------|---------|
| **user** | Grundläggande användare | Kan se dashboard och hantera egna todos |
| **usp** | Användartjänstleverantör | Har user-behörigheter + tillgång till USP-data |
| **admin** | Administratör | Full åtkomst till alla funktioner inklusive admin-panel |

## Funktioner

- Användarkonto-hantering (registrering och inloggning)
- JWT-baserad autentisering
- Rollbaserad åtkomstkontroll
- Dashboard för alla inloggade användare
- Todo-hantering för användare
- USP-datahantering för USP-roller
- Admin-panel för administratörer
- Responsiv design

## Teknikstack

### Frontend
- **Vue.js 3** - Progressivt JavaScript-ramverk
- **TypeScript** - Typsäker JavaScript
- **Vue Router** - Routing
- **Pinia** - State management
- **Axios** - HTTP-klient
- **Vite** - Build-verktyg

### Backend
- **Express.js** - Web-ramverk för Node.js
- **TypeScript** - Typsäker JavaScript
- **JSON Web Tokens (JWT)** - Autentisering
- **CORS** - Cross-Origin Resource Sharing

### Arkitektur
Projektet använder en mikroservice-arkitektur med tre separata backend-tjänster:
- **backend-auth** - Hanterar autentisering och JWT-tokens
- **backend-data** - Datahantering och CRUD-operationer
- **backend-usp** - USP-specifik funktionalitet

## Komma igång

### Förutsättningar

Se till att du har följande installerat:
- Node.js (version 14 eller högre)
- npm eller yarn

### Installation

1. Klona repositoryt:
```bash
git clone <repository-url>
cd AxonAdmin
```

2. Installera frontend-beroenden:
```bash
cd frontend
npm install
```

3. Installera backend-beroenden för varje mikroservice:
```bash
# Auth service
cd ../projekt-backends/backend-auth
npm install

# Data service
cd ../backend-data
npm install

# USP service
cd ../backend-usp
npm install
```

### Starta applikationen

För att köra hela applikationen behöver du starta både frontend och alla backend-tjänster.

#### Starta Frontend
```bash
cd frontend
npm run dev
```
Frontend körs nu på `http://localhost:5173` (Vite default port)

#### Starta Backend-tjänster

Öppna tre separata terminaler och kör följande kommandon:

**Terminal 1 - Auth Service:**
```bash
cd projekt-backends/backend-auth
npm run dev
```

**Terminal 2 - Data Service:**
```bash
cd projekt-backends/backend-data
npm run dev
```

**Terminal 3 - USP Service:**
```bash
cd projekt-backends/backend-usp
npm run dev
```

## Användarguide

### Registrera ett nytt konto

1. Öppna applikationen i din webbläsare (vanligtvis `http://localhost:5173`)
2. Klicka på **Registrera** eller navigera till registreringssidan
3. Fyll i formuläret med:
   - Användarnamn
   - Email
   - Lösenord
   - Välj användarroll (user, usp, eller admin)
4. Klicka på **Registrera**
5. Du kommer automatiskt att loggas in och omdirigeras till dashboard

### Logga in

1. Från startsidan, klicka på **Logga in**
2. Ange ditt användarnamn och lösenord
3. Klicka på **Logga in**
4. Du omdirigeras till dashboard baserat på din användarroll

### Dashboard

Efter inloggning kommer du till dashboard där du kan:
- Se dina användaruppgifter
- Navigera till rollspecifika funktioner
- Logga ut

### Användarfunktioner (user-roll)

Som grundläggande användare har du tillgång till:

#### Todos
1. Navigera till **Todos** från menyn
2. Här kan du:
   - Se din lista över todos
   - Lägga till nya todos
   - Markera todos som klara
   - Ta bort todos

### USP-funktioner (usp-roll)

Som USP-användare har du tillgång till allt som user-rollen har, plus:

#### USP Data
1. Navigera till **USP Data** från menyn
2. Här kan du:
   - Visa och hantera USP-specifik data
   - Utföra USP-relaterade operationer

### Admin-funktioner (admin-roll)

Som administratör har du full åtkomst till systemet:

#### Admin Panel
1. Navigera till **Admin Panel** från menyn
2. Här kan du:
   - Se alla användare i systemet
   - Hantera användarroller
   - Övervaka systemaktivitet
   - Utföra administrativa operationer

### Logga ut

1. Klicka på **Logga ut**-knappen i navigationsmenyn
2. Du kommer att omdirigeras till startsidan
3. Din session raderas och du måste logga in igen för att komma åt skyddade sidor

### Säkerhet

- Alla lösenord ska vara säkra och unika
- JWT-tokens används för att autentisera varje förfrågan
- Tokens lagras säkert i webbläsaren
- Sessionen upphör automatiskt vid utloggning

## Utveckling

### Projektstruktur

```
AxonAdmin/
├── frontend/               # Vue.js frontend
│   ├── src/
│   │   ├── components/    # Vue-komponenter
│   │   ├── router/        # Vue Router-konfiguration
│   │   ├── store/         # Pinia state management
│   │   ├── App.vue        # Huvudkomponent
│   │   └── main.ts        # Ingångspunkt
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
└── projekt-backends/       # Backend mikroservices
    ├── backend-auth/      # Autentiseringstjänst
    │   ├── src/
    │   └── package.json
    ├── backend-data/      # Datahanteringstjänst
    │   ├── src/
    │   └── package.json
    └── backend-usp/       # USP-tjänst
        ├── src/
        └── package.json
```

### Bygga för produktion

#### Frontend
```bash
cd frontend
npm run build
```
Detta skapar en optimerad produktionsbuild i `dist/`-mappen.

#### Förhandsgranska produktionsbuild
```bash
cd frontend
npm run preview
```

### Kodstil och linting

Projektet använder TypeScript för typkontroll. För att kontrollera typer:
```bash
cd frontend
npx tsc --noEmit
```

## API-dokumentation

### Autentisering

Alla skyddade endpoints kräver en giltig JWT-token i Authorization-headern:
```
Authorization: Bearer <token>
```

### Rollbaserad auktorisering

Systemet använder `authorizeAtLeast(role)`-middleware för att kontrollera behörigheter:

| Endpoint-typ | Krävd roll | Tillåtna roller |
|-------------|-----------|----------------|
| `/user/*` | user | user, usp, admin |
| `/usp/*` | usp | usp, admin |
| `/admin/*` | admin | admin |

### Exempel på API-anrop

#### Registrera användare
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "user"
}
```

#### Logga in
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

#### Hämta användardata (kräver autentisering)
```bash
GET /api/user/info
Authorization: Bearer <your-jwt-token>
```

## Felsökning

### Vanliga problem

**Problem:** Frontend kan inte ansluta till backend
- **Lösning:** Kontrollera att alla tre backend-tjänster körs och att CORS är korrekt konfigurerat

**Problem:** "401 Unauthorized" fel
- **Lösning:** Kontrollera att du är inloggad och att din JWT-token är giltig

**Problem:** Åtkomst nekad till vissa sidor
- **Lösning:** Kontrollera att ditt användarkonto har rätt roll för den sidan du försöker nå

**Problem:** Applikationen laddar inte
- **Lösning:**
  1. Kontrollera att alla npm-paket är installerade
  2. Rensa cache: `npm cache clean --force`
  3. Ta bort `node_modules` och kör `npm install` igen

## Bidrag

Om du vill bidra till projektet:
1. Forka repositoryt
2. Skapa en feature-branch (`git checkout -b feature/AmazingFeature`)
3. Commit:a dina ändringar (`git commit -m 'Add some AmazingFeature'`)
4. Push:a till branchen (`git push origin feature/AmazingFeature`)
5. Öppna en Pull Request

## Licens

[Lägg till licensinformation här]

## Kontakt

[Lägg till kontaktinformation här]

---

Skapad med Vue.js och Express.js
