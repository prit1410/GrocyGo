import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:grocygo/app/controllers/auth_controller.dart';
import 'package:grocygo/app/screens/auth_screen.dart';
import 'package:grocygo/app/screens/home_screen.dart';

class Root extends GetWidget<AuthController> {
  const Root({super.key});

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      return (Get.find<AuthController>().user != null)
          ? HomeScreen()
          : const AuthScreen();
    });
  }
}
