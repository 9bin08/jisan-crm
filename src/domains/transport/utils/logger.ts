type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    level: LogLevel;
    message: string;
    context?: string;
    timestamp: number;
    data?: unknown;
}

class Logger {
    private static instance: Logger;
    private logs: LogEntry[] = [];
    private readonly maxLogs = 1000;
    private readonly isDevelopment = process.env.NODE_ENV === 'development';

    private constructor() { }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private log(level: LogLevel, message: string, context?: string, data?: unknown) {
        const entry: LogEntry = {
            level,
            message,
            context,
            timestamp: Date.now(),
            data,
        };

        this.logs.push(entry);

        // 로그 개수 제한
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }

        // 개발 환경에서만 콘솔 출력
        if (this.isDevelopment) {
            const prefix = context ? `[${context}]` : '';
            const logMessage = `${prefix} ${message}`;

            switch (level) {
                case 'debug':
                    console.debug(logMessage, data);
                    break;
                case 'info':
                    console.info(logMessage, data);
                    break;
                case 'warn':
                    console.warn(logMessage, data);
                    break;
                case 'error':
                    console.error(logMessage, data);
                    break;
            }
        }

        // 프로덕션에서는 에러만 외부 로깅 서비스로 전송
        if (!this.isDevelopment && level === 'error') {
            this.sendToExternalService(entry);
        }
    }

    private sendToExternalService(entry: LogEntry) {
        // TODO: 외부 로깅 서비스 연동 (Sentry, LogRocket 등)
        // 현재는 구현하지 않음
    }

    debug(message: string, context?: string, data?: unknown) {
        this.log('debug', message, context, data);
    }

    info(message: string, context?: string, data?: unknown) {
        this.log('info', message, context, data);
    }

    warn(message: string, context?: string, data?: unknown) {
        this.log('warn', message, context, data);
    }

    error(message: string, context?: string, data?: unknown) {
        this.log('error', message, context, data);
    }

    // 에러 객체를 자동으로 파싱하는 헬퍼 메서드
    errorWithError(error: unknown, context?: string) {
        let message = '알 수 없는 오류가 발생했습니다.';
        let errorData: unknown = error;

        if (error instanceof Error) {
            message = error.message;
            errorData = {
                name: error.name,
                message: error.message,
                stack: error.stack,
            };
        } else if (typeof error === 'string') {
            message = error;
        } else if (error && typeof error === 'object' && 'message' in error) {
            message = String(error.message);
        }

        this.error(message, context, errorData);
    }

    // 로그 조회
    getLogs(level?: LogLevel): LogEntry[] {
        if (level) {
            return this.logs.filter(log => log.level === level);
        }
        return [...this.logs];
    }

    // 로그 초기화
    clear() {
        this.logs = [];
    }
}

export const logger = Logger.getInstance();