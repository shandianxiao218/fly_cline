/**
 * 卫星信号可见性计算软件 - 应用配置文件
 * 
 * 该文件包含应用程序的所有配置参数，包括：
 * - 系统配置
 * - 卫星配置
 * - 飞机配置
 * - 测试配置
 */

const config = {
  // 系统配置
  system: {
    port: 3000, // 服务器端口
    updateInterval: 100, // 更新间隔，单位：ms
    maxCalculationTime: 50, // 最大计算时间，单位：ms
    memoryLimit: 100, // 内存限制，单位：MB
    cpuLimit: 30, // CPU使用率限制，单位：%
    maxConnections: 100, // 最大连接数
  },
  
  // 卫星配置
  satellites: {
    beidou: {
      name: 'BEIDOU',
      frequency: 1268520000, // B3I频率，单位：Hz
      supportedIds: ['B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B10'], // 支持的卫星ID
      orbitalRadius: 42164000, // 轨道半径，单位：m
      orbitalPeriod: 43082, // 轨道周期，单位：s
    },
    gps: {
      name: 'GPS',
      frequency: 1575420000, // L1 C/A频率，单位：Hz
      supportedIds: ['G01', 'G02', 'G03', 'G04', 'G05', 'G06', 'G07', 'G08', 'G09', 'G10'], // 支持的卫星ID
      orbitalRadius: 26560000, // 轨道半径，单位：m
      orbitalPeriod: 43082, // 轨道周期，单位：s
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
    antenna: {
      position: {
        x: 0, // 天线X位置，单位：m
        y: 0, // 天线Y位置，单位：m
        z: 5, // 天线Z位置，单位：m
      },
      gain: 3, // 天线增益，单位：dB
      pattern: 'omnidirectional', // 天线方向图
    },
    trajectory: {
      defaultSpeed: 250, // 默认速度，单位：m/s
      defaultAltitude: 10000, // 默认高度，单位：m
      maxAcceleration: 10, // 最大加速度，单位：m/s²
    },
  },
  
  // 计算精度配置
  precision: {
    satellitePosition: 10, // 卫星位置计算精度，单位：m
    coordinateConversion: 1, // 坐标转换精度，单位：m
    timeConversion: 0.001, // 时间转换精度，单位：s
    angleConversion: 0.0001, // 角度转换精度，单位：rad
  },
  
  // 信号处理配置
  signal: {
    freeSpacePathLoss: true, // 是否计算自由空间路径损耗
    antennaGain: true, // 是否计算天线增益
    carrierToNoiseRatio: true, // 是否计算载噪比
    minimumSignalStrength: -130, // 最小信号强度，单位：dBm
    signalQualityThreshold: 30, // 信号质量阈值，单位：dB-Hz
  },
  
  // 缓存配置
  cache: {
    enabled: true, // 是否启用缓存
    ttl: 300, // 缓存生存时间，单位：s
    maxSize: 1000, // 最大缓存条目数
    checkPeriod: 60, // 缓存检查周期，单位：s
  },
  
  // 日志配置
  logging: {
    level: 'info', // 日志级别
    format: 'json', // 日志格式
    file: {
      enabled: true, // 是否启用文件日志
      path: './logs/', // 日志文件路径
      maxSize: '10m', // 单个日志文件最大大小
      maxFiles: 5, // 最大日志文件数量
    },
    console: {
      enabled: true, // 是否启用控制台日志
      colorize: true, // 是否启用颜色
    },
  },
  
  // 测试配置
  testing: {
    timeout: 5000, // 测试超时时间，单位：ms
    mockDataPath: './tests/mock-data/', // Mock数据路径
    performance: {
      enabled: true, // 是否启用性能测试
      maxResponseTime: 100, // 最大响应时间，单位：ms
      maxMemoryUsage: 100, // 最大内存使用，单位：MB
    },
  },
  
  // 安全配置
  security: {
    cors: {
      enabled: true, // 是否启用CORS
      origin: ['http://localhost:3000'], // 允许的源
    },
    rateLimit: {
      enabled: true, // 是否启用限流
      windowMs: 15 * 60 * 1000, // 时间窗口，单位：ms
      max: 100, // 最大请求数
    },
  },
  
  // 开发配置
  development: {
    debug: true, // 是否启用调试模式
    hotReload: true, // 是否启用热重载
    sourceMaps: true, // 是否生成源映射
  },
  
  // 生产配置
  production: {
    debug: false, // 是否启用调试模式
    hotReload: false, // 是否启用热重载
    sourceMaps: false, // 是否生成源映射
    compression: true, // 是否启用压缩
  },
};

// 根据环境变量覆盖配置
if (process.env.NODE_ENV === 'production') {
  Object.assign(config, config.production);
} else if (process.env.NODE_ENV === 'development') {
  Object.assign(config, config.development);
}

// 导出配置
module.exports = config;
