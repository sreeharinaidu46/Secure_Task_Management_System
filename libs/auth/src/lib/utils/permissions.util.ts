import { RoleName } from '@secure-task-system/data';

export type Action = 'create' | 'read' | 'update' | 'delete';

export function hasPermission(role: RoleName, action: Action): boolean {
  switch (role) {
    case RoleName.OWNER:
      return true;
    case RoleName.ADMIN:
      return ['create', 'read', 'update'].includes(action);
    case RoleName.VIEWER:
      return action === 'read';
    default:
      return false;
  }
}
