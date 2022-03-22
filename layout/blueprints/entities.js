import { Friendlies } from './entities/friendlies.js';
import { Beasts } from './entities/beasts.js';

export const Entities = { 
  ...Friendlies,
  ...Beasts
}