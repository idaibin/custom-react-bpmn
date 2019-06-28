import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import BearUrl from './bear'
import CoffeeUrl from './coffee'
import JuiceUrl from './juice'

import {
  append as svgAppend,
  attr as svgAttr,
  classes as svgClasses,
  create as svgCreate
} from 'tiny-svg';

import {
  getRoundRectPath
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
  is,
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import { isNil } from 'min-dash';

const DRINKS = {
  bear: BearUrl,
  coffee: CoffeeUrl,
  juice: JuiceUrl
};

const HIGH_PRIORITY = 1500,
      TASK_BORDER_RADIUS = 2,
      COLOR_GREEN = '#52B415',
      COLOR_YELLOW = '#ffc800',
      COLOR_RED = '#cc0000';


export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);

    this.bpmnRenderer = bpmnRenderer;
  }

  canRender(element) {

    // ignore labels
    return !element.labelTarget;
  }

  drawShape(parentNode, element) {
    let shape = '';
    console.log('element', element);
    // const shape = this.bpmnRenderer.drawShape((parentNode, element) => {
    if (element.drink) {
      shape = svgCreate('image', {
        x: 0,
        y: 0,
        width: element.width,
        height: element.height,
        href: DRINKS[element.drink]
      });
    } else shape = this.bpmnRenderer.drawShape(parentNode, element)

    const suitabilityScore = this.getSuitabilityScore(element);

    if (!isNil(suitabilityScore) && suitabilityScore === 0) {
      const color = this.getColor(suitabilityScore);
      const rect = drawRect(parentNode, 50, 20, TASK_BORDER_RADIUS, color);

      svgAppend(parentNode, rect);

      svgAttr(rect, {
        transform: 'translate(-20, -10)'
      });

      var text = svgCreate('text');

      svgAttr(text, {
        fill: '#fff',
        transform: 'translate(-15, 5)'
      });

      svgClasses(text).add('djs-label');

      svgAppend(text, document.createTextNode(suitabilityScore));

      svgAppend(parentNode, text);
    }
    svgAppend(parentNode, shape);

    return shape;
  }

  getShapePath(shape) {
    if (is(shape, 'bpmn:Task')) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS);
    }

    return this.bpmnRenderer.getShapePath(shape);
  }

  getSuitabilityScore(element) {
    const businessObject = getBusinessObject(element);

    const { suitable } = businessObject;

    return Number.isFinite(suitable) ? suitable : null;
  }

  getColor(suitabilityScore) {
    if (suitabilityScore > 75) {
      return COLOR_GREEN;
    } else if (suitabilityScore > 25) {
      return COLOR_YELLOW;
    }

    return COLOR_RED;
  }
}

CustomRenderer.$inject = [ 'eventBus', 'bpmnRenderer' ];

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, color) {
  const rect = svgCreate('rect');

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: color,
    strokeWidth: 2,
    fill: color
  });

  svgAppend(parentNode, rect);

  return rect;
}
