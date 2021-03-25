import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'decodeString'})
export class StringDecoder implements PipeTransform {
    transform(value: string) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = value;
        return tempElement.innerText;
    }
}
