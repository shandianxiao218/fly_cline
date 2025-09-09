/**
 * 卫星信号可见性计算软件 - 工具函数测试
 * 
 * 该文件包含工具函数的单元测试，包括：
 * - 日志工具测试
 * - 配置工具测试
 * - 验证工具测试
 */

const { logger, createModuleLogger, performanceLogger, auditLogger } = require('../src/utils/logger');
const config = require('../src/config/app.config');
const { testUtils } = require('./setup');

describe('日志工具测试', () => {
  let moduleLogger;

  beforeEach(() => {
    moduleLogger = createModuleLogger('test-module');
  });

  test('应该能够创建模块日志记录器', () => {
    expect(moduleLogger).toBeDefined();
    expect(typeof moduleLogger.info).toBe('function');
    expect(typeof moduleLogger.warn).toBe('function');
    expect(typeof moduleLogger.error).toBe('function');
    expect(typeof moduleLogger.debug).toBe('function');
  });

  test('应该能够记录不同级别的日志', () => {
    expect(() => {
      moduleLogger.info('测试信息日志');
      moduleLogger.warn('测试警告日志');
      moduleLogger.error('测试错误日志');
      moduleLogger.debug('测试调试日志');
    }).not.toThrow();
  });

  test('应该能够记录带元数据的日志', () => {
    expect(() => {
      moduleLogger.info('测试带元数据的日志', { key: 'value', number: 123 });
    }).not.toThrow();
  });
});

describe('性能日志记录器测试', () => {
  test('应该能够测量执行时间', () => {
    const startTime = performanceLogger.start('test-operation');
    expect(startTime).toBeDefined();
    expect(typeof startTime).toBe('bigint');

    // 模拟一些工作
    const result = performanceLogger.end('test-operation', startTime);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(0);
  });

  test('应该能够测量函数执行时间', () => {
    const testFunction = () => {
      return 'test-result';
    };

    const { result, durationMs } = performanceLogger.measure('test-function', testFunction);
    expect(result).toBe('test-result');
    expect(durationMs).toBeDefined();
    expect(typeof durationMs).toBe('number');
    expect(durationMs).toBeGreaterThanOrEqual(0);
  });

  test('应该能够处理函数异常', () => {
    const errorFunction = () => {
      throw new Error('测试错误');
    };

    expect(() => {
      performanceLogger.measure('test-error-function', errorFunction);
    }).toThrow('测试错误');
  });
});

describe('审计日志记录器测试', () => {
  test('应该能够记录审计日志', () => {
    expect(() => {
      auditLogger.log('TEST_ACTION', 'test-user', 'test-resource', { key: 'value' });
    }).not.toThrow();
  });

  test('应该能够记录访问日志', () => {
    expect(() => {
      auditLogger.logAccess('test-user', 'test-resource', 'READ', true);
      auditLogger.logAccess('test-user', 'test-resource', 'WRITE', false);
    }).not.toThrow();
  });

  test('应该能够记录修改日志', () => {
    expect(() => {
      auditLogger.logModification('test-user', 'test-resource', { field: 'value' });
    }).not.toThrow();
  });

  test('应该能够记录系统事件日志', () => {
    expect(() => {
      auditLogger.logSystemEvent('SYSTEM_START', { version: '1.0.0' });
    }).not.toThrow();
  });
});

describe('配置测试', () => {
  test('应该包含所有必要的配置项', () => {
    expect(config.system).toBeDefined();
    expect(config.satellites).toBeDefined();
    expect(config.aircraft).toBeDefined();
    expect(config.precision).toBeDefined();
    expect(config.signal).toBeDefined();
    expect(config.cache).toBeDefined();
    expect(config.logging).toBeDefined();
    expect(config.testing).toBeDefined();
    expect(config.security).toBeDefined();
  });

  test('系统配置应该包含正确的默认值', () => {
    expect(config.system.port).toBe(3000);
    expect(config.system.updateInterval).toBe(100);
    expect(config.system.maxCalculationTime).toBe(50);
    expect(config.system.memoryLimit).toBe(100);
    expect(config.system.cpuLimit).toBe(30);
    expect(config.system.maxConnections).toBe(100);
  });

  test('卫星配置应该包含北斗和GPS配置', () => {
    expect(config.satellites.beidou).toBeDefined();
    expect(config.satellites.gps).toBeDefined();
    expect(config.satellites.beidou.name).toBe('BEIDOU');
    expect(config.satellites.gps.name).toBe('GPS');
  });

  test('飞机配置应该包含正确的默认值', () => {
    expect(config.aircraft.defaultModel).toBe('cuboid');
    expect(config.aircraft.dimensions.length).toBe(50);
    expect(config.aircraft.dimensions.width).toBe(40);
    expect(config.aircraft.dimensions.height).toBe(10);
  });

  test('精度配置应该包含正确的默认值', () => {
    expect(config.precision.satellitePosition).toBe(10);
    expect(config.precision.coordinateConversion).toBe(1);
    expect(config.precision.timeConversion).toBe(0.001);
    expect(config.precision.angleConversion).toBe(0.0001);
  });
});

