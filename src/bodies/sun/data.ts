import { BodyData } from '../../shared/types/body';

export const sunData: BodyData = {
  id: 'sun',
  name: 'Sun',
  radius: 6,
  orbitRadius: 0,
  orbitalPeriod: 0,
  spinPeriod: 25,
  tilt: 7.25,
  diameter: '1,392,700 km',
  distance: 'Center of the system',
  orbitDesc: '~230 million years around the galaxy',
  moonCount: '',
  note: 'A G-type star holding 99.86% of the solar system’s mass. Real sunspot imagery under an animated model of boiling convection cells and limb darkening.',
  facts: [
    ['Diameter', '1,392,700 km'],
    ['Rotation', '25 days at the equator'],
    ['Surface', '5,500 °C'],
    ['Gravity', '274 m/s²'],
    ['Mass', '99.86% of the system'],
    ['Age', '4.6 billion years'],
  ],
  inspectorDistance: 3.2,
  hours: 600,
};
