// 获取屏幕宽度并计算比例, 最小显示为12像素
export function getFontSize(res: number, max: number, min = 12): number {
  const clientWidth: number =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth ||
    1440;
  const maxWidth = max > clientWidth ? clientWidth : max;
  const width = maxWidth >= 1440 ? 1440 : maxWidth;
  const precent = width / 1440;
  const result = Math.round(res * precent);
  return result > min ? result : min;
}

// 高度通用
export function getDistance(res: number, max: number): number {
  const clientHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight ||
    900;
  const maxHeight = max > clientHeight ? clientHeight : max;
  const height = maxHeight >= 900 ? 900 : maxHeight;
  const precent = height / 900;
  return Math.round(res * precent);
}
