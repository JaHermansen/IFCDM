import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import * as FRAGS from "@thatopen/fragments";

export default (components: OBC.Components, world?: OBC.World) => {
    const highlighter = components.get(OBF.Highlighter);
    const hider = components.get(OBC.Hider);
    const fragments = components.get(OBC.FragmentsManager);
    const clipper = components.get(OBC.Clipper); // Assuming Clipper is a component for clipping planes

    const onToggleVisibility = () => {
        const selection = highlighter.selection.select;
        if (Object.keys(selection).length === 0) return;
        for (const fragmentID in selection) {
            const fragment = fragments.list.get(fragmentID);
            if (!fragment) continue;
            const expressIDs = selection[fragmentID];
            for (const id of expressIDs) {
                const isHidden = fragment.hiddenItems.has(id);
                if (isHidden) {
                    fragment.setVisibility(true, [id]);
                } else {
                    fragment.setVisibility(false, [id]);
                }
            }
        }
    };

    const onIsolate = () => {
        const selection = highlighter.selection.select;
        if (Object.keys(selection).length === 0) return;
        for (const [, fragment] of fragments.list) {
            fragment.setVisibility(false);
            const cullers = components.get(OBC.Cullers);
            for (const [, culler] of cullers.list) {
                const culled = culler.colorMeshes.get(fragment.id);
                if (culled) culled.count = fragment.mesh.count;
            }
        }
        // Convert selection to FragmentIdMap
        const fragmentIdMap: FRAGS.FragmentIdMap = {};
        for (const fragmentID in selection) {
            fragmentIdMap[fragmentID] = new Set(selection[fragmentID]);
        }
        hider.set(true, fragmentIdMap);
    };

    const onShowAll = () => {
        for (const [, fragment] of fragments.list) {
            fragment.setVisibility(true);
            const cullers = components.get(OBC.Cullers);
            for (const [, culler] of cullers.list) {
                const culled = culler.colorMeshes.get(fragment.id);
                if (culled) culled.count = fragment.mesh.count;
            }
        }
    };

    clipper.enabled = true;
    window.onkeydown = (event) => {
        if (event.code === "KeyC") {
            if (clipper.enabled && world) {
                clipper.create(world);
            }
        }
    };

    const offAddClippingPlane = () => {
        if (clipper.enabled && world) {
            clipper.deleteAll();
        }
    };

    return BUI.Component.create<BUI.PanelSection>(() => {
        return BUI.html`
      <bim-toolbar-section label="Selection" icon="ph:cursor-fill">
        <bim-button @click=${onShowAll} label="Show All" icon="tabler:eye-filled" tooltip-title="Show All" tooltip-text="Shows all elements in all models."></bim-button>
        <bim-button @click=${onToggleVisibility} label="Toggle Visibility" icon="tabler:square-toggle" tooltip-title="Toggle Visibility" tooltip-text="From the current selection, hides visible elements and shows hidden elements."></bim-button>
        <bim-button @click=${onIsolate} label="Isolate" icon="prime:filter-fill" tooltip-title="Isolate" tooltip-text="Isolates the current selection."></bim-button>
        <bim-button @click=${offAddClippingPlane} label="Delete Clipping Plane" icon="mdi:eye-off" tooltip-title="Mark object and press C to add section" tooltip-text="Remove all clipping planes."></bim-button>
      </bim-toolbar-section> 
    `;
    });
};
