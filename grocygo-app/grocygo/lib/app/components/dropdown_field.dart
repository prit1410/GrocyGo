import 'package:flutter/material.dart';

class DropdownField extends StatelessWidget {
  final List<String> items;
  final String? selectedItem;
  final ValueChanged<String?> onChanged;
  final String hintText;

  const DropdownField({
    super.key,
    required this.items,
    required this.onChanged,
    this.selectedItem,
    this.hintText = 'Select an option',
    String? label,
    String? value,
  });

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<String>(
      value: selectedItem,
      hint: Text(hintText),
      onChanged: onChanged,
      items:
          items.map((String item) {
            return DropdownMenuItem<String>(value: item, child: Text(item));
          }).toList(),
      decoration: const InputDecoration(
        border: OutlineInputBorder(),
        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      ),
    );
  }
}
