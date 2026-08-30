export type JerseyNumberAssignment = {
  number: string;
  owner: string;
};

export const JERSEY_NUMBER_ASSIGNMENTS: JerseyNumberAssignment[] = [
  { number: '00', owner: 'R Nilsson' },
  { number: '01', owner: 'L Nilsson' },
  { number: '02', owner: 'PA' },
  { number: '03', owner: 'C Stadler' },
  { number: '04', owner: 'J Boquist' },
  { number: '05', owner: 'Milton' },
  { number: '06', owner: 'Hansson' },
  { number: '07', owner: 'T Andersson' },
  { number: '08', owner: 'Poljak' },
  { number: '09', owner: 'L Sjöström' },
  { number: '10', owner: 'Amir' },
  { number: '11', owner: 'T Skyman' },
  { number: '12', owner: 'Mårdby' },
  { number: '13', owner: 'J Emanuelsson' },
  { number: '14', owner: 'J Ekerstedt' },
  { number: '15', owner: 'W Lundgren' },
  { number: '16', owner: 'L Bengtsson' },
  { number: '17', owner: 'Lundell' },
  { number: '18', owner: 'LUNDHOLM' },
  { number: '19', owner: 'RELFSON' },
  { number: '20', owner: 'A Andersson' },
  { number: '21', owner: 'Rolf P' },
  { number: '22', owner: 'S Rönnblom' },
  { number: '23', owner: 'Jonte' },
  { number: '24', owner: 'P Sandberg' },
  { number: '25', owner: 'N Ockell' },
  { number: '26', owner: 'S. Ali Mahamoud' },
  { number: '27', owner: 'Hedlund' },
  { number: '28', owner: 'S Blanck' },
  { number: '29', owner: 'A Tran' },
  { number: '30', owner: 'F Edvardsson' },
  { number: '31', owner: 'C Elfström' },
  { number: '32', owner: 'H Ragnarsson' },
  { number: '33', owner: 'Henriksson' },
  { number: '34', owner: 'L Palm' },
  { number: '35', owner: 'C Engman' },
  { number: '36', owner: 'O Palm' },
  { number: '37', owner: 'Ängbacken' },
  { number: '38', owner: 'F E Fuxin' },
  { number: '39', owner: 'F Fuxin' },
  { number: '40', owner: 'H Ekeroth' },
  { number: '41', owner: 'Njal' },
  { number: '42', owner: 'Kalle' },
  { number: '43', owner: 'H Udd' },
  { number: '44', owner: 'Gerdes' },
  { number: '45', owner: 'M Väljemark' },
  { number: '47', owner: 'O Stark' },
  { number: '48', owner: 'Valter L' },
  { number: '50', owner: 'Movitz' },
  { number: '55', owner: 'G Ragnarsson' },
  { number: '60', owner: 'Göthager' },
  { number: '61', owner: 'Malin H' },
  { number: '66', owner: 'Magnus' },
  { number: '67', owner: 'S Larsson' },
  { number: '69', owner: 'C Sjöberg' },
  { number: '70', owner: 'Valdemar' },
  { number: '72', owner: 'A Mentor' },
  { number: '73', owner: 'Gad' },
  { number: '74', owner: 'Sallander' },
  { number: '75', owner: 'J Boden' },
  { number: '77', owner: 'A Gabriel' },
  { number: '78', owner: 'Tobbe L' },
  { number: '80', owner: 'Udd' },
  { number: '81', owner: 'Alfred N' },
  { number: '82', owner: 'Mäntylä' },
  { number: '86', owner: 'L Gustafsson' },
  { number: '87', owner: 'Tobias G' },
  { number: '88', owner: 'R Wen' },
  { number: '89', owner: 'J Dahlqvist' },
  { number: '90', owner: 'A Grankvist' },
  { number: '93', owner: 'A Hendel' },
  { number: '94', owner: 'Rasmus' },
  { number: '95', owner: 'S Babic' },
  { number: '96', owner: 'H Ekström' },
  { number: '97', owner: 'Hansson' },
  { number: '98', owner: 'L Lundell' },
  { number: '99', owner: 'M Nordfelt' },
  { number: '100', owner: 'P Skallefell' },
  { number: '103', owner: 'Jägerbom' },
];

const takenNumbers = new Set(JERSEY_NUMBER_ASSIGNMENTS.map((row) => row.number));

export function availableJerseyNumbers() {
  return Array.from({ length: 100 }, (_, index) => String(index).padStart(2, '0')).filter(
    (number) => !takenNumbers.has(number),
  );
}

export const CLUB_CLOTHES_EMAIL = 'sten-inge@xlntreklam.se';

export const EQUIPMENT_LINKS = [
  {
    name: 'Stiga Sports',
    href: 'https://www.stigasports.com/sv',
    note: '30% rabattkod: INKOP_KUÄV_74574',
  },
  {
    name: 'CHTT',
    href: 'https://chtt.se/',
    note: 'Bra för att köpa kinesisk utrustning.',
  },
  {
    name: 'Wookie Sports',
    href: 'https://wookiesports.se/bordtennis/',
  },
  {
    name: 'TTEX',
    href: 'https://www.ttex.se/',
  },
  {
    name: 'Sydsport',
    href: 'https://www.sydsport.com/bordtennis/',
  },
] as const;
