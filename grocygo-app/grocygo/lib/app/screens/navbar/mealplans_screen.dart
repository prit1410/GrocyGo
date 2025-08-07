import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:grocygo/app/components/add_meal_dialog.dart';
import 'package:grocygo/app/components/dropdown_field.dart';
import 'package:grocygo/app/components/meal_plan_section.dart';
import 'package:grocygo/app/controllers/navbar/mealplans_controller.dart';

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
    // Now you can safely access the controller via `controller` property of GetView

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
              () => Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back_ios),
                    onPressed: controller.goToPreviousWeek,
                  ),
                  Text(
                    controller.getWeekRange(),
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.arrow_forward_ios),
                    onPressed: controller.goToNextWeek,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Obx(
              () => Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back_ios),
                    onPressed: controller.goToPreviousWeek,
                  ),
                  Text(
                    controller.getWeekRange(),
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.arrow_forward_ios),
                    onPressed: controller.goToNextWeek,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Weekly Meal Plan',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            Obx(() {
              if (controller.isLoadingPlans.value) {
                return const Center(child: CircularProgressIndicator());
              }
              return Column(
                children:
                    controller.daysOfWeek.map((dayName) {
                      final dayDate = controller.currentWeekStart.value.add(
                        Duration(days: controller.daysOfWeek.indexOf(dayName)),
                      );
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16.0,
                              vertical: 8.0,
                            ),
                            child: Text(
                              '$dayName - ${dayDate.day}/${dayDate.month}',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          ...controller.mealSlots.map((slot) {
                            final mealPlan =
                                controller.mealPlans[dayName]?[slot];
                            return MealPlanSection(
                              title: slot,
                              items:
                                  mealPlan != null
                                      ? [
                                        mealPlan['recipe']
                                            as Map<String, dynamic>,
                                      ]
                                      : [],
                              onAdd:
                                  () => _showAddMealDialog(
                                    context,
                                    slot,
                                    dayDate,
                                  ),
                            );
                          }).toList(),
                          const SizedBox(height: 10),
                        ],
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
          ],
        ),
      ),
    );
  }
}
