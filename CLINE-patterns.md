# 卫星信号可见性计算软件 - 代码模式和约定

## 文档信息
- **文件名称**：CLINE-patterns.md
- **创建日期**：2025-01-09
- **最后更新**：2025-01-09
- **文件用途**：记录已建立的代码模式和约定

## 代码命名约定

### 文件命名
- **JavaScript文件**：使用小驼峰命名法，如 `satelliteCalculator.js`
- **测试文件**：使用 `.test.js` 或 `.spec.js` 后缀，如 `satelliteCalculator.test.js`
- **组件文件**：React组件使用大驼峰命名法，如 `SatelliteVisualizer.jsx`
- **配置文件**：使用 `.config.js` 后缀，如 `app.config.js`

### 变量命名
- **常量**：使用全大写 + 下划线，如 `const EARTH_RADIUS = 6378137;`
- **普通变量**：使用小驼峰命名法，如 `satellitePosition`
- **布尔变量**：使用 `is` 或 `has` 前缀，如 `isVisible`, `hasSignal`
- **数组变量**：使用复数形式，如 `satellites`, `positions`
- **对象变量**：使用单数形式，如 `aircraft`, `satellite`

### 函数命名
- **普通函数**：使用小驼峰命名法，如 `calculatePosition`
- **异步函数**：使用 `async` 前缀，如 `async fetchSatelliteData`
- **私有函数**：使用下划线前缀，如 `_internalCalculation`
- **事件处理函数**：使用 `handle` 前缀，如 `handleClick`

### 类命名
- **类名**：使用大驼峰命名法，如 `SatelliteCalculator`
- **私有属性**：使用下划线前缀，如 `_privateProperty`
- **私有方法**：使用下划线前缀，如 `_privateMethod`

## 文件组织结构

### 目录结构
```
src/
├── algorithms/           # 核心算法
│   ├── satellite/        # 卫星相关算法
│   ├── coordinate/       # 坐标转换算法
│   ├── visibility/       # 可见性计算算法
│   └── signal/          # 信号处理算法
├── models/              # 数据模型
│   ├── satellite.js     # 卫星模型
│   ├── aircraft.js      # 飞机模型
│   └── rinex.js         # RINEX数据模型
├── services/            # 业务逻辑服务
│   ├── satelliteService.js
│   ├── aircraftService.js
│   └── calculationService.js
├── utils/               # 工具函数
│   ├── mathUtils.js     # 数学工具
│   ├── coordinateUtils.js
│   └── validationUtils.js
├── api/                 # API接口
│   ├── routes/          # 路由定义
│   ├── middleware/      # 中间件
│   └── controllers/     # 控制器
├── tests/               # 测试文件
│   ├── unit/            # 单元测试
│   ├── integration/     # 集成测试
│   └── e2e/             # 端到端测试
└── config/              # 配置文件
    ├── app.config.js
    └── database.config.js
```

### 模块导入导出
- **默认导出**：一个文件只使用一个默认导出
- **命名导出**：使用明确的命名导出
- **导入顺序**：第三方库 → 项目内部模块 → 相对路径模块

```javascript
// 正确的导入顺序
import React from 'react';
import { SatelliteCalculator } from '../algorithms/satellite';
import { calculateDistance } from '../utils/mathUtils';
import { config } from '../config/app.config';
```

## 函数设计模式

### 函数参数设计
- **参数数量**：函数参数不超过5个，超过时使用对象参数
- **参数验证**：函数开始时进行参数验证
- **默认参数**：使用默认参数值而不是可选参数
- **解构参数**：使用对象解构提高可读性

```javascript
/**
 * 计算卫星位置
 * @param {Object} params - 计算参数
 * @param {Object} params.rinexData - RINEX星历数据，单位：无
 * @param {string} params.satelliteId - 卫星ID，单位：无
 * @param {Date} params.timestamp - 时间戳，单位：无
 * @returns {Object} 卫星位置对象，单位：米
 */
function calculateSatellitePosition({ rinexData, satelliteId, timestamp }) {
  // 参数验证
  if (!rinexData || !satelliteId || !timestamp) {
    throw new Error('缺少必要参数');
  }
  
  // 函数实现
  // ...
}
```

