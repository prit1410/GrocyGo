import 'package:flutter/material.dart';
import 'package:get/get.dart';

class IngredientUsageDialog extends StatefulWidget {
  final List<String> ingredients;
  final Function(List<Map<String, dynamic>>) onConfirm;

  const IngredientUsageDialog({
    super.key,
    required this.ingredients,
    required this.onConfirm,
  });

  @override
  State<IngredientUsageDialog> createState() => _IngredientUsageDialogState();
}

class _IngredientUsageDialogState extends State<IngredientUsageDialog> {
  late List<Map<String, dynamic>> rows;

  @override
  void initState() {
    super.initState();
    rows = widget.ingredients
        .map((name) => {'name': name, 'quantity': '', 'unit': 'pieces'})
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Ingredient Usage'),
      content: SizedBox(
        width: double.maxFinite,
        child: ListView(
          shrinkWrap: true,
          children: [
            DataTable(
              columns: const [
                DataColumn(label: Text('Ingredient')),
                DataColumn(label: Text('Quantity')),
                DataColumn(label: Text('Unit')),
              ],
              rows: rows.asMap().entries.map((entry) {
                final index = entry.key;
                final row = entry.value;
                return DataRow(
                  cells: [
                    DataCell(Text(row['name'])),
                    DataCell(
                      TextFormField(
                        initialValue: row['quantity'],
                        keyboardType: TextInputType.number,
                        onChanged: (value) {
                          setState(() {
                            rows[index]['quantity'] = value;
                          });
                        },
                      ),
                    ),
                    DataCell(
                      DropdownButton<String>(
                        value: row['unit'],
                        items: ['pieces', 'kg', 'g', 'ml', 'l']
                            .map((unit) => DropdownMenuItem(
                                  value: unit,
                                  child: Text(unit),
                                ))
                            .toList(),
                        onChanged: (value) {
                          setState(() {
                            rows[index]['unit'] = value;
                          });
                        },
                      ),
                    ),
                  ],
                );
              }).toList(),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Get.back(),
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            widget.onConfirm(rows);
            Get.back();
          },
          child: const Text('Confirm'),
        ),
      ],
    );
  }
}
