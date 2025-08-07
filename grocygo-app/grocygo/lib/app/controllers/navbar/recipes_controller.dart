
import 'package:get/get.dart';
import '../../utils/api/recipes_api.dart';
import '../../utils/api/inventory_api.dart';

class RecipesController extends GetxController {
  final RecipesApi _recipesAPI = RecipesApi();
  final InventoryApi _inventoryAPI = InventoryApi();

  var savedRecipes = [].obs;
  var suggestedRecipes = [].obs;
  var isLoadingSaved = true.obs;
  var isLoadingSuggested = false.obs;
  var selectedCourse = 'All Courses'.obs;
  var selectedDiet = 'All Diets'.obs;
  var inventoryItems = <Map<String, dynamic>>[].obs;

  final List<String> courses = [
    'All Courses',
    'Dinner',
    'Lunch',
    'Side Dish',
    'South Indian Breakfast',
    'Snack',
    'Dessert',
    'Appetizer',
    'Main Course',
    'World Breakfast',
    'Indian Breakfast',
    'North Indian Breakfast',
    'One Pot Dish',
    'Brunch'
  ];
  final List<String> diets = [
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
    'Sugar Free Diet'
  ];

  var greeting = ''.obs;

  @override
  void onInit() {
    updateGreeting();
    fetchSavedRecipes();
    fetchSuggestedRecipes();
    fetchInventory(); // Fetch inventory on init
    super.onInit();
  }

  void updateGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) {
      greeting.value = 'Good Morning';
    } else if (hour < 17) {
      greeting.value = 'Good Afternoon';
    } else {
      greeting.value = 'Good Evening';
    }
  }

  Future<void> fetchSavedRecipes() async {
    try {
      isLoadingSaved(true);
      savedRecipes.value = await _recipesAPI.getRecipes();
    } catch (e) {
      Get.snackbar('Error', e.toString());
    } finally {
      isLoadingSaved(false);
    }
  }

  Future<void> fetchSuggestedRecipes() async {
    try {
      isLoadingSuggested(true);
      final course = selectedCourse.value == 'All Courses' ? '' : selectedCourse.value;
      final diet = selectedDiet.value == 'All Diets' ? '' : selectedDiet.value;
      suggestedRecipes.value = await _recipesAPI.getSuggestedRecipes(course, diet);
    } catch (e) {
      Get.snackbar('Error', e.toString());
    } finally {
      isLoadingSuggested(false);
    }
  }

  Future<void> fetchInventory() async {
    try {
      final items = await _inventoryAPI.fetchInventory();
      inventoryItems.assignAll(items.cast<Map<String, dynamic>>());
    } catch (e) {
      print('[RecipesController] Error loading inventory: $e');
    }
  }

  Future<void> saveRecipe(Map<String, dynamic> recipe) async {
    try {
      final newRecipe = await _recipesAPI.addRecipe(recipe);
      savedRecipes.add(newRecipe);
      Get.snackbar('Success', 'Recipe saved successfully');
    } catch (e) {
      Get.snackbar('Error', e.toString());
    }
  }
}