### 函数返回值
- **单一返回值**：函数只返回一种类型的值
- **对象返回值**：返回多个值时使用对象
- **错误处理**：使用 throw 抛出错误，不返回错误码

### 纯函数优先
- **无副作用**：优先编写纯函数
- **输入输出**：相同的输入总是产生相同的输出
- **可测试性**：纯函数更容易测试和调试

## 错误处理模式

### 错误类型定义
```javascript
// 自定义错误类型
class SatelliteCalculationError extends Error {
  constructor(message, satelliteId) {
    super(message);
    this.name = 'SatelliteCalculationError';
    this.satelliteId = satelliteId;
  }
}

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}
```

### 错误处理策略
- **验证错误**：在函数入口处验证参数
- **计算错误**：在计算过程中捕获异常
- **异步错误**：使用 try-catch 处理异步错误
- **错误传播**：允许错误向上传播到适当的处理层

```javascript
/**
 * 安全计算卫星位置
 * @param {Object} params - 计算参数
 * @returns {Object} 计算结果或错误信息
 */
function safeCalculateSatellitePosition(params) {
  try {
    // 参数验证
    validateParameters(params);
    
    // 计算卫星位置
    const position = calculateSatellitePosition(params);
    
    return { success: true, data: position };
  } catch (error) {
    // 错误处理
    console.error('卫星位置计算失败:', error.message);
    return { success: false, error: error.message };
  }
}
```

## 测试编写模式

### 测试文件命名
- **单元测试**：`[filename].test.js`
- **集成测试**：`[filename].integration.test.js`
- **端到端测试**：`[feature].e2e.test.js`

### 测试结构模式
```javascript
describe('卫星位置计算', () => {
  // 测试数据准备
  const mockRinexData = {
    // 模拟RINEX数据
  };
  
  describe('基本功能测试', () => {
    test('应该正确计算北斗卫星位置', () => {
      // 准备测试数据
      const params = {
        rinexData: mockRinexData,
        satelliteId: 'B01',
        timestamp: new Date()
      };
      
      // 执行测试
      const result = calculateSatellitePosition(params);
      
      // 验证结果
      expect(result).toBeDefined();
      expect(result.x).toBeNumber();
      expect(result.y).toBeNumber();
      expect(result.z).toBeNumber();
    });
    
    test('应该正确计算GPS卫星位置', () => {
      // GPS卫星测试
    });
  });
  
  describe('边界条件测试', () => {
    test('应该处理无效卫星ID', () => {
      const params = {
        rinexData: mockRinexData,
        satelliteId: 'INVALID',
        timestamp: new Date()
      };
      
      expect(() => calculateSatellitePosition(params)).toThrow();
    });
    
    test('应该处理缺失参数', () => {
      expect(() => calculateSatellitePosition({})).toThrow();
    });
  });
  
  describe('性能测试', () => {
    test('应该在指定时间内完成计算', () => {
      const params = {
        rinexData: mockRinexData,
        satelliteId: 'B01',
        timestamp: new Date()
      };
      
      const startTime = performance.now();
      calculateSatellitePosition(params);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(10); // 10ms内完成
    });
  });
});
```

### 测试数据管理
- **Mock数据**：使用专门的mock数据文件
- **测试固件**：使用 beforeEach 和 afterEach 进行测试固件设置
- **数据隔离**：每个测试用例使用独立的数据

## 异步处理模式

### Promise使用模式
```javascript
/**
 * 异步获取卫星数据
 * @param {string} satelliteId - 卫星ID，单位：无
 * @returns {Promise<Object>} 卫星数据对象
 */
async function fetchSatelliteData(satelliteId) {
  try {
    const response = await fetch(`/api/satellites/${satelliteId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取卫星数据失败:', error);
    throw error;
  }
}
```

### async/await使用规范
- **错误处理**：使用 try-catch 包裹 await 调用
- **并行处理**：使用 Promise.all 进行并行异步操作
- **超时处理**：为异步操作设置超时

```javascript
/**
 * 批量获取卫星数据
 * @param {Array<string>} satelliteIds - 卫星ID数组，单位：无
 * @returns {Promise<Array<Object>>} 卫星数据数组
 */
