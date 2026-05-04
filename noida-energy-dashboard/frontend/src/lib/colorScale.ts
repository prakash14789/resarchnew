export const colorScale = (value: number, category: string): [number, number, number, number] => {
  const min = category === 'residential' ? 50 : 200;
  const max = category === 'residential' ? 500 : 2000;
  
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
  
  const p1 = [34, 197, 94];
  const p2 = [234, 179, 8];
  const p3 = [239, 68, 68];
  
  let r, g, b;
  if (ratio < 0.5) {
    const rRatio = ratio * 2;
    r = Math.round(p1[0] + (p2[0] - p1[0]) * rRatio);
    g = Math.round(p1[1] + (p2[1] - p1[1]) * rRatio);
    b = Math.round(p1[2] + (p2[2] - p1[2]) * rRatio);
  } else {
    const rRatio = (ratio - 0.5) * 2;
    r = Math.round(p2[0] + (p3[0] - p2[0]) * rRatio);
    g = Math.round(p2[1] + (p3[1] - p2[1]) * rRatio);
    b = Math.round(p2[2] + (p3[2] - p2[2]) * rRatio);
  }
  
  return [r, g, b, 255];
}
