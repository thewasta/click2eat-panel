import {
    IconBuildingStore,
    IconCashRegister,
    IconLayoutDashboard,
    IconNotebook,
    IconReportAnalytics
} from "@tabler/icons-react";
import {ConciergeBell} from "lucide-react";
import {ReactNode} from "react";

export type MenuItem = {
    name: string;
    icon: ReactNode;
    path?: string;
    subMenu?: boolean;
    subMenuItems?: (MenuItem & {
        path: string;
        description?: string
    })[];
}
const MenuItems: MenuItem[] = [
    {
        name: 'Panel',
        icon: <IconLayoutDashboard className="h-6"/>,
        path: '/',
    },
    {
        name: 'TPV',
        icon: <IconCashRegister className="h-6"/>,
        path: '/tpv',
    },
    {
        name: 'Pedidos',
        icon: <ConciergeBell className="h-6"/>,
        path: '/orders',
    },
    {
        name: 'Menú',
        icon: <IconNotebook className="h-6"/>,
        subMenu: true,
        subMenuItems: [
            {
                name: 'Productos',
                icon: null,
                path: '/products',
                description: "Gestiona los productos del local"
            },
            {
                name: 'Categorías',
                icon: null,
                path: '/products/categories',
                description: "Gestiona las categorías y sub categorías del local"
            },
        ]
    },
    {
        name: 'Mi local',
        icon: <IconBuildingStore className="h-6"/>,
        subMenu: true,
        subMenuItems: [
            {
                name: 'Mesas',
                icon: null,
                path: '/local/tables',
                description: "Gestiona las zonas/localizaciones y mesas de tu local"
            },
            {
                name: 'Pantallas',
                icon: null,
                path: '/local/screens',
                description: "Crea la configuración de pantallas"
            },
            {
                name: 'Personal',
                icon: null,
                path: '/personal',
                description: "Gestiona los accesos al panel"
            },
        ]
    },
    {
        name: 'Informes',
        icon: <IconReportAnalytics className="h-6"/>,
        path: '/reports',
    },
];
export default MenuItems;