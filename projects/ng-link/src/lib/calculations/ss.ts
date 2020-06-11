import {NgLink} from '../ng-link';
import {margin} from '../ng-link-endpoint.service';
import {rightArrow} from '../arrows/rightArrow';

export function ss(link: NgLink): string {
  const coordinates = [];
  const start = link.start;
  const end = link.end;

  if (start.x - margin < end.x - margin) {
    const startWithMargin = start.x - margin;

    coordinates.push(`M${start.x} ${start.y} L${startWithMargin} ${start.y}`);
    coordinates.push(`M${startWithMargin} ${start.y} L${startWithMargin} ${end.y}`);
    coordinates.push(`M${startWithMargin} ${end.y} L${end.x} ${end.y}`);
  } else {
    const endWithMargin = end.x - margin;

    coordinates.push(`M${start.x} ${start.y} L${endWithMargin} ${start.y}`);
    coordinates.push(`M${endWithMargin} ${start.y} L${endWithMargin} ${end.y}`);
    coordinates.push(`M${endWithMargin} ${end.y} L${end.x} ${end.y}`);
  }

  coordinates.push(rightArrow(link.style.width, end.x, end.y));
  return coordinates.join(' ');
}
