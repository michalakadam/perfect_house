import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'prettifyNumber' })
export class NumberPrettifier implements PipeTransform {
  transform(unformattedNumber: number, unit?: string): string {
    if (unformattedNumber === 0) {
      return '—';
    }

    let digitsWithDecimals = ('' + unformattedNumber).split('.');
    let digits = [...digitsWithDecimals[0]];
    let decimals =
      digitsWithDecimals.length > 1 ? '.' + digitsWithDecimals[1] : '';
    if (decimals.length === 2) {
      decimals = decimals + '0';
    }
    return this.addWhitespaces(digits) + decimals + (unit ? unit : '');
  }

  private addWhitespaces(digits: string[]): string {
    let numberOfWhitespaces = 0;
    for (let i = digits.length - 1; i > -1; i--) {
      if ((digits.length - i - numberOfWhitespaces) % 3 === 0 && i !== 0) {
        digits = [...digits.slice(0, i), ' ', ...digits.slice(i)];
        i--;
        numberOfWhitespaces++;
      }
    }
    return digits.join('');
  }
}
