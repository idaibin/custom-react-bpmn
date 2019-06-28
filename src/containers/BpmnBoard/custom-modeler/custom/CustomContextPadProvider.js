import inherits from 'inherits';

import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';

import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
  assign,
  bind
} from 'min-dash';

import { BearUrl, CoffeeUrl, JuiceUrl } from '../images';

const SUITABILITY_SCORE_HIGH = 100,
  SUITABILITY_SCORE_AVERGE = 50,
  SUITABILITY_SCORE_LOW = 25;

export default function CustomContextPadProvider (bpmnFactory, config, create, elementFactory, injector, connect, translate) {
  console.log('config', config.autoPlace)
  if (config.autoPlace !== false) {
    this.autoPlace = injector.get('autoPlace', false);
  }
  injector.invoke(ContextPadProvider, this);

  var cached = bind(this.getContextPadEntries, this);
  // contextPad.registerProvider(this);
  this.getContextPadEntries = function (element) {
    const {
      autoPlace,
    } = this;

    var actions = cached(element);

    var businessObject = element.businessObject;

    function startConnect (event, element, autoActivate) {
      connect.start(event, element, autoActivate);
    }

    if (isAny(businessObject, ['custom:triangle', 'custom:circle'])) {
      assign(actions, {
        'connect': {
          group: 'connect',
          className: 'bpmn-icon-connection-multi',
          title: translate('Connect using custom connection'),
          action: {
            click: startConnect,
            dragstart: startConnect
          }
        }
      });
    }

    function appendServiceTask (suitabilityScore, drink) {
      return function (event, element) {
        console.log('autoPlace', autoPlace)
        if (autoPlace) {
          const businessObject = bpmnFactory.create('bpmn:Task');

          businessObject.suitable = suitabilityScore;
          businessObject.test = 'testtest';

          const shape = elementFactory.createShape({
            drink,
            type: 'bpmn:Task',
            businessObject: businessObject
          });

          autoPlace.append(element, shape);
        } else {
          appendServiceTaskStart(event, element);
        }
      }
    }

    function appendServiceTaskStart (suitabilityScore, drink) {
      return function (event) {
        const businessObject = bpmnFactory.create('bpmn:Task');

        businessObject.suitable = suitabilityScore;

        const shape = elementFactory.createShape({
          drink,
          type: 'bpmn:Task',
          businessObject: businessObject
        });

        create.start(event, shape, element);
      }
    }

    const customActions = {
      ...actions,
      connect: actions.connect,
      delete: actions.delete,
    }

    return assign(customActions, {
      'append.low-task': {
        group: 'model',
        // className: 'bpmn-icon-task red',
        title: translate('Append Task with low suitability score'),
        imageUrl: BearUrl,
        action: {
          click: appendServiceTask(SUITABILITY_SCORE_LOW, 'bear'),
          dragstart: appendServiceTaskStart(SUITABILITY_SCORE_LOW, 'bear')
        }
      },
      'append.average-task': {
        group: 'model',
        // className: 'bpmn-icon-task yellow',
        title: translate('Append Task with average suitability score'),
        imageUrl: CoffeeUrl,
        action: {
          click: appendServiceTask(SUITABILITY_SCORE_AVERGE, 'coffee'),
          dragstart: appendServiceTaskStart(SUITABILITY_SCORE_AVERGE, 'coffee')
        }
      },
      'append.high-task': {
        group: 'model',
        // className: 'bpmn-icon-task green',
        imageUrl: JuiceUrl,
        title: translate('Append Task with high suitability score'),
        action: {
          click: appendServiceTask(SUITABILITY_SCORE_HIGH, 'juice'),
          dragstart: appendServiceTaskStart(SUITABILITY_SCORE_HIGH, 'juice')
        }
      },
    });
  };
}

inherits(CustomContextPadProvider, ContextPadProvider);

CustomContextPadProvider.$inject = [
  // 'injector',
  // 'connect',
  // 'translate',

  'bpmnFactory',
  'config',
  // 'contextPad',
  'create',
  'elementFactory',
  'injector',
  'connect',
  'translate'
];
