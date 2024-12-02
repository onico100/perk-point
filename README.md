# Recipes App

The website is tailored for managing benefit inventories, specifically for user clubs, and allows users to quickly and conveniently access their eligible benefits.

## Installation

1. **Clone the repository:**

```bash
   git clone https://github.com/onico100/perk-point.git
```

2. **Install dependencys:**

```bash
   cd perk-point
   npm install
```

3. **Set up MongoDB:**

- Make sure you have a MongoDB instance running.

- put your MongoDB connection string in the next.config.mjs file.

4. **Run the app:**

```bash
   npm run dev
```

- Open your browser and go to http://localhost:3000.

## Technologies Used

- **Frontend:**: Next.js ver 14 with TypeScript.
- **React Query:** for state management and API calls
- **Zustand:** for global state management
- **Zod:** for validation
- **Backend:** Node.js (using Next.js API routes).
- **Database:** MongoDB for data storage.
- **Styling:** CSS

## App preview

- live Demo: View the app running here: https://perk-point.vercel.app/
