import { MAX_STAT } from 'src/app/home/components/details-pokemon-dialog/details-pokemon-dialog.component';
import { ValueStatPercentagePipe } from './value-stat-percentage.pipe';

describe('ValueStatPercentagePipe', () => {
  let pipe: ValueStatPercentagePipe;

  beforeEach(() => {
    pipe = new ValueStatPercentagePipe();
  });

  it('calc percentage', () => {
    const result = pipe.transform(24552);
    const expected = (24552 / MAX_STAT) * 100;
    expect(result).toBe(expected);
  });
});
