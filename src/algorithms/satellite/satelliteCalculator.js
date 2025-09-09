/**
 * @fileoverview 卫星位置计算模块
 * @module satelliteCalculator
 * @description 基于开普勒轨道根数计算卫星在ECEF坐标系中的位置
 * @author Development Team
 * @date 2025-01-09
 */

'use strict';

// 地球自转角速度 (rad/s)
const EARTH_ROTATION_RATE = 7.2921151467e-5;
// 地球引力常数 (m^3/s^2)
const EARTH_GRAVITATIONAL_CONSTANT = 3.986004418e14;
// GPS秒数/周
const GPS_SECONDS_PER_WEEK = 604800;
// Unix 纪元 (1970-01-01) 到 GPS 纪元 (1980-01-06) 的秒数差 (不考虑闰秒)
const UNIX_TO_GPS_EPOCH_SECONDS = 315964800;

/**
 * 计算卫星在ECEF坐标系中的位置
 * @function calculateSatellitePosition
 * @description 根据RINEX星历数据中的开普勒轨道根数，计算指定时间点的卫星位置
 * @param {object} params - 计算参数对象
 * @param {object} params.rinexData - RINEX星历数据
 * @param {string} params.satelliteId - 卫星标识符 (例如 'B01', 'G01')
 * @param {Date} params.timestamp - 计算时间戳 (UTC)
 * @returns {{x: number, y: number, z: number}} 卫星在ECEF坐标系中的位置，单位为米
 * @throws {Error} 当缺少必要参数时抛出错误
 * @throws {Error} 当找不到指定卫星数据时抛出错误
 * @throws {Error} 当时间戳超出星历数据有效范围时抛出错误
 */
