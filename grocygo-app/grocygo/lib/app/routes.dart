import 'package:get/get.dart';
import 'package:grocygo/app/screens/auth_screen.dart';
import 'package:grocygo/app/screens/home_screen.dart';
import 'package:grocygo/app/screens/splash_screen.dart';
import 'controllers/auth_controller.dart';

class AppRoutes {
  static const splash = '/splash';
  static const auth = '/auth';
  static const home = '/home';

  static final routes = [
    GetPage(name: splash, page: () => SplashScreen()),
    GetPage(
      name: auth,
      page: () => AuthScreen(),
      binding: BindingsBuilder(() => Get.put(AuthController())),
    ),
    GetPage(name: home, page: () => HomeScreen()),
  ];
}
