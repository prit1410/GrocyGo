import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:grocygo/app/components/dropdown_field.dart';
import 'package:grocygo/app/controllers/navbar/mealplans_controller.dart';

class AddMealDialog extends StatefulWidget {
  final String category;

  const AddMealDialog({super.key, required this.category});

  @override
  State<AddMealDialog> createState() => _AddMealDialogState();
}

class _AddMealDialogState extends State<AddMealDialog> {
  final MealPlansController controller = Get.find();
  String selectedOption = 'My Recipes';
  String? selectedRecipe;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Add ${widget.category}'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
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
            items: <String>['My Recipes', 'AI Generated', 'Add Custom']
                .map<DropdownMenuItem<String>>((String value) {
              return DropdownMenuItem<String>(
                value: value,
                child: Text(value),
              );
            }).toList(),
          ),
          const SizedBox(height: 20),
          if (selectedOption != 'Add Custom')
            Obx(() {
              final recipes = selectedOption == 'My Recipes'
                  ? controller.mealPlans // Replace with actual user recipes
                  : controller.mealSuggestions;
              return DropdownField(
                value: selectedRecipe,
                hintText: 'Select a recipe',
                items: recipes.map((r) => r['recipe_title'] as String).toList(),
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
        TextButton(
          onPressed: () => Get.back(),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () {
            if (selectedRecipe != null) {
              final plan = {
                'date': controller.selectedDate.value!.toIso8601String(),
                'category': widget.category,
                'recipe': {
                  'recipe_title': selectedRecipe,
                }
              };
              controller.addMealPlan(plan);
              Get.back();
            }
          },
          child: const Text('Add'),
        ),
      ],
    );
  }
}
