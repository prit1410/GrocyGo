import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:grocygo/app/controllers/navbar/analytics_controller.dart';
import 'firebase_options.dart';
import 'app/theme.dart';
import 'app/routes.dart' as app_routes;
import 'app/controllers/theme_controller.dart';
import 'app/controllers/auth_controller.dart';
import 'app/controllers/navbar/inventory_controller.dart';
import 'app/controllers/navbar/recipes_controller.dart';
import 'app/controllers/navbar/mealplans_controller.dart';
import 'app/controllers/navbar/shoppinglist_controller.dart';
import 'app/screens/root.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  Get.put(AuthController());
  Get.put(InventoryController());
  Get.put(RecipesController());
  Get.put(MealPlansController());
  Get.put(ShoppingListController());
  Get.put(AnalyticsController());
  runApp(const GrocyGoApp());
}

class GrocyGoApp extends StatelessWidget {
  const GrocyGoApp({super.key});

  @override
  Widget build(BuildContext context) {
    final ThemeController themeController = Get.put(ThemeController());
    return Obx(
      () => GetMaterialApp(
        title: 'GrocyGo',
        theme: themeController.isDarkMode.value
            ? AppTheme.darkTheme
            : AppTheme.lightTheme,
        home: const Root(),
        getPages: app_routes.AppRoutes.routes,
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}

// ...existing code...
