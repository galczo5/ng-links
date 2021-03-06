import {NgLink} from '../ng-link';
import {margin} from '../ng-link-endpoint.service';
import {leftArrow} from '../arrows/leftArrow';

export function se(link: NgLink): string {
  const coordinates = [];
  const start = link.start;
  const end = link.end;

  if (start.x - margin < end.x + margin) {
    const startWithMargin = start.x - margin;
    const firstHalf = start.y + ((end.y - start.y) / 2);
    const endWithMargin = end.x + margin;

    coordinates.push(`M${start.x} ${start.y} L${startWithMargin} ${start.y}`);
    coordinates.push(`M${startWithMargin} ${start.y} L${startWithMargin} ${firstHalf}`);
    coordinates.push(`M${startWithMargin} ${firstHalf} L${endWithMargin} ${firstHalf}`);
    coordinates.push(`M${endWithMargin} ${firstHalf} L${endWithMargin} ${end.y}`);
    coordinates.push(`M${endWithMargin} ${end.y} L${end.x} ${end.y}`);
  } else {
    const firstHalf = start.x + ((end.x - start.x) / 2);
    coordinates.push(`M${start.x} ${start.y} L${firstHalf} ${start.y}`);
    coordinates.push(`M${firstHalf} ${start.y} L${firstHalf} ${end.y}`);
    coordinates.push(`M${firstHalf} ${end.y} L${end.x} ${end.y}`);
  }

  coordinates.push(leftArrow(link.style.width, end.x, end.y));
  return coordinates.join(' ');
}
