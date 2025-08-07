import 'package:get/get.dart';
import 'package:grocygo/app/utils/api/mealplans_api.dart';

class MealPlansController extends GetxController {
  final MealPlansApi _mealPlansApi = MealPlansApi();
  final selectedDate = Rx<DateTime?>(DateTime.now());
  final mealPlans = RxList<dynamic>([]);
  final mealSuggestions = RxList<dynamic>([]);
  final selectedDiet = 'All Diets'.obs;
  final isLoadingSuggestions = false.obs;

  @override
  void onInit() {
    super.onInit();
    fetchMealPlans();
    fetchMealSuggestions(); // Initial fetch
  }

  void updateSelectedDate(DateTime? date) {
    selectedDate.value = date;
  }

  void onDietChanged(String? newDiet) {
    if (newDiet != null) {
      selectedDiet.value = newDiet;
      fetchMealSuggestions();
    }
  }

  List<dynamic> get filteredMealPlans {
    if (selectedDate.value == null) {
      return [];
    }
    return mealPlans.where((plan) {
      if (plan['date'] == null) return false;
      try {
        final planDate = DateTime.parse(plan['date']);
        final selected = selectedDate.value!;
        return planDate.year == selected.year &&
            planDate.month == selected.month &&
            planDate.day == selected.day;
      } catch (e) {
        return false;
      }
    }).toList();
  }

  Future<void> fetchMealPlans() async {
    try {
      final plans = await _mealPlansApi.getMealPlans();
      mealPlans.assignAll(plans);
    } catch (e) {
      Get.snackbar('Error', 'Failed to fetch meal plans');
    }
  }

  Future<void> fetchMealSuggestions() async {
    try {
      isLoadingSuggestions.value = true;
      // TODO: Get actual inventory
      final List<String> inventory = [];
      final suggestions = await _mealPlansApi.getMealSuggestions(
        inventory,
        selectedDiet.value,
      );
      mealSuggestions.assignAll(suggestions);
    } catch (e) {
      Get.snackbar('Error', 'Failed to get meal suggestions');
    } finally {
      isLoadingSuggestions.value = false;
    }
  }

  Future<void> addMealPlan(Map<String, dynamic> mealPlan) async {
    try {
      final newPlan = await _mealPlansApi.addMealPlan(mealPlan);
      mealPlans.add(newPlan);
    } catch (e) {
      Get.snackbar('Error', 'Failed to add meal plan');
    }
  }

  Future<void> updateMealPlan(String id, Map<String, dynamic> mealPlan) async {
    try {
      final updatedPlan = await _mealPlansApi.updateMealPlan(id, mealPlan);
      final index = mealPlans.indexWhere((plan) => plan['id'] == id);
      if (index != -1) {
        mealPlans[index] = updatedPlan;
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to update meal plan');
    }
  }

  Future<void> deleteMealPlan(String id) async {
    try {
      await _mealPlansApi.deleteMealPlan(id);
      mealPlans.removeWhere((plan) => plan['id'] == id);
    } catch (e) {
      Get.snackbar('Error', 'Failed to delete meal plan');
    }
  }
}
