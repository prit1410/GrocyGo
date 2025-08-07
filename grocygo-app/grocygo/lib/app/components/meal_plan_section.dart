import 'package:flutter/material.dart';

class MealPlanSection extends StatelessWidget {
  final String title;
  final List<Map<String, dynamic>>? items;
  final VoidCallback? onAdd;

  const MealPlanSection({super.key, required this.title, this.items, this.onAdd});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: Card(
        margin: const EdgeInsets.symmetric(vertical: 8.0),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style:
                    const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              if (items != null && items!.isNotEmpty)
                ...items!.map((item) => Text(item['recipe_title'] ?? 'Unnamed Recipe')).toList()
              else
                ElevatedButton.icon(
                  onPressed: onAdd,
                  icon: const Icon(Icons.add),
                  label: Text('Add $title'),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
