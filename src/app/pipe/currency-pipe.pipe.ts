import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyPipe',
  standalone: true,
})
export class CurrencyPipePipe implements PipeTransform {

 
  transform(value: string): any {
    let numberValue = +value == undefined ? 0 : +value;
    let newValue;
    newValue = numberValue < 0 ? Math.abs(numberValue) : numberValue;
    let finalValue;
    if (newValue >= 10000000000) {
      finalValue = (newValue / 10000000000).toFixed(2).replace(/\.0$/, '') + ' L.Cr';
    }
    else if (newValue >= 10000000) {
      finalValue = (newValue / 10000000).toFixed(2).replace(/\.0$/, '') + ' Cr';
    } 
    else if (newValue >= 100000) {
      finalValue = (newValue / 100000).toFixed(2).replace(/\.0$/, '') + ' Lac';
    } else if (newValue >= 1000) {
      finalValue = (newValue / 1000).toFixed(2).replace(/\.0$/, '') + ' K';
    }
    else if (newValue >= 10000000) {
      finalValue = (newValue / 10000000).toFixed(2).replace(/\.0$/, '') + ' A';
    } else if (newValue < 1000) {
      finalValue = newValue.toFixed(2);
    } else if (numberValue < 0) {
      finalValue = '-' + numberValue;
    } else {
      finalValue = 0;
    }
    return '₹' + finalValue;
  }
}
