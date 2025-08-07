import 'package:flutter/material.dart';

class InventoryListView extends StatelessWidget {
  final List<Map<String, dynamic>> items;
  final void Function(Map<String, dynamic>) onEdit;
  final void Function(dynamic) onDelete;
  final String Function(DateTime?) getExpiryStatus;

  const InventoryListView({
    Key? key,
    required this.items,
    required this.onEdit,
    required this.onDelete,
    required this.getExpiryStatus,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      itemCount: items.length,
      separatorBuilder:
          (_, __) => Divider(height: 1, color: theme.dividerColor),
      itemBuilder: (context, index) {
        final item = items[index];
        DateTime? expiryDate;
        if (item['expiryDate'] is String) {
          expiryDate = DateTime.tryParse(item['expiryDate']);
        } else if (item['expiryDate'] is Map && item['expiryDate']['_seconds'] != null) {
          expiryDate = DateTime.fromMillisecondsSinceEpoch(
              item['expiryDate']['_seconds'] * 1000);
        }

        return ListTile(
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 12,
            vertical: 8,
          ),
          title: Text(
            item['name'],
            style: theme.textTheme.bodyLarge?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          leading: CircleAvatar(
            backgroundColor: theme.colorScheme.primary.withOpacity(0.1),
            child: Text(
              item['name'][0].toUpperCase(),
              style: theme.textTheme.titleMedium,
            ),
          ),
          trailing: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.location_on, size: 16, color: theme.hintColor),
                      const SizedBox(width: 4),
                      Text(
                        item['location'] ?? '-',
                        style: theme.textTheme.bodySmall,
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.calendar_today,
                        size: 16,
                        color: theme.hintColor,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        getExpiryStatus(expiryDate),
                        style: theme.textTheme.bodySmall,
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(width: 12),
              PopupMenuButton<String>(
                icon: Icon(Icons.more_vert, color: theme.iconTheme.color),
                onSelected: (value) {
                  if (value == 'edit') onEdit(item);
                  if (value == 'delete') onDelete(item['id']);
                },
                itemBuilder:
                    (context) => [
                      PopupMenuItem(
                        value: 'edit',
                        child: Text('Edit', style: theme.textTheme.bodyMedium),
                      ),
                      PopupMenuItem(
                        value: 'delete',
                        child: Text(
                          'Delete',
                          style: theme.textTheme.bodyMedium,
                        ),
                      ),
                    ],
              ),
            ],
          ),
          isThreeLine: true,
          dense: false,
          subtitle: Text(
            '${item['quantity']} ${item['unit']}',
            style: theme.textTheme.bodyMedium,
          ),
        );
      },
    );
  }
}

