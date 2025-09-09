/**
 * 卫星信号可见性计算软件 - 测试设置文件
 * 
 * 该文件在所有测试运行之前执行，负责：
 * - 设置测试环境
 * - 初始化测试数据库
 * - 配置测试工具
 * - 清理测试数据
 */

const path = require('path');
const fs = require('fs');

// 测试环境配置
process.env.NODE_ENV = 'test';

// 设置测试超时
jest.setTimeout(10000);

// 全局测试变量
global.__TEST__ = true;
global.__BASE_DIR__ = path.resolve(__dirname, '..');
global.__TEST_DIR__ = __dirname;
global.__MOCK_DATA_DIR__ = path.join(__dirname, 'mock-data');

// 确保测试数据目录存在
if (!fs.existsSync(global.__MOCK_DATA_DIR__)) {
  fs.mkdirSync(global.__MOCK_DATA_DIR__, { recursive: true });
}

// 全局测试工具
global.testUtils = {
  // 创建测试用的RINEX数据
  createMockRinexData: (overrides = {}) => {
    return {
      version: 3.0,
      fileType: 'N',
      satelliteSystem: 'G',
      timeSystem: 'GPS',
      leapSeconds: 18,
      satellites: {
        'G01': {
          id: 'G01',
          prn: 1,
          health: 0,
          eccentricity: 0.000123,
          inclination: 0.987654,
          rightAscension: 1.234567,
          argumentPerigee: 2.345678,
          meanAnomaly: 3.456789,
          semiMajorAxis: 26560000,
          meanMotion: 0.000145855,
          rateOfRightAscension: -0.0000000001,
          rateOfInclination: 0.0000000001,
          crc: 0,
          crs: 0,
          cuc: 0,
          cus: 0,
          cic: 0,
          cis: 0,
          toe: 123456,
          toc: 123456,
          ...overrides,
        },
      },
      ...overrides,
    };
  },

  // 创建测试用的飞机数据
  createMockAircraftData: (overrides = {}) => {
    return {
      id: 'TEST001',
      position: {
        x: 0,
        y: 0,
        z: 10000,
      },
      velocity: {
        x: 250,
        y: 0,
        z: 0,
      },
      attitude: {
        roll: 0,
        pitch: 0,
        yaw: 0,
      },
      dimensions: {
        length: 50,
        width: 40,
        height: 10,
      },
      antenna: {
        position: {
          x: 0,
          y: 0,
          z: 5,
        },
        gain: 3,
        pattern: 'omnidirectional',
      },
      ...overrides,
    };
  },

  // 创建测试用的卫星位置数据
  createMockSatellitePosition: (overrides = {}) => {
    return {
      satelliteId: 'G01',
      position: {
        x: 20000000,
        y: 10000000,
        z: 15000000,
      },
      velocity: {
        x: 1000,
        y: 2000,
        z: 1500,
      },
      timestamp: new Date().toISOString(),
      ...overrides,
    };
  },

  // 创建测试用的计算结果
  createMockCalculationResult: (overrides = {}) => {
    return {
      satelliteId: 'G01',
      isVisible: true,
      signalStrength: -120,
      carrierToNoiseRatio: 45,
      pathLoss: 180,
      antennaGain: 3,
      elevation: 45,
      azimuth: 90,
      distance: 25000000,
      timestamp: new Date().toISOString(),
      ...overrides,
    };
  },

  // 验证数值精度
  expectCloseTo: (actual, expected, precision = 1e-10) => {
    expect(Math.abs(actual - expected)).toBeLessThan(precision);
  },

  // 验证位置向量
  expectPositionCloseTo: (actual, expected, precision = 1e-10) => {
    expectCloseTo(actual.x, expected.x, precision);
    expectCloseTo(actual.y, expected.y, precision);
    expectCloseTo(actual.z, expected.z, precision);
  },

  // 验证速度向量
  expectVelocityCloseTo: (actual, expected, precision = 1e-10) => {
    expectCloseTo(actual.x, expected.x, precision);
    expectCloseTo(actual.y, expected.y, precision);
    expectCloseTo(actual.z, expected.z, precision);
  },

  // 测量函数执行时间
  measureExecutionTime: (fn, ...args) => {
    const start = process.hrtime.bigint();
    const result = fn(...args);
    const end = process.hrtime.bigint();
    const durationNs = end - start;
    const durationMs = Number(durationNs) / 1000000;
    return {
      result,
      durationMs: Math.round(durationMs * 100) / 100,
      durationNs: durationNs.toString(),
    };
  },

  // 生成随机测试数据
  generateRandomPosition: (radius = 26560000) => {
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * Math.PI;
    return {
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta),
      z: radius * Math.cos(phi),
    };
  },

  generateRandomVelocity: (maxSpeed = 3000) => {
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * Math.PI;
    const speed = Math.random() * maxSpeed;
    return {
      x: speed * Math.sin(phi) * Math.cos(theta),
      y: speed * Math.sin(phi) * Math.sin(theta),
      z: speed * Math.cos(phi),
    };
  },

  // 清理测试数据
  cleanupTestData: () => {
    // 清理测试文件
    const testFiles = fs.readdirSync(__dirname).filter(file => 
      file.startsWith('test-') && file.endsWith('.tmp')
    );
    
    testFiles.forEach(file => {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  },
};

// 在所有测试之前运行
beforeAll(() => {
  console.log('🚀 测试环境初始化开始...');
  
  // 设置测试环境变量
  process.env.TEST_MODE = 'true';
  process.env.LOG_LEVEL = 'error'; // 测试时只记录错误日志
  
  // 创建必要的测试目录
  const testDirs = [
    path.join(__dirname, 'temp'),
    path.join(__dirname, 'output'),
    path.join(__dirname, 'coverage'),
  ];
  
  testDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  console.log('✅ 测试环境初始化完成');
});

// 在每个测试之前运行
beforeEach(() => {
  // 重置全局状态
  jest.clearAllMocks();
  jest.resetModules();
  
  // 清理测试数据
  global.testUtils.cleanupTestData();
});

// 在所有测试之后运行
afterAll(() => {
  console.log('🧹 测试环境清理开始...');
  
  // 清理测试文件
  const cleanupDirs = [
    path.join(__dirname, 'temp'),
    path.join(__dirname, 'output'),
  ];
  
  cleanupDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        fs.unlinkSync(path.join(dir, file));
      });
      fs.rmdirSync(dir);
    }
  });
  
  console.log('✅ 测试环境清理完成');
});

// 全局异常处理
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
  console.error('Promise:', promise);
});

process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

// 导出测试配置
module.exports = {
  testUtils: global.testUtils,
  testConfig: {
    timeout: 10000,
    precision: 1e-10,
    mockDataDir: global.__MOCK_DATA_DIR__,
  },
};
