const { parseRinex } = require('../../src/algorithms/rinex/rinexParser');

describe('RINEX星历数据解析', () => {
  describe('基本功能测试', () => {
    test('应该能够解析一个包含一颗卫星的RINEX文件', () => {
      // 这是一个简化的RINEX文件示例，只包含一颗卫星的数据
      const rinexContent = `
     3.04           NAVIGATION DATA     M (Mixed)           RINEX VERSION / TYPE
GPS T               20250101 000000 LCL G (GPS)             PGM / RUN BY / DATE
                                                            END OF HEADER
C01 2025 01 01 00 00 00  1.0e-04  1.0e-12  1.0e-12
    1.0e+00  1.0e+00  1.0e+00  1.0e+00
    1.0e+00  1.0e+00  1.0e+00  1.0e+00
    1.0e+00  1.0e+00  1.0e+00  1.0e+00
    1.0e+00  1.0e+00  1.0e+00  1.0e+00
    1.0e+00  1.0e+00  1.0e+00  1.0e+00
    1.0e+00  1.0e+00  1.0e+00  1.0e+00
    1.0e+00  1.0e+00  1.0e+00  1.0e+00
`;

      const parsedData = parseRinex(rinexContent);

      // 期望结果：解析出的数据应该包含一颗卫星
      // 注意：这个测试用例在初始的模拟实现下会失败，因为模拟实现总是返回一个空的 satellites 数组。
      // 这将驱动我们去实现真实的RINEX解析算法。
      expect(parsedData).toBeDefined();
      expect(parsedData.satellites).toHaveLength(1);
      expect(parsedData.satellites[0].id).toBe('C01');
    });
  });

  describe('边界条件测试', () => {
    test('当输入内容为空时应该抛出错误', () => {
      expect(() => parseRinex('')).toThrow('RINEX内容不能为空');
    });

    test('当输入内容为null时应该抛出错误', () => {
      expect(() => parseRinex(null)).toThrow('RINEX内容不能为空');
    });

    test('当输入内容为undefined时应该抛出错误', () => {
      expect(() => parseRinex(undefined)).toThrow('RINEX内容不能为空');
    });

    test('当输入内容只包含空格时应该抛出错误', () => {
      expect(() => parseRinex('   ')).toThrow('RINEX内容不能为空');
    });
  });
});
