import { BodyData } from '../../shared/types/body';

export const mercuryData: BodyData = {
  id: 'mercury',
  name: 'Mercury',
  radius: 0.5,
  orbitRadius: 12,
  orbitalPeriod: 88,
  spinPeriod: 58.6,
  tilt: 0.03,
  diameter: '4,879 km',
  distance: '0.39 AU from the Sun',
  orbitDesc: '88 days',
  moonCount: 'None',
  note: 'The smallest planet, heavily cratered and airless. Surface temperatures swing by over 500 °C from day to night. One day, sunrise to sunrise, lasts 176 Earth days.',
  facts: [
    ['Diameter', '4,879 km'],
    ['Day', '59 Earth days'],
    ['Year', '88 days'],
    ['Surface', '167 °C mean'],
    ['Gravity', '3.7 m/s²'],
    ['Moons', 'None'],
  ],
  inspectorDistance: 2.9,
  hours: 1407.6,
  bump: ['mercury_b', 0.6],
};
