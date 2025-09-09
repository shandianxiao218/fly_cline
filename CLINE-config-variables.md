# 卫星信号可见性计算软件 - 配置变量参考

## 文档信息
- **文件名称**：CLINE-config-variables.md
- **创建日期**：2025-01-09
- **最后更新**：2025-01-09
- **文件用途**：记录配置变量参考

## 系统配置变量

### 系统基础配置

#### 系统运行配置
```javascript
// config/system.config.js
module.exports = {
  // 系统基本信息
  name: '卫星信号可见性计算软件',
  version: '1.0.0',
  description: '实时计算飞机飞行过程中北斗和GPS卫星信号可见性',
  
  // 运行环境配置
  environment: process.env.NODE_ENV || 'development',
  debug: process.env.DEBUG === 'true',
  
  // 性能配置
  updateInterval: 100, // 更新间隔，单位：ms
  maxCalculationTime: 50, // 最大计算时间，单位：ms
  memoryLimit: 100, // 内存限制，单位：MB
  cpuLimit: 30, // CPU使用率限制，单位：%
  
  // 并发配置
  maxConnections: 100, // 最大连接数
  workerThreads: 4, // 工作线程数
  
  // 日志配置
  logLevel: process.env.LOG_LEVEL || 'info',
  logDirectory: './logs',
  logMaxSize: '10m',
  logMaxFiles: 5
};
```

#### 服务器配置
```javascript
// config/server.config.js
module.exports = {
  // HTTP服务器配置
  http: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"]
    }
  },
  
  // WebSocket服务器配置
  websocket: {
    port: process.env.WS_PORT || 3001,
    path: '/ws',
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000, // 心跳超时，单位：ms
    pingInterval: 25000, // 心跳间隔，单位：ms
    maxHttpBufferSize: 1e8, // 最大HTTP缓冲区大小，单位：字节
    maxPayload: 1000000 // 最大消息负载，单位：字节
  },
  
  // 静态文件配置
  static: {
    path: './public',
    maxAge: 86400000, // 静态文件缓存时间，单位：ms
    etag: true,
    lastModified: true
  }
};
```

#### 数据库配置
```javascript
// config/database.config.js
module.exports = {
  // MongoDB配置
  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/satellite_visibility',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    }
  },
  
  // Redis配置（可选）
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    options: {
      password: process.env.REDIS_PASSWORD || null,
      db: process.env.REDIS_DB || 0,
      keyPrefix: 'satellite:',
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    }
  }
};
```

## 卫星系统配置

### 北斗卫星系统配置

#### 北斗B3I频点配置
```javascript
// config/satellites/beidou.config.js
module.exports = {
  // 系统基本信息
  system: 'BEIDOU',
  name: '北斗卫星导航系统',
  
  // 频点配置
  frequency: {
    B3I: {
      value: 1268520000, // B3I频点频率，单位：Hz
      wavelength: 0.2364, // 波长，单位：m
      bandwidth: 20700000, // 带宽，单位：Hz
      polarization: 'RHCP' // 极化方式
    }
  },
  
  // 卫星配置
  satellites: {
    // 支持的卫星ID列表
    supportedIds: [
      'B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B10',
      'B11', 'B12', 'B13', 'B14', 'B15', 'B16', 'B17', 'B18', 'B19', 'B20',
      'B21', 'B22', 'B23', 'B24', 'B25', 'B26', 'B27', 'B28', 'B29', 'B30'
    ],
    
    // 默认轨道参数
    defaultOrbitalParameters: {
      semiMajorAxis: 26560000, // 半长轴，单位：m
      eccentricity: 0.001, // 偏心率
      inclination: 55.0, // 轨道倾角，单位：度
      period: 43082.0, // 轨道周期，单位：s
      revolution: 1.0027, // 每日绕地球圈数
    },
    
    // 信号参数
    signal: {
      transmitPower: -120, // 发射功率，单位：dBW
      antennaGain: 13.0, // 天线增益，单位：dB
      codeLength: 10230, // 码长，单位：chip
      chipRate: 10230000, // 码速率，单位：chip/s
      modulation: 'QPSK' // 调制方式
    }
  }
};
```

### GPS卫星系统配置

