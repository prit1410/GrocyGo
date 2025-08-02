import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/auth_controller.dart';

class AuthScreen extends StatelessWidget {
  final AuthController controller = Get.find();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          Image.asset('assets/background/auth/auth_bg.png', fit: BoxFit.cover),
          Container(color: Colors.black.withOpacity(0.4)),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Spacer(),
                Obx(
                  () => Text(
                    controller.isLogin.value
                        ? "Welcome Back to GrocyGo!"
                        : "Join GrocyGo and Simplify Your Groceries",
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 24,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                SizedBox(height: 32),
                TextField(
                  controller: controller.emailController,
                  decoration: InputDecoration(
                    hintText: 'Email',
                    filled: true,
                    fillColor: Colors.white.withOpacity(0.8),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                SizedBox(height: 16),
                TextField(
                  controller: controller.passwordController,
                  obscureText: true,
                  decoration: InputDecoration(
                    hintText: 'Password',
                    filled: true,
                    fillColor: Colors.white.withOpacity(0.8),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                Obx(
                  () =>
                      controller.error.value.isNotEmpty
                          ? Padding(
                            padding: const EdgeInsets.only(top: 8.0),
                            child: Text(
                              controller.error.value,
                              style: TextStyle(color: Colors.redAccent),
                            ),
                          )
                          : SizedBox.shrink(),
                ),
                SizedBox(height: 32),
                ElevatedButton(
                  onPressed: controller.authenticate,
                  style: ElevatedButton.styleFrom(
                    minimumSize: Size(double.infinity, 48),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24),
                    ),
                  ),
                  child: Obx(
                    () => Text(controller.isLogin.value ? 'Login' : 'Sign Up'),
                  ),
                ),
                SizedBox(height: 16),
                GestureDetector(
                  onTap: controller.toggleLogin,
                  child: Center(
                    child: Obx(
                      () => Text(
                        controller.isLogin.value
                            ? "Create New Account"
                            : "Already have an account? Login",
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                          fontSize: 16,
                          decoration: TextDecoration.underline,
                        ),
                      ),
                    ),
                  ),
                ),
                SizedBox(height: 48),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
