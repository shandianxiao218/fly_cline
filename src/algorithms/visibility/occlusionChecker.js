/**
 * @fileoverview 遮挡判断算法模块
 * @module occlusionChecker
 * @description 判断飞机与卫星之间的视线上是否存在地球表面遮挡
 * @author Development Team
 * @date 2025-01-09
 */

'use strict';

// 地球半径 (m)
const EARTH_RADIUS = 6378137.0;

/**
 * 判断飞机与卫星之间是否存在地球遮挡
 * @function checkOcclusion
 * @description 基于飞机和卫星的ECEF坐标，计算视线矢量与地球表面的交点，
 *              从而判断是否存在遮挡。算法核心是求解线段与球体的相交问题。
 * @param {object} params - 计算参数对象
 * @param {{x: number, y: number, z: number}} params.aircraftPosition - 飞机的ECEF坐标，单位为米
 * @param {{x: number, y: number, z: number}} params.satellitePosition - 卫星的ECEF坐标，单位为米
 * @returns {boolean} 如果存在遮挡返回 true，否则返回 false
 * @throws {Error} 当缺少必要参数时抛出错误
 */
function checkOcclusion(params) {
  // 参数校验
  if (!params || !params.aircraftPosition || !params.satellitePosition) {
    throw new Error('缺少必要参数');
  }

  const { aircraftPosition, satellitePosition } = params;

  // 如果飞机和卫星位置相同，直接视为无遮挡
  if (
    aircraftPosition.x === satellitePosition.x &&
    aircraftPosition.y === satellitePosition.y &&
    aircraftPosition.z === satellitePosition.z
  ) {
    return false;
  }

  // --- 开始真实的遮挡判断算法 ---

  // 1. 定义视线线段
  // P1: 飞机位置 (线段起点)
  const p1x = aircraftPosition.x;
  const p1y = aircraftPosition.y;
  const p1z = aircraftPosition.z;

  // P2: 卫星位置 (线段终点)
  const p2x = satellitePosition.x;
  const p2y = satellitePosition.y;
  const p2z = satellitePosition.z;

  // 2. 计算线段的方向矢量
  const dx = p2x - p1x;
  const dy = p2y - p1y;
  const dz = p2z - p1z;

  // 3. 计算二次方程的系数 (At^2 + Bt + C = 0)
  // 该方程描述了从P1出发，沿方向矢量移动t个单位长度的点，到地球原点距离的平方。
  // 如果该方程在 t ∈ [0, 1] 范围内有解，且解对应的距离小于等于地球半径，则线段与球体相交。
  const A = dx * dx + dy * dy + dz * dz;
  const B = 2 * (p1x * dx + p1y * dy + p1z * dz);
  const C = p1x * p1x + p1y * p1y + p1z * p1z - EARTH_RADIUS * EARTH_RADIUS;

  // 4. 计算判别式
  const discriminant = B * B - 4 * A * C;

  // 如果判别式小于0，表示线段与球体无交点，无遮挡
  if (discriminant < 0) {
    return false;
  }

  // 5. 计算交点对应的参数 t
  // t = [-B ± sqrt(discriminant)] / (2A)
  const sqrtDiscriminant = Math.sqrt(discriminant);
  const t1 = (-B + sqrtDiscriminant) / (2 * A);
  const t2 = (-B - sqrtDiscriminant) / (2 * A);

  // 6. 判断交点是否在线段上 (即 t 是否在 [0, 1] 区间内)
  // 只要有一个交点在线段上，就认为存在遮挡
  const isIntersecting = (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);

  return isIntersecting;
}

module.exports = {
  checkOcclusion
};
