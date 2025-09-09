/**
 * 卫星信号可见性计算软件 - 日志工具
 * 
 * 该文件提供统一的日志记录功能，包括：
 * - 不同级别的日志记录
 * - 文件和控制台输出
 * - 结构化日志格式
 * - 日志轮转和管理
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');
const config = require('../config/app.config');

// 确保日志目录存在
const logDir = path.resolve(config.logging.file.path);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 自定义日志格式
const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const logEntry = {
      timestamp,
      level,
      message,
      ...(Object.keys(meta).length > 0 && { meta })
    };
    
    if (stack) {
      logEntry.stack = stack;
    }
    
    return JSON.stringify(logEntry);
  })
);

// 控制台日志格式
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

// 创建Winston logger实例
const logger = winston.createLogger({
  level: config.logging.level,
  format: customFormat,
  transports: [
    // 错误日志文件
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: config.logging.file.maxSize,
      maxFiles: config.logging.file.maxFiles,
      tailable: true,
    }),
    
    // 组合日志文件
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: config.logging.file.maxSize,
      maxFiles: config.logging.file.maxFiles,
      tailable: true,
    }),
  ],
  
  // 异常处理
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
      maxsize: config.logging.file.maxSize,
      maxFiles: config.logging.file.maxFiles,
      tailable: true,
    }),
  ],
  
  // 拒绝处理
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log'),
      maxsize: config.logging.file.maxSize,
      maxFiles: config.logging.file.maxFiles,
      tailable: true,
    }),
  ],
});

// 如果启用了控制台日志，添加控制台传输
if (config.logging.console.enabled) {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
  }));
}

// 创建子logger，用于特定模块
const createModuleLogger = (moduleName) => {
  return {
    info: (message, meta = {}) => {
      logger.info(message, { module: moduleName, ...meta });
    },
    warn: (message, meta = {}) => {
      logger.warn(message, { module: moduleName, ...meta });
    },
    error: (message, meta = {}) => {
      logger.error(message, { module: moduleName, ...meta });
    },
    debug: (message, meta = {}) => {
      logger.debug(message, { module: moduleName, ...meta });
    },
    verbose: (message, meta = {}) => {
      logger.verbose(message, { module: moduleName, ...meta });
    },
    silly: (message, meta = {}) => {
      logger.silly(message, { module: moduleName, ...meta });
    },
  };
};

// 性能日志记录器
const performanceLogger = {
  start: (operationId, meta = {}) => {
    const startTime = process.hrtime.bigint();
    logger.info(`性能测量开始`, { operationId, startTime: startTime.toString(), ...meta });
    return startTime;
  },
  
  end: (operationId, startTime, meta = {}) => {
    const endTime = process.hrtime.bigint();
    const durationNs = endTime - startTime;
    const durationMs = Number(durationNs) / 1000000;
    
    logger.info(`性能测量结束`, {
      operationId,
      startTime: startTime.toString(),
      endTime: endTime.toString(),
      durationNs: durationNs.toString(),
      durationMs: Math.round(durationMs * 100) / 100,
      ...meta
    });
    
    return durationMs;
  },
  
  measure: (operationId, fn, meta = {}) => {
    const startTime = performanceLogger.start(operationId, meta);
    try {
      const result = fn();
      const durationMs = performanceLogger.end(operationId, startTime, { status: 'success', ...meta });
      return { result, durationMs };
    } catch (error) {
      const durationMs = performanceLogger.end(operationId, startTime, { status: 'error', error: error.message, ...meta });
      throw error;
    }
  },
};

// 审计日志记录器
const auditLogger = {
  log: (action, userId, resource, details = {}) => {
    logger.info(`审计日志`, {
      action,
      userId,
      resource,
      timestamp: new Date().toISOString(),
      ...details
    });
  },
  
  logAccess: (userId, resource, accessType, success = true) => {
    auditLogger.log('ACCESS', userId, resource, {
      accessType,
      success,
    });
  },
  
  logModification: (userId, resource, changes) => {
    auditLogger.log('MODIFICATION', userId, resource, {
      changes,
    });
  },
  
  logSystemEvent: (eventType, details) => {
    auditLogger.log('SYSTEM_EVENT', 'system', eventType, details);
  },
};

// 导出logger实例
module.exports = {
  logger,
  createModuleLogger,
  performanceLogger,
  auditLogger,
};
