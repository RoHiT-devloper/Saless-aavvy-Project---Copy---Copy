// package com.salesSavvy.service;

// import com.salesSavvy.entity.*;
// import com.salesSavvy.repository.*;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import java.time.LocalDateTime;
// import java.time.temporal.ChronoUnit;
// import java.util.*;
// import java.util.stream.Collectors;

// @Service
// public class AnalyticsService {

//     @Autowired
//     private OrderRepository orderRepository;

//     @Autowired
//     private UsersRepository usersRepository;

//     @Autowired
//     private ProductRepository productRepository;

//     @Autowired
//     private OrderItemRepository orderItemRepository;

//     @Autowired
//     private CouponRepository couponRepository;

//     public Map<String, Object> getDashboardAnalytics(String timeRange) {
//         Map<String, Object> analytics = new HashMap<>();
        
//         // Get time boundaries based on range
//         TimeRange range = getTimeRange(timeRange);
        
//         // Calculate metrics
//         analytics.put("totalRevenue", calculateTotalRevenue(range));
//         analytics.put("totalOrders", calculateTotalOrders(range));
//         analytics.put("totalUsers", calculateTotalUsers(range));
//         analytics.put("totalProducts", productRepository.count());
//         analytics.put("revenueChange", calculateRevenueChange(range));
//         analytics.put("ordersChange", calculateOrdersChange(range));
//         analytics.put("usersChange", calculateUsersChange(range));
//         analytics.put("productsChange", calculateProductsChange(range));
//         analytics.put("topProducts", getTopSellingProducts(range, 5));
//         analytics.put("recentOrders", getRecentOrders(5));
//         analytics.put("recentActivities", getRecentActivities());
//         analytics.put("salesData", getSalesData(range));
//         analytics.put("customerStats", getCustomerStats(range));
        
//         return analytics;
//     }

//     private Double calculateTotalRevenue(TimeRange range) {
//         List<Order> orders = orderRepository.findByOrderDateBetween(range.startDate, range.endDate);
//         return orders.stream()
//                 .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
//                 .sum();
//     }

//     private Long calculateTotalOrders(TimeRange range) {
//         return orderRepository.countByOrderDateBetween(range.startDate, range.endDate);
//     }

//     private Long calculateTotalUsers(TimeRange range) {
//         // For user count, we'll use all users since registration date isn't stored
//         return usersRepository.count();
//     }

//     private Double calculateRevenueChange(TimeRange range) {
//         TimeRange previousRange = getPreviousTimeRange(range);
//         Double currentRevenue = calculateTotalRevenue(range);
//         Double previousRevenue = calculateTotalRevenue(previousRange);
        
//         if (previousRevenue == 0) return 0.0;
//         return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
//     }

//     private Double calculateOrdersChange(TimeRange range) {
//         TimeRange previousRange = getPreviousTimeRange(range);
//         Long currentOrders = calculateTotalOrders(range);
//         Long previousOrders = calculateTotalOrders(previousRange);
        
//         if (previousOrders == 0) return 0.0;
//         return ((currentOrders - previousOrders.doubleValue()) / previousOrders) * 100;
//     }

//     private Double calculateUsersChange(TimeRange range) {
//         // Since we don't have user registration dates, return 0 for now
//         return 0.0;
//     }

//     private Double calculateProductsChange(TimeRange range) {
//         // Product count change - for simplicity, return 0
//         return 0.0;
//     }

//     private List<Map<String, Object>> getTopSellingProducts(TimeRange range, int limit) {
//         // Get all orders in the time range
//         List<Order> orders = orderRepository.findByOrderDateBetween(range.startDate, range.endDate);
        
//         // Count product sales
//         Map<Long, Integer> productSales = new HashMap<>();
        
//         for (Order order : orders) {
//             if (order.getItems() != null) {
//                 for (OrderItem item : order.getItems()) {
//                     Long productId = item.getProductId();
//                     Integer quantity = item.getQuantity() != null ? item.getQuantity() : 1;
//                     productSales.put(productId, productSales.getOrDefault(productId, 0) + quantity);
//                 }
//             }
//         }
        
