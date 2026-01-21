import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '../hooks/useFavorites';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock CustomEvent
Object.defineProperty(window, 'CustomEvent', {
  value: class CustomEvent {
    type: string;
    detail: any;
    constructor(type: string, options?: { detail?: any }) {
      this.type = type;
      this.detail = options?.detail;
    }
  },
});

describe('useFavorites Hook', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  afterEach(() => {
    // 清理所有事件监听器
    window.dispatchEvent = new EventTarget().dispatchEvent;
  });

  it('应该初始化为空收藏列表', () => {
    const { result } = renderHook(() => useFavorites());
    
    expect(result.current.favoriteTools).toEqual([]);
    expect(result.current.isFavorite('test-tool')).toBe(false);
  });

  it('应该从localStorage加载收藏数据', () => {
    localStorageMock.setItem('favoriteTools', JSON.stringify(['base64-text', 'base64-image']));
    
    const { result } = renderHook(() => useFavorites());
    
    expect(result.current.favoriteTools).toEqual(['base64-text', 'base64-image']);
    expect(result.current.isFavorite('base64-text')).toBe(true);
    expect(result.current.isFavorite('base64-image')).toBe(true);
    expect(result.current.isFavorite('other-tool')).toBe(false);
  });

  it('应该能够添加收藏', () => {
    const { result } = renderHook(() => useFavorites());
    
    act(() => {
      result.current.toggleFavorite('base64-text');
    });
    
    expect(result.current.favoriteTools).toEqual(['base64-text']);
    expect(result.current.isFavorite('base64-text')).toBe(true);
    expect(localStorageMock.getItem('favoriteTools')).toBe(JSON.stringify(['base64-text']));
  });

  it('应该能够移除收藏', () => {
    localStorageMock.setItem('favoriteTools', JSON.stringify(['base64-text', 'base64-image']));
    
    const { result } = renderHook(() => useFavorites());
    
    act(() => {
      result.current.toggleFavorite('base64-text');
    });
    
    expect(result.current.favoriteTools).toEqual(['base64-image']);
    expect(result.current.isFavorite('base64-text')).toBe(false);
    expect(result.current.isFavorite('base64-image')).toBe(true);
    expect(localStorageMock.getItem('favoriteTools')).toBe(JSON.stringify(['base64-image']));
  });

  it('应该触发自定义事件', () => {
    const { result } = renderHook(() => useFavorites());
    let eventFired = false;
    let eventDetail: any = null;

    const mockDispatchEvent = (event: any) => {
      if (event.type === 'favoriteToolsChanged') {
        eventFired = true;
        eventDetail = event.detail;
      }
    };

    window.dispatchEvent = mockDispatchEvent;
    
    act(() => {
      result.current.toggleFavorite('base64-text');
    });
    
    expect(eventFired).toBe(true);
    expect(eventDetail).toEqual(['base64-text']);
  });
});