import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../controllers/navbar/inventory_controller.dart';

class InventoryApi {
  static const String baseUrl = 'https://grocygo.onrender.com/api/inventory';

  // Pass token if needed
  static Map<String, String> headers({String? token}) => {
    'Content-Type': 'application/json',
    if (token != null) 'Authorization': 'Bearer $token',
  };

  static Future<List<InventoryItem>> fetchInventory({String? token}) async {
    final res = await http.get(
      Uri.parse(baseUrl),
      headers: headers(token: token),
    );
    if (res.statusCode == 200) {
      final data = json.decode(res.body);
      if (data is List) {
        return data.map((e) => InventoryItem.fromJson(e)).toList();
      }
    }
    throw Exception('Failed to load inventory');
  }

  static Future<InventoryItem> addItem(
    InventoryItem item, {
    String? token,
  }) async {
    final res = await http.post(
      Uri.parse(baseUrl),
      headers: headers(token: token),
      body: json.encode(item.toJson()),
    );
    if (res.statusCode == 201) {
      return InventoryItem.fromJson(json.decode(res.body));
    }
    throw Exception('Failed to add item');
  }

  static Future<InventoryItem> updateItem(
    InventoryItem item, {
    String? token,
  }) async {
    final res = await http.put(
      Uri.parse('$baseUrl/${item.id}'),
      headers: headers(token: token),
      body: json.encode(item.toJson()),
    );
    if (res.statusCode == 200) {
      return InventoryItem.fromJson(json.decode(res.body));
    }
    throw Exception('Failed to update item');
  }

  static Future<void> deleteItem(dynamic id, {String? token}) async {
    final res = await http.delete(
      Uri.parse('$baseUrl/$id'),
      headers: headers(token: token),
    );
    if (res.statusCode != 200) {
      throw Exception('Failed to delete item');
    }
  }
}
