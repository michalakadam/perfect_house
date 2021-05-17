import winston from 'winston';

const ERROR = 'error';
const INFO = 'info';

const Logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'updater.log',
    }),
  ],
});

export const log = (infoMessage: string, err?: Error) => {
    err ? appendLog(ERROR)(err.message) : appendLog(INFO)(infoMessage);
};

const appendLog = (level: string) => {
  return (message: string) => {
    Logger.log({
        level,
        message,
    });
  };
};