#### GPS L1 C/A频点配置
```javascript
// config/satellites/gps.config.js
module.exports = {
  // 系统基本信息
  system: 'GPS',
  name: '全球定位系统',
  
  // 频点配置
  frequency: {
    L1CA: {
      value: 1575420000, // L1 C/A频点频率，单位：Hz
      wavelength: 0.1903, // 波长，单位：m
      bandwidth: 2020000, // 带宽，单位：Hz
      polarization: 'RHCP' // 极化方式
    }
  },
  
  // 卫星配置
  satellites: {
    // 支持的卫星ID列表
    supportedIds: [
      'G01', 'G02', 'G03', 'G04', 'G05', 'G06', 'G07', 'G08', 'G09', 'G10',
      'G11', 'G12', 'G13', 'G14', 'G15', 'G16', 'G17', 'G18', 'G19', 'G20',
      'G21', 'G22', 'G23', 'G24', 'G25', 'G26', 'G27', 'G28', 'G29', 'G30',
      'G31', 'G32'
    ],
    
    // 默认轨道参数
    defaultOrbitalParameters: {
      semiMajorAxis: 26560000, // 半长轴，单位：m
      eccentricity: 0.001, // 偏心率
      inclination: 55.0, // 轨道倾角，单位：度
      period: 43082.0, // 轨道周期，单位：s
      revolution: 1.0027, // 每日绕地球圈数
    },
    
    // 信号参数
    signal: {
      transmitPower: -120, // 发射功率，单位：dBW
      antennaGain: 13.0, // 天线增益，单位：dB
      codeLength: 1023, // 码长，单位：chip
      chipRate: 1023000, // 码速率，单位：chip/s
      modulation: 'BPSK' // 调制方式
    }
  }
};
```

## 飞机配置

### 飞机几何模型配置

#### 飞机几何参数配置
```javascript
// config/aircraft/geometry.config.js
module.exports = {
  // 几何模型类型
  modelType: 'cuboid', // 可选：cuboid, cylinder, combination
  
  // 长方体模型参数
  cuboid: {
    length: 50.0, // 长度，单位：m
    width: 40.0, // 宽度，单位：m
    height: 10.0, // 高度，单位：m
    centerOfMass: { // 质心位置，单位：m
      x: 0.0,
      y: 0.0,
      z: 0.0
    }
  },
  
  // 圆柱体模型参数
  cylinder: {
    radius: 20.0, // 半径，单位：m
    height: 10.0, // 高度，单位：m
    centerOfMass: { // 质心位置，单位：m
      x: 0.0,
      y: 0.0,
      z: 0.0
    }
  },
  
  // 组合模型参数
  combination: {
    // 机身（圆柱体）
    fuselage: {
      type: 'cylinder',
      radius: 2.0, // 半径，单位：m
      height: 30.0, // 高度，单位：m
      position: { x: 0.0, y: 0.0, z: 0.0 } // 位置，单位：m
    },
    
    // 机翼（长方体）
    wings: {
      type: 'cuboid',
      length: 40.0, // 长度，单位：m
      width: 8.0, // 宽度，单位：m
      height: 1.0, // 高度，单位：m
      position: { x: 0.0, y: 0.0, z: -2.0 } // 位置，单位：m
    },
    
    // 尾翼（长方体）
    tail: {
      type: 'cuboid',
      length: 8.0, // 长度，单位：m
      width: 6.0, // 宽度，单位：m
      height: 3.0, // 高度，单位：m
      position: { x: 0.0, y: 0.0, z: 15.0 } // 位置，单位：m
    }
  },
  
  // 材料属性
  material: {
    density: 2700, // 密度，单位：kg/m³
    conductivity: 3.5e7, // 电导率，单位：S/m
    permeability: 1.2566e-6, // 磁导率，单位：H/m
    permittivity: 8.854e-12 // 介电常数，单位：F/m
  }
};
```

### 飞机天线配置

#### 天线位置和参数配置
```javascript
// config/aircraft/antenna.config.js
module.exports = {
  // 天线配置列表
  antennas: [
    {
      id: 'top_antenna', // 天线ID
      name: '顶部天线', // 天线名称
      type: 'omnidirectional', // 天线类型：omnidirectional, directional
      position: { // 天线位置，单位：m
        x: 0.0,
        y: 0.0,
        z: 5.0
      },
      orientation: { // 天线指向，单位：度
        azimuth: 0.0,
        elevation: 90.0,
        roll: 0.0
      },
      
      // 天线增益参数
      gain: {
        maximum: 3.0, // 最大增益，单位：dB
        beamWidth: 120.0, // 3dB波束宽度，单位：度
        pattern: 'cosine' // 方向图类型：cosine, gaussian, custom
      },
      
      // 频率响应
      frequency: {
        beidou: {
          center: 1268520000, // 中心频率，单位：Hz
          bandwidth: 20700000, // 带宽，单位：Hz
          gain: 2.8 // 增益，单位：dB
        },
        gps: {
          center: 1575420000, // 中心频率，单位：Hz
          bandwidth: 2020000, // 带宽，单位：Hz
          gain: 3.2 // 增益，单位：dB
        }
      },
      
      // 极化配置
      polarization: {
        type: 'RHCP', // 极化类型：RHCP, LHCP, Linear, Circular
        axialRatio: 3.0 // 轴比，单位：dB
      },
      
      // 噪声参数
      noise: {
        figure: 2.0, // 噪声系数，单位：dB
        temperature: 290.0 // 噪声温度，单位：K
      }
    },
    
    {
      id: 'bottom_antenna',
      name: '底部天线',
      type: 'omnidirectional',
      position: {
        x: 0.0,
        y: 0.0,
        z: -5.0
      },
      orientation: {
        azimuth: 0.0,
        elevation: -90.0,
        roll: 0.0
      },
      
      gain: {
        maximum: 3.0,
        beamWidth: 120.0,
        pattern: 'cosine'
      },
      
      frequency: {
        beidou: {
          center: 1268520000,
          bandwidth: 20700000,
          gain: 2.8
        },
        gps: {
          center: 1575420000,
          bandwidth: 2020000,
          gain: 3.2
        }
      },
      
      polarization: {
        type: 'RHCP',
        axialRatio: 3.0
      },
      
      noise: {
        figure: 2.0,
        temperature: 290.0
      }
    }
  ]
};
```

