import { Global, Module, Injectable, Logger } from '@nestjs/common';
import { User } from '@secure-task-system/data';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuditLoggerService {
  private readonly logger = new Logger('AuditLogger');
  private readonly logs: string[] = [];

  private getLogFilePath(): string {
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);
    const fileName = `audit-${new Date().toISOString().split('T')[0]}.log`;
    return path.join(logsDir, fileName);
  }

  log(user: Partial<User> | null, action: string, method?: string, url?: string, body?: any) {
    const timestamp = new Date().toISOString();
    const safeMethod = method ?? 'UNKNOWN_METHOD';
    const safeUrl = url ?? 'UNKNOWN_URL';
    const userLabel = user
      ? `${user.fullName ?? 'Unknown'} (${user.email ?? 'N/A'}) [${user.role ?? 'Guest'}]`
      : 'System / Anonymous';
    const bodyData = body ? JSON.stringify(body) : '{}';

    const message =
      `[${timestamp}] ${safeMethod} ${safeUrl} | ${userLabel} → ${action}\n` +
      `payload: ${bodyData}\n`;

    this.logger.log(message.trim());
    this.logs.push(message);
    fs.appendFileSync(this.getLogFilePath(), message, 'utf8');
  }

  getLogs() {
    return this.logs;
  }
}

@Global()
@Module({
  providers: [AuditLoggerService],
  exports: [AuditLoggerService],
})
export class AuditLoggerModule {}
