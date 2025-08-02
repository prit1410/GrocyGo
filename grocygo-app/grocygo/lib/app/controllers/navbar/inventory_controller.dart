import 'package:firebase_auth/firebase_auth.dart';
import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:grocygo/app/components/dropdown_field.dart';
import 'package:grocygo/app/components/date_picker_field.dart';
import 'package:grocygo/app/utils/api/inventory_api.dart';

class InventoryController extends GetxController {
  // Observable loading state
  final loading = false.obs;

  // Search controller
  final searchController = TextEditingController();

  // Observable list of filtered items
  final filteredItems = <InventoryItem>[].obs;

  // Load inventory from backend
  Future<void> refresh() async {
    loading.value = true;
    try {
      // Get Firebase Auth token
      final user = await FirebaseAuth.instance.currentUser;
      final token = await user?.getIdToken();
      print('[InventoryController] Using token: $token');
      final items = await InventoryApi.fetchInventory(token: token);
      print('[InventoryController] Raw items from API:');
      print(items);
      filteredItems.assignAll(items);
    } catch (e) {
      print('[InventoryController] Error loading inventory: $e');
      Get.snackbar('Error', 'Failed to load inventory');
    } finally {
      loading.value = false;
    }
  }

  // Add item to backend
  void openAddDialog() {
    String name = '';
    String quantity = '';
    String? unit;
    String? location;
    String? category;
    DateTime? expiryDate;

    final units = [
      'pieces',
      'kg',
      'bag',
      'packet',
      'box',
      'containers',
      'lbs',
      'loaf',
    ];
    final locations = ['Counter', 'Fridge', 'Freezer', 'Pantry'];
    final categories = [
      'fruits',
      'vegetables',
      'namkeen',
      'meat & fish',
      'dairy',
      'pantry',
    ];

    Get.dialog(
      AlertDialog(
        title: Text('Add Item'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                decoration: InputDecoration(labelText: 'Name'),
                onChanged: (v) => name = v,
              ),
              SizedBox(height: 12),
              TextField(
                decoration: InputDecoration(labelText: 'Quantity'),
                keyboardType: TextInputType.number,
                onChanged: (v) => quantity = v,
              ),
              SizedBox(height: 12),
              DropdownField(
                label: 'Unit',
                items: units,
                value: unit,
                onChanged: (v) => unit = v,
              ),
              SizedBox(height: 12),
              DropdownField(
                label: 'Location',
                items: locations,
                value: location,
                onChanged: (v) => location = v,
              ),
              SizedBox(height: 12),
              DropdownField(
                label: 'Category',
                items: categories,
                value: category,
                onChanged: (v) => category = v,
              ),
              SizedBox(height: 12),
              DatePickerField(
                label: 'Expiry Date',
                value: expiryDate,
                onChanged: (v) => expiryDate = v,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Get.back(), child: Text('Cancel')),
          ElevatedButton(
            onPressed: () async {
              if (name.isEmpty || quantity.isEmpty || unit == null) {
                Get.snackbar('Error', 'Please fill all required fields');
                return;
              }
              try {
                final newItem = InventoryItem(
                  name: name,
                  unit: unit!,
                  quantity: int.tryParse(quantity) ?? 1,
                  location: location,
                  expiryDate: expiryDate,
                  category: category,
                );
                final user = await FirebaseAuth.instance.currentUser;
                final token = await user?.getIdToken();
                final added = await InventoryApi.addItem(newItem, token: token);
                filteredItems.add(added);
                Get.back();
                Get.snackbar('Success', 'Item added');
              } catch (e) {
                Get.snackbar('Error', 'Failed to add item');
              }
            },
            child: Text('Add Item'),
          ),
        ],
      ),
      barrierDismissible: false,
    );
  }

  // Edit item in backend
  void openEditDialog(InventoryItem item) {
    String name = item.name;
    String quantity = item.quantity.toString();
    String? unit = item.unit;
    String? location = item.location;
    String? category = item.category;
    DateTime? expiryDate = item.expiryDate;

    final units = [
      'pieces',
      'kg',
      'bag',
      'packet',
      'box',
      'containers',
      'lbs',
      'loaf',
    ];
    final locations = ['Counter', 'Fridge', 'Freezer', 'Pantry'];
    final categories = [
      'fruits',
      'vegetables',
      'namkeen',
      'meat & fish',
      'dairy',
      'pantry',
    ];

    Get.dialog(
      AlertDialog(
        title: Text('Edit Item'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                decoration: InputDecoration(labelText: 'Name'),
                controller: TextEditingController(text: name),
                onChanged: (v) => name = v,
              ),
              SizedBox(height: 12),
              TextField(
                decoration: InputDecoration(labelText: 'Quantity'),
                keyboardType: TextInputType.number,
                controller: TextEditingController(text: quantity),
                onChanged: (v) => quantity = v,
              ),
              SizedBox(height: 12),
              DropdownField(
                label: 'Unit',
                items: units,
                value: unit,
                onChanged: (v) => unit = v,
              ),
              SizedBox(height: 12),
              DropdownField(
                label: 'Location',
                items: locations,
                value: location,
                onChanged: (v) => location = v,
              ),
              SizedBox(height: 12),
              DropdownField(
                label: 'Category',
                items: categories,
                value: category,
                onChanged: (v) => category = v,
              ),
              SizedBox(height: 12),
              DatePickerField(
                label: 'Expiry Date',
                value: expiryDate,
                onChanged: (v) => expiryDate = v,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Get.back(), child: Text('Cancel')),
          ElevatedButton(
            onPressed: () async {
              if (name.isEmpty || quantity.isEmpty || unit == null) {
                Get.snackbar('Error', 'Please fill all required fields');
                return;
              }
              try {
                final updated = InventoryItem(
                  id: item.id,
                  name: name,
                  unit: unit!,
                  quantity: int.tryParse(quantity) ?? 1,
                  location: location,
                  expiryDate: expiryDate,
                  category: category,
                );
                final user = await FirebaseAuth.instance.currentUser;
                final token = await user?.getIdToken();
                final result = await InventoryApi.updateItem(
                  updated,
                  token: token,
                );
                final idx = filteredItems.indexWhere((i) => i.id == item.id);
                if (idx != -1) filteredItems[idx] = result;
                Get.back();
                Get.snackbar('Success', 'Item updated');
              } catch (e) {
                Get.snackbar('Error', 'Failed to update item');
              }
            },
            child: Text('Save'),
          ),
        ],
      ),
      barrierDismissible: false,
    );
  }

  // Delete item from backend
  Future<void> deleteItem(dynamic id) async {
    try {
      final user = await FirebaseAuth.instance.currentUser;
      final token = await user?.getIdToken();
      await InventoryApi.deleteItem(id, token: token);
      filteredItems.removeWhere((item) => item.id == id);
      Get.snackbar('Delete', 'Item deleted');
    } catch (e) {
      Get.snackbar('Error', 'Failed to delete item');
    }
  }

  // Dummy search handler
  void onSearch(String value) {
    // Implement search logic here
    // For now, do nothing
  }

  // Dummy expiry status method
  String getExpiryStatus(DateTime? expiryDate) {
    if (expiryDate == null) return '-';
    final now = DateTime.now();
    if (expiryDate.isBefore(now)) return 'Expired';
    final days = expiryDate.difference(now).inDays;
    return days < 7 ? 'Expiring soon' : 'Fresh';
  }
}