async function fetchMultipleSatelliteData(satelliteIds) {
  try {
    // 并行获取多个卫星数据
    const promises = satelliteIds.map(id => fetchSatelliteData(id));
    const results = await Promise.all(promises);
    
    return results;
  } catch (error) {
    console.error('批量获取卫星数据失败:', error);
    throw error;
  }
}
```

## 配置管理模式

### 配置文件结构
```javascript
// app.config.js
const config = {
  // 系统配置
  system: {
    updateInterval: 100, // 更新间隔，单位：ms
    maxCalculationTime: 50, // 最大计算时间，单位：ms
    memoryLimit: 100, // 内存限制，单位：MB
  },
  
  // 卫星配置
  satellites: {
    beidou: {
      frequency: 1268520000, // B3I频率，单位：Hz
      supportedIds: ['B01', 'B02', 'B03'], // 支持的卫星ID
    },
    gps: {
      frequency: 1575420000, // L1 C/A频率，单位：Hz
      supportedIds: ['G01', 'G02', 'G03'], // 支持的卫星ID
    },
  },
  
  // 飞机配置
  aircraft: {
    defaultModel: 'cuboid', // 默认模型
    dimensions: {
      length: 50, // 长度，单位：m
      width: 40,   // 宽度，单位：m
      height: 10,  // 高度，单位：m
    },
  },
  
  // 测试配置
  testing: {
    timeout: 5000, // 测试超时时间，单位：ms
    mockDataPath: './tests/mock-data/', // Mock数据路径
  },
};

module.exports = config;
```

### 环境变量处理
```javascript
// config/env.js
require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  API_URL: process.env.API_URL || 'http://localhost:3000',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
};

module.exports = env;
```

## 日志记录模式

### 日志级别定义
```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### 日志使用规范
```javascript
const logger = require('../utils/logger');

// 在函数中使用日志
function calculateSatellitePosition(params) {
  logger.info('开始计算卫星位置', { satelliteId: params.satelliteId });
  
  try {
    const result = performCalculation(params);
    logger.info('卫星位置计算成功', { 
      satelliteId: params.satelliteId,
      calculationTime: result.calculationTime 
    });
    return result;
  } catch (error) {
    logger.error('卫星位置计算失败', { 
      satelliteId: params.satelliteId,
      error: error.message 
    });
    throw error;
  }
}
```

## 性能优化模式

### 计算结果缓存
```javascript
// utils/cache.js
const NodeCache = require('node-cache');

class CalculationCache {
  constructor() {
    this.cache = new NodeCache({ 
      stdTTL: 300, // 5分钟缓存
      checkperiod: 60 // 1分钟检查
    });
  }
  
  get(key) {
    return this.cache.get(key);
  }
  
  set(key, value) {
    this.cache.set(key, value);
  }
  
  generateKey(params) {
    return `${params.satelliteId}_${params.timestamp.getTime()}`;
  }
}

module.exports = new CalculationCache();
```

### 批量处理优化
```javascript
// 批量计算卫星位置
async function batchCalculateSatellitePositions(requests) {
  // 分组处理
  const groups = groupRequestsBySatellite(requests);
  
  // 并行计算
  const results = await Promise.all(
    Object.entries(groups).map(([satelliteId, satelliteRequests]) => 
      processSatelliteGroup(satelliteId, satelliteRequests)
    )
  );
  
  // 合并结果
  return results.flat();
}
```

## 代码质量保证

### ESLint配置
```javascript
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': 'warn',
    'no-console': 'warn',
  },
};
```

### Prettier配置
```javascript
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
}
```

## 安全模式

### 输入验证
```javascript
// utils/validation.js
const Joi = require('joi');

const satellitePositionSchema = Joi.object({
  rinexData: Joi.object().required(),
  satelliteId: Joi.string().pattern(/^[BG]\d{2}$/).required(),
  timestamp: Joi.date().required(),
});

function validateSatellitePosition(params) {
  const { error } = satellitePositionSchema.validate(params);
  if (error) {
    throw new ValidationError('参数验证失败', error.details[0].path);
  }
}
```

### 输出编码
```javascript
// 防止XSS攻击
function encodeOutput(data) {
  if (typeof data === 'string') {
    return data.replace(/</g, '<').replace(/>/g, '>');
  }
  return data;
}
```

## 数据类型使用策略

### 数据类型选择原则

