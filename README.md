# Perk Point App

The Perk Point App is designed to streamline the management of benefit inventories for user clubs. It provides users with a seamless and efficient way to access their eligible benefits.

### **User Side**

- **Club-Specific Benefits:** Users can view benefits tied to their specific clubs.
- **Advanced Search:** Search benefits by categories, clubs, place, date, and more.
- **Saved Benefits:** Save favorite benefits for quick access.
- **Benefit Calculator:** A built-in tool to calculate the price of each product after applying eligible benefits.

### **Supplier Side**

- **Manage Benefits**:
  - **Add**: Easily add new benefits to the company's inventory.
  - **Update**: Modify existing benefits.
  - **Delete**: Remove benefits no longer offered.

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

**Frontend:**

- Next.js (v14): React-based framework for building modern web applications.
- TypeScript: For type safety and improved development experience.
- React Query: Handles API calls and caching.
- Zustand: Lightweight global state management.
- Zod: Ensures robust validation of user inputs.

**Backend:**

- Node.js (using Next.js API routes).

  **Database:**

- MongoDB for data storage.

**Styling:**

- CSS: Custom styles for a clean and responsive design.

**Third-Party Libraries:**

- **Cloudinary:** Efficient image storage and optimization.
- **SweetAlert:** Interactive and user-friendly notifications.
- **Google OAuth:** Secure authentication using Google accounts.

## App preview

- live Demo: View the app running here: https://perk-point.vercel.app/
