import 'package:flutter/material.dart';
import 'package:grocygo/app/screens/navbar/inventory_screen.dart';
import 'package:grocygo/app/screens/navbar/recipes_screen.dart';
import 'package:grocygo/app/screens/navbar/mealplans_screen.dart';
import 'package:grocygo/app/screens/navbar/shoppinglist_screen.dart';
import 'package:grocygo/app/screens/navbar/analytics_screen.dart';

class HomeScreen extends StatefulWidget {
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  static final List<Widget> _pages = <Widget>[
    InventoryScreen(),
    RecipesScreen(),
    MealPlansScreen(),
    ShoppingListScreen(),
    AnalyticsScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex],
      bottomNavigationBar: Container(
        padding: EdgeInsets.symmetric(vertical: 8, horizontal: 8),
        decoration: BoxDecoration(
          color: Theme.of(context).scaffoldBackgroundColor,
          boxShadow: [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 8,
              offset: Offset(0, -2),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: List.generate(_navItems.length, (index) {
            final item = _navItems[index];
            final selected = _selectedIndex == index;
            return AnimatedContainer(
              duration: Duration(milliseconds: 250),
              curve: Curves.easeOut,
              padding: EdgeInsets.symmetric(
                horizontal: selected ? 16 : 0,
                vertical: 8,
              ),
              decoration: BoxDecoration(
                color:
                    selected
                        ? Theme.of(context).colorScheme.primary.withOpacity(0.1)
                        : Colors.transparent,
                borderRadius: BorderRadius.circular(24),
              ),
              child: InkWell(
                borderRadius: BorderRadius.circular(24),
                onTap: () => _onItemTapped(index),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      item.icon,
                      color:
                          selected
                              ? Theme.of(context).colorScheme.primary
                              : Colors.grey,
                      size: 28,
                    ),
                    AnimatedSize(
                      duration: Duration(milliseconds: 250),
                      curve: Curves.easeOut,
                      child:
                          selected
                              ? Padding(
                                padding: const EdgeInsets.only(left: 8.0),
                                child: Text(
                                  item.label,
                                  style: TextStyle(
                                    color:
                                        Theme.of(context).colorScheme.primary,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 16,
                                  ),
                                ),
                              )
                              : SizedBox.shrink(),
                    ),
                  ],
                ),
              ),
            );
          }),
        ),
      ),
    );
  }

  static const List<_NavItem> _navItems = [
    _NavItem(Icons.inventory_2, 'Inventory'),
    _NavItem(Icons.receipt_long, 'Recipes'),
    _NavItem(Icons.calendar_month, 'Meal Plans'),
    _NavItem(Icons.shopping_cart, 'Shopping List'),
    _NavItem(Icons.analytics, 'Analytics'),
  ];
}

class _NavItem {
  final IconData icon;
  final String label;
  const _NavItem(this.icon, this.label);
}

// ...existing code...