#### 1. 精度优先（使用double型）
**适用场景**：
- 卫星位置计算（经度、纬度、高度、轨道参数）
- 坐标转换（ECEF坐标、LLA坐标转换过程）
- 时间计算（儒略日、GPS时间、UTC时间转换）
- 角度计算（三角函数运算、角度转换）
- 距离计算（卫星到接收机距离、几何距离）
- 信号处理（载噪比、信号强度、传播损耗）

**变量示例**：
```javascript
// 卫星位置计算
let semiMajorAxis: number;        // 半长轴 (m)
let eccentricity: number;         // 偏心率
let inclination: number;          // 轨道倾角 (rad)
let meanAnomaly: number;          // 平近点角 (rad)
let trueAnomaly: number;          // 真近点角 (rad)
let satelliteX: number;          // 卫星X坐标 (m)
let satelliteY: number;          // 卫星Y坐标 (m)
let satelliteZ: number;          // 卫星Z坐标 (m)

// 坐标转换
let latitude: number;             // 纬度 (rad)
let longitude: number;            // 经度 (rad)
let altitude: number;             // 高度 (m)
let x: number;                   // ECEF X坐标 (m)
let y: number;                   // ECEF Y坐标 (m)
let z: number;                   // ECEF Z坐标 (m)

// 时间计算
let julianDate: number;          // 儒略日
let gpsTime: number;             // GPS时间 (s)
let utcTime: number;             // UTC时间 (s)

// 信号处理
let carrierToNoiseRatio: number;  // 载噪比 (dB-Hz)
let signalPower: number;         // 信号功率 (dBW)
let pathLoss: number;            // 路径损耗 (dB)
```

#### 2. 性能优先（使用整型）
**适用场景**：
- 卫星ID（B01-B30、G01-G32等标识符）
- 迭代计数（循环计数器、数组索引）
- 状态码（错误码、状态标志）
- 数据版本（RINEX版本号、数据格式版本）
- 配置参数（最大迭代次数、数组大小等固定值）

**变量示例**：
```javascript
// 卫星标识
let satelliteId: number;         // 卫星ID (如B01, G01)
let satelliteSystem: number;     // 卫星系统枚举
let satelliteCount: number;     // 卫星数量

// 迭代计数
let maxIterations: number;       // 最大迭代次数
let iterationCount: number;      // 当前迭代次数
let arrayIndex: number;          // 数组索引
let loopCounter: number;         // 循环计数器

// 状态和配置
let statusCode: number;         // 状态码
let errorCode: number;           // 错误码
let rinexVersion: number;        // RINEX版本号 (2, 3)
let precisionLevel: number;       // 精度级别
let maxConnections: number;      // 最大连接数
```

#### 3. 状态判断（使用布尔型）
**适用场景**：
- 计算成功/失败状态
- 数据有效/无效标志
- 功能启用/禁用开关
- 调试模式开关
- 边界条件检查结果

**变量示例**：
```javascript
// 计算状态
let isConverged: boolean;        // 是否收敛
let isValidData: boolean;        // 数据是否有效
let isCalculationSuccess: boolean; // 计算是否成功

// 功能开关
let isDebugEnabled: boolean;     // 调试模式开关
let isCacheEnabled: boolean;     // 缓存功能开关
let isLoggingEnabled: boolean;   // 日志功能开关

// 条件判断
let isWGS84: boolean;            // 是否使用WGS84椭球
let isHeightAboveEllipsoid: boolean; // 高度是否相对于椭球
let isSatelliteVisible: boolean; // 卫星是否可见
```

#### 4. 文本处理（使用字符串）
**适用场景**：
- 卫星系统标识（'BEIDOU'、'GPS'）
- 文件路径（RINEX文件路径、配置文件路径）
- 错误消息（异常信息、日志消息）
- 数据格式（时间格式字符串、坐标格式字符串）

**变量示例**：
```javascript
// 系统标识
let satelliteSystem: string;    // 卫星系统 ('BEIDOU', 'GPS')
let satelliteIdStr: string;      // 卫星ID字符串 ('B01', 'G01')

// 文件路径
let rinexFilePath: string;       // RINEX文件路径
let configFilePath: string;      // 配置文件路径
let logFilePath: string;         // 日志文件路径

// 错误和日志
let errorMessage: string;        // 错误消息
let logMessage: string;          // 日志消息
let warningMessage: string;      // 警告消息

// 格式字符串
let timeFormat: string;          // 时间格式字符串
let coordinateFormat: string;    // 坐标格式字符串
let outputFormat: string;        // 输出格式字符串
```

