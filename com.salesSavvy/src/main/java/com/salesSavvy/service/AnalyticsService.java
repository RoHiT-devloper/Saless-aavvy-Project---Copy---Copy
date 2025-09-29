package com.salesSavvy.service;

import com.salesSavvy.entity.*;
import com.salesSavvy.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.time.Duration;
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

    @Autowired
    private ActivityLogService activityLogService;

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

    // Enhanced Recent Activities using ActivityLog
    private List<Map<String, Object>> getRecentActivities() {
        List<Map<String, Object>> activities = new ArrayList<>();
        
        try {
            List<com.salesSavvy.entity.ActivityLog> activityLogs = activityLogService.getRecentActivities(10);
            
            for (com.salesSavvy.entity.ActivityLog log : activityLogs) {
                String icon = getActivityIcon(log.getActivityType());
                String text = log.getDescription();
                
                activities.add(createActivity(
                    log.getActivityType().toLowerCase(),
                    text,
                    log.getActivityTime()
                ));
            }
            
            // If no activities found, create some sample ones
            if (activities.isEmpty()) {
                return getFallbackActivities();
            }
            
        } catch (Exception e) {
            System.err.println("Error fetching activities: " + e.getMessage());
            return getFallbackActivities();
        }
        
        return activities;
    }

    private String getActivityIcon(String activityType) {
        switch (activityType) {
            case "USER_REGISTERED":
                return "👤";
            case "ORDER_PLACED":
                return "📦";
            case "PRODUCT_ADDED":
            case "PRODUCT_UPDATED":
                return "📊";
            case "USER_LOGIN":
                return "🔐";
            case "REVIEW_ADDED":
                return "⭐";
            case "CART_UPDATED":
                return "🛒";
            case "WISHLIST_UPDATED":
                return "❤️";
            default:
                return "📝";
        }
    }

    private Map<String, Object> createActivity(String type, String text, LocalDateTime timestamp) {
        Map<String, Object> activity = new HashMap<>();
        activity.put("type", type);
        activity.put("text", text);
        activity.put("time", calculateTimeAgo(timestamp));
        activity.put("timestamp", timestamp);
        return activity;
    }

private String calculateTimeAgo(LocalDateTime dateTime) {
    if (dateTime == null) {
        return "Recently";
    }
    
    try {
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        Duration duration = Duration.between(dateTime, now);
        
        long seconds = Math.abs(duration.getSeconds());
        long minutes = seconds / 60;
        long hours = minutes / 60;
        long days = hours / 24;
        
        if (seconds < 60) {
            return "Just now";
        } else if (minutes < 60) {
            return minutes + (minutes == 1 ? " minute ago" : " minutes ago");
        } else if (hours < 24) {
            return hours + (hours == 1 ? " hour ago" : " hours ago");
        } else if (days < 7) {
            return days + (days == 1 ? " day ago" : " days ago");
        } else if (days < 30) {
            long weeks = days / 7;
            return weeks + (weeks == 1 ? " week ago" : " weeks ago");
        } else if (days < 365) {
            long months = days / 30;
            return months + (months == 1 ? " month ago" : " months ago");
        } else {
            long years = days / 365;
            return years + (years == 1 ? " year ago" : " years ago");
        }
    } catch (Exception e) {
        return "Recently";
    }
}

    // Enhanced Sales Trend Algorithm
    private Map<String, Object> getSalesData(TimeRange range) {
        Map<String, Object> salesData = new HashMap<>();
        
        try {
            List<Order> orders = orderRepository.findByOrderDateBetween(range.startDate, range.endDate);
            
            if (orders == null || orders.isEmpty()) {
                return getEmptySalesData(range);
            }
            
            // Group sales by period using enhanced algorithm
            Map<String, Double> periodSales = groupSalesByPeriod(orders, range);
            
            // Fill missing periods with zero
            periodSales = fillMissingPeriods(periodSales, range);
            
            // Convert to sorted lists
            List<String> labels = new ArrayList<>(periodSales.keySet());
            List<Double> data = labels.stream()
                    .map(periodSales::get)
                    .collect(Collectors.toList());
            
            salesData.put("data", data);
            salesData.put("labels", labels);
            salesData.put("totalPeriods", periodSales.size());
            
        } catch (Exception e) {
            return getEmptySalesData(range);
        }
        
        return salesData;
    }

    private Map<String, Double> groupSalesByPeriod(List<Order> orders, TimeRange range) {
        Map<String, Double> periodSales = new LinkedHashMap<>();
        
        for (Order order : orders) {
            if (order != null && order.getOrderDate() != null && order.getTotalAmount() != null) {
                String periodKey = getPeriodKey(order.getOrderDate(), range.unit);
                Double currentAmount = periodSales.getOrDefault(periodKey, 0.0);
                periodSales.put(periodKey, currentAmount + order.getTotalAmount());
            }
        }
        
        return periodSales;
    }

    private Map<String, Double> fillMissingPeriods(Map<String, Double> periodSales, TimeRange range) {
        Map<String, Double> filledSales = new LinkedHashMap<>();
        
        LocalDateTime current = range.startDate;
        while (!current.isAfter(range.endDate)) {
            String periodKey = getPeriodKey(current, range.unit);
            filledSales.put(periodKey, periodSales.getOrDefault(periodKey, 0.0));
            current = getNextPeriod(current, range.unit);
        }
        
        return filledSales;
    }

    private String getPeriodKey(LocalDateTime dateTime, ChronoUnit unit) {
        switch (unit) {
            case HOURS:
                return String.format("%02d/%02d %02d:00", 
                    dateTime.getDayOfMonth(), 
                    dateTime.getMonthValue(),
                    dateTime.getHour());
            case DAYS:
                return String.format("%02d/%02d", 
                    dateTime.getDayOfMonth(), 
                    dateTime.getMonthValue());
            default:
                return String.format("%02d/%02d", 
                    dateTime.getDayOfMonth(), 
                    dateTime.getMonthValue());
        }
    }

    private LocalDateTime getNextPeriod(LocalDateTime current, ChronoUnit unit) {
        switch (unit) {
            case HOURS:
                return current.plusHours(1);
            case DAYS:
                return current.plusDays(1);
            default:
                return current.plusDays(1);
        }
    }

    private Map<String, Object> getEmptySalesData(TimeRange range) {
        Map<String, Object> emptyData = new HashMap<>();
        
        // Generate empty data points for the entire range
        List<Double> data = new ArrayList<>();
        List<String> labels = new ArrayList<>();
        
        LocalDateTime current = range.startDate;
        int pointCount = 0;
        
        while (!current.isAfter(range.endDate) && pointCount < 30) { // Max 30 points
            labels.add(getPeriodKey(current, range.unit));
            data.add(0.0);
            current = getNextPeriod(current, range.unit);
            pointCount++;
        }
        
        emptyData.put("data", data);
        emptyData.put("labels", labels);
        emptyData.put("totalPeriods", pointCount);
        
        return emptyData;
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


// And in the getTimeRange method:
private TimeRange getTimeRange(String range) {
    LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
    LocalDateTime startDate;
    ChronoUnit unit;
    
    switch (range.toLowerCase()) {
        case "daily":
            startDate = now.minusDays(1);
            unit = ChronoUnit.HOURS;
            break;
        case "weekly":
            startDate = now.minusWeeks(1);
            unit = ChronoUnit.DAYS;
            break;
        case "monthly":
        default:
            startDate = now.minusMonths(1);
            unit = ChronoUnit.DAYS;
            break;
    }
    
    return new TimeRange(startDate, now, unit);
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