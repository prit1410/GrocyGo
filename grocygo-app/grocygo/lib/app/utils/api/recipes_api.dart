import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:firebase_auth/firebase_auth.dart';

class RecipesApi {
  final String baseUrl = 'https://grocygo.onrender.com/api';
  final FirebaseAuth _auth = FirebaseAuth.instance;

  Future<String?> _getToken() async {
    final user = _auth.currentUser;
    if (user != null) {
      return await user.getIdToken();
    }
    return null;
  }

  static Map<String, String> headers({String? token}) => {
        'Content-Type': 'application/json',
        'x-api-key': '5b7e18b6-8e28-40ca-b50d-29fadfe420e2-2s6hd',
        if (token != null) 'Authorization': 'Bearer $token',
      };

  Future<List<Map<String, dynamic>>> getRecipes() async {
    final token = await _getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/recipes'),
      headers: headers(token: token),
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.cast<Map<String, dynamic>>();
    } else {
      throw Exception('Failed to load recipes');
    }
  }

  Future<List<Map<String, dynamic>>> getSuggestedRecipes(String course, String diet) async {
    final token = await _getToken();
    final response = await http.post(
      Uri.parse('$baseUrl/ai/recipe-suggestions'),
      headers: headers(token: token),
      body: json.encode({'course': course, 'diet': diet}),
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.cast<Map<String, dynamic>>();
    } else {
      throw Exception('Failed to get recipe suggestions');
    }
  }

  Future<Map<String, dynamic>> getRecipeDetails(String id) async {
    final token = await _getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/recipes/$id'),
      headers: headers(token: token),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load recipe details');
    }
  }

  Future<Map<String, dynamic>> addRecipe(Map<String, dynamic> recipe) async {
    final token = await _getToken();
    final response = await http.post(
      Uri.parse('$baseUrl/recipes'),
      headers: headers(token: token),
      body: json.encode(recipe),
    );

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to add recipe');
    }
  }

  Future<Map<String, dynamic>> updateRecipe(
    String id,
    Map<String, dynamic> recipe,
  ) async {
    final token = await _getToken();
    final response = await http.put(
      Uri.parse('$baseUrl/recipes/$id'),
      headers: headers(token: token),
      body: json.encode(recipe),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to update recipe');
    }
  }

  Future<void> deleteRecipe(String id) async {
    final token = await _getToken();
    final response = await http.delete(
      Uri.parse('$baseUrl/recipes/$id'),
      headers: headers(token: token),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to delete recipe');
    }
  }
}