### 数据类型安全措施

#### 1. 类型检查和验证
```javascript
// 运行时类型检查
function validateNumber(value: any, paramName: string): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`参数 ${paramName} 必须是有效的数字`);
  }
  return value;
}

function validateInteger(value: any, paramName: string): number {
  const num = validateNumber(value, paramName);
  if (!Number.isInteger(num)) {
    throw new Error(`参数 ${paramName} 必须是整数`);
  }
  return num;
}

function validateBoolean(value: any, paramName: string): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(`参数 ${paramName} 必须是布尔值`);
  }
  return value;
}

function validateString(value: any, paramName: string): string {
  if (typeof value !== 'string') {
    throw new Error(`参数 ${paramName} 必须是字符串`);
  }
  return value;
}
```

#### 2. 精度控制
```javascript
// 浮点数比较精度
const EPSILON = Number.EPSILON;
const PRECISION = 1e-10;

// 安全的浮点数比较
function isEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < PRECISION;
}

function isLessThan(a: number, b: number): boolean {
  return a < b - PRECISION;
}

function isGreaterThan(a: number, b: number): boolean {
  return a > b + PRECISION;
}

// 角度规范化（确保在0-2π范围内）
function normalizeAngle(angle: number): number {
  while (angle < 0) angle += 2 * Math.PI;
  while (angle >= 2 * Math.PI) angle -= 2 * Math.PI;
  return angle;
}
```

#### 3. 类型转换处理
```javascript
// 安全的类型转换
function toNumber(value: any): number {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`无法将 ${value} 转换为数字`);
  }
  return num;
}

function toInteger(value: any): number {
  const num = Math.floor(toNumber(value));
  return num;
}

function toBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return Boolean(value);
}

function toString(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value);
}
```

### 性能优化考虑

#### 1. 内存优化
```javascript
// 使用TypedArray处理大量数值数据
class SatellitePositionArray {
  private positions: Float64Array;
  
  constructor(size: number) {
    this.positions = new Float64Array(size * 3); // x, y, z
  }
  
  set(index: number, x: number, y: number, z: number): void {
    const offset = index * 3;
    this.positions[offset] = x;
    this.positions[offset + 1] = y;
    this.positions[offset + 2] = z;
  }
  
  get(index: number): { x: number, y: number, z: number } {
    const offset = index * 3;
    return {
      x: this.positions[offset],
      y: this.positions[offset + 1],
      z: this.positions[offset + 2]
    };
  }
}
```

#### 2. 计算优化
```javascript
// 使用位运算替代部分算术运算
class BitwiseOperations {
  // 快速判断奇偶
  static isEven(n: number): boolean {
    return (n & 1) === 0;
  }
  
  // 快速取整（对于正数）
  static fastFloor(n: number): number {
    return n | 0;
  }
  
  // 快速乘以2的幂次方
  static multiplyByPowerOfTwo(n: number, power: number): number {
    return n << power;
  }
  
  // 快速除以2的幂次方
  static divideByPowerOfTwo(n: number, power: number): number {
    return n >> power;
  }
}
```

#### 3. 缓存优化
```javascript
// 使用Map缓存计算结果
class CalculationCache {
  private cache: Map<string, number>;
  
  constructor() {
    this.cache = new Map();
  }
  
  generateKey(params: object): string {
    return JSON.stringify(params);
  }
  
  get(params: object): number | undefined {
    const key = this.generateKey(params);
    return this.cache.get(key);
  }
  
  set(params: object, value: number): void {
    const key = this.generateKey(params);
    this.cache.set(key, value);
  }
  
  clear(): void {
    this.cache.clear();
  }
}
```

### 具体模块数据类型规划

