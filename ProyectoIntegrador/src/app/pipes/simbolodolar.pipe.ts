import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'simbolodolar'
})
export class SimbolodolarPipe implements PipeTransform {

  transform(value: string): string {
    return '$' + value;
  }

}