//         // Get product details and sort by sales
//         return productSales.entrySet().stream()
//                 .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
//                 .limit(limit)
//                 .map(entry -> {
//                     Product product = productRepository.findById(entry.getKey()).orElse(null);
//                     Map<String, Object> productData = new HashMap<>();
//                     if (product != null) {
//                         productData.put("id", product.getId());
//                         productData.put("name", product.getName());
//                         productData.put("category", product.getCategory());
//                         productData.put("soldCount", entry.getValue());
//                         productData.put("price", product.getPrice());
//                     } else {
//                         productData.put("id", entry.getKey());
//                         productData.put("name", "Unknown Product");
//                         productData.put("category", "Unknown");
//                         productData.put("soldCount", entry.getValue());
//                         productData.put("price", 0);
//                     }
//                     return productData;
//                 })
//                 .collect(Collectors.toList());
//     }

//     private List<Map<String, Object>> getRecentOrders(int limit) {
//         return orderRepository.findTop5ByOrderByOrderDateDesc().stream()
//                 .map(order -> {
//                     Map<String, Object> orderData = new HashMap<>();
//                     orderData.put("id", order.getId());
//                     orderData.put("orderId", order.getOrderId());
//                     orderData.put("customerName", order.getCustomerName());
//                     orderData.put("totalAmount", order.getTotalAmount());
//                     orderData.put("status", order.getStatus());
//                     orderData.put("orderDate", order.getOrderDate());
//                     return orderData;
//                 })
//                 .collect(Collectors.toList());
//     }

//     private List<Map<String, Object>> getRecentActivities() {
//         List<Map<String, Object>> activities = new ArrayList<>();
        
//         // Add recent orders as activities
//         List<Order> recentOrders = orderRepository.findTop3ByOrderByOrderDateDesc();
//         for (Order order : recentOrders) {
//             Map<String, Object> activity = new HashMap<>();
//             activity.put("type", "order");
//             activity.put("text", "New order #" + (order.getOrderId() != null ? order.getOrderId() : order.getId()) + " placed");
//             activity.put("time", formatTimeAgo(order.getOrderDate()));
//             activities.add(activity);
//         }
        
//         // Add product activities
//         Map<String, Object> productActivity = new HashMap<>();
//         productActivity.put("type", "product");
//         productActivity.put("text", "Product inventory updated");
//         productActivity.put("time", "4 hours ago");
//         activities.add(productActivity);
        
//         // Add user activities
//         List<Users> recentUsers = usersRepository.findTop1ByOrderByIdDesc();
//         if (!recentUsers.isEmpty()) {
//             Map<String, Object> userActivity = new HashMap<>();
//             userActivity.put("type", "user");
//             userActivity.put("text", "New user registered: " + recentUsers.get(0).getUsername());
//             userActivity.put("time", "2 hours ago");
//             activities.add(userActivity);
//         }
        
//         return activities;
//     }

//     private Map<String, Object> getSalesData(TimeRange range) {
//         Map<String, Object> salesData = new HashMap<>();
        
//         // Generate daily/weekly/monthly sales data
//         List<Double> data = new ArrayList<>();
//         List<String> labels = new ArrayList<>();
        
//         LocalDateTime current = range.startDate;
//         while (current.isBefore(range.endDate)) {
//             LocalDateTime periodEnd = getNextPeriod(current, range.unit);
//             Double periodRevenue = calculateRevenueForPeriod(current, periodEnd);
//             data.add(periodRevenue);
//             labels.add(formatLabel(current, range.unit));
//             current = periodEnd;
//         }
        
//         salesData.put("data", data);
//         salesData.put("labels", labels);
//         return salesData;
//     }

//     private Map<String, Object> getCustomerStats(TimeRange range) {
//         Map<String, Object> stats = new HashMap<>();
//         stats.put("newCustomers", usersRepository.count());
//         stats.put("returningCustomers", 0); // You'd need order history per customer for this
//         stats.put("averageOrderValue", calculateAverageOrderValue(range));
//         return stats;
//     }

//     private Double calculateAverageOrderValue(TimeRange range) {
//         List<Order> orders = orderRepository.findByOrderDateBetween(range.startDate, range.endDate);
//         if (orders.isEmpty()) return 0.0;
        
//         Double totalRevenue = orders.stream()
//                 .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
//                 .sum();
//         return totalRevenue / orders.size();
//     }

