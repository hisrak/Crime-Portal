// Karachi ke ilaqe (har ilaqa kisi ek region ka hissa hai)
export const AREAS = [
    { name: 'Saddar', region: 'South' },
    { name: 'Clifton', region: 'South' },
    { name: 'Lyari', region: 'South' },
    { name: 'DHA', region: 'South' },
    { name: 'Garden', region: 'South' },
    { name: 'Gulshan-e-Iqbal', region: 'East' },
    { name: 'Gulistan-e-Johar', region: 'East' },
    { name: 'Korangi', region: 'East' },
    { name: 'Landhi', region: 'East' },
    { name: 'Malir', region: 'East' },
    { name: 'Orangi Town', region: 'West' },
    { name: 'Baldia Town', region: 'West' },
    { name: 'SITE Area', region: 'West' },
    { name: 'North Nazimabad', region: 'North' },
    { name: 'Nazimabad', region: 'North' },
    { name: 'New Karachi', region: 'North' },
    { name: 'Surjani Town', region: 'North' },
];

export const AREA_NAMES = AREAS.map((a) => a.name);