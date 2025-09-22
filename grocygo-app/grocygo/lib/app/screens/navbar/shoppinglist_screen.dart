import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:grocygo/app/controllers/navbar/shoppinglist_controller.dart';
import 'package:grocygo/app/models/shopping_list_item.dart';

class ShoppingListScreen extends StatelessWidget {
  final ShoppingListController controller = Get.find<ShoppingListController>();

  ShoppingListScreen({super.key});

  void _showAddItemDialog(BuildContext context) {
    final nameController = TextEditingController();
    final quantityController = TextEditingController();
    final unitController = TextEditingController();
    final categoryController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Add Item'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(labelText: 'Name'),
                ),
                TextField(
                  controller: quantityController,
                  decoration: const InputDecoration(labelText: 'Quantity'),
                  keyboardType: TextInputType.number,
                ),
                TextField(
                  controller: unitController,
                  decoration: const InputDecoration(
                    labelText: 'Unit (e.g., pcs, kg)',
                  ),
                ),
                TextField(
                  controller: categoryController,
                  decoration: const InputDecoration(labelText: 'Category'),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Get.back(),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                final name = nameController.text;
                final quantity = int.tryParse(quantityController.text) ?? 0;
                final unit = unitController.text;
                final category = categoryController.text;

                if (name.isNotEmpty &&
                    quantity > 0 &&
                    unit.isNotEmpty &&
                    category.isNotEmpty) {
                  controller.addShoppingItem(name, quantity, unit, category);
                  Get.back();
                } else {
                  Get.snackbar('Error', 'Please fill all fields');
                }
              },
              child: const Text('Add'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Shopping Lists'),
        actions: [
          Obx(() => IconButton(
            icon: controller.isLoading.value
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2.0, color: Colors.white),
                  )
                : const Icon(Icons.refresh),
            onPressed: controller.isLoading.value ? null : () => controller.fetchShoppingList(),
          )),
        ],
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(20.0),
          child: Padding(
            padding: EdgeInsets.only(bottom: 8.0),
            child: Text(
              'Smart shopping lists based on your inventory and meal plans',
              style: TextStyle(fontSize: 12.0),
            ),
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Obx(() {
                if (controller.isLoading.value) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (controller.shoppingList.isEmpty) {
                  return const Center(
                    child: Text('Your shopping list is empty.'),
                  );
                }
                return ListView.builder(
                  itemCount: controller.shoppingList.length,
                  itemBuilder: (context, index) {
                    final item = controller.shoppingList[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(vertical: 4.0),
                      child: ListTile(
                        title: Text(item.name),
                        subtitle: Text(
                          '${item.quantity} ${item.unit} | ${item.category}',
                        ),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed:
                              () => controller.deleteShoppingItem(item.id),
                        ),
                      ),
                    );
                  },
                );
              }),
            ),
            const SizedBox(height: 16.0),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Smart Suggestions',
                  style: TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold),
                ),
                Row(
                  children: [
                    ElevatedButton(
                      onPressed: () => controller.fetchSuggestions(),
                      child: Obx(
                        () =>
                            controller.isGeneratingSuggestions.value
                                ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2.0,
                                    color: Colors.white,
                                  ),
                                )
                                : const Text('Generate'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
            Expanded(
              child: Obx(() {
                if (controller.isGeneratingSuggestions.value &&
                    controller.suggestions.isEmpty) {
                  return const Center(child: Text("Generating..."));
                }
                if (controller.suggestions.isEmpty) {
                  return const Center(
                    child: Padding(
                      padding: EdgeInsets.all(16.0),
                      child: Text(
                        'No smart suggestions available.\nThis may happen if your inventory and meal plans are empty.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                  );
                }
                return ListView.builder(
                  itemCount: controller.suggestions.length,
                  itemBuilder: (context, index) {
                    final suggestion = controller.suggestions[index];
                    print('ShoppingListScreen: Displaying suggestion: ${suggestion.item}'); // Debug print
                    return Card(
                      margin: const EdgeInsets.symmetric(vertical: 4.0),
                      child: ListTile(
                        title: Text(suggestion.item),
                        subtitle: Text(
                          'Needed for: ${suggestion.neededFor.join(', ')}',
                        ),
                        trailing: IconButton(
                          icon: const Icon(Icons.add, color: Colors.green),
                          onPressed:
                              () => controller.addSuggestionToShoppingList(
                                suggestion,
                              ),
                        ),
                      ),
                    );
                  },
                );
              }),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddItemDialog(context),
        child: const Icon(Icons.add),
      ),
    );
  }
}