function calculateSatellitePosition(params) {
  // 参数校验
  if (!params || !params.rinexData || !params.satelliteId || !params.timestamp) {
    throw new Error('缺少必要参数');
  }

  const { rinexData, satelliteId, timestamp } = params;

  // 查找指定卫星的轨道数据
  const satelliteData = rinexData.satellites && rinexData.satellites.find(sat => sat.id === satelliteId);
  if (!satelliteData) {
    throw new Error(`找不到卫星 ${satelliteId} 的轨道数据`);
  }

  // 从卫星数据中提取轨道参数
  const orbitalParams = satelliteData.orbitalParameters;
  if (!orbitalParams) {
    throw new Error(`卫星 ${satelliteId} 缺少轨道参数`);
  }

  // 时间有效性检查
  const timeParams = satelliteData.timeParameters;
  if (timeParams && timeParams.validFrom && timeParams.validTo) {
    const calculationTime = timestamp.getTime();
    if (calculationTime < timeParams.validFrom.getTime() || calculationTime > timeParams.validTo.getTime()) {
      throw new Error('计算时间超出星历数据有效范围');
    }
  }

  // --- 开始真实的轨道计算 ---

  // 1. 计算时间差 (tk)
  // toe 是星历参考时间，通常是 GPS 周内的周秒 (SOW)。
  // timestamp 是 UTC 时间戳。我们需要将其也转换为 GPS 周内秒。
  const utcTimestampSeconds = timestamp.getTime() / 1000;
  // 将 UTC 时间戳转换为 GPS 总秒数 (不考虑闰秒，这是一个近似)
  const gpsTotalSeconds = utcTimestampSeconds - UNIX_TO_GPS_EPOCH_SECONDS;
  // 计算 GPS 周数和周内秒
  const gpsWeek = Math.floor(gpsTotalSeconds / GPS_SECONDS_PER_WEEK);
  const t_sow = gpsTotalSeconds % GPS_SECONDS_PER_WEEK;

  // toe 也是周内秒，所以可以直接相减
  const toe = orbitalParams.toe;
  let tk = t_sow - toe;

  // 处理周跨接问题：如果 tk > 302400，则 tk = tk - 604800
  // 如果 tk < -302400，则 tk = tk + 604800
  // 这确保了 tk 是以 toe 为中心，前后半小时范围内的最小时间差。
  const halfWeek = GPS_SECONDS_PER_WEEK / 2;
  if (tk > halfWeek) {
    tk -= GPS_SECONDS_PER_WEEK;
  } else if (tk < -halfWeek) {
    tk += GPS_SECONDS_PER_WEEK;
  }

  // 2. 计算平近点角 (Mean Anomaly)
  const n0 = Math.sqrt(EARTH_GRAVITATIONAL_CONSTANT / Math.pow(orbitalParams.rootA, 6)); // 平均运动 (rad/s)
  const n = n0 + orbitalParams.deltaN; // 校正后的平均运动
  const Mk = orbitalParams.m0 + n * tk; // 平近点角
  // 将平近点角归一化到 [0, 2*PI) 范围
  const normalizedMk = ((Mk % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  // 3. 求解开普勒方程得到偏近点角 (Eccentric Anomaly)
  // 使用牛顿-拉夫逊迭代法
  let Ek = normalizedMk; // 初始猜测
  let Ek_prev;
  const tolerance = 1e-12; // 迭代容差
  let iterations = 0;
  do {
    Ek_prev = Ek;
    // E(k+1) = E(k) - (E(k) - e*sin(E(k)) - M(k)) / (1 - e*cos(E(k)))
    Ek = Ek_prev - (Ek_prev - orbitalParams.e * Math.sin(Ek_prev) - normalizedMk) / (1 - orbitalParams.e * Math.cos(Ek_prev));
    iterations++;
  } while (Math.abs(Ek - Ek_prev) > tolerance && iterations < 100);

  // 4. 计算真近点角 (True Anomaly)
  const vk = Math.atan2(
    Math.sqrt(1 - Math.pow(orbitalParams.e, 2)) * Math.sin(Ek),
    Math.cos(Ek) - orbitalParams.e
  );

  // 5. 计算纬度幅角 (Argument of Latitude)
  const phik = vk + orbitalParams.omega;

  // 6. 计算摄动改正项
  const deltaUk = orbitalParams.cus * Math.sin(2 * phik) + orbitalParams.cuc * Math.cos(2 * phik);
  const deltaRk = orbitalParams.crs * Math.sin(2 * phik) + orbitalParams.crc * Math.cos(2 * phik);
  const deltaIk = orbitalParams.cis * Math.sin(2 * phik) + orbitalParams.cic * Math.cos(2 * phik);

  // 7. 计算改正后的纬度幅角、半径和轨道倾角
  const uk = phik + deltaUk;
  const rk = Math.pow(orbitalParams.rootA, 2) * (1 - orbitalParams.e * Math.cos(Ek)) + deltaRk;
  const ik = orbitalParams.i0 + deltaIk + orbitalParams.idot * tk;

  // 8. 计算卫星在轨道平面内的坐标
  const xk_prime = rk * Math.cos(uk);
  const yk_prime = rk * Math.sin(uk);

  // 9. 计算改正后的升交点经度
  // 注意：这里需要考虑地球自转的影响，以及参考时间 toe
  const Omegak = orbitalParams.omega0 + (orbitalParams.omegadot - EARTH_ROTATION_RATE) * tk - EARTH_ROTATION_RATE * toe;

  // 10. 将轨道平面坐标转换为ECEF坐标
  const xk = xk_prime * Math.cos(Omegak) - yk_prime * Math.cos(ik) * Math.sin(Omegak);
  const yk = xk_prime * Math.sin(Omegak) + yk_prime * Math.cos(ik) * Math.cos(Omegak);
  const zk = yk_prime * Math.sin(ik);

  // 注意：这里还没有考虑卫星钟差校正。在完整实现中，需要根据 clockParameters 计算钟差，
  // 并对计算出的位置进行修正。

  return {
    x: xk, // ECEF X坐标，单位：米
    y: yk, // ECEF Y坐标，单位：米
    z: zk  // ECEF Z坐标，单位：米
  };
}

module.exports = {
  calculateSatellitePosition
};
