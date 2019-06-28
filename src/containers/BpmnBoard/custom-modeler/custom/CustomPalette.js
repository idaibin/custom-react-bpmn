import {
  assign
} from 'min-dash';

import { BearUrl, CoffeeUrl, JuiceUrl } from '../images';

const SUITABILITY_SCORE_HIGH = 100,
  SUITABILITY_SCORE_AVERGE = 50,
  SUITABILITY_SCORE_LOW = 25;

/**
 * A palette that allows you to create BPMN _and_ custom elements.
 */
export default function PaletteProvider (bpmnFactory, palette, create, elementFactory, spaceTool, lassoTool, translate) {

  this._elementFactory = elementFactory;
  this._spaceTool = spaceTool;
  this._lassoTool = lassoTool;
  this.bpmnFactory = bpmnFactory;
  this.create = create;
  this.elementFactory = elementFactory;
  this.translate = translate;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  'bpmnFactory',
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'translate'
];


PaletteProvider.prototype.getPaletteEntries = function (element) {
  const {
    bpmnFactory,
    create,
    elementFactory,
    translate
  } = this;
  const actions = {},
    spaceTool = this._spaceTool,
    lassoTool = this._lassoTool;

  function createAction (type, group, className, title, options) {

    function createListener (event) {
      const shape = elementFactory.createShape(assign({ type: type }, options));

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    var shortType = type.replace(/^bpmn:/, '');

    return {
      group: group,
      className: className,
      title: title || 'Create ' + shortType,
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  function createParticipant (event, collapsed) {
    create.start(event, elementFactory.createParticipantShape(collapsed));
  }

  function createTask (suitabilityScore, drink) {
    return function (event) {
      const businessObject = bpmnFactory.create('bpmn:Task');

      businessObject.suitable = suitabilityScore;
      businessObject.test = 'testtest';

      const shape = elementFactory.createShape({
        topic: true,
        drink,
        businessObject,
        type: 'bpmn:Task',
      });

      create.start(event, shape);
    }
  }

  assign(actions, {
    // 'custom-triangle': createAction(
    //   'custom:triangle', 'custom', 'icon-custom-triangle'
    // ),
    // 'custom-circle': createAction(
    //   'custom:circle', 'custom', 'icon-custom-circle'
    // ),
    // 'custom-separator': {
    //   group: 'custom',
    //   separator: true
    // },
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: 'Activate the lasso tool',
      action: {
        click: function (event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    'space-tool': {
      group: 'tools',
      className: 'bpmn-icon-space-tool',
      title: 'Activate the create/remove space tool',
      action: {
        click: function (event) {
          spaceTool.activateSelection(event);
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create.start-event': createAction(
      'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none'
    ),
    'create.intermediate-event': createAction(
      'bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-none'
    ),
    'create.end-event': createAction(
      'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none'
    ),
    'create.exclusive-gateway': createAction(
      'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-xor'
    ),
    'create.task': createAction(
      'bpmn:Task', 'activity', 'bpmn-icon-task'
    ),
    'create.subprocess-expanded': createAction(
      'bpmn:SubProcess', 'activity', 'bpmn-icon-subprocess-expanded', 'Create expanded SubProcess',
      { isExpanded: true }
    ),
    'create.participant-expanded': {
      group: 'collaboration',
      className: 'bpmn-icon-participant',
      title: 'Create Pool/Participant',
      action: {
        dragstart: createParticipant,
        click: createParticipant
      }
    },
    'create.low-task': {
      group: 'activity',
      // className: 'bpmn-icon-task red',
      title: translate('Create Task with low suitability score'),
      imageUrl: BearUrl,
      action: {
        dragstart: createTask(SUITABILITY_SCORE_LOW, 'bear'),
        click: createTask(SUITABILITY_SCORE_LOW, 'bear')
      }
    },
    'create.average-task': {
      group: 'activity',
      // className: 'bpmn-icon-task yellow',
      title: translate('Create Task with average suitability score'),
      imageUrl: CoffeeUrl,
      action: {
        dragstart: createTask(SUITABILITY_SCORE_AVERGE, 'coffee'),
        click: createTask(SUITABILITY_SCORE_AVERGE, 'coffee')
      }
    },
    'create.high-task': {
      group: 'activity',
      // className: 'bpmn-icon-task green',
      title: translate('Create Task with high suitability score'),
      imageUrl: JuiceUrl,
      action: {
        dragstart: createTask(SUITABILITY_SCORE_HIGH, 'juice'),
        click: createTask(SUITABILITY_SCORE_HIGH, 'juice')
      }
    }
  });

  return actions;
};
