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




# 🛍️ SalesSavvy - Component Breakdown

## 🏗️ **Backend Architecture (Spring Boot)**

### **1. Core Configuration (`config/`)**
- **`SecurityConfig.java`** - Spring Security configuration
  - Disables CSRF for API
  - Configures CORS for frontend communication
  - Permits all requests (for development)
- **`CorsConfig.java`** - Cross-Origin Resource Sharing
  - Allows requests from React frontend (localhost:5173, 3000)
  - Configures allowed methods and headers
- **`AsyncConfig.java`** - Enables asynchronous processing
- **`SimpleCorsFilter.java`** - Handles CORS pre-flight requests

### **2. Controllers (`controller/`) - API Endpoints**
- **`UsersController.java`** - User authentication & management
  - `/api/auth/signup` - User registration
  - `/api/auth/signin` - User login
  - Role-based access (admin/customer)
- **`ProductController.java`** - Product catalog management
  - CRUD operations for products
  - Add products to cart
  - Search and filter products
- **`OrderController.java`** - Order processing
  - Create, retrieve, update orders
  - Order status management
- **`CartController.java`** - Shopping cart operations
  - Add/remove items, update quantities
  - Cart total calculation
- **`PaymentController.java`** - Razorpay integration
  - Create payment orders
  - Verify transactions
- **`ReviewController.java`** - Product reviews & ratings
- **`WishlistController.java`** - Favorite products management
- **`AddressController.java`** - User address book
- **`CouponController.java`** - Discount code validation
- **`AnalyticsController.java`** - Dashboard data
- **`ActivityLogController.java`** - System activity tracking
- **`ForgotPasswordController.java`** - Password reset with OTP

### **3. Entities (`entity/`) - Database Models**
- **`Users.java`** - User accounts with roles (admin/customer)
- **`Product.java`** - Product catalog with inventory tracking
- **`Cart.java`** - Shopping cart with items
- **`CartItem.java`** - Individual cart items with quantities
- **`Order.java`** - Order details and status
- **`OrderItem.java`** - Ordered product line items
- **`Address.java`** - User shipping addresses
- **`Review.java`** - Product reviews and ratings
- **`Wishlist.java`** - User favorite products
- **`Coupon.java`** - Discount codes and rules
- **`ActivityLog.java`** - System activity tracking

### **4. Services (`service/`) - Business Logic**
- **`UsersService.java`** - User registration, authentication, password management
- **`ProductService.java`** - Product CRUD, inventory management
- **`OrderService.java`** - Order processing, status updates
- **`CartService.java`** - Cart operations and calculations
- **`ReviewService.java`** - Review validation and ratings
- **`EmailService.java`** - OTP and notification emails
- **`AnalyticsService.java`** - Dashboard metrics and reports
- **`ActivityLogService.java`** - System activity tracking
- **`CouponService.java`** - Discount validation and calculation

### **5. Repositories (`repository/`) - Data Access**
- Spring Data JPA repositories for all entities
- Custom query methods for complex operations
- Database interaction layer

### **6. DTOs (`dto/`) - Data Transfer Objects**
- **`CartResponse.java`** - Cart data for frontend
- **`CartItemResponse.java`** - Individual cart items
- **`SignInResponse.java`** - Login response data

### **7. Utilities & Configuration**
- **`PasswordEncoder.java`** - BCrypt password encryption
- **`application.properties`** - Database, email, security config
- **`pom.xml`** - Maven dependencies

---

## ⚛️ **Frontend Architecture (React)**

### **1. Authentication & User Management**
- **Login/Signup Components** - User authentication
- **Role-based Routing** - Admin vs Customer views
- **Password Reset** - OTP-based recovery system

### **2. Product Management**
- **Product Listing** - Display all products with filters
- **Product Details** - Individual product pages
- **Search & Categories** - Product discovery
- **Admin Product CRUD** - Add/edit/delete products

### **3. Shopping Cart System**
- **Cart Page** - View and manage cart items
- **Quantity Controls** - Update item quantities
- **Price Calculation** - Real-time total updates
- **Cart Persistence** - Saved across sessions

### **4. Order Management**
- **Checkout Process** - Address selection, payment
- **Order History** - User order tracking
- **Order Status** - Real-time status updates
- **Admin Order Management** - Process and update orders

### **5. Payment Integration**
- **Razorpay Gateway** - Secure payment processing
- **Order Confirmation** - Payment success handling
- **Receipt Generation** - Order summaries

### **6. User Experience Features**
- **Wishlist** - Save favorite products
- **Product Reviews** - Rating and feedback system
- **Address Management** - Multiple shipping addresses
- **Coupon System** - Apply discount codes

### **7. Admin Dashboard**
- **Analytics Overview** - Sales, revenue, user metrics
- **Inventory Management** - Stock level monitoring
- **User Management** - Customer and admin accounts
- **Activity Logs** - System activity monitoring

---

## 🔄 **Data Flow**

### **Frontend → Backend**
1. **React Components** make API calls to Spring Boot controllers
2. **Controllers** validate requests and call services
3. **Services** implement business logic using repositories
4. **Repositories** interact with MySQL database
5. **Responses** flow back through the same layers

