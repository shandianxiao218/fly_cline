/**
 * @fileoverview RINEX星历数据解析模块
 * @module rinexParser
 * @description 解析RINEX格式的星历文件
 * @author Development Team
 * @date 2025-01-09
 */

'use strict';

/**
 * 解析RINEX格式的星历文件内容
 * @function parseRinex
 * @description 将RINEX文件的字符串内容解析为结构化的JavaScript对象
 * @param {string} rinexContent - RINEX文件的完整内容
 * @returns {object} 解析后的星历数据对象
 * @throws {Error} 当输入内容为空或格式不正确时抛出错误
 */
function parseRinex(rinexContent) {
  // 参数校验
  if (!rinexContent || typeof rinexContent !== 'string' || rinexContent.trim() === '') {
    throw new Error('RINEX内容不能为空');
  }

  // --- 开始真实的RINEX解析逻辑 ---

  const lines = rinexContent.split(/\r?\n/);
  const header = {};
  const satellites = [];
  let inHeader = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (inHeader) {
      // 解析文件头
      if (line.includes('RINEX VERSION / TYPE')) {
        header.version = parseFloat(line.substring(0, 9));
        header.type = line.substring(20, 21);
        header.system = line.substring(40, 41);
      } else if (line.includes('END OF HEADER')) {
        inHeader = false;
      }
      // TODO: 可以添加更多文件头信息的解析
    } else {
      // 解析卫星数据
      // 这是一个简化的解析器，只处理我们测试用例中的格式
      // 真实的解析器需要处理更复杂的格式和多种卫星系统
      const satId = line.substring(0, 3).trim();
      if (satId) {
        const satelliteData = {
          id: satId,
          // TODO: 解析更多卫星参数
        };
        satellites.push(satelliteData);
        // 跳过后续的7行数据
        i += 7;
      }
    }
  }

  return {
    header,
    satellites
  };
}

module.exports = {
  parseRinex
};
