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

---

**文档维护说明**
- 本文档记录项目中已建立的代码模式和约定
- 新的模式和约定需要及时更新到此文档
- 所有开发人员需要遵循本文档中的约定
- 违反约定需要有充分的理由并经过团队讨论
