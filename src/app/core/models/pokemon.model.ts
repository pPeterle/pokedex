import { TypeModel } from './type.model';
import { StatModel } from './stat.model';

export interface PokemonModel {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  stats: StatModel[];
  types: TypeModel[];
}
