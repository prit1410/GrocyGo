import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:grocygo/app/components/dropdown_field.dart';
import 'package:grocygo/app/controllers/navbar/mealplans_controller.dart';

class AddMealDialog extends StatefulWidget {
  final String category;

  const AddMealDialog({
    super.key,
    required this.category,
    required DateTime date,
  });

  @override
  State<AddMealDialog> createState() => _AddMealDialogState();
}

class _AddMealDialogState extends State<AddMealDialog> {
  final MealPlansController controller = Get.find();
  String selectedOption = 'My Recipes';
  String? selectedRecipe;
  DateTime _selectedDate = DateTime.now(); // Initialize with current date

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Add ${widget.category}'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          GestureDetector(
            onTap: () => _selectDate(context),
            child: AbsorbPointer(
              child: TextFormField(
                controller: TextEditingController(
                  text:
                      "${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}",
                ),
                decoration: const InputDecoration(
                  labelText: 'Select Date',
                  suffixIcon: Icon(Icons.calendar_today),
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
          DropdownButton<String>(
            value: selectedOption,
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  selectedOption = newValue;
                  selectedRecipe = null; // Reset recipe selection
                });
              }
            },
            items:
                <String>[
                  'My Recipes',
                  'AI Generated',
                  'Add Custom',
                ].map<DropdownMenuItem<String>>((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
          ),
          const SizedBox(height: 20),
          if (selectedOption != 'Add Custom')
            Obx(() {
              final recipes =
                  selectedOption == 'My Recipes'
                      ? controller.mealPlans.values
                          .expand((e) => e.values)
                          .whereType<Map<String, dynamic>>()
                          .map((e) => e['recipe'])
                          .whereType<Map<String, dynamic>>()
                          .toList()
                      : controller.mealSuggestions;
              print('Recipes list: $recipes'); // Debug print
              return DropdownField(
                value: selectedRecipe,
                hintText: 'Select a recipe',
                items: (recipes as List<dynamic>)
                    .map((r) {
                      final title = r['recipe_title'] ?? r['name'];
                      return title is String ? title : null;
                    })
                    .where((t) => t != null && t.isNotEmpty)
                    .toSet()
                    .toList()
                    .cast<String>(),
                onChanged: (value) {
                  setState(() {
                    selectedRecipe = value;
                  });
                },
              );
            })
          else
            TextFormField(
              decoration: const InputDecoration(labelText: 'Custom Meal Name'),
              onChanged: (value) {
                setState(() {
                  selectedRecipe = value;
                });
              },
            ),
        ],
      ),
      actions: [
        TextButton(onPressed: () => Get.back(), child: const Text('Cancel')),
        ElevatedButton(
          onPressed: () {
            if (selectedRecipe != null) {
              final recipes = selectedOption == 'My Recipes'
                  ? controller.mealPlans.values.expand((e) => e.values).whereType<Map<String, dynamic>>().map((e) => e['recipe']).whereType<Map<String, dynamic>>().toList()
                  : controller.mealSuggestions;

              final recipeData = (recipes as List<dynamic>).firstWhere(
                (r) => r['recipe_title'] == selectedRecipe,
                orElse: () => null,
              );

              if (recipeData != null) {
                final plan = {
                  'date': _selectedDate.toIso8601String(),
                  'category': widget.category,
                  'recipe': recipeData,
                };
                controller.addMealPlan(plan);
              } else {
                // Handle custom meal
                final plan = {
                  'date': _selectedDate.toIso8601String(),
                  'category': widget.category,
                  'recipe': {'recipe_title': selectedRecipe, 'id': 'custom'},
                };
                controller.addMealPlan(plan);
              }
              Get.back();
            }
          },
          child: const Text('Add'),
        ),
      ],
    );
  }
}
