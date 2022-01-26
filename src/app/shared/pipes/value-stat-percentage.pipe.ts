import { Pipe, PipeTransform } from '@angular/core';
import { MAX_STAT } from 'src/app/home/components/details-pokemon-dialog/details-pokemon-dialog.component';

@Pipe({name: 'valueStatPercentage'})
export class ValueStatPercentagePipe implements PipeTransform {
  transform(value: number): number {
    return value/MAX_STAT * 100;
  }
}
