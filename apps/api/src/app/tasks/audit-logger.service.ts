import { Injectable, Logger } from '@nestjs/common';
import { User } from '@secure-task-system/data';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuditLoggerService {
  private readonly logger = new Logger('AuditLogger');
  private readonly logs: string[] = [];

  private getLogFilePath(): string {
    // ensure logs folder exists
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

    // one file per day
    const fileName = `audit-${new Date().toISOString().split('T')[0]}.log`;
    return path.join(logsDir, fileName);
  }

 log(user: User, action: string, method?: string, url?: string, body?: any) {
  const timestamp = new Date().toISOString();
  const safeMethod = method ?? 'UNKNOWN_METHOD';
  const safeUrl = url ?? 'UNKNOWN_URL';
  const bodyData = body ? JSON.stringify(body) : '{}';

  const message =
    `[${timestamp}] ${safeMethod} ${safeUrl} | ` +
    `${user.fullName} (${user.email}) [${user.role}] → ${action}\n` +
    `payload: ${bodyData}\n`;

  this.logger.log(message.trim());
  this.logs.push(message);
  fs.appendFileSync(this.getLogFilePath(), message, 'utf8');
}

  getLogs() {
    return this.logs;
  }
}
