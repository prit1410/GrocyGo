class ShoppingListItem {
  final String id;
  final String name;
  final int quantity;
  final String unit;
  final String category;

  ShoppingListItem({
    required this.id,
    required this.name,
    required this.quantity,
    required this.unit,
    required this.category,
  });

  factory ShoppingListItem.fromJson(Map<String, dynamic> json) {
    return ShoppingListItem(
      id: json['id'],
      name: json['name'] ?? json['item'] ?? '',
      quantity: (json['quantity'] as num?)?.toInt() ?? 1,
      unit: json['unit'] ?? '',
      category: json['category'] ?? '',
    );
  }
}