### 飞机轨迹配置

#### 测试轨迹参数配置
```javascript
// config/aircraft/trajectory.config.js
module.exports = {
  // 轨迹类型配置
  trajectoryTypes: {
    // 起飞阶段轨迹
    takeoff: {
      name: '起飞阶段',
      description: '飞机起飞阶段的飞行轨迹',
      
      // 高度范围
      altitude: {
        start: 0, // 起始高度，单位：m
        end: 3000, // 结束高度，单位：m
        rate: 10.0 // 上升率，单位：m/s
      },
      
      // 速度范围
      speed: {
        start: 0, // 起始速度，单位：m/s
        end: 83.3, // 结束速度，单位：m/s (300km/h)
        acceleration: 2.0 // 加速度，单位：m/s²
      },
      
      // 姿态范围
      attitude: {
        pitch: {
          start: 0.0, // 起始俯仰角，单位：度
          end: 15.0, // 结束俯仰角，单位：度
          rate: 2.0 // 变化率，单位：度/s
        },
        roll: {
          min: -5.0, // 最小横滚角，单位：度
          max: 5.0, // 最大横滚角，单位：度
          variation: 2.0 // 变化幅度，单位：度
        },
        azimuth: {
          start: 0.0, // 起始方位角，单位：度
          end: 45.0, // 结束方位角，单位：度
          rate: 1.0 // 变化率，单位：度/s
        }
      },
      
      // 时间参数
      duration: 300, // 轨迹持续时间，单位：s
      updateInterval: 0.1 // 更新间隔，单位：s
    },
    
    // 巡航阶段轨迹
    cruise: {
      name: '巡航阶段',
      description: '飞机巡航阶段的飞行轨迹',
      
      // 高度范围
      altitude: {
        start: 8000, // 起始高度，单位：m
        end: 12000, // 结束高度，单位：m
        variation: 1000 // 高度变化，单位：m
      },
      
      // 速度范围
      speed: {
        start: 222.2, // 起始速度，单位：m/s (800km/h)
        end: 250.0, // 结束速度，单位：m/s (900km/h)
        variation: 20.0 // 速度变化，单位：m/s
      },
      
      // 姿态范围
      attitude: {
        pitch: {
          min: -3.0, // 最小俯仰角，单位：度
          max: 3.0, // 最大俯仰角，单位：度
          variation: 1.0 // 变化幅度，单位：度
        },
        roll: {
          min: -10.0, // 最小横滚角，单位：度
          max: 10.0, // 最大横滚角，单位：度
          variation: 3.0 // 变化幅度，单位：度
        },
        azimuth: {
          start: 45.0, // 起始方位角，单位：度
          end: 90.0, // 结束方位角，单位：度
          rate: 0.5 // 变化率，单位：度/s
        }
      },
      
      // 时间参数
      duration: 1800, // 轨迹持续时间，单位：s
      updateInterval: 0.1 // 更新间隔，单位：s
    },
    
    // 着陆阶段轨迹
    landing: {
      name: '着陆阶段',
      description: '飞机着陆阶段的飞行轨迹',
      
      // 高度范围
      altitude: {
        start: 3000, // 起始高度，单位：m
        end: 0, // 结束高度，单位：m
        rate: -8.0 // 下降率，单位：m/s
      },
      
      // 速度范围
      speed: {
        start: 83.3, // 起始速度，单位：m/s (300km/h)
        end: 0, // 结束速度，单位：m/s
        deceleration: -3.0 // 减速度，单位：m/s²
      },
      
      // 姿态范围
      attitude: {
        pitch: {
          start: 0.0, // 起始俯仰角，单位：度
          end: -3.0, // 结束俯仰角，单位：度
          rate: -1.0 // 变化率，单位：度/s
        },
        roll: {
          min: -5.0, // 最小横滚角，单位：度
          max: 5.0, // 最大横滚角，单位：度
          variation: 2.0 // 变化幅度，单位：度
        },
        azimuth: {
          start: 90.0, // 起始方位角，单位：度
          end: 135.0, // 结束方位角，单位：度
          rate: 1.0 // 变化率，单位：度/s
        }
      },
      
      // 时间参数
      duration: 300, // 轨迹持续时间，单位：s
      updateInterval: 0.1 // 更新间隔，单位：s
    }
  },
  
  // 默认轨迹配置
  defaultTrajectory: 'takeoff',
  
  // 轨迹生成参数
  generation: {
    interpolation: 'linear', // 插值方法：linear, cubic, spline
    smoothing: true, // 是否平滑
    noiseLevel: 0.1, // 噪声水平
    randomSeed: 12345 // 随机种子
  }
};
```

