import { DayData, CycleData, Domain, SessionBreakdown, CrossLink, MILESTONE_CYCLES } from '@/types/marathon';

export function parseMarkdown(markdownText: string): CycleData[] {
  const cycles: CycleData[] = [];
  const lines = markdownText.split('\n');

  let currentCycle: CycleData | null = null;
  let currentDay: DayData | null = null;
  let inSubtopics = false;
  let subtopics: string[] = [];
  let crossLinks: CrossLink[] = [];

  const dayPattern = /^#### Cycle (\d+) — Day (\d+) — (\w+)/;
  const domainPattern = /^- \*\*Domain:\*\* (.+)/;
  const themePattern = /^\s+- \*\*Theme:\*\* (.+)/;
  const primaryTopicPattern = /^- \*\*Primary Topic:\*\* (.+)/;
  const subtopicsStartPattern = /^- \*\*Subtopics to cover:\*\*/;
  const learningObjectivePattern = /^- \*\*Learning Objective:\*\* (.+)/;
  const sessionBreakdownPattern = /^\s+- \*\*Session Breakdown:\*\* (.+)/;
  const deliverablePattern = /^- \*\*Deliverable:\*\* (.+)/;
  const tagsPattern = /^- \*\*Tags:\*\* (.+)/;
  const crossLinkPattern = /^\s+- Cross-Link \(([^)]+)\): (.+)/;
  const subtopicPattern = /^\s+- (.+)/;
  const cycleHeaderPattern = /^### Cycle (\d+)/;

  function savePreviousDay() {
    if (currentDay && currentCycle) {
      currentDay.subtopics = subtopics.filter(s => !s.startsWith('Cross-Link'));
      currentDay.crossLinks = crossLinks;
      currentCycle.days.push(currentDay);
    }
    subtopics = [];
    crossLinks = [];
    inSubtopics = false;
  }

  function savePreviousCycle() {
    savePreviousDay();
    if (currentCycle && currentCycle.days.length > 0) {
      cycles.push(currentCycle);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for cycle header
    const cycleMatch = line.match(cycleHeaderPattern);
    if (cycleMatch) {
      savePreviousCycle();
      const cycleNum = parseInt(cycleMatch[1]);
      currentCycle = {
        cycleNum,
        days: [],
        isCompleted: false,
        isMilestone: MILESTONE_CYCLES.includes(cycleNum),
      };
      currentDay = null;
      continue;
    }

    // Check for day header
    const dayMatch = line.match(dayPattern);
    if (dayMatch && currentCycle) {
      savePreviousDay();
      currentDay = {
        cycle: parseInt(dayMatch[1]),
        dayNum: parseInt(dayMatch[2]),
        dayOfWeek: dayMatch[3],
        domain: 'ECE' as Domain,
        theme: '',
        primaryTopic: '',
        subtopics: [],
        crossLinks: [],
        learningObjective: '',
        sessionBreakdown: { theory: 0, intuition: 0, problemSolving: 0, review: 0, total: 150 },
        deliverable: '',
        tags: [],
        isRevisionDay: false,
        isCompleted: false,
      };
      continue;
    }

    if (!currentDay) continue;

    // Parse domain
    const domainMatch = line.match(domainPattern);
    if (domainMatch) {
      let domainStr = domainMatch[1].trim();
      if (domainStr.includes('Revision')) {
        currentDay.domain = 'Revision';
        currentDay.isRevisionDay = true;
      } else {
        currentDay.domain = domainStr as Domain;
      }
      continue;
    }

    // Parse theme
    const themeMatch = line.match(themePattern);
    if (themeMatch) {
      currentDay.theme = themeMatch[1].trim();
      continue;
    }

    // Parse primary topic
    const primaryTopicMatch = line.match(primaryTopicPattern);
    if (primaryTopicMatch) {
      currentDay.primaryTopic = primaryTopicMatch[1].trim();
      continue;
    }

    // Check for subtopics section start
    if (subtopicsStartPattern.test(line)) {
      inSubtopics = true;
      continue;
    }

    // Parse learning objective
    const learningMatch = line.match(learningObjectivePattern);
    if (learningMatch) {
      currentDay.learningObjective = learningMatch[1].trim();
      inSubtopics = false;
      continue;
    }

    // Parse session breakdown
    const sessionMatch = line.match(sessionBreakdownPattern);
    if (sessionMatch) {
      currentDay.sessionBreakdown = parseSessionBreakdown(sessionMatch[1]);
      continue;
    }

    // Parse deliverable
    const deliverableMatch = line.match(deliverablePattern);
    if (deliverableMatch) {
      currentDay.deliverable = deliverableMatch[1].trim();
      continue;
    }

    // Parse tags
    const tagsMatch = line.match(tagsPattern);
    if (tagsMatch) {
      currentDay.tags = tagsMatch[1].split(' ').map(t => t.trim()).filter(t => t.startsWith('#'));
      continue;
    }

    // Parse cross-links and subtopics
    if (inSubtopics) {
      const crossLinkMatch = line.match(crossLinkPattern);
      if (crossLinkMatch) {
        crossLinks.push({
          domain: crossLinkMatch[1],
          title: crossLinkMatch[2].trim(),
        });
      } else {
        const subtopicMatch = line.match(subtopicPattern);
        if (subtopicMatch && !line.includes('Learning Objective') && !line.includes('Session Breakdown')) {
          subtopics.push(subtopicMatch[1].trim());
        }
      }
    }
  }

  // Save the last cycle
  savePreviousCycle();

  // Debug: Log cycle counts
  console.log('parseMarkdown result:', {
    totalCycles: cycles.length,
    cycleNumbers: cycles.map(c => c.cycleNum),
    totalDays: cycles.reduce((sum, c) => sum + c.days.length, 0),
    cycle40: cycles.find(c => c.cycleNum === 40)?.days.length || 'NOT FOUND'
  });

  return cycles;
}

function parseSessionBreakdown(breakdownStr: string): SessionBreakdown {
  const result: SessionBreakdown = {
    theory: 0,
    intuition: 0,
    problemSolving: 0,
    review: 0,
    total: 150,
  };

  const patterns = [
    { regex: /(\d+)m?\s*Theory/i, key: 'theory' },
    { regex: /(\d+)m?\s*Intuition/i, key: 'intuition' },
    { regex: /(\d+)m?\s*Problem\s*Solving/i, key: 'problemSolving' },
    { regex: /(\d+)m?\s*Review/i, key: 'review' },
    { regex: /(\d+)m?\s*Coding/i, key: 'coding' },
    { regex: /(\d+)m?\s*Practice/i, key: 'practice' },
    { regex: /(\d+)m?\s*Notes/i, key: 'notes' },
  ];

  for (const { regex, key } of patterns) {
    const match = breakdownStr.match(regex);
    if (match) {
      (result as any)[key] = parseInt(match[1]);
    }
  }

  const totalMatch = breakdownStr.match(/Total:\s*(\d+)m?/i);
  if (totalMatch) {
    result.total = parseInt(totalMatch[1]);
  }

  return result;
}
