import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class DatePickerField extends StatefulWidget {
  final String label;
  final DateTime? value;
  final ValueChanged<DateTime?> onChanged;

  const DatePickerField({
    super.key,
    required this.label,
    this.value,
    required this.onChanged,
  });

  @override
  State<DatePickerField> createState() => _DatePickerFieldState();
}

class _DatePickerFieldState extends State<DatePickerField> {
  late DateTime _selectedDate;
  late DateTime _focusedDate;
  List<DateTime> _weekDays = [];

  @override
  void initState() {
    super.initState();
    _selectedDate = widget.value ?? DateTime.now().toUtc();
    _focusedDate = _selectedDate;
    _generateWeekDays();
  }

  void _generateWeekDays() {
    _weekDays = [];
    // Go back to the previous Monday.
    DateTime startOfWeek = _focusedDate.subtract(
      Duration(days: _focusedDate.weekday - 1),
    );
    for (int i = 0; i < 7; i++) {
      _weekDays.add(startOfWeek.add(Duration(days: i)));
    }
  }

  void _goToPreviousWeek() {
    setState(() {
      _focusedDate = _focusedDate.subtract(const Duration(days: 7));
      _generateWeekDays();
    });
  }

  void _goToNextWeek() {
    setState(() {
      _focusedDate = _focusedDate.add(const Duration(days: 7));
      _generateWeekDays();
    });
  }

  Future<void> _selectMonthYear(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _focusedDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
      initialDatePickerMode: DatePickerMode.year,
    );
    if (picked != null && picked != _focusedDate) {
      setState(() {
        _focusedDate = picked;
        _selectedDate = picked;
        _generateWeekDays();
        widget.onChanged(picked);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(
                icon: const Icon(Icons.chevron_left),
                onPressed: _goToPreviousWeek,
              ),
              GestureDetector(
                onTap: () => _selectMonthYear(context),
                child: Text(
                  DateFormat('MMMM yyyy').format(_focusedDate),
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.chevron_right),
                onPressed: _goToNextWeek,
              ),
            ],
          ),
        ),
        GestureDetector(
          onHorizontalDragEnd: (details) {
            if (details.primaryVelocity! < 0) {
              // Swiped left
              _goToNextWeek();
            } else if (details.primaryVelocity! > 0) {
              // Swiped right
              _goToPreviousWeek();
            }
          },
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 4.0),
            child: Row(
              children:
                  _weekDays.map((date) {
                    final isSelected =
                        date.year == _selectedDate.year &&
                        date.month == _selectedDate.month &&
                        date.day == _selectedDate.day;
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedDate = date;
                        });
                        widget.onChanged(date);
                      },
                      child: Container(
                        width:
                            50, // Give a fixed width for each day to allow scrolling
                        height: 70,
                        decoration: BoxDecoration(
                          color:
                              isSelected
                                  ? Colors.green[700]
                                  : Colors.transparent,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              DateFormat('E').format(date), // Day of week
                              style: TextStyle(
                                color: isSelected ? Colors.white : Colors.black,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              DateFormat('d').format(date), // Day of month
                              style: TextStyle(
                                color: isSelected ? Colors.white : Colors.black,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
            ),
          ),
        ),
      ],
    );
  }
}