describe('测试工具函数测试', () => {
  test('应该能够创建模拟RINEX数据', () => {
    const mockData = testUtils.createMockRinexData();
    expect(mockData).toBeDefined();
    expect(mockData.version).toBe(3.0);
    expect(mockData.satellites).toBeDefined();
    expect(mockData.satellites['G01']).toBeDefined();
  });

  test('应该能够创建模拟飞机数据', () => {
    const mockData = testUtils.createMockAircraftData();
    expect(mockData).toBeDefined();
    expect(mockData.id).toBe('TEST001');
    expect(mockData.position).toBeDefined();
    expect(mockData.velocity).toBeDefined();
    expect(mockData.attitude).toBeDefined();
  });

  test('应该能够创建模拟卫星位置数据', () => {
    const mockData = testUtils.createMockSatellitePosition();
    expect(mockData).toBeDefined();
    expect(mockData.satelliteId).toBe('G01');
    expect(mockData.position).toBeDefined();
    expect(mockData.velocity).toBeDefined();
  });

  test('应该能够创建模拟计算结果', () => {
    const mockData = testUtils.createMockCalculationResult();
    expect(mockData).toBeDefined();
    expect(mockData.satelliteId).toBe('G01');
    expect(mockData.isVisible).toBe(true);
    expect(mockData.signalStrength).toBe(-120);
  });

  test('应该能够验证数值精度', () => {
    expect(() => {
      testUtils.expectCloseTo(1.0, 1.0);
      testUtils.expectCloseTo(1.0000000001, 1.0);
    }).not.toThrow();

    expect(() => {
      testUtils.expectCloseTo(1.0, 1.1, 0.05);
    }).not.toThrow();

    expect(() => {
      testUtils.expectCloseTo(1.0, 1.1, 0.01);
    }).toThrow();
  });

  test('应该能够验证位置向量', () => {
    const position1 = { x: 1.0, y: 2.0, z: 3.0 };
    const position2 = { x: 1.0, y: 2.0, z: 3.0 };
    const position3 = { x: 1.1, y: 2.1, z: 3.1 };

    expect(() => {
      testUtils.expectPositionCloseTo(position1, position2);
    }).not.toThrow();

    expect(() => {
      testUtils.expectPositionCloseTo(position1, position3, 0.2);
    }).not.toThrow();

    expect(() => {
      testUtils.expectPositionCloseTo(position1, position3, 0.01);
    }).toThrow();
  });

  test('应该能够测量函数执行时间', () => {
    const testFunction = (a, b) => {
      return a + b;
    };

    const { result, durationMs } = testUtils.measureExecutionTime(testFunction, 2, 3);
    expect(result).toBe(5);
    expect(durationMs).toBeDefined();
    expect(typeof durationMs).toBe('number');
    expect(durationMs).toBeGreaterThanOrEqual(0);
  });

  test('应该能够生成随机位置', () => {
    const position = testUtils.generateRandomPosition();
    expect(position).toBeDefined();
    expect(position.x).toBeDefined();
    expect(position.y).toBeDefined();
    expect(position.z).toBeDefined();
    expect(typeof position.x).toBe('number');
    expect(typeof position.y).toBe('number');
    expect(typeof position.z).toBe('number');
  });

  test('应该能够生成随机速度', () => {
    const velocity = testUtils.generateRandomVelocity();
    expect(velocity).toBeDefined();
    expect(velocity.x).toBeDefined();
    expect(velocity.y).toBeDefined();
    expect(velocity.z).toBeDefined();
    expect(typeof velocity.x).toBe('number');
    expect(typeof velocity.y).toBe('number');
    expect(typeof velocity.z).toBe('number');
  });

  test('应该能够清理测试数据', () => {
    expect(() => {
      testUtils.cleanupTestData();
    }).not.toThrow();
  });
});

describe('性能测试', () => {
  test('日志记录应该在合理时间内完成', () => {
    const { durationMs } = testUtils.measureExecutionTime(() => {
      for (let i = 0; i < 1000; i++) {
        moduleLogger.info('性能测试日志', { iteration: i });
      }
    });

    expect(durationMs).toBeLessThan(1000); // 1000次日志记录应该在1秒内完成
  });

  test('配置访问应该在合理时间内完成', () => {
    const { durationMs } = testUtils.measureExecutionTime(() => {
      for (let i = 0; i < 10000; i++) {
        const value = config.system.port;
        const satellite = config.satellites.gps;
        const aircraft = config.aircraft.dimensions;
      }
    });

    expect(durationMs).toBeLessThan(100); // 10000次配置访问应该在100ms内完成
  });
});
