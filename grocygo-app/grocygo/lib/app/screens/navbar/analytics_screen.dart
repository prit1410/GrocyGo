import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:grocygo/app/controllers/navbar/analytics_controller.dart';
import 'package:grocygo/app/models/analytics_models.dart';

class AnalyticsScreen extends StatelessWidget {
  final AnalyticsController controller = Get.find<AnalyticsController>();

  AnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('GrocyGo Analytics'),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(20.0),
          child: Padding(
            padding: EdgeInsets.only(bottom: 8.0),
            child: Text(
              'Futuristic Kitchen Insights',
              style: TextStyle(fontSize: 12.0),
            ),
          ),
        ),
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }
        if (controller.error.value != null) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                'Error loading analytics: ${controller.error.value}',
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.red),
              ),
            ),
          );
        }
        return SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              // Groceries by Category (Pie Chart)
              Card(
                elevation: 4,
                margin: const EdgeInsets.only(bottom: 16.0),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      const Text(
                        'Groceries by Category',
                        style: TextStyle(
                            fontSize: 18.0, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 16.0),
                      SizedBox(
                        height: 250,
                        child: controller.categoryStats.isEmpty
                            ? const Center(
                                child: Text('No category data available.'))
                            : PieChart(
                                PieChartData(
                                  sections: controller.categoryStats
                                      .asMap()
                                      .entries
                                      .map((entry) {
                                    final index = entry.key;
                                    final data = entry.value;
                                    final color = _getChartColor(index);
                                    return PieChartSectionData(
                                      color: color,
                                      value: data.count.toDouble(),
                                      title: '${data.category} (${data.count})',
                                      radius: 80,
                                      titleStyle: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    );
                                  }).toList(),
                                  sectionsSpace: 2,
                                  centerSpaceRadius: 40,
                                  borderData: FlBorderData(show: false),
                                  // Add touch interaction for category click
                                  pieTouchData: PieTouchData(
                                    touchCallback: (FlTouchEvent event, pieTouchResponse) {
                                      if (event.isInterestedForInteractions &&
                                          pieTouchResponse != null &&
                                          pieTouchResponse.touchedSection != null) {
                                        final sectionIndex = pieTouchResponse.touchedSection!.touchedSectionIndex;
                                        final category = controller.categoryStats[sectionIndex].category;
                                        _showCategoryItemsDialog(context, category);
                                      }
                                    },
                                  ),
                                ),
                              ),
                      ),
                    ],
                  ),
                ),
              ),

              // Inventory Usage Over Time (Line Chart)
              Card(
                elevation: 4,
                margin: const EdgeInsets.only(bottom: 16.0),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      const Text(
                        'Inventory Usage Over Time',
                        style: TextStyle(
                            fontSize: 18.0, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 16.0),
                      SizedBox(
                        height: 250,
                        child: controller.inventoryUsage.isEmpty
                            ? const Center(
                                child: Text('No inventory usage data available.'))
                            : LineChart(
                                LineChartData(
                                  gridData: FlGridData(
                                    show: true,
                                    drawVerticalLine: true,
                                    getDrawingHorizontalLine: (value) => FlLine(
                                      color: Colors.grey.withOpacity(0.3),
                                      strokeWidth: 1,
                                    ),
                                    getDrawingVerticalLine: (value) => FlLine(
                                      color: Colors.grey.withOpacity(0.3),
                                      strokeWidth: 1,
                                    ),
                                  ),
                                  titlesData: FlTitlesData(
                                    show: true,
                                    bottomTitles: AxisTitles(
                                      sideTitles: SideTitles(
                                        showTitles: true,
                                        reservedSize: 30,
                                        getTitlesWidget: (value, meta) {
                                          final date = controller.inventoryUsage[value.toInt()].date;
                                          return SideTitleWidget(
                                            axisSide: meta.axisSide,
                                            child: Text(date.substring(5)), // Month-Day
                                          );
                                        },
                                      ),
                                    ),
                                    leftTitles: AxisTitles(
                                      sideTitles: SideTitles(
                                        showTitles: true,
                                        reservedSize: 40,
                                        getTitlesWidget: (value, meta) => Text(value.toInt().toString()),
                                      ),
                                    ),
                                    topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                    rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                  ),
                                  borderData: FlBorderData(
                                    show: true,
                                    border: Border.all(color: Colors.grey.withOpacity(0.3), width: 1),
                                  ),
                                  minX: 0,
                                  maxX: controller.inventoryUsage.length.toDouble() - 1,
                                  minY: 0,
                                  maxY: _getMaxValue(controller.inventoryUsage.map((e) => [e.added, e.used]).expand((e) => e).toList()).toDouble() + 1,
                                  lineBarsData: [
                                    LineChartBarData(
                                      spots: controller.inventoryUsage.asMap().entries.map((entry) {
                                        final index = entry.key;
                                        final data = entry.value;
                                        return FlSpot(index.toDouble(), data.added.toDouble());
                                      }).toList(),
                                      isCurved: true,
                                      color: Colors.blue,
                                      barWidth: 2,
                                      isStrokeCapRound: true,
                                      dotData: const FlDotData(show: false),
                                      belowBarData: BarAreaData(show: false),
                                    ),
                                    LineChartBarData(
                                      spots: controller.inventoryUsage.asMap().entries.map((entry) {
                                        final index = entry.key;
                                        final data = entry.value;
                                        return FlSpot(index.toDouble(), data.used.toDouble());
                                      }).toList(),
                                      isCurved: true,
                                      color: Colors.green,
                                      barWidth: 2,
                                      isStrokeCapRound: true,
                                      dotData: const FlDotData(show: false),
                                      belowBarData: BarAreaData(show: false),
                                    ),
                                  ],
                                ),
                              ),
                      ),
                    ],
                  ),
                ),
              ),

              // Expiring Items Per Month (Bar Chart)
              Card(
                elevation: 4,
                margin: const EdgeInsets.only(bottom: 16.0),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      const Text(
                        'Expiring Items Per Month',
                        style: TextStyle(
                            fontSize: 18.0, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 16.0),
                      SizedBox(
                        height: 250,
                        child: controller.expiryStats.isEmpty
                            ? const Center(
                                child: Text('No expiry stats data available.'))
                            : BarChart(
                                BarChartData(
                                  barGroups: controller.expiryStats
                                      .asMap()
                                      .entries
                                      .map((entry) {
                                    final index = entry.key;
                                    final data = entry.value;
                                    return BarChartGroupData(
                                      x: index,
                                      barRods: [
                                        BarChartRodData(
                                          toY: data.expiringCount.toDouble(),
                                          color: Colors.orange,
                                          width: 15,
                                        ),
                                      ],
                                    );
                                  }).toList(),
                                  titlesData: FlTitlesData(
                                    show: true,
                                    bottomTitles: AxisTitles(
                                      sideTitles: SideTitles(
                                        showTitles: true,
                                        reservedSize: 30,
                                        getTitlesWidget: (value, meta) {
                                          final month = controller.expiryStats[value.toInt()].month;
                                          return SideTitleWidget(
                                            axisSide: meta.axisSide,
                                            child: Text(month.substring(5)), // Month
                                          );
                                        },
                                      ),
                                    ),
                                    leftTitles: AxisTitles(
                                      sideTitles: SideTitles(
                                        showTitles: true,
                                        reservedSize: 40,
                                        getTitlesWidget: (value, meta) => Text(value.toInt().toString()),
                                      ),
                                    ),
                                    topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                    rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                  ),
                                  borderData: FlBorderData(
                                    show: true,
                                    border: Border.all(color: Colors.grey.withOpacity(0.3), width: 1),
                                  ),
                                  gridData: FlGridData(
                                    show: true,
                                    drawVerticalLine: false,
                                    getDrawingHorizontalLine: (value) => FlLine(
                                      color: Colors.grey.withOpacity(0.3),
                                      strokeWidth: 1,
                                    ),
                                  ),
                                  alignment: BarChartAlignment.spaceAround,
                                  maxY: _getMaxValue(controller.expiryStats.map((e) => e.expiringCount).toList()).toDouble() + 1,
                                ),
                              ),
                      ),
                    ],
                  ),
                ),
              ),

              // Shopping Frequency Per Month (Bar Chart)
              Card(
                elevation: 4,
                margin: const EdgeInsets.only(bottom: 16.0),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      const Text(
                        'Shopping Frequency Per Month',
                        style: TextStyle(
                            fontSize: 18.0, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 16.0),
                      SizedBox(
                        height: 250,
                        child: controller.shoppingTrends.isEmpty
                            ? const Center(
                                child: Text('No shopping trends data available.'))
                            : BarChart(
                                BarChartData(
                                  barGroups: controller.shoppingTrends
                                      .asMap()
                                      .entries
                                      .map((entry) {
                                    final index = entry.key;
                                    final data = entry.value;
                                    return BarChartGroupData(
                                      x: index,
                                      barRods: [
                                        BarChartRodData(
                                          toY: data.shoppingCount.toDouble(),
                                          color: Colors.blueAccent,
                                          width: 15,
                                        ),
                                      ],
                                    );
                                  }).toList(),
                                  titlesData: FlTitlesData(
                                    show: true,
                                    bottomTitles: AxisTitles(
                                      sideTitles: SideTitles(
                                        showTitles: true,
                                        reservedSize: 30,
                                        getTitlesWidget: (value, meta) {
                                          final month = controller.shoppingTrends[value.toInt()].month;
                                          return SideTitleWidget(
                                            axisSide: meta.axisSide,
                                            child: Text(month.substring(5)), // Month
                                          );
                                        },
                                      ),
                                    ),
                                    leftTitles: AxisTitles(
                                      sideTitles: SideTitles(
                                        showTitles: true,
                                        reservedSize: 40,
                                        getTitlesWidget: (value, meta) => Text(value.toInt().toString()),
                                      ),
                                    ),
                                    topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                    rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                  ),
                                  borderData: FlBorderData(
                                    show: true,
                                    border: Border.all(color: Colors.grey.withOpacity(0.3), width: 1),
                                  ),
                                  gridData: FlGridData(
                                    show: true,
                                    drawVerticalLine: false,
                                    getDrawingHorizontalLine: (value) => FlLine(
                                      color: Colors.grey.withOpacity(0.3),
                                      strokeWidth: 1,
                                    ),
                                  ),
                                  alignment: BarChartAlignment.spaceAround,
                                  maxY: _getMaxValue(controller.shoppingTrends.map((e) => e.shoppingCount).toList()).toDouble() + 1,
                                ),
                              ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      }),
    );
  }

  // Helper to get a consistent color for charts
  Color _getChartColor(int index) {
    final colors = [
      Colors.green,
      Colors.orange,
      Colors.blue,
      Colors.red,
      Colors.purple,
      Colors.yellow,
      Colors.cyan,
      Colors.pink,
      Colors.teal,
      Colors.indigo,
    ];
    return colors[index % colors.length];
  }

  // Helper to get max value for Y-axis
  int _getMaxValue(List<int> values) {
    if (values.isEmpty) return 0;
    return values.reduce((curr, next) => curr > next ? curr : next);
  }

  void _showCategoryItemsDialog(BuildContext context, String category) {
    controller.fetchItemsForCategory(category);
    Get.dialog(
      AlertDialog(
        title: Text('Items in $category'),
        content: Obx(() {
          if (controller.isCategoryItemsLoading.value) {
            return const SizedBox(
              height: 100,
              child: Center(child: CircularProgressIndicator()),
            );
          }
          if (controller.selectedCategoryItems.isEmpty) {
            return const SizedBox(
              height: 100,
              child: Center(child: Text('No items found for this category.')),
            );
          }
          return SizedBox(
            width: double.maxFinite,
            child: ListView.builder(
              shrinkWrap: true,
              itemCount: controller.selectedCategoryItems.length,
              itemBuilder: (context, index) {
                final item = controller.selectedCategoryItems[index];
                return ListTile(
                  title: Text(item.name),
                  subtitle: Text('Quantity: ${item.quantity}'),
                );
              },
            ),
          );
        }),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
}