import 'dart:convert';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:firebase_auth/firebase_auth.dart';
import 'package:grocygo/app/models/analytics_models.dart';
import '../auth_controller.dart';

class AnalyticsController extends GetxController {
  final AuthController authController = Get.find<AuthController>();

  var isLoading = false.obs;
  var error = Rxn<String>();

  var categoryStats = <CategoryStat>[].obs;
  var inventoryUsage = <InventoryUsage>[].obs;
  var expiryStats = <ExpiryStat>[].obs;
  var shoppingTrends = <ShoppingTrend>[].obs;

  var selectedCategoryItems = <InventoryItem>[].obs;
  var isCategoryItemsLoading = false.obs;

  final String _baseUrl = 'https://grocygo.onrender.com/api/analytics';
  final String _apiKey = '5b7e18b6-8e28-40ca-b50d-29fadfe420e2-2s6hd'; // TODO: Store securely

  @override
  void onInit() {
    super.onInit();
    ever(authController.firebaseUser, (User? user) {
      if (user != null) {
        fetchAllAnalytics();
      } else {
        clearAnalyticsData();
      }
    });
  }

  void clearAnalyticsData() {
    categoryStats.clear();
    inventoryUsage.clear();
    expiryStats.clear();
    shoppingTrends.clear();
    selectedCategoryItems.clear();
    error.value = null;
  }

  Future<String?> _getToken() async {
    User? user = authController.user;
    if (user == null) return null;
    return await user.getIdToken();
  }

  Future<List<dynamic>> _fetchAnalytics(String endpoint) async {
    final token = await _getToken();
    if (token == null) {
      print('AnalyticsController: No token, cannot fetch $endpoint.');
      return [];
    }

    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/$endpoint'),
        headers: {
          'Authorization': 'Bearer $token',
          'x-api-key': _apiKey,
        },
      );

      print('AnalyticsController: $endpoint status code: ${response.statusCode}');
      print('AnalyticsController: $endpoint response body: ${response.body}');

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data;
      } else {
        throw Exception(
            'Failed to load $endpoint: ${response.statusCode} ${response.body}');
      }
    } catch (e) {
      print('AnalyticsController: Error fetching $endpoint: $e');
      rethrow;
    }
  }

  Future<void> fetchAllAnalytics() async {
    isLoading.value = true;
    error.value = null;
    try {
      final results = await Future.wait([
        _fetchAnalytics('category-stats'),
        _fetchAnalytics('inventory-usage'),
        _fetchAnalytics('expiry-stats'),
        _fetchAnalytics('shopping-trends'),
      ]);

      categoryStats.value = results[0]
          .map((json) => CategoryStat.fromJson(json))
          .toList()
          .cast<CategoryStat>();
      inventoryUsage.value = results[1]
          .map((json) => InventoryUsage.fromJson(json))
          .toList()
          .cast<InventoryUsage>();
      expiryStats.value = results[2]
          .map((json) => ExpiryStat.fromJson(json))
          .toList()
          .cast<ExpiryStat>();
      shoppingTrends.value = results[3]
          .map((json) => ShoppingTrend.fromJson(json))
          .toList()
          .cast<ShoppingTrend>();
    } catch (e) {
      error.value = 'Failed to load analytics data: ${e.toString()}';
      clearAnalyticsData();
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> fetchItemsForCategory(String category) async {
    isCategoryItemsLoading.value = true;
    try {
      final result = await _fetchAnalytics('category/${Uri.encodeComponent(category)}/items');
      selectedCategoryItems.value = result
          .map((json) => InventoryItem.fromJson(json))
          .toList()
          .cast<InventoryItem>();
    } catch (e) {
      Get.snackbar('Error', 'Failed to load items for category: ${e.toString()}');
      selectedCategoryItems.clear();
    } finally {
      isCategoryItemsLoading.value = false;
    }
  }
}