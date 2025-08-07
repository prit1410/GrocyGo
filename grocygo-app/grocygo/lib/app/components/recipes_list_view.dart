
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/navbar/recipes_controller.dart';
import '../screens/recipe_details_screen.dart';

class RecipesListView extends StatelessWidget {
  final List recipes;
  final bool isSuggestedList;

  const RecipesListView(
      {super.key, required this.recipes, this.isSuggestedList = false});

  @override
  Widget build(BuildContext context) {
    final RecipesController controller = Get.find();

    return SizedBox(
      height: 250,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: recipes.length,
        itemBuilder: (context, index) {
          final recipe = recipes[index];
          return GestureDetector(
            onTap: () {
              Get.to(() => RecipeDetailsScreen(recipe: recipe));
            },
            child: Container(
              width: 200,
              margin: const EdgeInsets.only(right: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: recipe['recipe_image'] != null &&
                              recipe['recipe_image'].isNotEmpty
                          ? Image.network(
                              recipe['recipe_image'],
                              fit: BoxFit.cover,
                              width: double.infinity,
                            )
                          : Container(
                              color: Colors.grey[300],
                              child: const Center(
                                child: Icon(Icons.image_not_supported),
                              ),
                            ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    recipe['name'] ?? recipe['recipe_title'] ?? 'No Title',
                    style: const TextStyle(
                        fontSize: 16, fontWeight: FontWeight.bold),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.restaurant_menu, size: 16),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          recipe['course'] ?? 'N/A',
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.local_dining, size: 16),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          recipe['diet'] ?? 'N/A',
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  if (isSuggestedList)
                    ElevatedButton(
                      onPressed: () {
                        controller.saveRecipe(recipe);
                      },
                      child: const Text('Save'),
                    )
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
