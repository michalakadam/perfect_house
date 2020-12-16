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
        title: 'O nas',
        route: '/o-nas',
    },
    {
        title: 'Kontakt',
        route: '/kontakt',
    },
]