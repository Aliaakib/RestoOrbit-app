/**
 * RestoOrbit operational module definitions, roles, and badge helpers.
 * Mirrors resto-orbit-frontend/src/constants/store.constant.js & user.constant.js.
 */

export const MODULE_STATUS = Object.freeze({
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
});

export const USER_ROLES = Object.freeze({
  ADMIN: 'Admin',
  GENERAL_MANAGER: 'General Manager',
  AREA_MANAGER: 'Area Manager',
  MANAGER: 'Manager',
  OFFICE_ASSISTANT: 'Office Assistant',
  STAFF: 'Staff',
});

export const USER_ROLE_FILTERS = [
  'All',
  USER_ROLES.ADMIN,
  USER_ROLES.GENERAL_MANAGER,
  USER_ROLES.AREA_MANAGER,
  USER_ROLES.MANAGER,
  USER_ROLES.OFFICE_ASSISTANT,
  USER_ROLES.STAFF,
];

export const OPERATIONAL_MODULES = [
  {
    key: 'daily_sales',
    title: 'Daily Sales',
    description: 'Shift reconciliation, safe counts, registers & weather insights',
    category: 'Operations',
    icon: 'bar-chart-outline',
    implemented: true,
    routeTarget: 'DailySalesTab',
  },
  {
    key: 'stores_management',
    title: 'Stores Management',
    description: 'Branch profiles, 5-digit store codes, timings & permissions',
    category: 'Administration',
    icon: 'storefront-outline',
    implemented: true,
    routeTarget: 'StoresTab',
  },
  {
    key: 'cashier',
    title: 'Cashier Directory',
    description: 'Cashier staff directory, POS terminal access & active status',
    category: 'Operations',
    icon: 'card-outline',
    implemented: true,
    routeTarget: 'Cashier',
  },
  {
    key: 'pos_orders',
    title: 'POS & Orders',
    description: 'Table seating, active checks, rapid checkout & order queue',
    category: 'Operations',
    icon: 'receipt-outline',
    implemented: true,
    routeTarget: 'Pos',
  },
  {
    key: 'kitchen_display',
    title: 'Kitchen Display (KDS)',
    description: 'Live kitchen tickets, prep timers, stations & bump actions',
    category: 'Kitchen',
    icon: 'flame-outline',
    implemented: true,
    routeTarget: 'Kds',
  },
  {
    key: 'users_management',
    title: 'Users Management',
    description: 'Employee accounts, roles, store assignments & permissions',
    category: 'Administration',
    icon: 'people-outline',
    implemented: true,
    routeTarget: 'UsersTab',
  },
  {
    key: 'shift_management',
    title: 'Shift Entry & Audit',
    description: 'Denomination bill/coin drawer counts & safe reconciliation',
    category: 'Operations',
    icon: 'calculator-outline',
    implemented: true,
    routeTarget: 'ShiftEntry',
  },
  {
    key: 'menu_inventory',
    title: 'Menu & Inventory',
    description: 'Recipe items, categories, ingredients, suppliers & stock alerts',
    category: 'Operations',
    icon: 'fast-food-outline',
    implemented: false,
    routeTarget: 'ModulePreview',
  },
  {
    key: 'reports_analytics',
    title: 'Reports & Analytics',
    description: 'Financial audits, tax summaries, hourly trends & margins',
    category: 'Finance',
    icon: 'pie-chart-outline',
    implemented: false,
    routeTarget: 'ModulePreview',
  },
  {
    key: 'customers_crm',
    title: 'Customers CRM',
    description: 'Guest dining history, feedback, loyalty points & contacts',
    category: 'Marketing',
    icon: 'heart-outline',
    implemented: false,
    routeTarget: 'ModulePreview',
  },
  {
    key: 'settings_integrations',
    title: 'Settings & Integrations',
    description: 'Printers, receipt layout, tax rates & organization settings',
    category: 'Administration',
    icon: 'options-outline',
    implemented: true,
    routeTarget: 'AboutOrganization',
  },
];

export function getRoleTone(role) {
  const normalized = (role || '').toLowerCase();
  if (normalized.includes('admin')) return 'primary';
  if (normalized.includes('general')) return 'neutral';
  if (normalized.includes('area')) return 'primary';
  if (normalized.includes('manager')) return 'info';
  if (normalized.includes('assistant')) return 'warning';
  if (normalized.includes('staff')) return 'success';
  return 'neutral';
}
