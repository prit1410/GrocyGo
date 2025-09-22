import 'dart:convert';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:firebase_auth/firebase_auth.dart';
import 'package:grocygo/app/models/shopping_list_item.dart';
import 'package:grocygo/app/models/shopping_suggestion.dart';
import '../auth_controller.dart';

class ShoppingListController extends GetxController {
  final AuthController authController = Get.find<AuthController>();
  // FirebaseFirestore instance removed — not used in this controller anymore.

  var shoppingList = <ShoppingListItem>[].obs;
  var suggestions = <ShoppingSuggestion>[].obs;
  var isLoading = false.obs;
  var isGeneratingSuggestions = false.obs;

  final String _baseUrl = 'https://grocygo.onrender.com/api/shopping';
  final String _apiKey =
      '5b7e18b6-8e28-40ca-b50d-29fadfe420e2-2s6hd'; // TODO: Store securely

  @override
  void onInit() {
    super.onInit();
    // Listen to auth changes
    ever(authController.firebaseUser, (User? user) {
      if (user != null) {
        fetchShoppingList();
      } else {
        shoppingList.clear();
        suggestions.clear();
      }
    });
  }

  Future<String?> _getToken() async {
    User? user = authController.user;
    if (user == null) return null;
    return await user.getIdToken();
  }

  Future<void> fetchShoppingList() async {
    final token = await _getToken();
    if (token == null) return;

    isLoading.value = true;
    try {
      final response = await http.get(
        Uri.parse(_baseUrl),
        headers: {'Authorization': 'Bearer $token', 'x-api-key': _apiKey},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        shoppingList.value =
            data.map((item) => ShoppingListItem.fromJson(item)).toList();
        // After loading shopping list, also fetch smart suggestions so UI updates automatically
        fetchSuggestions();
      } else {
        Get.snackbar('Error', 'Failed to fetch shopping list');
      }
    } catch (e) {
      Get.snackbar('Error', e.toString());
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> addShoppingItem(
    String name,
    int quantity,
    String unit,
    String category,
  ) async {
    final token = await _getToken();
    if (token == null) return;

    try {
      final response = await http.post(
        Uri.parse(_baseUrl),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
          'x-api-key': _apiKey,
        },
        body: json.encode({
          'name': name,
          'quantity': quantity,
          'unit': unit,
          'category': category,
        }),
      );

      if (response.statusCode == 201) {
        fetchShoppingList();
      } else {
        Get.snackbar('Error', 'Failed to add item');
      }
    } catch (e) {
      Get.snackbar('Error', e.toString());
    }
  }

  Future<void> deleteShoppingItem(String id) async {
    final token = await _getToken();
    if (token == null) return;

    try {
      final response = await http.delete(
        Uri.parse('$_baseUrl/$id'),
        headers: {'Authorization': 'Bearer $token', 'x-api-key': _apiKey},
      );

      if (response.statusCode == 200) {
        shoppingList.removeWhere((item) => item.id == id);
      } else {
        Get.snackbar('Error', 'Failed to delete item');
      }
    } catch (e) {
      Get.snackbar('Error', e.toString());
    }
  }

  Future<void> fetchSuggestions() async {
    final token = await _getToken();
    if (token == null) {
      print('ShoppingListController: No token, cannot fetch suggestions.');
      return;
    }

    isGeneratingSuggestions.value = true;
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/suggestions'),
        headers: {'Authorization': 'Bearer $token', 'x-api-key': _apiKey},
      );

      print(
        'ShoppingListController: Suggestions API status code: ${response.statusCode}',
      );
      print(
        'ShoppingListController: Suggestions API response body: ${response.body}',
      );

      if (response.statusCode == 200) {
        // Some endpoints may return an empty body or an empty array
        if (response.body.trim().isEmpty) {
          suggestions.clear();
          return;
        }

        final decoded = json.decode(response.body);

        if (decoded is List) {
          // Expecting [{ item: string, needed_for: [...] }, ...]
          final parsed = <ShoppingSuggestion>[];
          for (final entry in decoded) {
            try {
              if (entry is Map<String, dynamic>) {
                parsed.add(ShoppingSuggestion.fromJson(entry));
              } else if (entry is Map) {
                // sometimes JSON decode returns Map<dynamic, dynamic>
                parsed.add(
                  ShoppingSuggestion.fromJson(Map<String, dynamic>.from(entry)),
                );
              }
            } catch (e) {
              print(
                'ShoppingListController: Skipping invalid suggestion entry: $e',
              );
            }
          }
          suggestions.value = parsed;
        } else {
          print(
            'ShoppingListController: Unexpected suggestions payload: ${decoded.runtimeType}',
          );
          suggestions.clear();
        }
      } else if (response.statusCode == 204) {
        // No content
        suggestions.clear();
      } else {
        Get.snackbar(
          'Error',
          'Failed to fetch suggestions. Status: ${response.statusCode}',
        );
      }
    } catch (e) {
      print('ShoppingListController: Error fetching suggestions: $e');
      Get.snackbar('Error', e.toString());
    } finally {
      isGeneratingSuggestions.value = false;
    }
  }

  Future<void> addSuggestionToShoppingList(
    ShoppingSuggestion suggestion,
  ) async {
    // For now, let's add with default quantity, unit, and category.
    // You might want to open a dialog to ask for these details.
    addShoppingItem(suggestion.item, 1, 'pcs', 'uncategorized');
  }

  // Removed addSampleData helper — sample data should not be added automatically.
}
