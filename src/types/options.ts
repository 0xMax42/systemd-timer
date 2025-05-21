export interface TimerOptions {
    name?: string;
    exec: string;
    calendar: string;
    description?: string;
    user?: boolean;
    output?: string;
    after?: string[];
    environment?: string[];
    logfile?: string;
    dryRun?: boolean;
}
