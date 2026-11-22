export interface StoryPhase {
  title: string;
  description: string;
}

export const STORY_PHASES: StoryPhase[] = [
  {
    title: 'A stable star',
    description:
      'One solar mass of hot plasma. Press Collapse and watch the light bend around it as it compresses.',
  },
  {
    title: 'Collapsing',
    description:
      'The surface falls inward, heats up, then dims and reddens as gravity stretches its light.',
  },
  {
    title: 'A black hole',
    description:
      'Same mass, horizon radius about 2.95 km. Far away, gravity is what it was. Drag to orbit.',
  },
];