## 算法配置

### 卫星位置计算配置

#### 开普勒轨道计算配置
```javascript
// config/algorithms/satellite.config.js
module.exports = {
  // 轨道计算参数
  orbital: {
    // 地球参数
    earth: {
      mu: 3.986004418e14, // 地球引力常数，单位：m³/s²
      omega: 7.292115e-5, // 地球自转角速度，单位：rad/s
      radius: 6378137.0, // 地球半径，单位：m
      flattening: 1/298.257223563, // 地球扁率
      j2: 1.08263e-3 // J2摄动系数
    },
    
    // 计算精度参数
    precision: {
      position: 1.0, // 位置精度，单位：m
      velocity: 0.1, // 速度精度，单位：m/s
      time: 0.001, // 时间精度，单位：s
      maxIterations: 100, // 最大迭代次数
      convergence: 1e-12 // 收敛阈值
    },
    
    // 摄动修正参数
    perturbation: {
      enabled: true, // 是否启用摄动修正
      order: 8, // 摄动修正阶数
      terms: {
        j2: true, // J2摄动
        j3: true, // J3摄动
        j4: true, // J4摄动
        lunisolar: false, // 日月摄动
        atmospheric: false // 大气摄动
      }
    },
    
    // 坐标转换参数
    coordinate: {
      // ECEF到LLA转换参数
      ecefToLla: {
        maxIterations: 10,
        convergence: 1e-11,
        initialGuess: 'wgs84'
      },
      
      // LLA到ECEF转换参数
      llaToEcef: {
        precision: 1e-6,
        useEllipsoid: true
      },
      
      // 机体坐标系到ECEF转换参数
      bodyToEcef: {
        rotationOrder: 'ZYX', // 旋转顺序
        angleUnit: 'degrees', // 角度单位
        precision: 1e-8
      }
    }
  },
  
  // 时间系统配置
  time: {
    // 时间系统类型
    system: 'UTC', // 可选：UTC, GPS, TAI
    
    // 时间转换参数
    conversion: {
      // GPS时间到UTC时间转换
      gpsToUtc: {
        leapSeconds: 18, // 跳秒数
        reference: '2017-01-01T00:00:00.000Z' // 参考时间
      },
      
      // TAI时间到UTC时间转换
      taiToUtc: {
        leapSeconds: 37, // 跳秒数
        reference: '2017-01-01T00:00:00.000Z' // 参考时间
      }
    },
    
    // 时间精度参数
    precision: {
      second: 1e-9, // 秒精度
      millisecond: 1e-6, // 毫秒精度
      microsecond: 1e-3, // 微秒精度
      nanosecond: 1.0 // 纳秒精度
    }
  }
};
```

### 遮挡计算配置

