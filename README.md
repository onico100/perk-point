# Perk Point App

An online platform designed for managing users' benefit inventory, centralizing all their perks in one place, and providing quick and convenient access to benefits based on the clubs and cards they are members of.

### **User Side**

- **Club-Specific Benefits:** Users can view benefits tied to their specific clubs.
- **Advanced Search:** Search benefits by categories, clubs, place, date, and more.
- **Saved Benefits:** Save favorite benefits for quick access.
- **Benefit Calculator:** A built-in tool to calculate the price of each product after applying eligible benefits.

### **Supplier Side**

- **Manage Benefits**:

  - **Add**: Easily add new benefits to the company's inventory.
  - **Update**: Modify existing benefits.
  - **Delete**: Remove benefits that are no longer offered.
  - **Upload Benefits via Excel**:
  - Suppliers can bulk upload benefits using an Excel file, making it easier to manage large inventories.

- **Track Benefit Views:**
  Suppliers can monitor how many users have viewed each benefit. This allows suppliers to analyze user interest and adjust their offerings accordingly.
  The supplier dashboard provides a real-time count of views for each benefit.

### **Club Integration**

- **Request to Join**: Clubs can request to join the platform via an intuitive interface.
- **API Integration**: Clubs can provide an API (following documentation) to allow automatic fetching of all their benefits. This ensures that club benefits stay updated on the platform in real-time.

### **Admin Panel**

- **Manage Clubs**: Admins can add, remove, or edit club details. They can also approve or reject requests from clubs to join the platform.
- **Control Data**: Admins have full control over benefits, suppliers, and clubs, ensuring the platform operates smoothly.

### **Demonstration Club Site**

- A fake club site has been created to demonstrate how the API integration works. This showcases how benefits can be fetched dynamically from a club.
  you can see the code here: https://github.com/onico100/perkpoint-club.git
  and the club site running here:https://perkpoint-club.vercel.app/

## Installation

1. **Clone the repository:**

```bash
   git clone https://github.com/onico100/perk-point.git
```

2. **Install dependencies:**

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

## How to Use

**For Users**

- Log in securely using Google OAuth or email and password.
- Explore benefits specific to your clubs or search by category, place, or date.
- Save favorite benefits for easy access.
- Use the Benefit Calculator to calculate product costs after applying eligible benefits.

**For Suppliers**

- Log in or create an account.
- Add benefits manually or upload an Excel file for bulk addition.
- Edit or delete existing benefits.

**For Clubs**

- Submit a request to join the platform.
- Optionally provide an API (following the provided documentation) to enable automatic benefit updates.

**For Admins**

- Access the admin panel to manage clubs, suppliers, and benefits.
- Approve or reject club requests to join.
- Monitor and control all data on the platform.

**API Integration Documentation**
Clubs can enable integration by providing API endpoints for fetching benefits. The API should follow the documented structure to ensure compatibility with the platform. Key details include:

Authentication: Provide a token-based or other secure mechanism.
Endpoints:
GET api/benefits/clubid?**\*\***\*\*\*\***\*\***: Fetch all benefits from the club.
For more detailed documentation, refer to the API documentation file.
[Download Documentation](./public/assets/Documentation.pdf)

**Excel Upload Guide**
Suppliers can streamline benefit management with the Excel upload feature:

- Download the sample Excel template.
- Fill in the required fields such as benefit name, category, start date, end date, etc.
- Upload the file through the supplier dashboard.
- The system validates the data and adds the benefits automatically.

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

## Contributors

We would like to thank the following contributors for their valuable efforts:

- [Contributor 1](https://github.com/Talia22) - Talia Fridman
- [Contributor 2](https://github.com/BatyahCohen) - Batyah Cohen
- [Contributor 3](https://github.com/Tamar-Amar) - Tamar Amar
