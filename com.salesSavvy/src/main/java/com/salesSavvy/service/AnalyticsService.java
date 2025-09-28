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
            
            // Calculate metrics with null safety
            Double totalRevenue = calculateTotalRevenue(range);
            Long totalOrders = calculateTotalOrders(range);
            Long totalUsers = calculateTotalUsers();
            Long totalProducts = calculateTotalProducts();
            
            analytics.put("totalRevenue", totalRevenue);
            analytics.put("totalOrders", totalOrders);
            analytics.put("totalUsers", totalUsers);
            analytics.put("totalProducts", totalProducts);
            analytics.put("revenueChange", calculateRevenueChange(range));
            analytics.put("ordersChange", calculateOrdersChange(range));
            analytics.put("usersChange", 0.0);
            analytics.put("productsChange", 0.0);
            analytics.put("topProducts", getTopSellingProducts(range, 5));
            analytics.put("recentOrders", getRecentOrders(5));
            analytics.put("recentActivities", getRecentActivities());
            analytics.put("salesData", getSalesData(range));
            
        } catch (Exception e) {
            // Return safe fallback data instead of throwing exception
            return getFallbackAnalytics();
        }
        
        return analytics;
    }

    private Double calculateTotalRevenue(TimeRange range) {
        try {
            List<Order> orders = orderRepository.findByOrderDateBetween(range.startDate, range.endDate);
            if (orders == null || orders.isEmpty()) {
                return 0.0;
            }
            return orders.stream()
                    .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
                    .sum();
        } catch (Exception e) {
            return 0.0;
        }
    }

    private Long calculateTotalOrders(TimeRange range) {
        try {
            List<Order> orders = orderRepository.findByOrderDateBetween(range.startDate, range.endDate);
            return orders != null ? (long) orders.size() : 0L;
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
            
            if (previousRevenue == null || previousRevenue == 0) return 0.0;
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
            
            if (previousOrders == null || previousOrders == 0) return 0.0;
            return ((currentOrders - previousOrders.doubleValue()) / previousOrders) * 100;
        } catch (Exception e) {
            return 0.0;
        }
    }

    private List<Map<String, Object>> getTopSellingProducts(TimeRange range, int limit) {
        try {
            List<Order> orders = orderRepository.findByOrderDateBetween(range.startDate, range.endDate);
            if (orders == null || orders.isEmpty()) {
                return getFallbackTopProducts();
            }
            
            Map<Long, Integer> productSales = new HashMap<>();
            
            for (Order order : orders) {
                if (order.getItems() != null) {
                    for (OrderItem item : order.getItems()) {
                        if (item != null && item.getProductId() != null) {
                            Long productId = item.getProductId();
                            Integer quantity = item.getQuantity() != null ? item.getQuantity() : 1;
                            productSales.put(productId, productSales.getOrDefault(productId, 0) + quantity);
                        }
                    }
                }
            }
            
            // Get all products to handle missing ones
            List<Product> allProducts = productRepository.findAll();
            Map<Long, Product> productMap = allProducts != null ? 
                allProducts.stream().collect(Collectors.toMap(Product::getId, product -> product)) :
                new HashMap<>();
            
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
            return getFallbackTopProducts();
        }
    }

    private List<Map<String, Object>> getRecentOrders(int limit) {
        try {
            List<Order> orders = orderRepository.findTop5ByOrderByOrderDateDesc();
            if (orders == null || orders.isEmpty()) {
                return new ArrayList<>();
            }
            
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
            // 1. Recent Orders (last 2 orders)
            List<Order> recentOrders = orderRepository.findTop2ByOrderByOrderDateDesc();
            if (recentOrders != null) {
                for (Order order : recentOrders) {
                    if (order != null && order.getOrderDate() != null) {
                        activities.add(createActivity(
                            "order", 
                            "New order #" + (order.getOrderId() != null ? order.getOrderId() : order.getId()) + " placed",
                            order.getOrderDate()
                        ));
                    }
                }
            }
            
            // 2. Recent User Registrations (last user)
            List<Users> recentUsers = usersRepository.findTop1ByOrderByCreatedAtDesc();
            if (recentUsers != null && !recentUsers.isEmpty()) {
                Users latestUser = recentUsers.get(0);
                if (latestUser != null && latestUser.getCreatedAt() != null) {
                    activities.add(createActivity(
                        "user", 
                        "New user registered: " + latestUser.getUsername(),
                        latestUser.getCreatedAt()
                    ));
                }
            }
            
            // 3. Recent Product Updates (last updated product)
            List<Product> recentProducts = productRepository.findTop1ByOrderByUpdatedAtDesc();
            if (recentProducts != null && !recentProducts.isEmpty()) {
                Product latestProduct = recentProducts.get(0);
                if (latestProduct != null && latestProduct.getUpdatedAt() != null) {
                    activities.add(createActivity(
                        "product", 
                        "Product '" + latestProduct.getName() + "' updated",
                        latestProduct.getUpdatedAt()
                    ));
                }
            }
            
        } catch (Exception e) {
            // Fallback with current time activities
            activities.add(createActivity("system", "Analytics system started", LocalDateTime.now()));
        }
        
        // Ensure we have at least 3 activities
        while (activities.size() < 3) {
            activities.add(createActivity(
                "system", 
                "SalesSavvy analytics initialized", 
                LocalDateTime.now().minusHours(activities.size())
            ));
        }
        
        // Sort by timestamp (most recent first)
        return activities.stream()
                .sorted((a, b) -> {
                    LocalDateTime timeA = (LocalDateTime) a.get("timestamp");
                    LocalDateTime timeB = (LocalDateTime) b.get("timestamp");
                    return timeB.compareTo(timeA);
                })
                .limit(3)
                .map(activity -> {
                    // Remove timestamp from final response
                    Map<String, Object> cleanActivity = new HashMap<>();
                    cleanActivity.put("type", activity.get("type"));
                    cleanActivity.put("text", activity.get("text"));
                    cleanActivity.put("time", activity.get("time"));
                    return cleanActivity;
                })
                .collect(Collectors.toList());
    }

    private Map<String, Object> createActivity(String type, String text, LocalDateTime timestamp) {
        Map<String, Object> activity = new HashMap<>();
        activity.put("type", type);
        activity.put("text", text);
        activity.put("time", calculateTimeAgo(timestamp));
        activity.put("timestamp", timestamp);
        return activity;
    }

    private Map<String, Object> getSalesData(TimeRange range) {
        Map<String, Object> salesData = new HashMap<>();
        
        try {
            List<Order> orders = orderRepository.findByOrderDateBetween(range.startDate, range.endDate);
            
            if (orders == null || orders.isEmpty()) {
                // Return empty data structure
                salesData.put("data", Arrays.asList(0.0));
                salesData.put("labels", Arrays.asList("No Data"));
                return salesData;
            }
            
            // Simple grouping by day
            Map<String, Double> dailySales = new TreeMap<>();
            
            for (Order order : orders) {
                if (order != null && order.getOrderDate() != null && order.getTotalAmount() != null) {
                    String dayKey = order.getOrderDate().getDayOfMonth() + "/" + order.getOrderDate().getMonthValue();
                    double amount = order.getTotalAmount();
                    dailySales.put(dayKey, dailySales.getOrDefault(dayKey, 0.0) + amount);
                }
            }
            
            List<Double> data = new ArrayList<>(dailySales.values());
            List<String> labels = new ArrayList<>(dailySales.keySet());
            
            salesData.put("data", data);
            salesData.put("labels", labels);
            
        } catch (Exception e) {
            // Fallback data
            salesData.put("data", Arrays.asList(0.0, 0.0, 0.0));
            salesData.put("labels", Arrays.asList("Mon", "Tue", "Wed"));
        }
        
        return salesData;
    }

    // Helper classes and methods
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
                    now.minusDays(1),
                    now,
                    ChronoUnit.HOURS
                );
            case "weekly":
                return new TimeRange(
                    now.minusWeeks(1),
                    now,
                    ChronoUnit.DAYS
                );
            case "monthly":
            default:
                return new TimeRange(
                    now.minusMonths(1),
                    now,
                    ChronoUnit.DAYS
                );
        }
    }

    private TimeRange getPreviousTimeRange(TimeRange currentRange) {
        long amount = 1;
        switch (currentRange.unit) {
            case HOURS: amount = 24; break;
            case DAYS: amount = 7; break;
            default: amount = 30;
        }
        
        return new TimeRange(
            currentRange.startDate.minus(amount, currentRange.unit),
            currentRange.startDate,
            currentRange.unit
        );
    }

    private String calculateTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "Recently";
        }
        
        try {
            LocalDateTime now = LocalDateTime.now();
            long seconds = java.time.Duration.between(dateTime, now).getSeconds();
            long minutes = seconds / 60;
            long hours = minutes / 60;
            long days = hours / 24;
            
            if (seconds < 60) {
                return "Just now";
            } else if (minutes < 60) {
                return minutes + " minute" + (minutes > 1 ? "s" : "") + " ago";
            } else if (hours < 24) {
                return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
            } else if (days < 7) {
                return days + " day" + (days > 1 ? "s" : "") + " ago";
            } else {
                return dateTime.format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy"));
            }
        } catch (Exception e) {
            return "Recently";
        }
    }

    // Fallback methods for when data is not available
    private Map<String, Object> getFallbackAnalytics() {
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("totalRevenue", 0);
        fallback.put("totalOrders", 0);
        fallback.put("totalUsers", 0);
        fallback.put("totalProducts", 0);
        fallback.put("revenueChange", 0.0);
        fallback.put("ordersChange", 0.0);
        fallback.put("usersChange", 0.0);
        fallback.put("productsChange", 0.0);
        fallback.put("topProducts", getFallbackTopProducts());
        fallback.put("recentOrders", new ArrayList<>());
        fallback.put("recentActivities", getFallbackActivities());
        fallback.put("salesData", getFallbackSalesData());
        return fallback;
    }

    private List<Map<String, Object>> getFallbackTopProducts() {
        List<Map<String, Object>> fallbackProducts = new ArrayList<>();
        // Add some sample products
        Map<String, Object> product1 = new HashMap<>();
        product1.put("id", 1L);
        product1.put("name", "Sample Product 1");
        product1.put("category", "General");
        product1.put("soldCount", 0);
        product1.put("price", 0);
        fallbackProducts.add(product1);
        
        return fallbackProducts;
    }

    private List<Map<String, Object>> getFallbackActivities() {
        List<Map<String, Object>> activities = new ArrayList<>();
        activities.add(createActivity("system", "Welcome to SalesSavvy Analytics", LocalDateTime.now()));
        activities.add(createActivity("product", "System initialized successfully", LocalDateTime.now().minusMinutes(30)));
        activities.add(createActivity("user", "Ready to track your business", LocalDateTime.now().minusHours(1)));
        return activities;
    }

    private Map<String, Object> getFallbackSalesData() {
        Map<String, Object> salesData = new HashMap<>();
        salesData.put("data", Arrays.asList(0.0, 0.0, 0.0));
        salesData.put("labels", Arrays.asList("Start", "Your", "Business"));
        return salesData;
    }
}