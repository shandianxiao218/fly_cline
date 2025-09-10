/**
 * @fileoverview 信号强度计算模型模块
 * @module signalStrengthCalculator
 * @description 计算飞机接收到的卫星信号强度
 * @author Development Team
 * @date 2025-01-09
 */

'use strict';

// 光速 (m/s)
const SPEED_OF_LIGHT = 299792458.0;
// 4 * PI / c
const FOUR_PI_OVER_C = (4 * Math.PI) / SPEED_OF_LIGHT;

/**
 * 计算两点之间的欧几里得距离
 * @param {{x: number, y: number, z: number}} pos1
 * @param {{x: number, y: number, z: number}} pos2
 * @returns {number} 距离，单位为米
 */
function calculateDistance(pos1, pos2) {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const dz = pos1.z - pos2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * 计算卫星信号强度
 * @function calculateSignalStrength
 * @description 基于自由空间路径损耗等模型，计算飞机接收到的卫星信号强度。
 * @param {object} params - 计算参数对象
 * @param {{x: number, y: number, z: number}} params.aircraftPosition - 飞机的ECEF坐标，单位为米
 * @param {{x: number, y: number, z: number}} params.satellitePosition - 卫星的ECEF坐标，单位为米
 * @param {number} params.transmitterPower - 卫星发射功率 (dBW)
 * @param {number} params.frequency - 信号频率 (Hz)
 * @param {number} [params.satelliteAntennaGain=0] - 卫星天线增益 (dBi), 默认为 0
 * @param {number} [params.aircraftAntennaGain=0] - 飞机天线增益 (dBi), 默认为 0
 * @returns {number} 计算得到的信号强度 (dBm)
 * @throws {Error} 当缺少必要参数时抛出错误
 */
function calculateSignalStrength(params) {
  // 参数校验
  if (!params || !params.aircraftPosition || !params.satellitePosition || params.transmitterPower == null || params.frequency == null) {
    throw new Error('缺少必要参数');
  }

  const {
    aircraftPosition,
    satellitePosition,
    transmitterPower,
    frequency,
    satelliteAntennaGain = 0,
    aircraftAntennaGain = 0
  } = params;

  // --- 开始真实的信号强度计算算法 ---

  // 1. 计算飞机与卫星之间的距离
  const distance = calculateDistance(aircraftPosition, satellitePosition);

  // 2. 计算自由空间路径损耗 (FSPL)
  // FSPL (dB) = 20 * log10(d) + 20 * log10(f) + 20 * log10(4 * PI / c)
  // 为了避免 log10(0) 的情况，确保距离和频率都大于0
  if (distance <= 0 || frequency <= 0) {
    // 在物理上不可能，但作为防御性编程
    return -Infinity; // 返回负无穷大，表示信号强度极低或无法计算
  }
  const fslp = 20 * Math.log10(distance) + 20 * Math.log10(frequency) + 20 * Math.log10(FOUR_PI_OVER_C);

  // 3. 计算接收到的信号强度
  // Received Power (dBW) = Transmitted Power (dBW) + Gains - Losses
  const receivedPowerDbw = transmitterPower + satelliteAntennaGain + aircraftAntennaGain - fslp;

  // 4. 将结果从 dBW 转换为 dBm (1 W = 1000 mW, 即 10*log10(1000) = 30 dB)
  const receivedPowerDbm = receivedPowerDbw + 30;

  return receivedPowerDbm;
}

module.exports = {
  calculateSignalStrength
};
