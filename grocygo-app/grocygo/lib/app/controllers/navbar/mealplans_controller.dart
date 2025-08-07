import 'package:get/get.dart';
import 'package:grocygo/app/utils/api/mealplans_api.dart';
import 'package:grocygo/app/utils/api/inventory_api.dart';

class MealPlansController extends GetxController {
  final MealPlansApi _mealPlansApi = MealPlansApi();
  final InventoryApi _inventoryApi = InventoryApi();

  final currentWeekStart = Rx<DateTime>(DateTime.now());
  final mealPlans = RxMap<String, Map<String, dynamic>>(); // Map to store meal plans by day and meal type
  final mealSuggestions = RxList<dynamic>([]);
  final selectedDiet = 'All Diets'.obs;
  final isLoadingSuggestions = false.obs;
  final isLoadingPlans = false.obs;

  final List<String> daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
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
    final diff = today.day - dayOfWeek + (dayOfWeek == 7 ? -6 : 1); // Adjust to Monday of the current week
    currentWeekStart.value = DateTime(today.year, today.month, diff);
  }

  void goToPreviousWeek() {
    currentWeekStart.value = currentWeekStart.value.subtract(const Duration(days: 7));
    fetchMealPlans();
  }

  void goToNextWeek() {
    currentWeekStart.value = currentWeekStart.value.add(const Duration(days: 7));
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

      // Initialize mealPlans map for the current week
      final Map<String, Map<String, dynamic>> newMealPlans = {};
      for (var day in daysOfWeek) {
        newMealPlans[day] = {'Breakfast': null, 'Lunch': null, 'Dinner': null};
      }

      // Populate mealPlans map with fetched data
      for (var plan in plansData) {
        final planDate = DateTime.parse(plan['date']);
        final dayName = daysOfWeek[planDate.weekday - 1]; // Adjust for 0-indexed list
        if (newMealPlans[dayName] != null && plan['mealType'] != null) {
          newMealPlans[dayName]![plan['mealType']] = plan;
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
      final List<String> inventoryNames = inventoryItems.map((item) => item['name'].toString()).toList();

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

  Future<void> addMealPlan(Map<String, dynamic> mealPlan) async {
    try {
      final newPlan = await _mealPlansApi.addMealPlan(mealPlan);
      // Update the specific slot in the mealPlans map
      final planDate = DateTime.parse(newPlan['date']);
      final dayName = daysOfWeek[planDate.weekday - 1];
      if (mealPlans[dayName] != null && newPlan['mealType'] != null) {
        mealPlans[dayName]![newPlan['mealType']] = newPlan;
        mealPlans.refresh(); // Notify listeners of map change
      }
      Get.snackbar('Success', 'Meal plan added successfully!');
    } catch (e) {
      Get.snackbar('Error', 'Failed to add meal plan: $e');
    }
  }

  Future<void> deleteMealPlan(String id) async {
    try {
      await _mealPlansApi.deleteMealPlan(id);
      // Find and remove the plan from the map
      mealPlans.forEach((day, slots) {
        slots.forEach((mealType, plan) {
          if (plan != null && plan['id'] == id) {
            mealPlans[day]![mealType] = null;
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
