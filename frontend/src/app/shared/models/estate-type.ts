export interface EstateType {
  displayName: string;
  queryName: string;
}

export const AVAILABLE_ESTATE_TYPES = [
  {
    displayName: 'mieszkanie',
    queryName: 'Mieszkanie',
  },
  {
    displayName: 'dom',
    queryName: 'Dom',
  },
  {
    displayName: 'działka',
    queryName: 'Działka',
  },
  {
    displayName: 'lokal',
    queryName: 'Lokal',
  },
  {
    displayName: 'hala',
    queryName: 'Hala',
  },
  {
    displayName: 'obiekt',
    queryName: 'Obiekt',
  },
];
