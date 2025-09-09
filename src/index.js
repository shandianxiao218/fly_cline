/**
 * 卫星信号可见性计算软件 - 主入口文件
 * 
 * 该文件是应用程序的主入口点，负责：
 * 1. 初始化Express服务器
 * 2. 设置WebSocket实时通信
 * 3. 配置中间件和路由
 * 4. 启动HTTP服务器
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 导入自定义模块
const logger = require('./utils/logger');
const config = require('./config/app.config');

// 创建Express应用
const app = express();
const server = http.createServer(app);

// 配置Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, '../public')));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API路由占位符
app.get('/api/status', (req, res) => {
  res.json({
    message: '卫星信号可见性计算软件API运行正常',
    status: 'running'
  });
});

// WebSocket连接处理
io.on('connection', (socket) => {
  logger.info('客户端连接成功', { socketId: socket.id });
  
  // 发送欢迎消息
  socket.emit('welcome', {
    message: '欢迎使用卫星信号可见性计算软件',
    socketId: socket.id,
    timestamp: new Date().toISOString()
  });

  // 处理客户端断开连接
  socket.on('disconnect', () => {
    logger.info('客户端断开连接', { socketId: socket.id });
  });

  // 处理计算请求
  socket.on('calculate', (data) => {
    logger.info('收到计算请求', { socketId: socket.id, data });
    
    // TODO: 实现具体的计算逻辑
    socket.emit('calculation-result', {
      status: 'success',
      message: '计算功能正在开发中',
      data: data,
      timestamp: new Date().toISOString()
    });
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error('服务器错误', { error: err.message, stack: err.stack });
  res.status(500).json({
    status: 'error',
    message: '服务器内部错误',
    timestamp: new Date().toISOString()
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: '请求的资源不存在',
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
const PORT = process.env.PORT || config.system.port || 3000;

server.listen(PORT, () => {
  logger.info(`服务器启动成功`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// 优雅关闭处理
process.on('SIGTERM', () => {
  logger.info('收到SIGTERM信号，开始优雅关闭');
  server.close(() => {
    logger.info('服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('收到SIGINT信号，开始优雅关闭');
  server.close(() => {
    logger.info('服务器已关闭');
    process.exit(0);
  });
});

module.exports = { app, server, io };