#### 遮挡检测算法配置
```javascript
// config/algorithms/visibility.config.js
module.exports = {
  // 遮挡计算参数
  visibility: {
    // 计算方法
    method: 'ray_tracing', // 可选：ray_tracing, geometric, hybrid
    
    // 射线追踪参数
    rayTracing: {
      maxDistance: 100000, // 最大追踪距离，单位：m
      stepSize: 0.1, // 步长，单位：m
      maxSteps: 1000, // 最大步数
      tolerance: 0.001, // 容差，单位：m
      reflection: {
        enabled: false, // 是否启用反射
        maxBounces: 3, // 最大反射次数
        coefficient: 0.8 // 反射系数
      }
    },
    
    // 几何计算参数
    geometric: {
      // 视角计算参数
      elevation: {
        min: 5.0, // 最小仰角，单位：度
        max: 90.0, // 最大仰角，单位：度
        threshold: 0.1 // 阈值，单位：度
      },
      
      // 遮挡角度计算参数
      blocking: {
        margin: 2.0, // 遮挡边距，单位：度
        precision: 0.1, // 精度，单位：度
        smoothing: true // 是否平滑
      }
    },
    
    // 性能优化参数
    performance: {
      // 空间分区参数
      spatialPartitioning: {
        enabled: true, // 是否启用空间分区
        type: 'octree', // 分区类型：octree, quadtree, grid
        maxDepth: 8, // 最大深度
        maxObjects: 10 // 最大对象数
      },
      
      // 缓存参数
      caching: {
        enabled: true, // 是否启用缓存
        maxSize: 1000, // 最大缓存大小
        ttl: 60000, // 缓存生存时间，单位：ms
        strategy: 'lru' // 缓存策略：lru, fifo, lfu
      },
      
      // 并行计算参数
      parallel: {
        enabled: true, // 是否启用并行计算
        workers: 4, // 工作线程数
        chunkSize: 100, // 数据块大小
        loadBalancing: true // 是否负载均衡
      }
    },
    
    // 结果输出参数
    output: {
      // 可见性状态
      visibility: {
        visible: true, // 是否输出可见状态
        threshold: 0.5 // 可见性阈值
      },
      
      // 遮挡信息
      blocking: {
        enabled: true, // 是否输出遮挡信息
        details: true, // 是否输出详细信息
        components: true // 是否输出遮挡部件
      },
      
      // 信号质量
      signal: {
        enabled: true, // 是否输出信号质量
        parameters: ['strength', 'cn0', 'snr'], // 输出参数列表
        units: 'dB' // 单位
      }
    }
  },
  
  // 遮挡模型配置
  models: {
    // 简化模型配置
    simplified: {
      // 遮挡因子
      blockingFactor: {
        fuselage: 0.8, // 机身遮挡因子
        wings: 0.6, // 机翼遮挡因子
        tail: 0.4, // 尾翼遮挡因子
        engines: 0.3 // 引擎遮挡因子
      },
      
      // 角度修正
      angleCorrection: {
        elevation: {
          factor: 0.02, // 仰角修正因子
          exponent: 1.5 // 修正指数
        },
        azimuth: {
          factor: 0.01, // 方位角修正因子
          exponent: 1.2 // 修正指数
        }
      }
    },
    
    // 精确模型配置
    precise: {
      // 电磁计算参数
      electromagnetic: {
        frequency: {
          beidou: 1268520000, // 北斗频率，单位：Hz
          gps: 1575420000 // GPS频率，单位：Hz
        },
        
        // 材料属性
        materials: {
          aluminum: {
            conductivity: 3.5e7, // 电导率，单位：S/m
            permeability: 1.2566e-6, // 磁导率，单位：H/m
            permittivity: 8.854e-12 // 介电常数，单位：F/m
          },
          composite: {
            conductivity: 1.0e6, // 电导率，单位：S/m
            permeability: 1.2566e-6, // 磁导率，单位：H/m
            permittivity: 8.854e-12 // 介电常数，单位：F/m
          }
        }
      },
      
      // 计算网格参数
      mesh: {
        resolution: 0.1, // 网格分辨率，单位：m
        refinement: 3, // 细化级别
        quality: 0.8 // 网格质量
      }
    }
  }
};
```

### 信号处理配置

