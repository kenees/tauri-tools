import { describe, it, expect } from 'vitest';

// 简单的Base64功能测试
describe('Base64 功能测试', () => {
  it('应该正确编码文本', () => {
    const text = 'Hello, World!';
    const encoded = btoa(unescape(encodeURIComponent(text)));
    expect(encoded).toBe('SGVsbG8sIFdvcmxkIQ==');
  });

  it('应该正确解码Base64', () => {
    const encoded = 'SGVsbG8sIFdvcmxkIQ==';
    const decoded = decodeURIComponent(escape(atob(encoded)));
    expect(decoded).toBe('Hello, World!');
  });

  it('应该处理中文字符', () => {
    const text = '你好，世界！';
    const encoded = btoa(unescape(encodeURIComponent(text)));
    const decoded = decodeURIComponent(escape(atob(encoded)));
    expect(decoded).toBe(text);
  });

  it('应该识别图片Base64格式', () => {
    const imageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    expect(imageBase64.startsWith('data:image/')).toBe(true);
    expect(imageBase64.includes('base64')).toBe(true);
  });
});