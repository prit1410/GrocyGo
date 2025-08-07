
import 'package:get/get.dart';
import '../../utils/api/recipes_api.dart';

class RecipesController extends GetxController {
  final RecipesApi _recipesAPI = RecipesApi();

  var savedRecipes = [].obs;
  var suggestedRecipes = [].obs;
  var isLoadingSaved = true.obs;
  var isLoadingSuggested = false.obs;
  var selectedCourse = 'All Courses'.obs;
  var selectedDiet = 'All Diets'.obs;

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

  @override
  void onInit() {
    fetchSavedRecipes();
    fetchSuggestedRecipes();
    super.onInit();
  }

  String get greeting {
    final hour = DateTime.now().hour;
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
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
