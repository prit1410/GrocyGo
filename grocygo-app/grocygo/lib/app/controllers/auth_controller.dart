import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:firebase_auth/firebase_auth.dart';

class AuthController extends GetxController {
  var isLogin = true.obs;
  var error = ''.obs;
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  Future<void> authenticate() async {
    try {
      if (isLogin.value) {
        await FirebaseAuth.instance.signInWithEmailAndPassword(
          email: emailController.text.trim(),
          password: passwordController.text.trim(),
        );
      } else {
        await FirebaseAuth.instance.createUserWithEmailAndPassword(
          email: emailController.text.trim(),
          password: passwordController.text.trim(),
        );
      }
      error.value = '';
      Get.offAllNamed('/home');
    } catch (e) {
      error.value = e.toString();
    }
  }

  void toggleLogin() {
    isLogin.value = !isLogin.value;
    error.value = '';
  }
}