### **Key Data Flow Examples:**
- **User Registration**: React form → UsersController → UsersService → UsersRepository → MySQL
- **Add to Cart**: React button → CartController → CartService → CartRepository → MySQL
- **Place Order**: Checkout → OrderController → OrderService → Payment integration → OrderRepository

---

## 🗃️ **Database Schema Highlights**

### **Core Relationships:**
- **Users** ↔ **Cart** (One-to-One)
- **Users** ↔ **Orders** (One-to-Many)
- **Users** ↔ **Addresses** (One-to-Many)
- **Products** ↔ **CartItems** (Many-to-Many via Cart)
- **Products** ↔ **Orders** (Many-to-Many via OrderItems)
- **Users** ↔ **Reviews** (One-to-Many)
- **Users** ↔ **Wishlist** (One-to-One)

---

## 🛡️ **Security Features**

### **Authentication & Authorization:**
- Password hashing with BCrypt
- Role-based access control (Admin/Customer)
- Session management
- CORS protection

### **Data Protection:**
- Input validation at controller level
- SQL injection prevention (JPA)
- XSS protection through proper encoding

### **Payment Security:**
- Razorpay secure payment gateway
- Payment signature verification
- Secure API key management

---

## 📊 **Analytics & Monitoring**

### **Business Intelligence:**
- Sales trends and revenue analytics
- Product performance tracking
- User behavior monitoring
- Inventory optimization

### **System Monitoring:**
- Activity logging for all major operations
- Error tracking and reporting
- Performance metrics

This comprehensive component structure creates a robust, scalable e-commerce platform with clear separation of concerns and maintainable code architecture.




# 🛍️ SalesSavvy - Complete Technology Stack & Components

## 🎯 **Project Overview**
A full-stack e-commerce platform with **Spring Boot backend** and **React frontend** featuring complete shopping experience, admin dashboard, and analytics.

---

## 🛠️ **Backend Technologies (Spring Boot)**

### **Core Framework**
- **Spring Boot 3.5.5** - Main application framework
- **Java 17** - Programming language
- **Maven** - Dependency management and build tool

### **Database & Persistence**
- **Spring Data JPA** - Object-relational mapping
- **MySQL** - Primary relational database
- **H2 Database** - In-memory database for testing
- **Hibernate** - JPA implementation

### **Security & Authentication**
- **Spring Security** - Authentication and authorization
- **BCrypt Password Encoding** - Secure password hashing
- **CORS Configuration** - Cross-origin resource sharing
- **Session Management** - User session handling

### **Web & REST API**
- **Spring MVC** - Model-View-Controller architecture
- **REST Controllers** - API endpoint definitions
- **JSON Processing** - Request/response serialization
- **Validation** - Input data validation

### **External Integrations**
- **Razorpay Java SDK** - Payment gateway integration
- **Spring Mail** - Email service for OTP and notifications
- **Async Processing** - Background task execution

### **Development Tools**
- **Spring Boot DevTools** - Hot reload for development
- **Lombok** - Reduced boilerplate code
- **Spring Boot Testing** - Unit and integration tests

---

## ⚛️ **Frontend Technologies (React)**

### **Core Framework**
- **React 18** - UI library
- **JavaScript/JSX** - Programming language and syntax

### **State Management**
- **React Context API** - Global state management
- **useState/useEffect Hooks** - Local component state
- **Props Drilling** - Component communication

### **Routing & Navigation**
- **React Router** - Client-side routing
- **Programmatic Navigation** - Dynamic page transitions

### **HTTP Client**
- **Fetch API / Axios** - HTTP requests to backend
- **Promise Handling** - Async operation management

### **UI & Styling**
- **CSS3** - Styling and layout
- **Flexbox/Grid** - Responsive design
- **Custom Components** - Reusable UI elements

### **Form Handling**
- **Controlled Components** - Form state management
- **Form Validation** - Client-side validation
- **File Upload** - Image handling for products

---

## 🗃️ **Database Components**

### **Core Entities**
```java
Users (id, username, email, password, role, createdAt)
Products (id, name, description, price, category, stock, photo)
Cart (id, user_id) + CartItems (cart_id, product_id, quantity)
Orders (id, orderId, username, totalAmount, status, orderDate)
OrderItems (order_id, product_id, quantity, price)
Addresses (id, username, street, city, state, zipCode)
Reviews (id, username, product_id, rating, comment)
Wishlist (id, username) + Wishlist_Products mapping
Coupons (id, code, discountType, discountValue, validity)
ActivityLogs (id, activityType, description, username, timestamp)
```

### **Key Relationships**
- **One-to-One**: User ↔ Cart
- **One-to-Many**: User → Orders, User → Addresses, User → Reviews
- **Many-to-Many**: Products ↔ Cart (through CartItems), Products ↔ Orders (through OrderItems)

---

## 🔧 **Key Features Implemented**

### **1. User Management**
- **Registration & Login** with email/username
- **Role-based Access** (Admin/Customer)
- **Password Reset** with OTP via email
- **Profile Management**

