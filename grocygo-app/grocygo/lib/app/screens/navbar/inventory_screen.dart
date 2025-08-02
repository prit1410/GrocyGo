import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:grocygo/app/controllers/navbar/inventory_controller.dart';
import 'package:grocygo/app/components/inventory_list_view.dart';

class InventoryScreen extends StatelessWidget {
  final InventoryController controller = Get.find<InventoryController>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: controller.openAddDialog,
        child: Icon(Icons.add),
        shape: CircleBorder(),
      ),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  Icon(
                    Icons.inventory_2,
                    color: Theme.of(context).colorScheme.primary,
                    size: 28,
                  ),
                  SizedBox(width: 8),
                  Text(
                    'Inventory',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Spacer(),
                  IconButton(
                    icon: Icon(
                      Icons.refresh,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    onPressed: controller.refresh,
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'Manage your kitchen items and track expiry dates',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            ),
            SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: TextField(
                controller: controller.searchController,
                decoration: InputDecoration(
                  hintText: 'Search items...',
                  prefixIcon: Icon(Icons.search),
                  filled: true,
                  fillColor: Theme.of(context).colorScheme.background,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onChanged: controller.onSearch,
              ),
            ),
            SizedBox(height: 8),
            Expanded(
              child: Obx(() {
                if (controller.loading.value) {
                  return Center(child: CircularProgressIndicator());
                }
                if (controller.filteredItems.isEmpty) {
                  return Center(child: Text('No items found'));
                }
                return InventoryListView(
                  items: controller.filteredItems,
                  onEdit: controller.openEditDialog,
                  onDelete: controller.deleteItem,
                  getExpiryStatus: controller.getExpiryStatus,
                );
              }),
            ),
          ],
        ),
      ),
    );
  }
}