#### 信号传播和增益计算配置
```javascript
// config/algorithms/signal.config.js
module.exports = {
  // 信号传播参数
  propagation: {
    // 自由空间传播损耗
    freeSpace: {
      enabled: true, // 是否启用
      formula: 'friis', // 传播公式：friis, itu
      constants: {
        c: 299792458.0, // 光速，单位：m/s
        k: 1.380649e-23, // 玻尔兹曼常数，单位：J/K
        t0: 290.0 // 参考温度，单位：K
      }
    },
    
    // 大气损耗
    atmospheric: {
      enabled: false, // 是否启用
      model: 'itu', // 模型：itu, crane
      parameters: {
        oxygen: 0.006, // 氧气吸收，单位：dB/km
        water: 0.002, // 水汽吸收，单位：dB/km
        pressure: 1013.25, // 气压，单位：hPa
        temperature: 15.0, // 温度，单位：°C
        humidity: 60.0 // 湿度，单位：%
      }
    },
    
    // 雨衰损耗
    rain: {
      enabled: false, // 是否启用
      model: 'itu', // 模型：itu, crane
      parameters: {
        rate: 0.0, // 降雨率，单位：mm/h
        height: 0.0, // 雨顶高度，单位：km
        latitude: 0.0, // 纬度，单位：度
        polarization: 'circular' // 极化方式
      }
    }
  },
  
  // 天线增益参数
  antenna: {
    // 增益模型
    gain: {
      model: 'simplified', // 模型：simplified, detailed, measured
      pattern: 'cosine', // 方向图：cosine, gaussian, custom
      
      // 简化模型参数
      simplified: {
        maxGain: 3.0, // 最大增益，单位：dB
        beamWidth: 120.0, // 3dB波束宽度，单位：度
        sideLobe: -20.0 // 旁瓣电平，单位：dB
      },
      
      // 高斯模型参数
      gaussian: {
        maxGain: 3.0, // 最大增益，单位：dB
        sigma: 30.0, // 标准差，单位：度
        cutoff: -30.0 // 截止电平，单位：dB
      }
    },
    
    // 极化损耗
    polarization: {
      enabled: true, // 是否启用
      loss: {
        linearToLinear: 0.0, // 线性到线性极化损耗，单位：dB
        linearToCircular: 3.0, // 线性到圆极化损耗，单位：dB
        circularToCircular: 0.0 // 圆极化到圆极化损耗，单位：dB
      }
    },
    
    // 指向损耗
    pointing: {
      enabled: true, // 是否启用
      accuracy: 1.0, // 指向精度，单位：度
      loss: {
        factor: 0.05, // 损耗因子
        exponent: 2.0 // 损耗指数
      }
    }
  },
  
  // 载噪比计算参数
  cn0: {
    // 系统噪声温度
    system: {
      temperature: 290.0, // 系统噪声温度，单位：K
      figure: 2.0, // 噪声系数，单位：dB
      bandwidth: {
        beidou: 20700000, // 北斗带宽，单位：Hz
        gps: 2020000 // GPS带宽，单位：Hz
      }
    },
    
    // 接收机参数
    receiver: {
      noiseFigure: 2.0, // 接收机噪声系数，单位：dB
      implementationLoss: 1.0, // 实现损耗，单位：dB
      cableLoss: 0.5, // 电缆损耗，单位：dB
      connectorLoss: 0.2 // 连接器损耗，单位：dB
    },
    
    // 信号质量评估
    quality: {
      thresholds: {
        excellent: 45, // 优秀阈值，单位：dB-Hz
        good: 35, // 良好阈值，单位：dB-Hz
        fair: 25, // 一般阈值，单位：dB-Hz
        poor: 15 // 较差阈值，单位：dB-Hz
      },
      
      // 跟踪灵敏度
      tracking: {
        acquisition: 35, // 捕获灵敏度，单位：dB-Hz
        tracking: 25, // 跟踪灵敏度，单位：dB-Hz
        reacquisition: 30 // 重捕灵敏度，单位：dB-Hz
      }
    }
  },
  
  // 信号功率计算参数
  power: {
    // 卫星发射功率
    transmit: {
      beidou: {
        eirp: -120, // 等效全向辐射功率，单位：dBW
        antennaGain: 13.0, // 天线增益，单位：dB
        cableLoss: 0.5, // 电缆损耗，单位：dB
        pointingLoss: 0.3 // 指向损耗，单位：dB
      },
      gps: {
        eirp: -120, // 等效全向辐射功率，单位：dBW
        antennaGain: 13.0, // 天线增益，单位：dB
        cableLoss: 0.5, // 电缆损耗，单位：dB
        pointingLoss: 0.3 // 指向损耗，单位：dB
      }
    },
    
    // 路径损耗
    pathLoss: {
      freeSpace: {
        enabled: true, // 是否启用
        formula: 'friis' // 公式：friis, itu
      },
      
      // 多径损耗
      multipath: {
        enabled: false, // 是否启用
        model: 'two_ray', // 模型：two_ray, rayleigh, rician
        parameters: {
          reflection: -0.7, // 反射系数，单位：dB
          delay: 1.0, // 延迟，单位：μs
          power: -10.0 // 功率，单位：dB
        }
      }
    }
  }
};
```

## 测试配置

### 单元测试配置

#### Jest测试框架配置
```javascript
// config/testing/jest.config.js
module.exports = {
  // 测试环境
  testEnvironment: 'node',
  
  // 测试文件匹配
  testMatch: [
    '**/tests/unit/**/*.test.js',
    '**/tests/unit/**/*.spec.js'
  ],
  
  // 覆盖率配置
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.config.js',
    '!src/**/index.js',
    '!src/tests/**'
  ],
  coverageDirectory: 'coverage/unit',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  
  // 测试设置
  setupFilesAfterEnv: ['<rootDir>/tests/setup/unit.setup.js'],
  testTimeout: 10000,
  verbose: true,
  
  // 模块映射
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@config/(.*)$': '<rootDir>/config/$1'
  }
};
```

### 集成测试配置

#### Mocha集成测试配置
```javascript
// config/testing/mocha.config.js
module.exports = {
  // 测试文件匹配
  testFiles: [
    'tests/integration/**/*.test.js',
    'tests/integration/**/*.spec.js'
  ],
  
  // 测试超时
  timeout: 30000,
  
  // 测试报告
  reporter: 'spec',
  
  // 测试设置
  require: [
    'chai',
    'chai-as-promised',
    'sinon-chai',
    '<rootDir>/tests/setup/integration.setup.js'
  ],
  
  // 覆盖率配置
  coverage: {
    enabled: true,
    dir: 'coverage/integration',
    reporters: ['text', 'lcov'],
    watermarks: {
      statements: [95, 100],
      branches: [95, 100],
      functions: [95, 100],
      lines: [95, 100]
    }
  }
};
```