// Dummy InventoryItem model for demonstration
class InventoryItem {
  final dynamic id;
  final String name;
  final String unit;
  final int quantity;
  final String? location;
  final DateTime? expiryDate;
  final String? category;

  InventoryItem({
    this.id,
    required this.name,
    required this.unit,
    required this.quantity,
    this.location,
    this.expiryDate,
    this.category,
  });

  factory InventoryItem.fromJson(Map<String, dynamic> json) {
    // Firestore may return id as 'id' or 'docId', and expiryDate as string or Timestamp
    dynamic expiryRaw = json['expiryDate'];
    DateTime? expiryDate;
    if (expiryRaw is String) {
      expiryDate = DateTime.tryParse(expiryRaw);
    } else if (expiryRaw is Map && expiryRaw['_seconds'] != null) {
      expiryDate = DateTime.fromMillisecondsSinceEpoch(
        expiryRaw['_seconds'] * 1000,
      );
    }
    return InventoryItem(
      id: json['id'] ?? json['docId'],
      name: json['name'] ?? '',
      unit: json['unit'] ?? '',
      quantity: int.tryParse(json['quantity']?.toString() ?? '1') ?? 1,
      location: json['location'],
      expiryDate: expiryDate,
      category: json['category'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'unit': unit,
      'quantity': quantity,
      'location': location,
      'expiryDate': expiryDate?.toIso8601String(),
      'category': category,
    };
  }
}
