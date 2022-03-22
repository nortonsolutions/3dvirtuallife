import { Valley } from './levels/00_valley.js';
import { Dungeon } from './levels/01_dungeon.js';
import { Catacomb } from './levels/02_catacomb.js';
import { Swamp } from './levels/03_swamp.js';
import { Lavafield } from './levels/04_lavafield.js';
import { Kingdom } from './levels/05_kingdom.js';
import { Ruins } from './levels/06_ruins.js';
import { Snowyland } from './levels/07_snowyland.js';
import { Lavalabyrinth } from './levels/08_lavalabyrinth.js';
import { Volcano } from './levels/09_volcano.js';
import { Elvandor } from './levels/10_elvandor.js';
import { Caves } from './levels/11_caves.js';
import { Concourse } from './levels/XX_concourse.js';

/**
 * LevelBuilder will keep track of layouts by level
 */

export const levels = [
    Valley,
    Dungeon,
    Catacomb,
    Swamp,
    Lavafield,
    Kingdom,
    Ruins,
    Snowyland,
    Lavalabyrinth,
    Volcano,
    Elvandor,
    Caves,
    Concourse
]