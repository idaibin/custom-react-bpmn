import BearUrl from './bear'
import CoffeeUrl from './coffee'
import JuiceUrl from './juice'

const SUITABILITY_SCORE_HIGH = 100,
      SUITABILITY_SCORE_AVERGE = 50,
      SUITABILITY_SCORE_LOW = 25;

export default class CustomPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const {
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this;

    function createTask(suitabilityScore, drink) {
      return function(event) {
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

    return {
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
    }
  }
}

CustomPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