### 端到端测试配置

#### Selenium端到端测试配置
```javascript
// config/testing/e2e.config.js
module.exports = {
  // 测试文件匹配
  testFiles: [
    'tests/e2e/**/*.test.js',
    'tests/e2e/**/*.spec.js'
  ],
  
  // 浏览器配置
  browsers: {
    chrome: {
      enabled: true,
      headless: true,
      windowSize: {
        width: 1920,
        height: 1080
      },
      options: {
        'disable-gpu': true,
        'no-sandbox': true,
        'disable-dev-shm-usage': true
      }
    },
    firefox: {
      enabled: true,
      headless: true,
      windowSize: {
        width: 1920,
        height: 1080
      },
      options: {
        '-headless': true,
        '-no-remote': true
      }
    }
  },
  
  // 测试超时
  timeout: 60000,
  
  // 测试设置
  baseUrl: 'http://localhost:3000',
  seleniumServer: {
    host: 'localhost',
    port: 4444
  },
  
  // 视觉测试配置
  visual: {
    enabled: false,
    tolerance: 2,
    update: false
  }
};
```

### 性能测试配置

#### Artillery性能测试配置
```javascript
// config/testing/performance.config.js
module.exports = {
  // 负载测试配置
  load: {
    phases: [
      {
        duration: 60,
        arrivalRate: 10,
        name: 'Warm up'
      },
      {
        duration: 120,
        arrivalRate: 50,
        name: 'Load test'
      },
      {
        duration: 60,
        arrivalRate: 100,
        name: 'Peak load'
      },
      {
        duration: 60,
        arrivalRate: 50,
        name: 'Cool down'
      }
    ]
  },
  
  // 目标配置
  targets: {
    http: {
      'GET /api/aircraft/status': {
        responseTime: {
          p95: 100, // 95%请求响应时间，单位：ms
          p99: 200 // 99%请求响应时间，单位：ms
        },
        rps: {
          min: 10, // 最小请求数/秒
          max: 100 // 最大请求数/秒
        },
        errorRate: {
          max: 0.01 // 最大错误率
        }
      },
      'GET /api/satellites/positions': {
        responseTime: {
          p95: 50,
          p99: 100
        },
        rps: {
          min: 10,
          max: 50
        },
        errorRate: {
          max: 0.01
        }
      },
      'GET /api/visibility/calculate': {
        responseTime: {
          p95: 200,
          p99: 500
        },
        rps: {
          min: 5,
          max: 20
        },
        errorRate: {
          max: 0.02
        }
      }
    },
    websocket: {
      'ws://localhost:3001/ws/aircraft': {
        latency: {
          p95: 20, // 95%请求延迟，单位：ms
          p99: 50 // 99%请求延迟，单位：ms
        },
        connections: {
          min: 10, // 最小连接数
          max: 100 // 最大连接数
        },
        messageRate: {
          min: 1, // 最小消息数/秒
          max: 10 // 最大消息数/秒
        }
      }
    }
  },
  
  // 监控配置
  monitoring: {
    enabled: true,
    interval: 1000, // 监控间隔，单位：ms
    metrics: [
      'vus', // 虚拟用户数
      'http.request_rate', // HTTP请求率
      'http.response_time', // HTTP响应时间
      'http.error_rate', // HTTP错误率
      'websocket.connections', // WebSocket连接数
      'websocket.message_rate', // WebSocket消息率
      'cpu.usage', // CPU使用率
      'memory.usage' // 内存使用率
    ]
  }
};
```

## 环境配置

### 开发环境配置

#### 开发环境参数配置
```javascript
// config/env/development.config.js
module.exports = {
  // 环境标识
  env: 'development',
  debug: true,
  
  // 服务器配置
  server: {
    port: 3000,
    host: 'localhost',
    cors: {
      origin: '*',
      credentials: true
    }
  },
  
  // 数据库配置
  database: {
    mongodb: {
      url: 'mongodb://localhost:27017/satellite_visibility_dev',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }
  },
  
  // 日志配置
  logging: {
    level: 'debug',
    format: 'combined',
    transports: ['console', 'file']
  },
  
  // 缓存配置
  cache: {
    enabled: true,
    ttl: 300, // 缓存时间，单位：秒
    maxSize: 1000
  },
  
  // 性能监控
  monitoring: {
    enabled: true,
    interval: 5000, // 监控间隔，单位：ms
    metrics: ['cpu', 'memory', 'response_time']
  },
  
  // 开发工具
  devTools: {
    hotReload: true,
    sourceMaps: true,
    linting: true,
    testing: true
  }
};
```

### 测试环境配置

