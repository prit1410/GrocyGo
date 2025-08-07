
import 'package:flutter/material.dart';

class RecipeSuggestionBox extends StatelessWidget {
  final String title;
  final String course;
  final String prepTime;

  const RecipeSuggestionBox({
    super.key,
    required this.title,
    required this.course,
    required this.prepTime,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 5),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(course),
            Text('Prep Time: $prepTime'),
          ],
        ),
      ),
    );
  }
}