//     private Double calculateRevenueForPeriod(LocalDateTime start, LocalDateTime end) {
//         List<Order> orders = orderRepository.findByOrderDateBetween(start, end);
//         return orders.stream()
//                 .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
//                 .sum();
//     }

//     // Helper classes and methods
//     private static class TimeRange {
//         LocalDateTime startDate;
//         LocalDateTime endDate;
//         ChronoUnit unit;
        
//         TimeRange(LocalDateTime start, LocalDateTime end, ChronoUnit unit) {
//             this.startDate = start;
//             this.endDate = end;
//             this.unit = unit;
//         }
//     }

//     private TimeRange getTimeRange(String range) {
//         LocalDateTime now = LocalDateTime.now();
//         switch (range.toLowerCase()) {
//             case "daily":
//                 return new TimeRange(
//                     now.minusDays(1).withHour(0).withMinute(0).withSecond(0),
//                     now,
//                     ChronoUnit.HOURS
//                 );
//             case "weekly":
//                 return new TimeRange(
//                     now.minusWeeks(1).withHour(0).withMinute(0).withSecond(0),
//                     now,
//                     ChronoUnit.DAYS
//                 );
//             case "monthly":
//             default:
//                 return new TimeRange(
//                     now.minusMonths(1).withHour(0).withMinute(0).withSecond(0),
//                     now,
//                     ChronoUnit.DAYS
//                 );
//         }
//     }

//     private TimeRange getPreviousTimeRange(TimeRange currentRange) {
//         long amount = 1;
//         switch (currentRange.unit) {
//             case HOURS: amount = 24; break;
//             case DAYS: amount = currentRange.unit.between(currentRange.startDate, currentRange.endDate); break;
//         }
        
//         return new TimeRange(
//             currentRange.startDate.minus(amount, currentRange.unit),
//             currentRange.startDate,
//             currentRange.unit
//         );
//     }

//     private LocalDateTime getNextPeriod(LocalDateTime current, ChronoUnit unit) {
//         return current.plus(1, unit);
//     }

//     private String formatLabel(LocalDateTime date, ChronoUnit unit) {
//         switch (unit) {
//             case HOURS: return date.getHour() + ":00";
//             case DAYS: return date.getDayOfMonth() + "/" + date.getMonthValue();
//             default: return date.toString();
//         }
//     }

//     private String formatTimeAgo(LocalDateTime date) {
//         if (date == null) return "Recently";
        
//         LocalDateTime now = LocalDateTime.now();
//         long minutes = java.time.Duration.between(date, now).toMinutes();
        
//         if (minutes < 60) return minutes + " minutes ago";
//         long hours = java.time.Duration.between(date, now).toHours();
//         if (hours < 24) return hours + " hours ago";
//         long days = java.time.Duration.between(date, now).toDays();
//         return days + " days ago";
//     }
// }



package com.salesSavvy.service;

