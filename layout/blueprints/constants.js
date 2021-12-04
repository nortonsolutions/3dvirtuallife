export const Color = {
    red: 'red',
    yellow: 'yellow',
    blue: 'blue',
    bronze: 'bronze',
    brown: 'brown',
    silver: 'silver',
    multicolored: 'multicolored'
}

export const Size = {
    xsmall: 0,
    small: 1,
    medium: 2,
    large: 3,
    xlarge: 4
}

export const Entity = {
    evilOne: {
        name: 'evilOne',
        description: 'A small but menacing humanoid beast, with fire in its eyes and ready to attack',
        type: 'beast',
        attributes: {
            size: Size.small,
            strength: 0,
            agility: 1,
            wisdom: 0,
            life: 2
        }
    }
}