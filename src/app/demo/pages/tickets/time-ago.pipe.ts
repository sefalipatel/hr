import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return ''; // If timestamp is not provided

    const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);

    // Calculate different time units
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };

    let counter;
    for (const key in intervals) {
      if (intervals.hasOwnProperty(key)) {
        counter = Math.floor(seconds / intervals[key]);
        if (counter > 0) {
          if (counter === 1) {
            return `${counter} ${key} ago`; // Singular (1 day ago)
          } else {
            return `${counter} ${key}s ago`; // Plural (2 days ago)
          }
        }
      }
    }

    return value;
  }

}
