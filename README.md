# 🛍️ SalesSavvy - E-commerce Platform

A full-stack e-commerce solution built with **Spring Boot** backend and **React** frontend, featuring a complete online shopping experience with admin dashboard, analytics, and secure payment integration.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.5-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue)

## ✨ Features

### 🛒 Customer Features
- **User Authentication** - Secure signup/login with password encryption
- **Product Catalog** - Browse products with categories and search
- **Shopping Cart** - Add/remove items with quantity management
- **Wishlist** - Save favorite products for later
- **Order Management** - Track order status and history
- **Product Reviews & Ratings** - Customer feedback system
- **Coupon System** - Discount codes and promotional offers
- **Address Management** - Multiple shipping addresses
- **Secure Payments** - Razorpay integration

### 📊 Admin Features
- **Dashboard Analytics** - Sales metrics and business insights
- **Product Management** - CRUD operations for products
- **Inventory Management** - Stock tracking and low stock alerts
- **Order Management** - Process and update order status
- **User Management** - Customer and admin user management
- **Activity Logs** - Track system activities and user actions
- **Sales Reports** - Revenue analytics and trends

### 🔒 Security Features
- **Password Encryption** - BCrypt password hashing
- **CORS Configuration** - Secure cross-origin requests
- **Input Validation** - Data integrity and security
- **OTP Verification** - Secure password reset process
- **Session Management** - Secure user sessions

## 🏗️ Architecture

```
SalesSavvy/
├── Backend (Spring Boot)
│   ├── Controllers - REST API endpoints
│   ├── Services - Business logic layer
│   ├── Repositories - Data access layer
│   ├── Entities - JPA model classes
│   └── DTOs - Data transfer objects
├── Frontend (React)
│   ├── Components - Reusable UI components
│   ├── Pages - Application screens
│   ├── Services - API integration
│   └── Context - State management
```

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Node.js 16+
- React 18+

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sales-savvy.git
   cd sales-savvy
   ```

2. **Database Configuration**
   ```sql
   CREATE DATABASE sales_savvy;
   ```

3. **Configure application properties**
   ```properties
   # src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/sales_savvy
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```

4. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## 📚 API Documentation

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/signin` | User login |
| GET | `/api/products` | Get all products |
| POST | `/api/cart/add` | Add to cart |
| GET | `/api/orders/user/{username}` | Get user orders |
| POST | `/api/payment/create-order` | Create payment order |

### Sample API Usage

```javascript
// User Registration
fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'securePassword123'
  })
});
```

## 🗃️ Database Schema

### Core Entities
- **Users** - Customer and admin accounts
- **Products** - Product catalog with inventory
- **Orders** - Order details and status
- **Cart** - Shopping cart management
- **Reviews** - Product ratings and reviews
- **Addresses** - User address book
- **Coupons** - Discount codes

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.5.5
- **Security**: Spring Security
- **Database**: MySQL with JPA/Hibernate
- **Payment**: Razorpay Integration
- **Email**: Spring Mail for notifications
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **State Management**: React Context API
- **Routing**: React Router
- **HTTP Client**: Axios
- **UI Components**: Custom CSS/React components

## 📦 Project Structure

```
src/main/java/com/salesSavvy/
├── config/          # Configuration classes
├── controller/      # REST API controllers
├── service/         # Business logic layer
├── repository/      # Data access layer
├── entity/          # JPA entities
├── dto/            # Data transfer objects
├── exception/       # Custom exception handling
└── util/           # Utility classes
```

## 🔧 Configuration

### Environment Variables
```properties
# Database
DB_URL=jdbc:mysql://localhost:3306/sales_savvy
DB_USERNAME=root
DB_PASSWORD=password

# Payment
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your_email@gmail.com
SPRING_MAIL_PASSWORD=your_app_password
```

## 🚀 Deployment

### Backend Deployment
```bash
# Build the application
./mvnw clean package

# Run the JAR file
java -jar target/com.salesSavvy-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve static files
serve -s build
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Spring Boot community
- React team
- Razorpay for payment integration
- All contributors and testers

---

**⭐ Star this repo if you find it helpful!**

For questions or support, please open an issue or contact the development team.