import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:grocygo/app/components/add_meal_dialog.dart';
import 'package:grocygo/app/components/date_picker_field.dart';
import 'package:grocygo/app/components/dropdown_field.dart';
import 'package:grocygo/app/components/meal_plan_section.dart';
import 'package:grocygo/app/components/recipes_list_view.dart';
import 'package:grocygo/app/controllers/navbar/mealplans_controller.dart';

class MealPlansScreen extends GetView<MealPlansController> {
  const MealPlansScreen({super.key});

  void _showAddMealDialog(BuildContext context, String category) {
    Get.dialog(AddMealDialog(category: category));
  }

  @override
  Widget build(BuildContext context) {
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
            Obx(
              () => DatePickerField(
                label: 'Select Date',
                value: controller.selectedDate.value,
                onChanged: controller.updateSelectedDate,
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Weekly Meal Plan',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            Obx(() {
              final mealPlans = controller.filteredMealPlans;
              return Column(
                children: [
                  MealPlanSection(
                    title: 'Breakfast',
                    items: mealPlans
                        .where((p) => p['category'] == 'Breakfast')
                        .map((p) => p['recipe'] as Map<String, dynamic>)
                        .toList(),
                    onAdd: () => _showAddMealDialog(context, 'Breakfast'),
                  ),
                  MealPlanSection(
                    title: 'Lunch',
                    items: mealPlans
                        .where((p) => p['category'] == 'Lunch')
                        .map((p) => p['recipe'] as Map<String, dynamic>)
                        .toList(),
                    onAdd: () => _showAddMealDialog(context, 'Lunch'),
                  ),
                  MealPlanSection(
                    title: 'Dinner',
                    items: mealPlans
                        .where((p) => p['category'] == 'Dinner')
                        .map((p) => p['recipe'] as Map<String, dynamic>)
                        .toList(),
                    onAdd: () => _showAddMealDialog(context, 'Dinner'),
                  ),
                ],
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
              }
              if (controller.mealSuggestions.isEmpty) {
                return const Center(child: Text('No suggestions available.'));
              }
              return RecipesListView(recipes: controller.mealSuggestions);
            }),
          ],
        ),
      ),
    );
  }
}
