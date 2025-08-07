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

  Future<List<dynamic>> getRecipes() async {
    final token = await _getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/recipes'),
      headers: headers(token: token),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load recipes');
    }
  }
}