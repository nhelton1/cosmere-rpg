<script lang="ts">
    export let tabCssClass: string = '';
    export let isEditMode: boolean = false;

    export let purposeLabel: string = 'Purpose';
    export let obstacleLabel: string = 'Obstacle';

    export let purpose: string = '';
    export let obstacle: string = '';

    export let onPurposeChange: (value: string) => void = () => {};
    export let onObstacleChange: (value: string) => void = () => {};

    let localPurpose = purpose;
    let localObstacle = obstacle;

    function savePurpose(){
        if(localPurpose !== purpose){
            onPurposeChange(localPurpose);
        }
    }

    function saveObstacle(){
        if(localPurpose !== purpose){
            onObstacleChange(localObstacle);
        }
    }
</script>

<div
    class={`tab tab-content split ${tabCssClass}`}
    data-tab="goals"
    data-group="primary"
>
    <section>
        <div class="details-text purpose">
            <div class="icon-header">
                <div class="title">
                    <i class="fa-solid fa-seedling"></i>
                    <span>{purposeLabel}</span>
                </div>
            </div>

            <textarea
                name="system.purpose"
                readonly={!isEditMode}
                bind:value={localPurpose}
                on:blur={savePurpose}
            ></textarea>
        </div>

        <!-- TODO: replace {{app-character-goals-list}} -->
    </section>

    <section>
        <div class="details-text obstacle">
            <div class="icon-header">
                <div class="title">
                    <i class="fa-solid fa-heart-crack"></i>
                    <span>{obstacleLabel}</span>
                </div>
            </div>

            <textarea
                name="system.obstacle"
                readonly={!isEditMode}
                bind:value={localObstacle}
                on:blur={saveObstacle}
            ></textarea>
        </div>

        <!-- TODO: replace {{app-character-connections-list}} -->
    </section>
</div>