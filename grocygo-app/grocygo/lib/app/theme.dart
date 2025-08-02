import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData lightTheme = ThemeData(
    brightness: Brightness.light,
    primaryColor: Color(0xFF2F9E89),
    scaffoldBackgroundColor: Color(0xFFF6FCFA),
    colorScheme: ColorScheme.light(
      primary: Color(0xFF2F9E89),
      secondary: Color(0xFFFF7A59),
      background: Color(0xFFF6FCFA),
      error: Color(0xFFFF4C4C),
    ),
    textTheme: TextTheme(
      titleLarge: TextStyle(color: Color(0xFF1C1F23)),
      bodyMedium: TextStyle(color: Color(0xFF4B5563)),
    ),
  );

  static ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    primaryColor: Color(0xFF2F9E89),
    scaffoldBackgroundColor: Color(0xFF101418),
    colorScheme: ColorScheme.dark(
      primary: Color(0xFF2F9E89),
      secondary: Color(0xFFFF7A59),
      background: Color(0xFF101418),
      error: Color(0xFFFF4C4C),
    ),
    textTheme: TextTheme(
      titleLarge: TextStyle(color: Color(0xFFF0F3F8)),
      bodyMedium: TextStyle(color: Color(0xFFA6B2C2)),
    ),
  );
}
