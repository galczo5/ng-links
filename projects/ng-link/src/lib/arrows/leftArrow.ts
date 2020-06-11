export function leftArrow(width: number, x: number, y: number): string {

  const yOffset = width * 2;
  const xOffset = x + (width * 4);

  const arrow = [
    `M${x} ${y}`,
    `L${xOffset} ${y - yOffset}`,
    `L${xOffset} ${y + yOffset}`,
    `Z`
  ];

  return arrow.join(' ');
}
