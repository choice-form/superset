/**
 * 通过 Control 控件处理的颜色都是包含 RGBA 信息的，此函数将其转换为 CSS RGBA 格
 * 式字符串
 */
export function toRGBA(color: Record<PropertyKey, number> | string): string {
  return typeof color === 'string'
    ? color
    : `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}
