import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/theme_controller.dart';

class SplashScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final ThemeController themeController = Get.find();
    Future.delayed(Duration(seconds: 2), () {
      Get.offAllNamed('/auth');
    });
    return Scaffold(
      body: Center(
        child: Text(
          'Welcome to GrocyGo',
          style: Theme.of(context).textTheme.titleLarge,
        ),
      ),
      floatingActionButton: IconButton(
        icon: Icon(
          themeController.isDarkMode.value
              ? Icons.wb_sunny
              : Icons.nightlight_round,
        ),
        onPressed: themeController.toggleTheme,
      ),
    );
  }
}
