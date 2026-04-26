import './components';

import { ItemType } from '@system/types/cosmere';
import { CharacterActor } from '@system/documents';
import { SYSTEM_ID } from '@src/system/constants';

// Base
import { BaseActorSheet } from './base';
import { TEMPLATES } from '@src/system/utils/templates';

//Svelte
import { getCharacterHeaderProps } from '@src/system/ui/adapters/character-header';
import { getCharacterGoalsTabProps } from '@src/system/ui/adapters/character-goals-tab';
import CharacterHeader from '../../ui/character/CharacterHeader.svelte';
import CharacterGoalsTab from '../../ui/character/CharacterGoalsTab.svelte';

const enum CharacterSheetTab {
    Details = 'details',
    Goals = 'goals',
}

export class CharacterSheet extends BaseActorSheet {
    declare actor: CharacterActor;
    private _headerComponent?: any;
    private _goalsComponent?: any;

    static DEFAULT_OPTIONS = {
        classes: [SYSTEM_ID, 'sheet', 'actor', 'character'] as string[],
        position: {
            width: 850,
            height: 1000,
        },
    };

    static PARTS = foundry.utils.mergeObject(
        foundry.utils.deepClone(super.PARTS),
        {
            header: {
                template: `systems/${SYSTEM_ID}/templates/${TEMPLATES.ACTOR_CHARACTER_HEADER}`,
            },
            content: {
                template: `systems/${SYSTEM_ID}/templates/${TEMPLATES.ACTOR_CHARACTER_CONTENT}`,
            },
        },
    );

    static TABS = foundry.utils.mergeObject(
        foundry.utils.deepClone(super.TABS),
        {
            [CharacterSheetTab.Details]: {
                label: 'COSMERE.Actor.Sheet.Tabs.Details',
                icon: '<i class="fa-solid fa-feather-pointed"></i>',
                sortIndex: 0,
            },

            [CharacterSheetTab.Goals]: {
                label: 'COSMERE.Actor.Sheet.Tabs.Goals',
                icon: '<i class="fa-solid fa-list"></i>',
                sortIndex: 25,
            },
        },
    );

    /* --- Context --- */

    public async _prepareContext(
        options: Partial<foundry.applications.api.ApplicationV2.RenderOptions>,
    ) {
        // Find the ancestry
        const ancestryItem = this.actor.items.find((item) => item.isAncestry());

        // Find all paths
        const pathItems = this.actor.items.filter((item) => item.isPath());

        // Split paths by type
        const pathTypes = pathItems
            .map((item) => item.system.type)
            .filter((v, i, self) => self.indexOf(v) === i); // Filter out duplicates

        return {
            ...(await super._prepareContext(options)),

            pathTypes: pathTypes.map((type) => ({
                type,
                typeLabel: CONFIG.COSMERE.paths.types[type].label,
                paths: pathItems.filter((i) => i.system.type === type),
            })),

            ancestryLabel:
                ancestryItem?.name ??
                game.i18n?.localize('COSMERE.Item.Type.Ancestry.label'),
        };
    }

    protected override async _onRender(context: any, options: any) {
        await super._onRender(context, options);

        if (!options.parts?.includes('header')) return;

        const root = (this as any).element.querySelector('.svelte-header-root');
        if (!root) return;

        this._headerComponent?.$destroy();

        this._headerComponent = new CharacterHeader({
            target: root as HTMLElement,
            props: getCharacterHeaderProps(
                this.actor,
                this.mode === 'edit' && this.isEditable,
                async (value: string) => {
                    await this.actor.update({ name: value });
                },
                async (value: number) => {
                    await this.actor.update({ 'system.level': value } as any);
                },
            ),
        });

        const goalsRoot = (this as any).element.querySelector('.svelte-goals-root');

        if (goalsRoot) {
            this._goalsComponent?.$destroy();

            const goalsTabCssClass = context.tabsMap?.goals?.cssClass ?? '';

            this._goalsComponent = new CharacterGoalsTab({
                target: goalsRoot as HTMLElement,
                props: getCharacterGoalsTabProps(
                    this.actor,
                    goalsTabCssClass,
                    this.mode === 'edit' && this.isEditable,
                    async (value: string) => {
                        await this.actor.update({ 'system.purpose': value } as any);
                    },
                    async (value: string) => {
                        await this.actor.update({ 'system.obstacle': value } as any);
                    },
                ),
            });
        }
    }
}
