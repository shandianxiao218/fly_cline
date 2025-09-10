const { calculateSignalStrength } = require('../../src/algorithms/signal/signalStrengthCalculator');

describe('信号强度计算模型', () => {
  describe('基本功能测试', () => {
    test('应该能够使用模拟数据计算出信号强度 (使用模拟实现)', () => {
      // 使用一组模拟参数，期望得到一个固定的模拟值
      const params = {
        aircraftPosition: { x: 0, y: 0, z: 6378137.0 + 10000 },
        satellitePosition: { x: 0, y: 0, z: 6378137.0 + 20000000 },
        transmitterPower: 20, // 20 dBW
        frequency: 1.57542e9, // GPS L1 频率 (Hz)
        satelliteAntennaGain: 13, // dBi
        aircraftAntennaGain: 3 // dBi
      };

      const signalStrength = calculateSignalStrength(params);

      // 期望结果：模拟实现返回的固定值
      expect(signalStrength).toBe(-50.0);
    });

    test('应该能够正确反映距离对信号强度的影响 (自由空间损耗)', () => {
      // 这是一个关键的测试用例，用于验证真实的信号强度计算逻辑。
      // 场景1: 飞机距离卫星较近
      const paramsClose = {
        aircraftPosition: { x: 0, y: 0, z: 6378137.0 + 10000 },
        satellitePosition: { x: 0, y: 0, z: 6378137.0 + 36000000 }, // 地球同步轨道
        transmitterPower: 20,
        frequency: 1.57542e9,
      };
      const signalStrengthClose = calculateSignalStrength(paramsClose);

      // 场景2: 飞机距离卫星较远 (例如，卫星轨道更高)
      const paramsFar = {
        aircraftPosition: { x: 0, y: 0, z: 6378137.0 + 10000 },
        satellitePosition: { x: 0, y: 0, z: 6378137.0 + 40000000 }, // 更高的轨道
        transmitterPower: 20,
        frequency: 1.57542e9,
      };
      const signalStrengthFar = calculateSignalStrength(paramsFar);

      // 期望结果：距离越远，信号强度应该越弱（数值越小）
      // 注意：这个测试用例在初始的模拟实现下会失败，因为模拟实现总是返回 -50.0。
      // 这将驱动我们去实现真实的信号强度计算算法。
      expect(signalStrengthFar).toBeLessThan(signalStrengthClose);
    });
  });

  describe('边界条件测试', () => {
    test('当缺少必要参数时应该抛出错误', () => {
      expect(() => calculateSignalStrength({})).toThrow('缺少必要参数');
    });

    test('当缺少飞机位置参数时应该抛出错误', () => {
      const params = {
        satellitePosition: { x: 0, y: 0, z: 100000 },
        transmitterPower: 20,
        frequency: 1.5e9,
      };
      expect(() => calculateSignalStrength(params)).toThrow('缺少必要参数');
    });

    test('当发射功率为null时应该抛出错误', () => {
      const params = {
        aircraftPosition: { x: 0, y: 0, z: 10000 },
        satellitePosition: { x: 0, y: 0, z: 100000 },
        transmitterPower: null,
        frequency: 1.5e9,
      };
      expect(() => calculateSignalStrength(params)).toThrow('缺少必要参数');
    });

    test('当频率为undefined时应该抛出错误', () => {
      const params = {
        aircraftPosition: { x: 0, y: 0, z: 10000 },
        satellitePosition: { x: 0, y: 0, z: 100000 },
        transmitterPower: 20,
        frequency: undefined,
      };
      expect(() => calculateSignalStrength(params)).toThrow('缺少必要参数');
    });

    test('应该能正确处理可选参数的默认值', () => {
      const params = {
        aircraftPosition: { x: 0, y: 0, z: 6378137.0 + 10000 },
        satellitePosition: { x: 0, y: 0, z: 6378137.0 + 20000000 },
        transmitterPower: 20,
        frequency: 1.57542e9,
        // satelliteAntennaGain 和 aircraftAntennaGain 未提供，应使用默认值 0
      };
      // 模拟实现下，这个测试会通过，因为它只检查是否抛出错误
      // 在真实算法中，需要确保默认值被正确使用
      expect(() => calculateSignalStrength(params)).not.toThrow();
    });
  });
});
