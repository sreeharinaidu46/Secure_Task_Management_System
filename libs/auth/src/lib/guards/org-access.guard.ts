import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuditLoggerService } from '../services/audit-logger.service.js';
import { Request } from 'express';

@Injectable()
export class OrgAccessGuard implements CanActivate {
  constructor(private readonly audit: AuditLoggerService) {}

  canActivate(context: ExecutionContext): boolean {
    const req: Request & { user?: any; task?: any } = context.switchToHttp().getRequest();
    const { user, task } = req;
//  Validate presence of user and task in request
    if (!user) {
      this.audit.log(null, 'Access denied — missing user context', req.method, req.url);
      throw new ForbiddenException('User not authenticated');
    }

    if (!task) {
      this.audit.log(user, 'Access denied — missing task context', req.method, req.url);
      throw new ForbiddenException('Task context missing for organization check');
    }

    //  Authorized conditions
    if (task.owner.id === user.id) {
      this.audit.log(user, 'Access granted — task owner', req.method, req.url);
      return true;
    }

    if (task.organization.id === user.organization.id) {
      this.audit.log(user, 'Access granted — same organization', req.method, req.url);
      return true;
    }

    if (task.organization.parent?.id === user.organization.id) {
      this.audit.log(user, 'Access granted — parent organization', req.method, req.url);
      return true;
    }
//  Deny access if none of the conditions met
    this.audit.log(user, 'Access denied — insufficient permissions', req.method, req.url, {
      orgId: user.organization?.id,
      taskOrgId: task.organization?.id,
    });
    throw new ForbiddenException('Not authorized to access this task');
  }
}
