import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:grocygo/app/components/recipes_list_view.dart';
import 'package:grocygo/app/controllers/navbar/recipes_controller.dart';

class RecipesScreen extends StatelessWidget {
  const RecipesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(RecipesController());
    final user = FirebaseAuth.instance.currentUser;

    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Bar
              Row(
                children: [
                  const Icon(Icons.wb_sunny, size: 30),
                  const SizedBox(width: 8),
                  Obx(() => Text(
                    controller.greeting.value,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  )),
                  const Spacer(),
                  Text(
                    user?.displayName ?? 'User',
                    style: const TextStyle(fontSize: 16),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Title
              const Text(
                'Recipes',
                style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'Save and manage your favorite recipes',
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
              const SizedBox(height: 24),

              // Saved Recipes
              const Text(
                'Saved Recipes',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              Obx(() {
                if (controller.isLoadingSaved.value) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (controller.savedRecipes.isEmpty) {
                  return const Center(child: Text('No saved recipes yet.'));
                }
                return RecipesListView(
                      recipes: controller.savedRecipes,
                      inventoryItems: controller.inventoryItems,
                      controller: controller,
                    );
              }),
              const SizedBox(height: 24),

              // AI Recipe Generation
              const Text(
                'Generate Recipes From AI',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              LayoutBuilder(
                builder: (context, constraints) {
                  final isNarrow = constraints.maxWidth < 400;

                  final courseDropdown = Obx(
                    () => DropdownButtonFormField<String>(
                      value: controller.selectedCourse.value,
                      isDense: true,
                      items: controller.courses
                          .map(
                            (course) => DropdownMenuItem(
                              value: course,
                              child: Text(course, overflow: TextOverflow.ellipsis),
                            ),
                          )
                          .toList(),
                      onChanged: (value) {
                        if (value != null) {
                          controller.selectedCourse.value = value;
                          controller.fetchSuggestedRecipes();
                        }
                      },
                      decoration: const InputDecoration(
                        labelText: 'Course',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  );

                  final dietDropdown = Obx(
                    () => DropdownButtonFormField<String>(
                      value: controller.selectedDiet.value,
                      isDense: true,
                      items: controller.diets
                          .map(
                            (diet) => DropdownMenuItem(
                              value: diet,
                              child: Text(diet, overflow: TextOverflow.ellipsis),
                            ),
                          )
                          .toList(),
                      onChanged: (value) {
                        if (value != null) {
                          controller.selectedDiet.value = value;
                          controller.fetchSuggestedRecipes();
                        }
                      },
                      decoration: const InputDecoration(
                        labelText: 'Diet',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  );

                  if (isNarrow) {
                    // Use a Column for narrow screens
                    return Column(
                      children: [
                        courseDropdown,
                        const SizedBox(height: 16),
                        dietDropdown,
                      ],
                    );
                  } else {
                    // Use a Row for wider screens
                    return Row(
                      children: [
                        Expanded(child: courseDropdown),
                        const SizedBox(width: 16),
                        Expanded(child: dietDropdown),
                      ],
                    );
                  }
                },
              ),
              const SizedBox(height: 16),
              Obx(() {
                if (controller.isLoadingSuggested.value) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (controller.suggestedRecipes.isEmpty) {
                  return const Center(child: Text('No suggestions available.'));
                }
                return RecipesListView(
                      recipes: controller.suggestedRecipes,
                      isSuggestedList: true,
                      inventoryItems: controller.inventoryItems,
                      controller: controller,
                    );
              }),
            ],
          ),
        ),
      ),
    );
  }
}