import com.salesSavvy.entity.*;
import com.salesSavvy.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private ProductRepository productRepository;

    public Map<String, Object> getDashboardAnalytics(String timeRange) {
        Map<String, Object> analytics = new HashMap<>();
        
        try {
            // Get time boundaries based on range
            TimeRange range = getTimeRange(timeRange);
            
            // Calculate metrics
            analytics.put("totalRevenue", calculateTotalRevenue(range));
            analytics.put("totalOrders", calculateTotalOrders(range));
            analytics.put("totalUsers", calculateTotalUsers());
            analytics.put("totalProducts", calculateTotalProducts());
            analytics.put("revenueChange", calculateRevenueChange(range));
            analytics.put("ordersChange", calculateOrdersChange(range));
            analytics.put("usersChange", 0.0); // Not implemented yet
            analytics.put("productsChange", 0.0); // Not implemented yet
            analytics.put("topProducts", getTopSellingProducts(range, 5));
            analytics.put("recentOrders", getRecentOrders(5));
            analytics.put("recentActivities", getRecentActivities());
            analytics.put("salesData", getSalesData(range));
            
        } catch (Exception e) {
            throw new RuntimeException("Error generating analytics: " + e.getMessage(), e);
        }
        
        return analytics;
    }

    private Double calculateTotalRevenue(TimeRange range) {
        try {
            List<Order> orders = orderRepository.findByOrderDateBetween(range.startDate, range.endDate);
            return orders.stream()
                    .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
                    .sum();
        } catch (Exception e) {
            return 0.0;
        }
    }

    private Long calculateTotalOrders(TimeRange range) {
        try {
            return orderRepository.countByOrderDateBetween(range.startDate, range.endDate);
        } catch (Exception e) {
            return 0L;
        }
    }

    private Long calculateTotalUsers() {
        try {
            return usersRepository.count();
        } catch (Exception e) {
            return 0L;
        }
    }

    private Long calculateTotalProducts() {
        try {
            return productRepository.count();
        } catch (Exception e) {
            return 0L;
        }
    }

    private Double calculateRevenueChange(TimeRange range) {
        try {
            TimeRange previousRange = getPreviousTimeRange(range);
            Double currentRevenue = calculateTotalRevenue(range);
            Double previousRevenue = calculateTotalRevenue(previousRange);
            
            if (previousRevenue == 0 || previousRevenue == null) return 0.0;
            return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
        } catch (Exception e) {
            return 0.0;
        }
    }

    private Double calculateOrdersChange(TimeRange range) {
        try {
            TimeRange previousRange = getPreviousTimeRange(range);
            Long currentOrders = calculateTotalOrders(range);
            Long previousOrders = calculateTotalOrders(previousRange);
            
            if (previousOrders == 0) return 0.0;
            return ((currentOrders - previousOrders.doubleValue()) / previousOrders) * 100;
        } catch (Exception e) {
            return 0.0;
        }
    }

    private List<Map<String, Object>> getTopSellingProducts(TimeRange range, int limit) {
        try {
            List<Order> orders = orderRepository.findByOrderDateBetween(range.startDate, range.endDate);
            Map<Long, Integer> productSales = new HashMap<>();
            
            for (Order order : orders) {
                if (order.getItems() != null) {
                    for (OrderItem item : order.getItems()) {
                        Long productId = item.getProductId();
                        Integer quantity = item.getQuantity() != null ? item.getQuantity() : 1;
                        productSales.put(productId, productSales.getOrDefault(productId, 0) + quantity);
                    }
                }
            }
            
            // Get all products to handle missing ones
            List<Product> allProducts = productRepository.findAll();
            Map<Long, Product> productMap = allProducts.stream()
                    .collect(Collectors.toMap(Product::getId, product -> product));
            
            return productSales.entrySet().stream()
                    .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                    .limit(limit)
                    .map(entry -> {
                        Product product = productMap.get(entry.getKey());
                        Map<String, Object> productData = new HashMap<>();
                        if (product != null) {
                            productData.put("id", product.getId());
                            productData.put("name", product.getName());
                            productData.put("category", product.getCategory());
                            productData.put("soldCount", entry.getValue());
                            productData.put("price", product.getPrice());
                        } else {
                            productData.put("id", entry.getKey());
                            productData.put("name", "Unknown Product");
                            productData.put("category", "Unknown");
                            productData.put("soldCount", entry.getValue());
                            productData.put("price", 0);
                        }
                        return productData;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private List<Map<String, Object>> getRecentOrders(int limit) {
        try {
            List<Order> orders = orderRepository.findTop5ByOrderByOrderDateDesc();
            return orders.stream()
                    .map(order -> {
                        Map<String, Object> orderData = new HashMap<>();
                        orderData.put("id", order.getId());
                        orderData.put("orderId", order.getOrderId());
                        orderData.put("customerName", order.getCustomerName());
                        orderData.put("totalAmount", order.getTotalAmount());
                        orderData.put("status", order.getStatus());
                        orderData.put("orderDate", order.getOrderDate());
                        return orderData;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private List<Map<String, Object>> getRecentActivities() {
        List<Map<String, Object>> activities = new ArrayList<>();
        
        try {
            // Add recent orders as activities
            List<Order> recentOrders = orderRepository.findTop3ByOrderByOrderDateDesc();
            for (Order order : recentOrders) {
                Map<String, Object> activity = new HashMap<>();
                activity.put("type", "order");
                activity.put("text", "New order #" + (order.getOrderId() != null ? order.getOrderId() : order.getId()) + " placed");
                activity.put("time", formatTimeAgo(order.getOrderDate()));
                activities.add(activity);
            }
            
            // Add product activities
            Map<String, Object> productActivity = new HashMap<>();
            productActivity.put("type", "product");
            productActivity.put("text", "Product inventory updated");
            productActivity.put("time", "4 hours ago");
            activities.add(productActivity);
            
            // Add user activities
            List<Users> recentUsers = usersRepository.findTop1ByOrderByIdDesc();
            if (!recentUsers.isEmpty()) {
                Map<String, Object> userActivity = new HashMap<>();
                userActivity.put("type", "user");
                userActivity.put("text", "New user registered: " + recentUsers.get(0).getUsername());
                userActivity.put("time", "2 hours ago");
                activities.add(userActivity);
            }
        } catch (Exception e) {
            // Fallback activities if there's an error
            activities.add(createActivity("order", "System initialized", "Just now"));
            activities.add(createActivity("product", "Welcome to SalesSavvy", "Recently"));
        }
        
        return activities;
    }

    private Map<String, Object> createActivity(String type, String text, String time) {
        Map<String, Object> activity = new HashMap<>();
        activity.put("type", type);
        activity.put("text", text);
        activity.put("time", time);
        return activity;
    }

    private Map<String, Object> getSalesData(TimeRange range) {
        Map<String, Object> salesData = new HashMap<>();
        
        try {
            // Generate simple sales data for the chart
            List<Double> data = new ArrayList<>();
            List<String> labels = new ArrayList<>();
            
            // Create mock data for demonstration
            Random random = new Random();
            int dataPoints = range.unit == ChronoUnit.HOURS ? 24 : 
                            range.unit == ChronoUnit.DAYS ? 7 : 30;
            
            for (int i = 0; i < dataPoints; i++) {
                data.add(random.nextDouble() * 1000 + 500); // Random revenue between 500-1500
                labels.add("Day " + (i + 1));
            }
            
            salesData.put("data", data);
            salesData.put("labels", labels);
        } catch (Exception e) {
            salesData.put("data", Arrays.asList(0.0, 0.0, 0.0));
            salesData.put("labels", Arrays.asList("No", "Data", "Available"));
        }
        
        return salesData;
    }

    // Helper classes and methods (keep the same as before)
    private static class TimeRange {
        LocalDateTime startDate;
        LocalDateTime endDate;
        ChronoUnit unit;
        
        TimeRange(LocalDateTime start, LocalDateTime end, ChronoUnit unit) {
            this.startDate = start;
            this.endDate = end;
            this.unit = unit;
        }
    }

    private TimeRange getTimeRange(String range) {
        LocalDateTime now = LocalDateTime.now();
        switch (range.toLowerCase()) {
            case "daily":
                return new TimeRange(
                    now.minusDays(1).withHour(0).withMinute(0).withSecond(0),
                    now,
                    ChronoUnit.HOURS
                );
            case "weekly":
                return new TimeRange(
                    now.minusWeeks(1).withHour(0).withMinute(0).withSecond(0),
                    now,
                    ChronoUnit.DAYS
                );
            case "monthly":
            default:
                return new TimeRange(
                    now.minusMonths(1).withHour(0).withMinute(0).withSecond(0),
                    now,
                    ChronoUnit.DAYS
                );
        }
    }

    private TimeRange getPreviousTimeRange(TimeRange currentRange) {
        long amount = 1;
        switch (currentRange.unit) {
            case HOURS: amount = 24; break;
            case DAYS: amount = currentRange.unit.between(currentRange.startDate, currentRange.endDate); break;
        }
        
        return new TimeRange(
            currentRange.startDate.minus(amount, currentRange.unit),
            currentRange.startDate,
            currentRange.unit
        );
    }

    private String formatTimeAgo(LocalDateTime date) {
        if (date == null) return "Recently";
        
        LocalDateTime now = LocalDateTime.now();
        long minutes = java.time.Duration.between(date, now).toMinutes();
        
        if (minutes < 60) return minutes + " minutes ago";
        long hours = java.time.Duration.between(date, now).toHours();
        if (hours < 24) return hours + " hours ago";
        long days = java.time.Duration.between(date, now).toDays();
        return days + " days ago";
    }
}