import React, { Component, Fragment } from "react";
// import BpmnModeler from "bpmn-js/lib/Modeler";
import BpmnModeler from "./custom-modeler";
import propertiesPanelModule from "bpmn-js-properties-panel";
// import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/bpmn";
import propertiesProviderModule from "./provider/magic";
import magicModdleDescriptor from "./descriptors/magic";

import customTranslate from './customTranslate';
// import customModule from './custom';

import PropertiesPanel from './properties-panel';

import ZoomControls from "./components/ZoomControls";
import FileControls from "./components/FileControls";
import EditingTools from './components/EditingTools';

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";
import "./style/app.less";

import xmlStr from "../../assets/bpmn/xmlStr";

let scale = 1;

export default class extends Component {
  state = {
    customModeler: null
  }
  componentDidMount () {
    document.body.className = "shown";

    this.bpmnModeler = new BpmnModeler({
      additionalModules: [
        // customModule,
        propertiesPanelModule,
        propertiesProviderModule,
        customTranslate,
      ],
      container: "#canvas",
      propertiesPanel: {
        parent: "#properties-panel"
      },
      moddleExtensions: {
        magicModdleDescriptor
      },
      keyboard: {
        bindTo: document.body
      }
    });
    // this.setState({
    //   customModeler: this.bpmnModeler
    // })

    // this.bpmnModeler.on('commandStack.changed', this.onChange);

    const { xml = xmlStr } = this.props;

    this.renderDiagram(xml);
  }

  componentWillReceiveProps (nextProps) {
    const { xml } = nextProps;
    if (xml && xml !== this.props.xml) {
      this.renderDiagram(xml);
    }
  }

  // shouldComponentUpdate() {
  //   return false;
  // }

  renderDiagram = (xml) => {
    this.bpmnModeler.importXML(xml, err => {
      if (err) {
        // import failed :-(
        console.log("error rendering", err);
      } else {
        // we did well!
        this.bpmnModeler.getDefinitions()
        console.log("successfully rendered");
      }
    });
  };

  handleSave = (e) => {
    this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
      if (err) console.log('err', err)
      console.log(xml);
      console.log(this.bpmnModeler.getDefinitions());
    });
  }

  handleRedo = () => {
    this.bpmnModeler.get('commandStack').redo();
  };

  handleUndo = () => {
    this.bpmnModeler.get('commandStack').undo();
  };

  handleZoom = () => {
    this.bpmnModeler.get('canvas').zoom(scale);
  }

  handleZoomIn = () => {
    scale += 0.1;
    this.handleZoom();
  };

  handleZoomOut = () => {
    if (scale <= 0.3) {
      scale = 0.2
    } else {
      scale -= 0.1;
    };
    this.handleZoom();
  };

  handleZoomReset = () => {
    scale = 1;
    this.handleZoom();
  };

  handleOpen = () => { };

  handleCreate = () => { };

  handleSaveFile = () => { };

  handleSaveImage = () => { };

  render () {
    const { customModeler } = this.state
    return (
      <Fragment>
        <div className="content">
          <div id="canvas" />
          <div id="properties-panel">
            {customModeler && <PropertiesPanel modeler={customModeler} />}
          </div>
        </div>
        <ZoomControls
          onZoomIn={this.handleZoomIn}
          onZoomOut={this.handleZoomOut}
          onZoomReset={this.handleZoomReset}
        />
        <FileControls
          onOpen={this.handleOpen}
          onCreate={this.handleCreate}
          onSaveFile={this.handleSaveFile}
          onSaveImage={this.handleSaveImage}
        />
        <EditingTools
          onSave={this.handleSave}
          onRedo={this.handleRedo}
          onUndo={this.handleUndo}
        />
      </Fragment>
    );
  }
}
