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
  final filteredItems = <Map<String, dynamic>>[].obs;
  final InventoryApi _api = InventoryApi();

  @override
  void onInit() {
    refresh();
    super.onInit();
  }

  // Load inventory from backend
  Future<void> refresh() async {
    loading.value = true;
    try {
      final items = await _api.fetchInventory();
      final processedItems = items.map((item) {
        // Ensure all keys are strings and handle potential null IDs
        final Map<String, dynamic> typedItem = {};
        item.forEach((key, value) {
          typedItem[key.toString()] = value;
        });

        if (typedItem['id'] == null) {
          print('WARNING: Item fetched with null ID: $typedItem');
          typedItem['id'] = 'temp_${DateTime.now().microsecondsSinceEpoch}';
        }
        return typedItem;
      }).toList();
      filteredItems.assignAll(processedItems);
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
                final newItem = {
                  'name': name,
                  'unit': unit!,
                  'quantity': int.tryParse(quantity) ?? 1,
                  'location': location,
                  'expiryDate': expiryDate?.toIso8601String(),
                  'category': category,
                };
                final added = await _api.addItem(newItem);
                // Ensure the added item has a non-null ID
                final Map<String, dynamic> processedAdded = {};
                added.forEach((key, value) {
                  processedAdded[key.toString()] = value;
                });
                if (processedAdded['id'] == null) {
                  print('WARNING: Added item has null ID: $processedAdded');
                  processedAdded['id'] = 'temp_${DateTime.now().microsecondsSinceEpoch}';
                }
                print('DEBUG: Added item ID from API: ${processedAdded['id']}');
                filteredItems.add(processedAdded);
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
  void openEditDialog(Map<String, dynamic> item) {
    final name = item['name'].toString().obs;
    final quantity = item['quantity'].toString().obs;
    final unit = (item['unit'] as String?).obs;
    final location = (item['location'] as String?).obs;
    final category = (item['category'] as String?).obs;
    final expiryDate = (item['expiryDate'] is String
            ? DateTime.tryParse(item['expiryDate'])
            : (item['expiryDate'] is Map && item['expiryDate']['_seconds'] != null
                ? DateTime.fromMillisecondsSinceEpoch(
                    item['expiryDate']['_seconds'] * 1000)
                : null))
        .obs;

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
        title: const Text('Edit Item'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                decoration: const InputDecoration(labelText: 'Name'),
                controller: TextEditingController(text: name.value),
                onChanged: (v) => name.value = v,
              ),
              const SizedBox(height: 12),
              TextField(
                decoration: const InputDecoration(labelText: 'Quantity'),
                keyboardType: TextInputType.number,
                controller: TextEditingController(text: quantity.value),
                onChanged: (v) => quantity.value = v,
              ),
              const SizedBox(height: 12),
              Obx(
                () => DropdownField(
                  label: 'Unit',
                  items: units,
                  value: unit.value,
                  onChanged: (v) => unit.value = v,
                ),
              ),
              const SizedBox(height: 12),
              Obx(
                () => DropdownField(
                  label: 'Location',
                  items: locations,
                  value: location.value,
                  onChanged: (v) => location.value = v,
                ),
              ),
              const SizedBox(height: 12),
              Obx(
                () => DropdownField(
                  label: 'Category',
                  items: categories,
                  value: category.value,
                  onChanged: (v) => category.value = v,
                ),
              ),
              const SizedBox(height: 12),
              Obx(
                () => DatePickerField(
                  label: 'Expiry Date',
                  value: expiryDate.value,
                  onChanged: (v) => expiryDate.value = v,
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Get.back(), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () async {
              if (name.value.isEmpty ||
                  quantity.value.isEmpty ||
                  unit.value == null) {
                Get.snackbar('Error', 'Please fill all required fields');
                return;
              }
              try {
                final updated = {
                  'id': item['id'],
                  'name': name.value,
                  'unit': unit.value!,
                  'quantity': int.tryParse(quantity.value) ?? 1,
                  'location': location.value,
                  'expiryDate': expiryDate.value?.toIso8601String(),
                  'category': category.value,
                };
                final String? itemId = item['id'] as String?;
                if (itemId == null) {
                  Get.snackbar('Error', 'Cannot update item: ID is missing.');
                  return;
                }
                print('DEBUG: Item ID being sent for update: $itemId');
                print('DEBUG: Updated payload being sent: $updated');
                final result = await _api.updateItem(itemId, updated);
                final idx = filteredItems.indexWhere(
                  (i) => i['id'] == itemId,
                );
                if (idx != -1) filteredItems[idx] = result;
                Get.back();
                Get.snackbar('Success', 'Item updated');
              } catch (e) {
                print('Failed to update item: $e');
                Get.snackbar('Error', 'Failed to update item');
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
      barrierDismissible: false,
    );
  }

  // Delete item from backend
  Future<void> deleteItem(dynamic id) async {
    try {
      final String? itemId = id as String?;
      if (itemId == null) {
        Get.snackbar('Error', 'Cannot delete item: ID is missing.');
        return;
      }
      await _api.deleteItem(itemId);
      filteredItems.removeWhere((item) => item['id'] == itemId);
      Get.snackbar('Delete', 'Item deleted');
    } catch (e) {
      Get.snackbar('Error', 'Failed to delete item');
    }
  }

  // Dummy search handler
  void onSearch(String value) {
    if (value.isEmpty) {
      refresh();
      return;
    }
    final lowerCaseQuery = value.toLowerCase();
    filteredItems.value =
        filteredItems
            .where(
              (item) => item['name'].toLowerCase().contains(lowerCaseQuery),
            )
            .toList();
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
