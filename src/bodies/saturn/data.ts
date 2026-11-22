import { BodyData } from '../../shared/types/body';
import { saturnMoons } from './moons';

export const saturnData: BodyData = {
  id: 'saturn',
  name: 'Saturn',
  radius: 2.9,
  orbitRadius: 66,
  orbitalPeriod: 10759,
  spinPeriod: 0.444,
  tilt: 26.7,
  diameter: '116,460 km',
  distance: '9.58 AU from the Sun',
  orbitDesc: '29.5 years',
  moonCount: '270+ known; 7 shown',
  note: 'Water-ice rings span about 280,000 km yet are typically only tens of metres thick. The planet shades the rings, and the rings shade it back.',
  facts: [
    ['Diameter', '116,460 km'],
    ['Day', '10 h 33 m'],
    ['Year', '29.5 years'],
    ['Cloud tops', '−140 °C'],
    ['Gravity', '10.4 m/s²'],
    ['Moons', '270+ known; 7 shown'],
  ],
  inspectorDistance: 6.2,
  hours: 10.7,
  ring: [3.5, 6.6, 'saturn'],
  atmosphere: ['#f0dca8', 1.02, 0.7],
  children: saturnMoons,
};

export * from './moons';
