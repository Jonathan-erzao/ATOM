import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'morado'
})
export class MoradoPipe implements PipeTransform {

  transform(value: string): any {
    if (!value) return value;

    return {
      'color': 'purple',
      'font-weight': 'bold'
    };
  }
}
