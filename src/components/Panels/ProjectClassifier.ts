import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import * as CUI from "@thatopen/ui-obc";
import * as OBF from "@thatopen/components-front";
import * as THREE from "three";
import * as WEBIFC from "web-ifc";

export default (components: OBC.Components) => {
    const fragments = components.get(OBC.FragmentsManager);

    const [classificationsTree, updateClassificationsTree] =
        CUI.tables.classificationTree({
            components,
            classifications: [],
            hoverHighlighterName: "hover",
            selectHighlighterName: "select",
        });
    const classifier = components.get(OBC.Classifier);
    const highlighter = components.get(OBF.Highlighter);
/*    const hider = components.get(OBC.Hider);*/

    let walls: Record<string, any>; // Use a more generic type

    fragments.onFragmentsLoaded.add(async (model) => {
        // This creates a classification system named "entities"
        classifier.byEntity(model);

        // This creates a classification system named "predefinedTypes"
        await classifier.byPredefinedType(model);
        await classifier.byIfcRel(model, WEBIFC.IFCPROPERTYSET, "storeys");

        const classifications = [
            { system: "entities", label: "Entities" },
            { system: "predefinedTypes", label: "Predefined Types" },
        ];

        walls = classifier.find({
            entities: ["IFCWALLSTANDARDCASE", "IFCWALL"],
        });

        //// Log walls to ensure they are found
        //console.log("Walls found:", walls);

        //// Log classifier list to ensure it is populated
        //console.log("Classifier list:", classifier.list);

        //// Log classifications to ensure they are correct
        //console.log("Classifications:", classifications);

        updateClassificationsTree({ classifications });
    });

    const search = (e: Event) => {
        const input = e.target as BUI.TextInput;
        classificationsTree.queryString = input.value;
    };

    //const isolateClassification = (classification: string) => {
    //    const selection = classifier.find({ classifications: [classification] });
    //    if (Object.keys(selection).length === 0) return;

    //    // Hide all fragments first
    //    for (const [, fragment] of fragments.list) {
    //        fragment.setVisibility(false);
    //    }

    //    // Show only the selected classification
    //    hider.set(true, selection);
    //};

    const getRowFragmentIdMap = (row: BUI.TableRow) => {
        const { system, Name } = row.data as { system: string; Name: string };
        const groups = classifier.list[system];
        if (!groups) return null;
        const groupData = groups[Name];
        if (!groupData) return null;
        return groupData.map;
    };

    classificationsTree.addEventListener("rowcreated", (e) => {
        e.stopImmediatePropagation();
        const { row } = e.detail;
        const fragmentIDMap = getRowFragmentIdMap(row);
        if (!(fragmentIDMap && Object.keys(fragmentIDMap).length !== 0)) return;
        row.onmouseover = () => {
            row.style.backgroundColor = "var(--bim-ui_bg-contrast-20)";
            highlighter.highlightByID(
                "hover",
                fragmentIDMap,
                true,
                false,
                highlighter.selection["select"] ?? {},
            );
        };

        row.onmouseout = () => {
            row.style.backgroundColor = "";
            highlighter.clear("hover");
        };

        row.onclick = () => {
            highlighter.highlightByID(
                "select",
                fragmentIDMap,
                true,
                true
            )
        }

        // Remove the onclick function
    });

    const color = new THREE.Color();

    const resetColor = () => {
        if (walls) {
            classifier.resetColor(walls);
        }
    };

    return BUI.Component.create<BUI.Panel>(() => {
        return BUI.html`
      <bim-panel>
        <bim-panel-section label="Classification" icon="mage:box-3d-fill">
          <bim-panel-section collapsed label="Color Indication">
            <bim-color-input
              label="Walls Color" color="#202932"
        @input="${({ target }: { target: BUI.ColorInput }) => {
                color.set(String(target.color)); // Ensure target.color is a string
                if (walls) {
                    classifier.setColor(walls, color);
                }
            }}">
            </bim-color-input>
            <bim-button @click=${resetColor} label="Reset Color" icon="mdi:refresh" tooltip-title="Reset Color" tooltip-text="Resets the color of the walls to their default state."></bim-button>
          </bim-panel-section>
          <bim-panel-section collapsed label="Classifications">
            <bim-text-input @input=${search} vertical placeholder="Search..." debounce="200"></bim-text-input>
            ${classificationsTree}
          </bim-panel-section>
       </bim-panel> 
      `;
    });
};
