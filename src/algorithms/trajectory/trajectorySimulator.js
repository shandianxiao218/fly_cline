/**
 * @fileoverview 飞机轨迹模拟模块
 * @module trajectorySimulator
 * @description 生成模拟的飞机轨迹数据
 * @author Development Team
 * @date 2025-01-09
 */

'use strict';

/**
 * 生成模拟的飞机轨迹
 * @function generateTrajectory
 * @description 根据指定的飞行阶段和参数，生成一系列的飞机状态数据
 * @param {object} params - 模拟参数对象
 * @param {string} params.flightPhase - 飞行阶段 ('takeoff', 'cruise', 'landing')
 * @param {number} params.duration - 模拟时长 (秒)
 * @param {number} params.interval - 数据点间隔 (秒)
 * @returns {Array<object>} 飞机状态数据数组，每个元素包含 timestamp, position, attitude
 * @throws {Error} 当缺少必要参数或参数无效时抛出错误
 */
function generateTrajectory(params) {
  // 参数校验
  if (!params || !params.flightPhase || params.duration == null || params.interval == null) {
    throw new Error('缺少必要参数');
  }

  const { flightPhase, duration, interval } = params;

  // 飞行阶段校验
  const validPhases = ['takeoff', 'cruise', 'landing'];
  if (!validPhases.includes(flightPhase)) {
    throw new Error('无效的飞行阶段');
  }

  // 参数范围校验
  if (duration <= 0 || interval <= 0) {
    throw new Error('持续时间和间隔必须为正数');
  }

  // --- 开始真实的轨迹生成逻辑 ---

  const trajectory = [];
  const startTime = Date.now();

  for (let t = 0; t < duration; t += interval) {
    const timestamp = new Date(startTime + t * 1000);
    let position;
    let attitude;

    switch (flightPhase) {
      case 'takeoff':
        // 简化的起飞模型
        position = {
          longitude: 116.3974,
          latitude: 39.9093,
          altitude: 10000 * (t / duration), // 高度线性增加
        };
        attitude = {
          roll: 0,
          pitch: 15 * (1 - t / duration), // 俯仰角从15度减小到0
          yaw: 0,
        };
        break;
      case 'cruise':
        // 简化的巡航模型
        position = {
          longitude: 116.3974 + 0.1 * (t / duration), // 经度线性增加
          latitude: 39.9093,
          altitude: 10000,
        };
        attitude = {
          roll: Math.sin(t / 10) * 2, // 横滚角周期性变化
          pitch: 0,
          yaw: 0,
        };
        break;
      case 'landing':
        // 简化的着陆模型
        position = {
          longitude: 116.3974,
          latitude: 39.9093,
          altitude: 10000 * (1 - t / duration), // 高度线性减小
        };
        attitude = {
          roll: 0,
          pitch: -3 * (t / duration), // 俯仰角从0度减小到-3度
          yaw: 0,
        };
        break;
    }

    trajectory.push({
      timestamp,
      position,
      attitude,
    });
  }

  return trajectory;
}

module.exports = {
  generateTrajectory
};
