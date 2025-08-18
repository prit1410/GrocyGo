import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CompleteMealDialog extends StatelessWidget {
  final String mealName;
  final VoidCallback onConfirm;

  const CompleteMealDialog({
    super.key,
    required this.mealName,
    required this.onConfirm,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Complete Meal'),
      content: Text('Did you make the meal "$mealName"?'),
      actions: [
        TextButton(
          onPressed: () => Get.back(),
          child: const Text('No'),
        ),
        TextButton(
          onPressed: onConfirm,
          child: const Text('Yes'),
        ),
      ],
    );
  }
}