### **2. Product Catalog**
- **CRUD Operations** for products
- **Category-based Filtering**
- **Search Functionality**
- **Inventory Management**
- **Image Upload/Display**

### **3. Shopping Experience**
- **Add to Cart** with quantity management
- **Wishlist** for saving favorites
- **Product Reviews & Ratings**
- **Stock Validation**

### **4. Order Management**
- **Checkout Process**
- **Order Tracking**
- **Status Updates** (Pending → Confirmed → Shipped → Delivered)
- **Order History**

### **5. Payment System**
- **Razorpay Integration** for payments
- **Order Creation & Verification**
- **Payment Status Tracking**

### **6. Address Management**
- **Multiple Shipping Addresses**
- **Default Address Selection**
- **Address Validation**

### **7. Discount System**
- **Coupon Codes** (Percentage/Fixed amount)
- **Minimum Order Validation**
- **Usage Limits & Expiry**

### **8. Analytics & Reporting**
- **Sales Dashboard** with charts
- **Revenue Tracking**
- **Product Performance** metrics
- **User Activity Monitoring**

### **9. Admin Features**
- **Dashboard Overview**
- **Product Management**
- **Order Processing**
- **User Management**
- **System Analytics**

### **10. Security Features**
- **Password Encryption**
- **CORS Protection**
- **Input Validation**
- **Secure API Endpoints**

---

## 🚀 **Architecture Patterns**

### **Backend Patterns**
- **MVC Architecture** - Model-View-Controller
- **Repository Pattern** - Data access abstraction
- **Service Layer** - Business logic separation
- **DTO Pattern** - Data transfer objects
- **Dependency Injection** - Spring IoC container

### **Frontend Patterns**
- **Component-Based Architecture** - Reusable UI components
- **Container/Presenter Pattern** - Logic vs presentation separation
- **Context API** - Global state management
- **HOC Pattern** - Component composition

---

## 📡 **API Design**

### **RESTful Principles**
- **Resource-based URLs** (`/api/products`, `/api/orders`)
- **HTTP Methods** (GET, POST, PUT, DELETE)
- **Stateless Communication**
- **JSON Request/Response**

### **Key Endpoint Categories**
```
/auth/*          - Authentication endpoints
/products/*      - Product management
/cart/*          - Shopping cart operations
/orders/*        - Order processing
/payment/*       - Payment integration
/reviews/*       - Product reviews
/addresses/*     - Address management
/analytics/*     - Dashboard data
/activities/*    - System logs
```

---

## 🔄 **Data Flow**

### **Frontend → Backend Flow**
1. **React Component** → User interaction
2. **API Service** → HTTP request to backend
3. **Spring Controller** → Request handling
4. **Service Layer** → Business logic
5. **Repository** → Database operations
6. **Response** → JSON data back to frontend

### **Example: Add to Cart**
```
Frontend: AddToCart button click
→ CartService.addToCart(productId, quantity)
→ POST /api/cart/add
→ CartController.addToCart()
→ CartService.updateCart()
→ CartRepository.save()
→ Database: Update cart_items table
→ Response: Success message + updated cart
```

---

## 🛡️ **Security Implementation**

### **Authentication**
- **Session-based Authentication**
- **Password Hashing** with BCrypt
- **Role-based Authorization**

### **Data Protection**
- **SQL Injection Prevention** (JPA parameter binding)
- **XSS Prevention** (Input sanitization)
- **CORS Configuration** (Allowed origins)

### **Payment Security**
- **Razorpay Secure Gateway**
- **Payment Signature Verification**
- **SSL/HTTPS Ready**

---

## 📊 **Performance & Optimization**

### **Backend Optimization**
- **Lazy Loading** for relationships
- **Pagination** for large datasets
- **Database Indexing** for frequent queries
- **Async Processing** for emails

### **Frontend Optimization**
- **Component Re-render Optimization**
- **Efficient State Updates**
- **Image Optimization**
- **Bundle Size Management**

---

## 🔍 **Monitoring & Logging**

### **Activity Tracking**
- **User Actions** (login, orders, reviews)
- **Admin Operations** (product updates, order changes)
- **System Events** (errors, important operations)

### **Error Handling**
- **Global Exception Handler**
- **Structured Error Responses**
- **Logging for Debugging**

---

## 🚀 **Deployment Ready Features**

### **Configuration Management**
- **Environment-specific Properties**
- **External Configuration** (database, email, payment)
- **Profile-based Settings**

### **Build & Packaging**
- **Maven Build System**
- **Executable JAR** creation
- **Static React Build** for frontend

---

## 💡 **Innovative Features**

1. **Real-time Analytics** - Live sales data and trends
2. **OTP-based Password Reset** - Secure account recovery
3. **Wishlist with Quantities** - Advanced wishlist management
4. **Activity Logging** - Comprehensive system monitoring
5. **Coupon System** - Flexible discount management
6. **Inventory Alerts** - Low stock notifications
7. **Multi-address Support** - Flexible shipping options

This comprehensive technology stack creates a **production-ready e-commerce platform** with modern development practices, robust security, and excellent user experience across both customer and admin interfaces.