#### 测试环境参数配置
```javascript
// config/env/testing.config.js
module.exports = {
  // 环境标识
  env: 'testing',
  debug: true,
  
  // 服务器配置
  server: {
    port: 3001,
    host: 'localhost',
    cors: {
      origin: '*',
      credentials: true
    }
  },
  
  // 数据库配置
  database: {
    mongodb: {
      url: 'mongodb://localhost:27017/satellite_visibility_test',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }
  },
  
  // 日志配置
  logging: {
    level: 'info',
    format: 'json',
    transports: ['file']
  },
  
  // 缓存配置
  cache: {
    enabled: false,
    ttl: 0,
    maxSize: 0
  },
  
  // 测试配置
  testing: {
    mockData: true,
    cleanup: true,
    parallel: true,
    timeout: 30000
  },
  
  // 性能监控
  monitoring: {
    enabled: false,
    interval: 0,
    metrics: []
  }
};
```

### 生产环境配置

#### 生产环境参数配置
```javascript
// config/env/production.config.js
module.exports = {
  // 环境标识
  env: 'production',
  debug: false,
  
  // 服务器配置
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    cors: {
      origin: process.env.CORS_ORIGIN || false,
      credentials: false
    }
  },
  
  // 数据库配置
  database: {
    mongodb: {
      url: process.env.MONGODB_URL || 'mongodb://localhost:27017/satellite_visibility_prod',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 20,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
      }
    }
  },
  
  // 日志配置
  logging: {
    level: 'warn',
    format: 'json',
    transports: ['file'],
    rotation: {
      enabled: true,
      maxSize: '20m',
      maxFiles: 14
    }
  },
  
  // 缓存配置
  cache: {
    enabled: true,
    ttl: 600, // 缓存时间，单位：秒
    maxSize: 5000
  },
  
  // 安全配置
  security: {
    helmet: true,
    rateLimit: {
      enabled: true,
      windowMs: 900000, // 15分钟
      max: 1000 // 最大请求数
    },
    cors: {
      enabled: true,
      origin: process.env.CORS_ORIGIN || false
    }
  },
  
  // 性能监控
  monitoring: {
    enabled: true,
    interval: 10000, // 监控间隔，单位：ms
    metrics: ['cpu', 'memory', 'response_time', 'error_rate'],
    alerts: {
      cpu: {
        threshold: 80, // CPU使用率阈值，单位：%
        duration: 300000 // 持续时间，单位：ms
      },
      memory: {
        threshold: 80, // 内存使用率阈值，单位：%
        duration: 300000 // 持续时间，单位：ms
      },
      responseTime: {
        threshold: 1000, // 响应时间阈值，单位：ms
        duration: 300000 // 持续时间，单位：ms
      }
    }
  },
  
  // 备份配置
  backup: {
    enabled: true,
    schedule: '0 2 * * *', // 每天凌晨2点
    retention: 30, // 保留天数
    compression: true
  }
};
```

---

## 配置变量使用说明

### 配置文件加载顺序

1. **默认配置**：加载各个模块的默认配置
2. **环境配置**：根据NODE_ENV加载对应的环境配置
3. **环境变量**：覆盖配置文件中的同名变量
4. **命令行参数**：最高优先级，覆盖所有配置

### 配置变量访问方式

```javascript
// 配置加载器
const config = require('./config/loader');

// 访问系统配置
const systemConfig = config.get('system');
console.log('系统名称:', systemConfig.name);
console.log('更新间隔:', systemConfig.updateInterval, 'ms');

// 访问卫星配置
const beidouConfig = config.get('satellites.beidou');
console.log('北斗频率:', beidouConfig.frequency.B3I.value, 'Hz');

// 访问算法配置
const visibilityConfig = config.get('algorithms.visibility');
console.log('遮挡计算方法:', visibilityConfig.method);

// 访问测试配置
const jestConfig = config.get('testing.jest');
console.log('测试覆盖率阈值:', jestConfig.coverageThreshold.global.lines, '%');
```

### 配置变量验证

```javascript
// 配置验证器
const { validateConfig } = require('./config/validator');

// 验证配置
const validationResult = validateConfig(config);

if (!validationResult.valid) {
  console.error('配置验证失败:', validationResult.errors);
  process.exit(1);
}

console.log('配置验证通过');
```

### 配置变量热更新

```javascript
// 配置热更新
const { watchConfig } = require('./config/watcher');

// 监听配置变化
watchConfig((newConfig) => {
  console.log('配置已更新');
  
  // 更新应用配置
  app.updateConfig(newConfig);
  
  // 重新初始化模块
  modules.reinitialize(newConfig);
});
```

---

**配置变量维护说明**
- 本文档记录项目中的所有配置变量
- 新的配置变量需要及时更新到此文档
- 配置变量需要有明确的类型、单位和取值范围
- 定期评审和更新配置变量，确保其准确性和有效性
