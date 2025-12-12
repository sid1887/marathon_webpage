#!/usr/bin/env python3
"""
Script to add missing cycle headers (### Cycle X:) to the timetable.md file
for cycles 30-77
"""

import re

# Read the file
with open('src/data/timetable.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Cycle titles
cycle_titles = {
    30: "Photonics to Embedded Systems",
    31: "Algorithms to Power Electronics",
    32: "Op-Amps to Perturbation Theory",
    33: "Advanced Electronics and Control",
    34: "Power Systems and Quantum Dynamics",
    35: "Advanced Analog Design",
    36: "System Integration and Optimization",
    37: "Complex Circuits and Quantum Applications",
    38: "Advanced Signal Processing",
    39: "Integrated System Design",
    40: "Advanced System Design",
    41: "Integrated Design Methodologies",
    42: "Cross-Domain Integration",
    43: "Advanced Project Design",
    44: "Specialized Systems",
    45: "Integration and Optimization",
    46: "Advanced Applications",
    47: "System-Level Design",
    48: "Comprehensive Integration",
    49: "Complex Multi-Domain Systems",
    50: "Advanced Integration",
    51: "Specialized Applications",
    52: "Advanced Topics Continuation",
    53: "System Synthesis and Analysis",
    54: "Complex Design Challenges",
    55: "Integrated Solutions",
    56: "Advanced Engineering",
    57: "Comprehensive System Design",
    58: "Multi-Domain Applications",
    59: "Integration Excellence",
    60: "Advanced Synthesis",
    61: "Complex Systems",
    62: "Integrated Design Excellence",
    63: "Advanced Topics",
    64: "System Optimization",
    65: "Complete Integration",
    66: "Advanced Applications",
    67: "Comprehensive Design",
    68: "Multi-Domain Integration",
    69: "System Excellence",
    70: "Advanced Topics",
    71: "Complex Integration",
    72: "System Synthesis",
    73: "Advanced Design",
    74: "Integration Mastery",
    75: "Comprehensive Excellence",
    76: "Advanced Topics",
    77: "Final Integration",
    78: "Marathon Grand Finale"
}

# Process cycles 30-77
replacements = 0
for cycle_num in range(30, 78):
    # Find the pattern: #### Cycle X — Day Y — Monday
    pattern = f"(#### Cycle {cycle_num} — Day (\\d+) — Monday)"
    match = re.search(pattern, content)

    if match:
        day_num = match.group(2)
        day_end = int(day_num) + 6
        title = cycle_titles.get(cycle_num, f"Cycle {cycle_num} Topics")

        # Create the header
        header = f"\n### Cycle {cycle_num}: {title} (Days {day_num}–{day_end})\n\n"

        # Replace: insert header before the day entry
        old_text = match.group(0)
        new_text = header + old_text

        content = content.replace(old_text, new_text, 1)  # Replace only first occurrence
        replacements += 1
        print(f"✓ Added header for Cycle {cycle_num} (Days {day_num}–{day_end})")
    else:
        print(f"✗ Could not find Cycle {cycle_num} Monday entry")

# Write the updated content
with open('src/data/timetable.md', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n✓ Successfully added {replacements} cycle headers!")
print("File saved: src/data/timetable.md")
