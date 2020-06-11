import {NgLink} from '../ng-link';
import {margin} from '../ng-link-endpoint.service';
import {leftArrow} from '../arrows/leftArrow';

export function ee(link: NgLink): string {
  const coordinates = [];
  const start = link.start;
  const end = link.end;

  if (start.x + margin < end.x + margin) {
    const endWithMargin = end.x + margin;
    coordinates.push(`M${start.x} ${start.y} L${endWithMargin} ${start.y}`);
    coordinates.push(`M${endWithMargin} ${start.y} L${endWithMargin} ${end.y}`);
    coordinates.push(`M${endWithMargin} ${end.y} L${end.x} ${end.y}`);
  } else {
    const startWithMargin = start.x + margin;
    coordinates.push(`M${start.x} ${start.y} L${startWithMargin} ${start.y}`);
    coordinates.push(`M${startWithMargin} ${start.y} L${startWithMargin} ${end.y}`);
    coordinates.push(`M${startWithMargin} ${end.y} L${end.x} ${end.y}`);
  }

  coordinates.push(leftArrow(link.style.width, end.x, end.y));
  return coordinates.join(' ');
}
