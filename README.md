# MartaFrica E-commerce Frontend

This is the frontend for **MartaFrica**, an e-commerce platform that allows users to:

- Register and login
- View and manage their profile
- Browse and search products
- Admins can create and upload new products with images

The project is built with **Next.js**, **TypeScript**, **Tailwind CSS**, and integrates with the **MartaFrica REST API** hosted on Render.

---

## 🚀 Features

### **Authentication**
- User signup with full name, email, and password confirmation.
- Secure login with token storage in `localStorage`.
- Profile page with auto-fetch user info from backend.
- Logout functionality.

### **Product Management**
- Fetch and display all products.
- Search products by name.
- Admin can:
  - Create new products
  - Upload product images
  - View all products in dashboard

### **Responsive UI**
- TailwindCSS for clean and modern styling.
- Mobile-friendly login/signup forms.

---

## 📂 Folder Structure

## API Endpoints Used
Method	Endpoint	Description
POST	/register/	Create new user account
POST	/admin/register/	Create new admin account
POST	/login/	Login and return auth token
GET	/profile/	Fetch user profile
GET	/products/	List all products
POST	/products/	Create a new product (Admin)
POST	/products/{id}/images	Upload image for a product

## Usage Flow
User registers → Redirect to login

User logs in → Token stored → Redirect to Profile

Profile page shows info using token

Products page fetches and displays items

Admin page allows adding new products & images

## Author
MartaFrica Dev Team
Frontend by Rahman Ademola
Backend by Catherine Wuyep

