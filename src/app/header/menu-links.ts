export interface MenuLink {
    title: string;
    route: string;
}

export const MENU_LINKS: MenuLink[] = [
    {
        title: 'Oferty',
        route: '/oferty',
    },
    {
        title: 'Doradztwo',
        route: '/doradztwo',
    },
    {
        title: 'Zarządzanie najmem',
        route: '/zarzadzanie',
    },
    {
        title: 'Fotowoltaika',
        route: '/fotowoltaika'
    },
    {
        title: 'Dla deweloperów',
        route: '/deweloperzy'
    },
    {
        title: 'O nas',
        route: 'multiple_options',
    },
    {
        title: 'Kontakt',
        route: '/kontakt',
    },
]