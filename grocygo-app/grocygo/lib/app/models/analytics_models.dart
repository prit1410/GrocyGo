import 'package:flutter/material.dart';

// Model for Category Stats (Pie Chart)
class CategoryStat {
  final String category;
  final int count;

  CategoryStat({required this.category, required this.count});

  factory CategoryStat.fromJson(Map<String, dynamic> json) {
    return CategoryStat(
      category: json['category'] ?? 'Unknown',
      count: (json['count'] as num?)?.toInt() ?? 0,
    );
  }
}

// Model for Inventory Usage (Line Chart)
class InventoryUsage {
  final String date;
  final int added;
  final int used;

  InventoryUsage({required this.date, required this.added, required this.used});

  factory InventoryUsage.fromJson(Map<String, dynamic> json) {
    return InventoryUsage(
      date: json['date'] ?? '',
      added: (json['added'] as num?)?.toInt() ?? 0,
      used: (json['used'] as num?)?.toInt() ?? 0,
    );
  }
}

// Model for Expiry Stats (Bar Chart)
class ExpiryStat {
  final String month;
  final int expiringCount;

  ExpiryStat({required this.month, required this.expiringCount});

  factory ExpiryStat.fromJson(Map<String, dynamic> json) {
    return ExpiryStat(
      month: json['month'] ?? '',
      expiringCount: (json['expiringCount'] as num?)?.toInt() ?? 0,
    );
  }
}

// Model for Shopping Trends (Bar Chart)
class ShoppingTrend {
  final String month;
  final int shoppingCount;

  ShoppingTrend({required this.month, required this.shoppingCount});

  factory ShoppingTrend.fromJson(Map<String, dynamic> json) {
    return ShoppingTrend(
      month: json['month'] ?? '',
      shoppingCount: (json['shoppingCount'] as num?)?.toInt() ?? 0,
    );
  }
}

// Model for Inventory Item (used in CategoryListDialog)
class InventoryItem {
  final String id;
  final String name;
  final String category;
  final String quantity;

  InventoryItem({
    required this.id,
    required this.name,
    required this.category,
    required this.quantity,
  });

  factory InventoryItem.fromJson(Map<String, dynamic> json) {
    return InventoryItem(
      id: json['id'] ?? '',
      name: json['name'] ?? 'Unknown Item',
      category: json['category'] ?? 'Uncategorized',
      quantity: json['quantity']?.toString() ?? 'N/A',
    );
  }
}
