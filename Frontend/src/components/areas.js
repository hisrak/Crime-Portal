// Karachi ke ilaqe. lat/lng har ilaqe ka taqriban markaz hai (map par pin ke liye)
export const AREAS = [
  { name: 'Saddar', region: 'South', lat: 24.8607, lng: 67.0099 },
  { name: 'Clifton', region: 'South', lat: 24.8138, lng: 67.03 },
  { name: 'Lyari', region: 'South', lat: 24.8667, lng: 66.9833 },
  { name: 'DHA', region: 'South', lat: 24.8, lng: 67.07 },
  { name: 'Garden', region: 'South', lat: 24.873, lng: 67.03 },
  { name: 'Gulshan-e-Iqbal', region: 'East', lat: 24.9215, lng: 67.095 },
  { name: 'Gulistan-e-Johar', region: 'East', lat: 24.921, lng: 67.13 },
  { name: 'Korangi', region: 'East', lat: 24.835, lng: 67.12 },
  { name: 'Landhi', region: 'East', lat: 24.85, lng: 67.2 },
  { name: 'Malir', region: 'East', lat: 24.89, lng: 67.2 },
  { name: 'Orangi Town', region: 'West', lat: 24.95, lng: 66.99 },
  { name: 'Baldia Town', region: 'West', lat: 24.915, lng: 66.975 },
  { name: 'SITE Area', region: 'West', lat: 24.9, lng: 67.0 },
  { name: 'North Nazimabad', region: 'North', lat: 24.937, lng: 67.039 },
  { name: 'Nazimabad', region: 'North', lat: 24.91, lng: 67.03 },
  { name: 'New Karachi', region: 'North', lat: 24.99, lng: 67.07 },
  { name: 'Surjani Town', region: 'North', lat: 25.03, lng: 67.05 },
]

export const areasOf = (region) => AREAS.filter((a) => a.region === region)