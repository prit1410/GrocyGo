import 'package:get/get.dart';
import 'package:grocygo/app/utils/api/mealplans_api.dart';
import 'package:grocygo/app/utils/api/inventory_api.dart';
import 'package:intl/intl.dart'; // Import for DateFormat

class MealPlansController extends GetxController {
  final MealPlansApi _mealPlansApi = MealPlansApi();
  final InventoryApi _inventoryApi = InventoryApi();

  final selectedDate = Rx<DateTime>(
    DateTime.now(),
  ); // New: Selected date for daily view
  final mealPlans =
      RxMap<
        String,
        Map<String, Map<String, dynamic>?>
      >(); // Map to store meal plans by date string and meal type
  final mealSuggestions = RxList<dynamic>([]);
  final selectedDiet = 'All Diets'.obs;
  final isLoadingSuggestions = false.obs;
  final isLoadingPlans = false.obs;
  final currentWeekStart = Rx<DateTime>(
    DateTime.now(),
  ); // Declare currentWeekStart here

  final List<String> daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  final List<String> mealSlots = ['Breakfast', 'Lunch', 'Dinner'];

  @override
  void onInit() {
    super.onInit();
    _initializeCurrentWeek();
    fetchMealPlans();
    fetchMealSuggestions(); // Initial fetch
  }

  void _initializeCurrentWeek() {
    final today = DateTime.now();
    final dayOfWeek = today.weekday; // 1 for Monday, 7 for Sunday
    final diff =
        today.day -
        dayOfWeek +
        (dayOfWeek == 7 ? -6 : 1); // Adjust to Monday of the current week
    currentWeekStart.value = DateTime(today.year, today.month, diff);
  }

  void goToPreviousWeek() {
    currentWeekStart.value = currentWeekStart.value.subtract(
      const Duration(days: 7),
    );
    fetchMealPlans();
  }

  void goToNextWeek() {
    currentWeekStart.value = currentWeekStart.value.add(
      const Duration(days: 7),
    );
    fetchMealPlans();
  }

  String getWeekRange() {
    final endOfWeek = currentWeekStart.value.add(const Duration(days: 6));
    return '${currentWeekStart.value.day}/${currentWeekStart.value.month} - ${endOfWeek.day}/${endOfWeek.month}';
  }

  void onDietChanged(String? newDiet) {
    if (newDiet != null) {
      selectedDiet.value = newDiet;
      fetchMealSuggestions();
    }
  }

  Future<void> fetchMealPlans() async {
    try {
      isLoadingPlans.value = true;
      final start = currentWeekStart.value;
      final end = start.add(const Duration(days: 6));

      final plansData = await _mealPlansApi.getWeeklyMealPlans(start, end);

      // Initialize mealPlans map for the current week, keyed by date string
      final Map<String, Map<String, Map<String, dynamic>?>> newMealPlans = {};
      for (int i = 0; i < 7; i++) {
        final date = start.add(Duration(days: i));
        final dateString = DateFormat('yyyy-MM-dd').format(date);
        newMealPlans[dateString] = {
          'Breakfast': null,
          'Lunch': null,
          'Dinner': null,
        };
      }

      // Populate mealPlans map with fetched data
      for (var plan in plansData) {
        final planDate = DateTime.parse(plan['date']);
        final dateString = DateFormat('yyyy-MM-dd').format(planDate);
        if (newMealPlans[dateString] != null && plan['mealType'] != null) {
          newMealPlans[dateString]![plan['mealType']] = plan;
        }
      }
      mealPlans.assignAll(newMealPlans);
    } catch (e) {
      Get.snackbar('Error', 'Failed to fetch meal plans: $e');
    } finally {
      isLoadingPlans.value = false;
    }
  }

  Future<void> fetchMealSuggestions() async {
    try {
      isLoadingSuggestions.value = true;
      final inventoryItems = await _inventoryApi.fetchInventory();
      final List<String> inventoryNames =
          inventoryItems.map((item) => item['name'].toString()).toList();

      final suggestions = await _mealPlansApi.getMealSuggestions(
        inventoryNames,
        selectedDiet.value,
      );
      mealSuggestions.assignAll(suggestions);
    } catch (e) {
      Get.snackbar('Error', 'Failed to get meal suggestions: $e');
    } finally {
      isLoadingSuggestions.value = false;
    }
  }

  Future<void> addMealPlan(Map<String, dynamic> mealData) async {
    try {
      final recipe = mealData['recipe'];
      // Construct the meal plan payload to match the backend expectation
      final plan = {
        'date': mealData['date'],
        'mealType': mealData['category'],
        'recipeId': recipe['id'] ?? recipe['recipeId'] ?? recipe['url'], // Prioritize id, then recipeId, then url
        'name': recipe['recipe_title'] ?? recipe['name'], // Check for both keys
        'day': DateFormat('EEEE').format(DateTime.parse(mealData['date'])),
        'recipe': recipe, // Add the full recipe object
      };

      final newPlan = await _mealPlansApi.addMealPlan(plan);

      // Update the local state
      final planDate = DateTime.parse(newPlan['date']);
      final dateString = DateFormat('yyyy-MM-dd').format(planDate);
      if (mealPlans[dateString] != null && newPlan['mealType'] != null) {
        mealPlans[dateString]![newPlan['mealType']] = newPlan;
        mealPlans.refresh();
      }

      Get.snackbar('Success', 'Meal plan added successfully!');
    } catch (e) {
      Get.snackbar('Error', 'Failed to add meal plan: $e');
    }
  }

  Future<void> deleteMealPlan(String id) async {
    try {
      await _mealPlansApi.deleteMealPlan(id);
      // Find and remove the plan from the map using date string
      mealPlans.forEach((dateStr, slots) {
        slots.forEach((mealType, plan) {
          if (plan != null && plan['id'] == id) {
            slots[mealType] = null;
          }
        });
      });
      mealPlans.refresh(); // Notify listeners of map change
      Get.snackbar('Success', 'Meal plan deleted successfully!');
    } catch (e) {
      Get.snackbar('Error', 'Failed to delete meal plan: $e');
    }
  }
}
