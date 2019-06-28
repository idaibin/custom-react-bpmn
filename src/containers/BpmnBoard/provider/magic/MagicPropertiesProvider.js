import inherits from 'inherits';

import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';

// Require all properties you need from existing providers.
// In this case all available bpmn relevant properties without camunda extensions.
import processProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps';
import eventProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps';
import linkProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps';
import documentationProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps';
import idProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps';
import nameProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps';

// Require your magic property entries.
import spellProps from './parts/SpellProps';


// The general tab contains all bpmn relevant properties.
// The properties are organized in groups.
function createGeneralTabGroups (element, bpmnFactory, elementRegistry, translate) {

  var generalGroup = {
    id: 'general',
    label: 'General 普遍',
    entries: []
  };
  idProps(generalGroup, element, translate);
  nameProps(generalGroup, element,  () => '名字');
  processProps(generalGroup, element, translate);

  var detailsGroup = {
    id: 'details',
    label: 'Details',
    entries: []
  };
  linkProps(detailsGroup, element, translate);
  eventProps(detailsGroup, element, bpmnFactory, elementRegistry, translate);

  var documentationGroup = {
    id: 'documentation',
    label: 'Documentation 文档',
    entries: []
  };

  documentationProps(documentationGroup, element, bpmnFactory, () => '文档');

  return [
    generalGroup,
    detailsGroup,
    documentationGroup
  ];
}

// Create the magic magic tab
function createMagicTabGroups (element, elementRegistry) {

  // Create a group called "Black magic".
  var blackMagicGroup = {
    id: 'black-magic',
    label: 'Black Comall',
    entries: []
  };

  // Add the spell props to the black magic group.
  spellProps(blackMagicGroup, element);

  return [
    blackMagicGroup
  ];
}

export default function MagicPropertiesProvider (
  eventBus, bpmnFactory, elementRegistry,
  translate) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function (element) {

    var generalTab = {
      id: 'general',
      label: 'General 通常',
      groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate)
    };

    // The "magic" tab
    var magicTab = {
      id: 'magic',
      label: 'Comall',
      groups: createMagicTabGroups(element, elementRegistry)
    };

    // Show general + "magic" tab
    return [
      generalTab,
      magicTab
    ];
  };
}

inherits(MagicPropertiesProvider, PropertiesActivator);
