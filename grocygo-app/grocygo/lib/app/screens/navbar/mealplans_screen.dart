import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:grocygo/app/components/add_meal_dialog.dart';
import 'package:grocygo/app/components/date_picker_field.dart'; // Import the DatePickerField
import 'package:grocygo/app/components/dropdown_field.dart';
import 'package:grocygo/app/components/meal_plan_section.dart';
import 'package:grocygo/app/components/recipes_list_view.dart';
import 'package:grocygo/app/controllers/navbar/mealplans_controller.dart';
import 'package:grocygo/app/controllers/navbar/recipes_controller.dart';
import 'package:intl/intl.dart';

class MealPlansScreen extends GetView<MealPlansController> {
  const MealPlansScreen({super.key});

  void _showAddMealDialog(
    BuildContext context,
    String category,
    DateTime date,
  ) {
    Get.dialog(AddMealDialog(category: category, date: date));
  }

  @override
  Widget build(BuildContext context) {
    // Ensure the controller is initialized if not already
    if (!Get.isRegistered<MealPlansController>()) {
      Get.put(MealPlansController());
    }

    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 50),
            const Text(
              'Meal Planning',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const Text('Plan your meals based on available ingredients'),
            const SizedBox(height: 20),
            // Date Picker Field
            Obx(
              () => DatePickerField(
                label: 'Select Date',
                value: controller.selectedDate.value,
                onChanged: (newDate) {
                  controller.selectedDate.value = newDate!.toUtc();
                  controller.fetchMealPlans(); // Fetch plans for the new date
                },
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Daily Meal Plan',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            Obx(() {
              if (controller.isLoadingPlans.value) {
                return const Center(child: CircularProgressIndicator());
              }
              final selectedDateString = DateFormat(
                'yyyy-MM-dd',
              ).format(controller.selectedDate.value);
              final mealPlansForSelectedDay =
                  controller.mealPlans[selectedDateString] ?? {};

              return Column(
                children: controller.mealSlots.map((slot) {
                  final mealPlan = mealPlansForSelectedDay[slot];
                  return MealPlanSection(
                    title: slot,
                    items: mealPlan != null
                        ? [mealPlan['recipe'] ?? {'name': mealPlan['name']}] // Handle both structures
                        : [],
                    onAdd: () => _showAddMealDialog(
                      context,
                      slot,
                      controller.selectedDate.value,
                    ),
                    onComplete: (item) {
                      controller.showCompleteMealDialog(mealPlan!);
                    },
                  );
                }).toList(),
              );
            }),
            const SizedBox(height: 20),
            const Text(
              'AI Meal Suggestions',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Obx(
                () => DropdownField(
                  items: const [
                    'All Diets',
                    'Vegetarian',
                    'High Protein Vegetarian',
                    'Non Vegeterian',
                    'No Onion No Garlic (Sattvic)',
                    'High Protein Non Vegetarian',
                    'Diabetic Friendly',
                    'Eggetarian',
                    'Vegan',
                    'Gluten Free',
                    'Sugar Free Diet',
                  ],
                  onChanged: controller.onDietChanged,
                  hintText: 'Select Diet',
                  value: controller.selectedDiet.value,
                ),
              ),
            ),
            Obx(() {
              if (controller.isLoadingSuggestions.value) {
                return const Center(child: CircularProgressIndicator());
              } else if (controller.mealSuggestions.isEmpty) {
                return const Center(child: Text('No suggestions available.'));
              } else {
                return SizedBox(
                  height: 400, // Set a fixed height for the ListView
                  child: RecipesListView(
                    recipes: controller.mealSuggestions,
                    isSuggestedList: true,
                    inventoryItems: Get.find<RecipesController>().inventoryItems,
                    controller: Get.find<RecipesController>(),
                  ),
                );
              }
            }),
          ],
        ),
      ),
    );
  }
}