// 获取屏幕宽度并计算比例
export function getFontSize(res: number, max: number): number {
  const clientWidth: number =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth ||
    1920;
  const maxWidth = max > clientWidth ? clientWidth : max;
  const width = maxWidth >= 1920 ? 1920 : maxWidth;
  const precent = width / 1920;
  return Math.round(res * precent);
}

// 高度通用
export function getDistance(res: number, max: number): number {
  const clientHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight ||
    1080;
  const maxHeight = max > clientHeight ? clientHeight : max;
  const height = maxHeight >= 1080 ? 1080 : maxHeight;
  const precent = height / 1080;
  return Math.round(res * precent);
}
