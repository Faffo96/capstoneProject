import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    const time = value.split('T')[1];
    return time.substring(0, 5); 
  }
}
