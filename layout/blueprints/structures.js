import { Buildings } from './structures/buildings.js';
import { GatesAndLevers } from './structures/gatesAndLevers.js';
import { Platforms } from './structures/platforms.js';
import { Props } from './structures/props.js';

export const Structures = {
    
    ...Buildings,
    ...GatesAndLevers,
    ...Platforms,
    ...Props

}

