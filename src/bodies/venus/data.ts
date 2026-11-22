import { BodyData } from '../../shared/types/body';

export const venusData: BodyData = {
  id: 'venus',
  name: 'Venus',
  radius: 1,
  orbitRadius: 17,
  orbitalPeriod: 224.7,
  spinPeriod: 243,
  tilt: 177.4,
  diameter: '12,104 km',
  distance: '0.72 AU from the Sun',
  orbitDesc: '225 days',
  moonCount: 'None',
  note: 'A runaway greenhouse under sulfuric acid clouds. The surface is hot enough to melt lead. It spins backwards, taking longer to rotate once than to orbit the Sun.',
  facts: [
    ['Diameter', '12,104 km'],
    ['Day', '243 Earth days, backwards'],
    ['Year', '225 days'],
    ['Surface', '464 °C'],
    ['Gravity', '8.9 m/s²'],
    ['Moons', 'None'],
  ],
  inspectorDistance: 3.4,
  hours: 5832,
  bump: ['venus_b', 0.5],
  atmosphere: ['#ffcf8a', 1.05, 1.8],
};
