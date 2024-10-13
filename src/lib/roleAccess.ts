// src/lib/roleAccess.ts

import { Role } from "@/types";

const roleHierarchy: Record<Role, number> = {
  admin: 3,
  agent: 2,
  broker: 1,
  user: 0
};

const routeAccess: Record<string, Role> = {
  '/dashboard': 'user',
  '/carrier-list': 'agent',
  '/admin-panel': 'admin',
};

export function checkRoleAccess(userRole: Role, route: string): boolean {
  const requiredRole = routeAccess[route] || 'admin'; // Default to admin if route is not specified
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}