import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:firebase_auth/firebase_auth.dart';

class MealPlansApi {
  final String baseUrl = 'https://grocygo.onrender.com/api';
  final FirebaseAuth _auth = FirebaseAuth.instance;

  Future<String?> _getToken() async {
    final user = _auth.currentUser;
    if (user != null) {
      return await user.getIdToken();
    }
    return null;
  }

  // Pass token if needed
  static Map<String, String> headers({String? token}) => {
        'Content-Type': 'application/json',
        'x-api-key': '5b7e18b6-8e28-40ca-b50d-29fadfe420e2-2s6hd',
        if (token != null) 'Authorization': 'Bearer $token',
      };

  Future<List<dynamic>> getMealPlans() async {
    final token = await _getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/meal-plans'),
      headers: headers(token: token),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load meal plans');
    }
  }

  Future<Map<String, dynamic>> addMealPlan(Map<String, dynamic> plan) async {
    final token = await _getToken();
    final response = await http.post(
      Uri.parse('$baseUrl/meal-plans'),
      headers: headers(token: token),
      body: json.encode(plan),
    );

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to add meal plan');
    }
  }

  Future<Map<String, dynamic>> updateMealPlan(
    String id,
    Map<String, dynamic> plan,
  ) async {
    final token = await _getToken();
    final response = await http.put(
      Uri.parse('$baseUrl/meal-plans/$id'),
      headers: headers(token: token),
      body: json.encode(plan),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to update meal plan');
    }
  }

  Future<void> deleteMealPlan(String id) async {
    final token = await _getToken();
    final response = await http.delete(
      Uri.parse('$baseUrl/meal-plans/$id'),
      headers: headers(token: token),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to delete meal plan');
    }
  }

  Future<List<dynamic>> getMealSuggestions(
    List<String> inventory,
    String diet,
  ) async {
    final token = await _getToken();
    final response = await http.post(
      Uri.parse('$baseUrl/ai/mealplan-suggestions'),
      headers: headers(token: token),
      body: json.encode({'inventory': inventory, 'diet': diet}),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get meal suggestions');
    }
  }
}
