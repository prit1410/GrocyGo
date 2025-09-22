import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/navbar/recipes_controller.dart';
import '../screens/recipe_details_screen.dart';

class RecipesListView extends StatelessWidget {
  final List recipes;
  final bool isSuggestedList;
  final List<Map<String, dynamic>> inventoryItems; // Add inventoryItems

  const RecipesListView({
    super.key,
    required this.recipes,
    this.isSuggestedList = false,
    required this.inventoryItems,
    required RecipesController controller, // Require inventoryItems
  });

  @override
  Widget build(BuildContext context) {
    final RecipesController controller = Get.find();

    return SizedBox(
      height: 409,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: recipes.length,
        itemBuilder: (context, index) {
          final recipe = recipes[index];
          // Use recipe_title for suggested recipes, name for saved recipes
          final title = recipe['recipe_title'] ?? recipe['name'] ?? 'No Title';
          final imageUrl = recipe['recipe_image'];

          // Parse ingredients string for both saved and suggested recipes
          List<String> ingredientsArr = [];
          if (recipe['ingredients'] is String) {
            ingredientsArr =
                (recipe['ingredients'] as String)
                    .split('|')
                    .map((e) => e.trim())
                    .where((e) => e.isNotEmpty)
                    .toList();
          }

          // Use actual inventory for matched/missing ingredients
          final List<String> inventoryNames =
              inventoryItems
                  .map((item) => item['name'].toString().toLowerCase())
                  .toList();

          final matched =
              ingredientsArr
                  .where((ing) => inventoryNames.contains(ing.toLowerCase()))
                  .toList();
          final missing =
              ingredientsArr
                  .where((ing) => !inventoryNames.contains(ing.toLowerCase()))
                  .toList();

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
                  AspectRatio(
                    aspectRatio: 1.0, // 1:1 aspect ratio for square
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child:
                          imageUrl != null && imageUrl.isNotEmpty
                              ? Image.network(
                                imageUrl,
                                fit: BoxFit.cover, // Cover the entire box
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
                    title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
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
                  // Display ingredients and matched/missing
                  if (ingredientsArr.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Ingredients: ${ingredientsArr.join(', ')}',
                            style: const TextStyle(fontSize: 12),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            'You have: ${matched.join(', ')}',
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.green,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            'Need to buy: ${missing.join(', ')}',
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.red,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                  if (isSuggestedList)
                    ElevatedButton(
                      onPressed: () {
                        controller.saveRecipe(recipe);
                      },
                      child: const Text('Save'),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
