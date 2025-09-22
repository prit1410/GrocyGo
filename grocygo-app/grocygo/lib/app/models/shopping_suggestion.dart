class ShoppingSuggestion {
  final String item;
  final List<String> neededFor;

  ShoppingSuggestion({
    required this.item,
    required this.neededFor,
  });

  factory ShoppingSuggestion.fromJson(Map<String, dynamic> json) {
    return ShoppingSuggestion(
      item: json['item'],
      neededFor: List<String>.from(json['needed_for']),
    );
  }
}
