import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:grocygo/app/utils/api/recipes_api.dart';
import 'package:grocygo/app/utils/api/inventory_api.dart'; // Import InventoryApi
import 'package:url_launcher/url_launcher.dart';

class RecipeDetailsScreen extends StatefulWidget {
  final Map<String, dynamic> recipe;

  const RecipeDetailsScreen({super.key, required this.recipe});

  @override
  _RecipeDetailsScreenState createState() => _RecipeDetailsScreenState();
}

class _RecipeDetailsScreenState extends State<RecipeDetailsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isExpanded = false;
  List<dynamic> _inventory = []; // Change to List<dynamic>
  bool _isLoadingInventory = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchInventory();
  }

  Future<void> _fetchInventory() async {
    try {
      final inventory = await InventoryApi().fetchInventory(); // Use InventoryApi
      setState(() {
        _inventory = inventory;
        _isLoadingInventory = false;
      });
    } catch (e) {
      setState(() {
        _isLoadingInventory = false;
      });
      Get.snackbar('Error', 'Failed to fetch inventory');
    }
  }

  List<String> get _recipeIngredients {
    if (widget.recipe['ingredients'] is String) {
      return (widget.recipe['ingredients'] as String)
          .split('|')
          .map((e) => e.trim())
          .toList();
    }
    return [];
  }

  List<String> get _haveIngredients {
    final inventoryNames =
        _inventory.map((e) => e['name'].toLowerCase()).toList();
    return _recipeIngredients
        .where((ing) => inventoryNames.contains(ing.toLowerCase()))
        .toList();
  }

  List<String> get _needIngredients {
    final inventoryNames =
        _inventory.map((e) => e['name'].toLowerCase()).toList();
    return _recipeIngredients
        .where((ing) => !inventoryNames.contains(ing.toLowerCase()))
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    // Responsive font sizes
    final titleSize = screenWidth * 0.06;
    final bodySize = screenWidth * 0.04;
    final chipSize = screenWidth * 0.035;

    // Responsive spacing
    final padding = screenWidth * 0.04;
    final spacing = screenHeight * 0.02;

    return Scaffold(
      body: LayoutBuilder(
        builder: (context, constraints) {
          return Stack(
            children: [
              // Background Image
              SizedBox(
                height: screenHeight * (constraints.maxWidth > 600 ? 0.5 : 0.4),
                width: double.infinity,
                child: widget.recipe['recipe_image'] != null &&
                        widget.recipe['recipe_image'].isNotEmpty
                    ? Image.network(
                        widget.recipe['recipe_image'],
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) =>
                            const Center(
                          child: Icon(Icons.broken_image, size: 100),
                        ),
                      )
                    : const Center(
                        child: Icon(Icons.image_not_supported, size: 100),
                      ),
              ),
              // Back button
              Positioned(
                top: 40,
                left: 16,
                child: CircleAvatar(
                  backgroundColor: Colors.black.withOpacity(0.5),
                  child: IconButton(
                    icon: const Icon(Icons.arrow_back, color: Colors.white),
                    onPressed: () => Get.back(),
                  ),
                ),
              ),
              // Draggable Content
              DraggableScrollableSheet(
                initialChildSize: constraints.maxWidth > 600 ? 0.5 : 0.6,
                minChildSize: constraints.maxWidth > 600 ? 0.5 : 0.6,
                maxChildSize: 0.9,
                builder: (context, scrollController) {
                  return Container(
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(30),
                        topRight: Radius.circular(30),
                      ),
                    ),
                    child: SingleChildScrollView(
                      controller: scrollController,
                      child: Padding(
                        padding: EdgeInsets.all(padding),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.recipe['recipe_title'] ?? 'No Title',
                              style: TextStyle(
                                fontSize: titleSize,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            if (widget.recipe['url'] != null &&
                                widget.recipe['url'].isNotEmpty)
                              Padding(
                                padding: EdgeInsets.only(top: spacing / 2),
                                child: InkWell(
                                  onTap: () async {
                                    final url = widget.recipe['url'];
                                    if (await canLaunch(url)) {
                                      await launch(url);
                                    }
                                  },
                                  child: Text(
                                    'Click here for video',
                                    style: TextStyle(
                                      color: Colors.blue,
                                      decoration: TextDecoration.underline,
                                      fontSize: bodySize,
                                    ),
                                  ),
                                ),
                              ),
                            SizedBox(height: spacing),
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Expanded(
                                  child: Wrap(
                                    spacing: 8.0,
                                    runSpacing: 4.0,
                                    children: [
                                      _buildInfoChip(
                                          'Course', widget.recipe['course'], chipSize),
                                      _buildInfoChip(
                                          'Diet', widget.recipe['diet'], chipSize),
                                    ],
                                  ),
                                ),
                                SizedBox(width: spacing),
                                Row(
                                  children: [
                                    const Icon(Icons.timer_outlined, size: 16),
                                    const SizedBox(width: 4),
                                    Text(
                                      widget.recipe['prep_time'] ?? 'N/A',
                                      style: TextStyle(fontSize: bodySize),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            SizedBox(height: spacing),
                            GestureDetector(
                              onTap: () {
                                setState(() {
                                  _isExpanded = !_isExpanded;
                                });
                              },
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    widget.recipe['description'] ?? '',
                                    maxLines: _isExpanded ? null : 2,
                                    overflow: _isExpanded
                                        ? TextOverflow.visible
                                        : TextOverflow.ellipsis,
                                    style: TextStyle(fontSize: bodySize),
                                  ),
                                  if (widget.recipe['description'] != null &&
                                      widget.recipe['description'].length > 100)
                                    Text(
                                      _isExpanded ? 'Read Less' : 'Read More',
                                      style: TextStyle(
                                        color: Colors.blue,
                                        fontSize: bodySize,
                                      ),
                                    ),
                                ],
                              ),
                            ),
                            SizedBox(height: spacing),
                            TabBar(
                              controller: _tabController,
                              tabs: const [
                                Tab(text: 'Ingredients'),
                                Tab(text: 'Instructions'),
                              ],
                            ),
                            SizedBox(
                              height: 300, // Adjust height as needed
                              child: TabBarView(
                                controller: _tabController,
                                children: [
                                  _buildIngredientsTab(bodySize),
                                  _buildInstructionsTab(bodySize),
                                ],
                              ),
                            ),
                            _buildBottomButton(),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildInfoChip(String label, String? value, double fontSize) {
    return Chip(
      label: Text(
        '$label: ${value ?? 'N/A'}',
        style: TextStyle(fontSize: fontSize),
      ),
      backgroundColor: Colors.grey[200],
    );
  }

  Widget _buildIngredientsTab(double bodySize) {
    if (_isLoadingInventory) {
      return const Center(child: CircularProgressIndicator());
    }
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Ingredients:',
            style: TextStyle(fontSize: bodySize, fontWeight: FontWeight.bold),
          ),
          ..._recipeIngredients.map((e) => Text('- $e', style: TextStyle(fontSize: bodySize))),
          const SizedBox(height: 16),
          Text(
            '✔️ You have:',
            style: TextStyle(
              fontSize: bodySize,
              fontWeight: FontWeight.bold,
              color: Colors.green,
            ),
          ),
          ..._haveIngredients.map((e) => Text('- $e', style: TextStyle(fontSize: bodySize))),
          const SizedBox(height: 16),
          Text(
            '❌ Need to buy:',
            style: TextStyle(
              fontSize: bodySize,
              fontWeight: FontWeight.bold,
              color: Colors.red,
            ),
          ),
          ..._needIngredients.map((e) => Text('- $e', style: TextStyle(fontSize: bodySize))),
        ],
      ),
    );
  }

  Widget _buildInstructionsTab(double bodySize) {
    final instructions = (widget.recipe['instructions'] as String? ?? '')
        .split('|')
        .where((s) => s.trim().isNotEmpty)
        .toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Instructions:',
            style: TextStyle(fontSize: bodySize, fontWeight: FontWeight.bold),
          ),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: instructions.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 4.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('${index + 1}. ', style: TextStyle(fontSize: bodySize)),
                    Expanded(
                      child: Text(instructions[index].trim(), style: TextStyle(fontSize: bodySize)),
                    ),
                  ],
                ),
              );
            },
          ),
          if (widget.recipe['url'] != null && widget.recipe['url'].isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 16.0),
              child: InkWell(
                onTap: () async {
                  final url = widget.recipe['url'];
                  if (await canLaunch(url)) {
                    await launch(url);
                  }
                },
                child: Text(
                  'View full recipe here',
                  style: TextStyle(
                    color: Colors.blue,
                    decoration: TextDecoration.underline,
                    fontSize: bodySize,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildBottomButton() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: ElevatedButton(
        onPressed: () async {
          try {
            final recipeToSave = {
              'name': widget.recipe['recipe_title'] ?? widget.recipe['name'],
              'description': widget.recipe['description'] ?? '',
              'url': widget.recipe['url'] ?? '',
              'recipe_image': widget.recipe['recipe_image'] ?? '',
              'prep_time': widget.recipe['prep_time'] ?? '',
              'course': widget.recipe['course'] ?? '',
              'diet': widget.recipe['diet'] ?? '',
              'instructions': widget.recipe['instructions'] ?? '',
              'items':
                  _recipeIngredients
                      .map(
                        (ing) => {
                          'name': ing,
                          'quantity': '',
                          'unit': '',
                          'fromInventory': false,
                        },
                      )
                      .toList(),
            };
            await RecipesApi().addRecipe(recipeToSave);
            Get.snackbar('Success', 'Recipe saved to your collection!');
          } catch (e) {
            Get.snackbar('Error', 'Failed to save recipe.');
          }
        },
        style: ElevatedButton.styleFrom(
          minimumSize: const Size(double.infinity, 50),
        ),
        child: const Text('Save to My Recipes'),
      ),
    );
  }
}
