const { generateTrajectory } = require('../../src/algorithms/trajectory/trajectorySimulator');

describe('飞机轨迹模拟', () => {
  describe('基本功能测试', () => {
    test('应该能够生成一个包含多个数据点的巡航阶段轨迹', () => {
      const params = {
        flightPhase: 'cruise',
        duration: 60, // 模拟60秒
        interval: 10, // 每10秒一个数据点
      };

      const trajectory = generateTrajectory(params);

      // 期望结果：生成的轨迹应该包含 60 / 10 = 6 个数据点
      expect(trajectory).toBeDefined();
      expect(trajectory).toHaveLength(6);
      expect(trajectory[0]).toHaveProperty('timestamp');
      expect(trajectory[0]).toHaveProperty('position');
      expect(trajectory[0]).toHaveProperty('attitude');
    });

    test('应该能够生成一个包含多个数据点的起飞阶段轨迹', () => {
      const params = {
        flightPhase: 'takeoff',
        duration: 60,
        interval: 10,
      };

      const trajectory = generateTrajectory(params);

      expect(trajectory).toBeDefined();
      expect(trajectory).toHaveLength(6);
      expect(trajectory[0].position.altitude).toBe(0);
      expect(trajectory[5].position.altitude).toBeCloseTo(10000 * (50 / 60));
    });

    test('应该能够生成一个包含多个数据点的着陆阶段轨迹', () => {
      const params = {
        flightPhase: 'landing',
        duration: 60,
        interval: 10,
      };

      const trajectory = generateTrajectory(params);

      expect(trajectory).toBeDefined();
      expect(trajectory).toHaveLength(6);
      expect(trajectory[0].position.altitude).toBe(10000);
      expect(trajectory[5].position.altitude).toBeCloseTo(10000 * (1 - 50 / 60));
    });
  });

  describe('边界条件测试', () => {
    test('当缺少必要参数时应该抛出错误', () => {
      expect(() => generateTrajectory({})).toThrow('缺少必要参数');
    });

    test('当飞行阶段无效时应该抛出错误', () => {
      const params = {
        flightPhase: 'invalid',
        duration: 60,
        interval: 10,
      };
      expect(() => generateTrajectory(params)).toThrow('无效的飞行阶段');
    });

    test('当持续时间或间隔为0或负数时应该抛出错误', () => {
      const params1 = { flightPhase: 'cruise', duration: -10, interval: 10 };
      const params2 = { flightPhase: 'cruise', duration: 60, interval: 0 };
      expect(() => generateTrajectory(params1)).toThrow('持续时间和间隔必须为正数');
      expect(() => generateTrajectory(params2)).toThrow('持续时间和间隔必须为正数');
    });
  });
});