#### 1. 卫星位置计算模块
```javascript
class SatelliteCalculator {
  // 使用double型的变量
  private semiMajorAxis: number;      // 半长轴 (m)
  private eccentricity: number;       // 偏心率
  private inclination: number;        // 轨道倾角 (rad)
  private meanAnomaly: number;        // 平近点角 (rad)
  private trueAnomaly: number;        // 真近点角 (rad)
  private satelliteX: number;         // 卫星X坐标 (m)
  private satelliteY: number;         // 卫星Y坐标 (m)
  private satelliteZ: number;         // 卫星Z坐标 (m)
  
  // 使用整型的变量
  private satelliteId: number;        // 卫星ID (如B01)
  private maxIterations: number;      // 最大迭代次数
  private iterationCount: number;     // 当前迭代次数
  
  // 使用布尔型的变量
  private isConverged: boolean;        // 是否收敛
  private isValidData: boolean;        // 数据是否有效
  
  // 使用字符串的变量
  private satelliteSystem: string;    // 卫星系统 ('BEIDOU', 'GPS')
  private errorMessage: string;        // 错误消息
}
```

#### 2. 坐标转换模块
```javascript
class CoordinateConverter {
  // 使用double型的变量
  private latitude: number;           // 纬度 (rad)
  private longitude: number;          // 经度 (rad)
  private altitude: number;           // 高度 (m)
  private x: number;                 // ECEF X坐标 (m)
  private y: number;                 // ECEF Y坐标 (m)
  private z: number;                 // ECEF Z坐标 (m)
  private roll: number;              // 横滚角 (rad)
  private pitch: number;             // 俯仰角 (rad)
  private yaw: number;               // 偏航角 (rad)
  
  // 使用整型的变量
  private coordinateSystem: number;   // 坐标系类型枚举
  private precisionLevel: number;     // 精度级别
  
  // 使用布尔型的变量
  private isWGS84: boolean;           // 是否使用WGS84椭球
  private isHeightAboveEllipsoid: boolean; // 高度是否相对于椭球
}

#### 3. RINEX解析模块
```javascript
class RinexParser {
  // 使用整型的变量
  private rinexVersion: number;       // RINEX版本号 (如2, 3)
  private satelliteCount: number;     // 卫星数量
  private lineNumber: number;         // 当前行号
  private recordType: number;        // 记录类型枚举
  
  // 使用字符串的变量
  private satelliteSystem: string;   // 卫星系统 ('G' for GPS, 'B' for BeiDou)
  private filePath: string;          // 文件路径
  private timeString: string;         // 时间字符串
  private recordTypeStr: string;      // 记录类型字符串
  
  // 使用布尔型的变量
  private isHeaderLine: boolean;      // 是否为文件头行
  private isDataLine: boolean;       // 是否为数据行
  private isValidRecord: boolean;    // 记录是否有效
}
```

### 数据类型使用最佳实践

#### 1. 选择合适的数据类型
```javascript
// ✅ 正确的数据类型选择
function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  // 使用double型进行高精度计算
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

// ✅ 使用整型进行计数
function processArray<T>(array: T[], callback: (item: T, index: number) => void): void {
  // 使用整型进行数组索引
  for (let i: number = 0; i < array.length; i++) {
    callback(array[i], i);
  }
}

// ✅ 使用布尔型进行状态判断
function validateInput(input: string): boolean {
  // 使用布尔型返回验证结果
  return input !== null && input !== undefined && input.length > 0;
}
```

#### 2. 避免类型混用
```javascript
// ❌ 避免类型混用
function badExample(id: any): string {
  // 不应该使用any类型
  return "ID-" + id;
}

// ✅ 明确的类型定义
function goodExample(id: number): string {
  // 明确使用number类型
  return "ID-" + id.toString();
}
```

#### 3. 合理的类型转换
```javascript
// ✅ 安全的类型转换
function safeConversion(value: any): number {
  if (typeof value === 'string') {
    const num = parseFloat(value);
    if (isNaN(num)) {
      throw new Error(`无法将 "${value}" 转换为数字`);
    }
    return num;
  }
  if (typeof value === 'number') {
    return value;
  }
  throw new Error(`不支持从 ${typeof value} 转换为数字`);
}
```

---

**文档维护说明**
- 本文档记录项目中已建立的代码模式和约定
- 新的模式和约定需要及时更新到此文档
- 所有开发人员需要遵循本文档中的约定
- 违反约定需要有充分的理由并经过团队讨论
