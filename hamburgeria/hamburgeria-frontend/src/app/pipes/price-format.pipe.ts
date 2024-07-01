import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat'
})
export class PriceFormatPipe implements PipeTransform {

  transform(value: number): string {
    if (value == null || value === 0) return '';
    return value.toFixed(2) + '€';
  }

}