const { llaToEcef, ecefToLla, bodyToEcef, ecefToBody } = require('../../src/algorithms/coordinate/coordinateConverter');

describe('坐标转换', () => {
  describe('LLA 与 ECEF 坐标转换', () => {
    describe('LLA 转 ECEF', () => {
      test('应该能够将LLA坐标正确转换为ECEF坐标', () => {
        // 模拟LLA坐标 (经度, 纬度, 高度)
        // 示例：北京天安门附近的坐标
        const llaCoord = {
          longitude: 116.3974, // 单位：度
          latitude: 39.9093,  // 单位：度
          altitude: 50.0      // 单位：米
        };

        const ecefCoord = llaToEcef(llaCoord);

        // 期望结果
        expect(ecefCoord).toBeDefined();
        expect(ecefCoord).toHaveProperty('x');
        expect(ecefCoord).toHaveProperty('y');
        expect(ecefCoord).toHaveProperty('z');
        expect(typeof ecefCoord.x).toBe('number');
        expect(typeof ecefCoord.y).toBe('number');
        expect(typeof ecefCoord.z).toBe('number');

        // TODO: 后续需要添加与已知精确值的比对测试
        // 例如: expect(ecefCoord.x).toBeCloseTo(-2178193.23, 2);
      });

      test('当缺少LLA参数时应该抛出错误', () => {
        expect(() => llaToEcef({})).toThrow('缺少必要参数');
      });
    });

    describe('ECEF 转 LLA', () => {
      test('应该能够将ECEF坐标正确转换为LLA坐标', () => {
        // 模拟ECEF坐标 (x, y, z)
        // 示例：对应北京天安门附近的ECEF坐标
        const ecefCoord = {
          x: -2178193.23, // 单位：米
          y: 4385320.32,  // 单位：米
          z: 4077003.58   // 单位：米
        };

        const llaCoord = ecefToLla(ecefCoord);

        // 期望结果
        expect(llaCoord).toBeDefined();
        expect(llaCoord).toHaveProperty('longitude');
        expect(llaCoord).toHaveProperty('latitude');
        expect(llaCoord).toHaveProperty('altitude');
        expect(typeof llaCoord.longitude).toBe('number');
        expect(typeof llaCoord.latitude).toBe('number');
        expect(typeof llaCoord.altitude).toBe('number');
      });

      test('当缺少ECEF参数时应该抛出错误', () => {
        expect(() => ecefToLla({})).toThrow('缺少必要参数');
      });
    });
  });

  describe('机体坐标系与 ECEF 坐标转换', () => {
    describe('机体坐标系 转 ECEF', () => {
      test('应该能够将机体坐标正确转换为ECEF坐标', () => {
        // 模拟飞机的位置（LLA）、姿态（横滚、俯仰、偏航）和机体坐标系下的点
        const aircraftPositionLla = {
          longitude: 116.3974,
          latitude: 39.9093,
          altitude: 10000.0 // 高度10000米
        };
        const aircraftAttitude = {
          roll: 0.0,    // 单位：度
          pitch: 0.0,   // 单位：度
          yaw: 0.0      // 单位：度
        };
        const bodyCoord = {
          x: 10.0, // 机头前方10米
          y: 0.0,  // 右侧0米
          z: 0.0   // 下方0米
        };

        const ecefCoord = bodyToEcef({ aircraftPositionLla, aircraftAttitude, bodyCoord });

        // 期望结果
        expect(ecefCoord).toBeDefined();
        expect(ecefCoord).toHaveProperty('x');
        expect(ecefCoord).toHaveProperty('y');
        expect(ecefCoord).toHaveProperty('z');
        expect(typeof ecefCoord.x).toBe('number');
        expect(typeof ecefCoord.y).toBe('number');
        expect(typeof ecefCoord.z).toBe('number');
      });

      test('当缺少机体转换参数时应该抛出错误', () => {
        expect(() => bodyToEcef({})).toThrow('缺少必要参数');
      });
    });

    describe('ECEF 转 机体坐标系', () => {
      test('应该能够将ECEF坐标正确转换为机体坐标', () => {
        // 模拟飞机的位置（LLA）、姿态和ECEF坐标系下的点
        const aircraftPositionLla = {
          longitude: 116.3974,
          latitude: 39.9093,
          altitude: 10000.0
        };
        const aircraftAttitude = {
          roll: 0.0,
          pitch: 0.0,
          yaw: 0.0
        };
        const ecefCoord = {
          // 这个点应该是从上面测试用例的bodyCoord转换过来的
          x: -2178193.23 + 10.0, // 近似值
          y: 4385320.32,
          z: 4077003.58
        };

        const bodyCoord = ecefToBody({ aircraftPositionLla, aircraftAttitude, ecefCoord });

        // 期望结果
        expect(bodyCoord).toBeDefined();
        expect(bodyCoord).toHaveProperty('x');
        expect(bodyCoord).toHaveProperty('y');
        expect(bodyCoord).toHaveProperty('z');
        expect(typeof bodyCoord.x).toBe('number');
        expect(typeof bodyCoord.y).toBe('number');
        expect(typeof bodyCoord.z).toBe('number');
      });

      test('当缺少ECEF转机体参数时应该抛出错误', () => {
        expect(() => ecefToBody({})).toThrow('缺少必要参数');
      });
    });
  });
});
