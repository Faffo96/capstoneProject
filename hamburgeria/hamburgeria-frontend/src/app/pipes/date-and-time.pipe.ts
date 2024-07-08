import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAndTime'
})
export class DateAndTimePipe implements PipeTransform {
  transform(value: string): string {
    const [date, time] = value.split('T');
    return `${date} ore ${time.substring(0, 5)}`; // Rimuove i secondi dall'orario
  }
}