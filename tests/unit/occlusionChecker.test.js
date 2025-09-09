const { checkOcclusion } = require('../../src/algorithms/visibility/occlusionChecker');

describe('遮挡判断算法', () => {
  describe('基本功能测试', () => {
    test('应该能够正确判断飞机与卫星之间无遮挡的情况 (使用模拟数据)', () => {
      // 模拟飞机和卫星的位置
      // 假设飞机在 (0, 0, EARTH_RADIUS + 10000)，即地表上方10km
      // 卫星在 (0, 0, EARTH_RADIUS + 20000000)，即地球同步轨道高度
      // 这种情况下，视线直通，无遮挡
      const aircraftPosition = { x: 0, y: 0, z: 6378137.0 + 10000 };
      const satellitePosition = { x: 0, y: 0, z: 6378137.0 + 20000000 };

      const isOccluded = checkOcclusion({
        aircraftPosition,
        satellitePosition
      });

      // 期望结果：无遮挡
      expect(isOccluded).toBe(false);
    });

    test('应该能够正确判断飞机与卫星之间存在地球遮挡的情况', () => {
      // 这是一个精心设计的测试用例，用于验证遮挡判断逻辑。
      // 场景：飞机位于地球一侧，卫星位于地球另一侧的地平线以下。
      // 此时，飞机到卫星的视线必然穿过地球。
      const aircraftPosition = { x: 6378137.0, y: 0, z: 10000 }; // 飞机在 (R, 0, 10km)
      const satellitePosition = { x: -6378137.0, y: 0, z: -10000 }; // 卫星在 (-R, 0, -10km)

      const isOccluded = checkOcclusion({
        aircraftPosition,
        satellitePosition
      });

      // 期望结果：存在遮挡
      // 注意：这个测试用例在初始的模拟实现下会失败，因为模拟实现总是返回 false。
      // 这将驱动我们去实现真实的遮挡判断算法。
      expect(isOccluded).toBe(true);
    });
  });

  describe('边界条件测试', () => {
    test('当缺少参数时应该抛出错误', () => {
      expect(() => checkOcclusion({})).toThrow('缺少必要参数');
    });

    test('当缺少飞机位置参数时应该抛出错误', () => {
      const satellitePosition = { x: 0, y: 0, z: 100000 };
      expect(() => checkOcclusion({ satellitePosition })).toThrow('缺少必要参数');
    });

    test('当缺少卫星位置参数时应该抛出错误', () => {
      const aircraftPosition = { x: 0, y: 0, z: 10000 };
      expect(() => checkOcclusion({ aircraftPosition })).toThrow('缺少必要参数');
    });

    test('当飞机和卫星位置相同时，应视为无遮挡', () => {
      const position = { x: 0, y: 0, z: 6378137.0 + 10000 };
      const isOccluded = checkOcclusion({
        aircraftPosition: position,
        satellitePosition: position
      });
      expect(isOccluded).toBe(false);
    });
  });
});
