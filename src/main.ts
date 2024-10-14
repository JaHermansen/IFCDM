import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import projectInformation from "./components/Panels/ProjectInformation";
import elementData from "./components/Panels/Selection";
import settings from "./components/Panels/Settings";
import load from "./components/Toolbars/Sections/Import";
import help from "./components/Panels/Help";
import camera from "./components/Toolbars/Sections/Camera";
import selection from "./components/Toolbars/Sections/Selection";
import { AppManager } from "./bim-components";

BUI.Manager.init();

const components = new OBC.Components();
const worlds = components.get(OBC.Worlds);

const world = worlds.create<
  OBC.SimpleScene,
  OBC.OrthoPerspectiveCamera,
  OBF.PostproductionRenderer
>();
world.name = "Main";

world.scene = new OBC.SimpleScene(components);
world.scene.setup();
world.scene.three.background = null;

const viewport = BUI.Component.create<BUI.Viewport>(() => {
  return BUI.html`
    <bim-viewport>
      <bim-grid floating></bim-grid>
    </bim-viewport>
  `;
});

world.renderer = new OBF.PostproductionRenderer(components, viewport);
const { postproduction } = world.renderer;

world.camera = new OBC.OrthoPerspectiveCamera(components);

const worldGrid = components.get(OBC.Grids).create(world);
worldGrid.material.uniforms.uColor.value = new THREE.Color(0x424242);
worldGrid.material.uniforms.uSize1.value = 2;
worldGrid.material.uniforms.uSize2.value = 8;

const resizeWorld = () => {
  world.renderer?.resize();
  world.camera.updateAspect();
};

viewport.addEventListener("resize", resizeWorld);

components.init();

postproduction.enabled = true;
postproduction.customEffects.excludedMeshes.push(worldGrid.three);
postproduction.setPasses({ custom: true, ao: true, gamma: true });
postproduction.customEffects.lineColor = 0x17191c;

const appManager = components.get(AppManager);
const viewportGrid = viewport.querySelector<BUI.Grid>("bim-grid[floating]")!;
appManager.grids.set("viewport", viewportGrid);

const fragments = components.get(OBC.FragmentsManager);
const indexer = components.get(OBC.IfcRelationsIndexer);
const classifier = components.get(OBC.Classifier);
classifier.list.CustomSelections = {};

const ifcLoader = components.get(OBC.IfcLoader);
await ifcLoader.setup();

const tilesLoader = components.get(OBF.IfcStreamer);
tilesLoader.url = "../resources/tiles/";
tilesLoader.world = world;
// tilesLoader.culler.threshold = 0.001;
//tilesLoader.culler.maxHiddenTime = 1000;
//tilesLoader.culler.maxLostTime = 40000;

const highlighter = components.get(OBF.Highlighter);
highlighter.setup({ world });
highlighter.zoomToSelection = true;

//const culler = components.get(OBC.Cullers).create(world);
//culler.threshold = 0.001;

world.camera.controls.restThreshold = 0.25;
world.camera.controls.addEventListener("rest", () => {
  //culler.needsUpdate = true;
  //tilesLoader.culler.needsUpdate = true;
});

fragments.onFragmentsLoaded.add(async (model) => {
  if (model.hasProperties) {
    await indexer.process(model);
    classifier.byEntity(model);
  }

  for (const fragment of model.items) {
    world.meshes.add(fragment.mesh);
    //culler.add(fragment.mesh);
  }

  world.scene.three.add(model);
  setTimeout(async () => {
    world.camera.fit(world.meshes, 0.8);
  }, 50);
});

const projectInformationPanel = projectInformation(components);
const elementDataPanel = elementData(components);

const toolbar = BUI.Component.create(() => {
  return BUI.html`
    <bim-toolbar>
      ${load(components)}
      ${camera(world)}
      ${selection(components, world)}
    </bim-toolbar>
  `;
});

const leftPanel = BUI.Component.create(() => {
  return BUI.html`
    <bim-tabs switchers-full>
      <bim-tab name="project" label="Project" icon="ph:building-fill">
        ${projectInformationPanel}
      </bim-tab>
      <bim-tab name="settings" label="Settings" icon="solar:settings-bold">
        ${settings(components)}
      </bim-tab>
      <bim-tab name="help" label="Help" icon="material-symbols:help">
        ${help}
      </bim-tab>
    </bim-tabs> 
  `;
});



//Test clipper
const casters = components.get(OBC.Raycasters);
casters.get(world);

const clipper = components.get(OBC.Clipper);

clipper.enabled = true;

container.ondblclick = () => {
  if (clipper.enabled) {
    clipper.create(world);
  }
};

window.onkeydown = (event) => {
  if (event.code === "Delete" || event.code === "Backspace") {
    if (clipper.enabled) {
      clipper.delete(world);
    }
  }
};

BUI.Manager.init();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel label="Clipper Tutorial" class="options-menu">
          <bim-panel-section collapsed label="Commands">
      
        <bim-label>Double click: Create clipping plane</bim-label>
        <bim-label>Delete key: Delete clipping plane</bim-label>
       
        
      </bim-panel-section>
      <bim-panel-section collapsed label="Others"">
          
        <bim-checkbox label="Clipper enabled" checked 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            clipper.config.enabled = target.value;
          }}">
        </bim-checkbox>
        
        <bim-checkbox label="Clipper visible" checked 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            clipper.config.visible = target.value;
          }}">
        </bim-checkbox>
      
        <bim-color-input 
          label="Planes Color" color="#202932" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            clipper.config.color = new THREE.Color(target.color);
          }}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.01" label="Planes opacity" value="0.2" min="0.1" max="1"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            clipper.config.opacity = target.value;
          }}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Planes size" value="5" min="2" max="10"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            clipper.config.size = target.value;
          }}">
        </bim-number-input>
        
        <bim-button 
          label="Delete all" 
          @click="${() => {
            clipper.deleteAll();
          }}">  
        </bim-button>        
        
        <bim-button 
          label="Rotate cube" 
          @click="${() => {
            cube.rotation.x = 2 * Math.PI * Math.random();
            cube.rotation.y = 2 * Math.PI * Math.random();
            cube.rotation.z = 2 * Math.PI * Math.random();
          }}">  
        </bim-button>
       
        
      </bim-panel-section>
    </bim-panel>
    `;
});

document.body.append(panel);

// test clipper end
const app = document.getElementById("app") as BUI.Grid;
app.layouts = {
  main: {
    template: `
      "leftPanel viewport" 1fr
      /26rem 1fr
    `,
    elements: {
      leftPanel,
      viewport,
    },
  },
};

app.layout = "main";

viewportGrid.layouts = {
  main: {
    template: `
      "empty" 1fr
      "toolbar" auto
      /1fr
    `,
    elements: { toolbar },
  },
  second: {
    template: `
      "empty elementDataPanel" 1fr
      "toolbar elementDataPanel" auto
      /1fr 24rem
    `,
    elements: {
      toolbar,
      elementDataPanel,
    },
  },
};

viewportGrid.layout = "main";
