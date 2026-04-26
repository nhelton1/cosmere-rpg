import { CharacterActor } from '@system/documents';

export function getCharacterGoalsTabProps(
    actor: CharacterActor,
    tabCssClass: string,
    isEditMode: boolean,
    onPurposeChange: (value: string) => void,
    onObstacleChange: (value: string) => void
) {

    return {
        tabCssClass,

        isEditMode,

        purposeLabel: game.i18n.localize('COSMERE.Actor.Sheet.Details.Purpose'),

        obstacleLabel: game.i18n.localize('COSMERE.Actor.Sheet.Details.Obstacle'),

        purpose: actor.system.purpose ?? '',

        obstacle: actor.system.obstacle ?? '',

        onPurposeChange,

        onObstacleChange
    };
}