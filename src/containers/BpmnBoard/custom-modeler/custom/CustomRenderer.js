import inherits from 'inherits';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  componentsToPath,
  createLine
} from 'diagram-js/lib/util/RenderUtil';

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg';

import { BearUrl, CoffeeUrl, JuiceUrl } from '../images';

const DRINKS = {
  bear: BearUrl,
  coffee: CoffeeUrl,
  juice: JuiceUrl
};

/**
 * A renderer that knows how to render custom elements.
 */
export default function CustomRenderer (eventBus, styles, bpmnRenderer) {

  BaseRenderer.call(this, eventBus, 2000);

  this.bpmnRenderer = bpmnRenderer;

  var computeStyle = styles.computeStyle;

  this.drawTriangle = function (p, side) {
    var halfSide = side / 2,
      points,
      attrs;

    points = [halfSide, 0, side, side, 0, side];

    attrs = computeStyle(attrs, {
      stroke: '#3CAA82',
      strokeWidth: 2,
      fill: '#3CAA82'
    });

    var polygon = svgCreate('polygon');

    svgAttr(polygon, {
      points: points
    });

    svgAttr(polygon, attrs);

    svgAppend(p, polygon);

    return polygon;
  };

  this.getTrianglePath = function (element) {
    var x = element.x,
      y = element.y,
      width = element.width,
      height = element.height;

    var trianglePath = [
      ['M', x + width / 2, y],
      ['l', width / 2, height],
      ['l', -width, 0],
      ['z']
    ];

    return componentsToPath(trianglePath);
  };

  this.drawCircle = function (p, width, height) {
    var cx = width / 2,
      cy = height / 2;
    // eslint-disable-next-line
    var attrs = computeStyle(attrs, {
      stroke: '#4488aa',
      strokeWidth: 4,
      fill: 'white'
    });

    var circle = svgCreate('circle');

    svgAttr(circle, {
      cx: cx,
      cy: cy,
      r: Math.round((width + height) / 4)
    });

    svgAttr(circle, attrs);

    svgAppend(p, circle);

    return circle;
  };

  this.getCirclePath = function (shape) {
    var cx = shape.x + shape.width / 2,
      cy = shape.y + shape.height / 2,
      radius = shape.width / 2;

    var circlePath = [
      ['M', cx, cy],
      ['m', 0, -radius],
      ['a', radius, radius, 0, 1, 1, 0, 2 * radius],
      ['a', radius, radius, 0, 1, 1, 0, -2 * radius],
      ['z']
    ];

    return componentsToPath(circlePath);
  };

  this.drawCustomConnection = function (p, element) {
    // eslint-disable-next-line
    var attrs = computeStyle(attrs, {
      stroke: '#ff471a',
      strokeWidth: 2
    });

    return svgAppend(p, createLine(element.waypoints, attrs));
  };

  this.getCustomConnectionPath = function (connection) {
    var waypoints = connection.waypoints.map(function (p) {
      return p.original || p;
    });

    var connectionPath = [
      ['M', waypoints[0].x, waypoints[0].y]
    ];

    waypoints.forEach(function (waypoint, index) {
      if (index !== 0) {
        connectionPath.push(['L', waypoint.x, waypoint.y]);
      }
    });

    return componentsToPath(connectionPath);
  };
}

inherits(CustomRenderer, BaseRenderer);

CustomRenderer.$inject = ['eventBus', 'styles', 'bpmnRenderer'];


CustomRenderer.prototype.canRender = function (element) {
  // ignore labels
  return !element.labelTarget;
  // return /^custom:/.test(element.type);
};

CustomRenderer.prototype.drawShape = function (parentNode, element) {
  const { drink, type } = element

  if (drink) {
    const shape = svgCreate('image', {
      x: 0,
      y: 0,
      width: element.width,
      height: element.height,
      href: DRINKS[drink]
    });
    svgAppend(parentNode, shape);
    return shape
  }
  if (type === 'custom:triangle') {
    return this.drawTriangle(parentNode, element.width);
  }

  if (type === 'custom:circle') {
    return this.drawCircle(parentNode, element.width, element.height);
  }

  // return this.bpmnRenderer.drawShape(parentNode, element)
};

CustomRenderer.prototype.getShapePath = function (shape) {
  var type = shape.type;
  if (type === 'custom:triangle') {
    return this.getTrianglePath(shape);
  }

  if (type === 'custom:circle') {
    return this.getCirclePath(shape);
  }
};

CustomRenderer.prototype.drawConnection = function (p, element) {

  var type = element.type;

  if (type === 'custom:connection') {
    return this.drawCustomConnection(p, element);
  }
};


CustomRenderer.prototype.getConnectionPath = function (connection) {

  var type = connection.type;

  if (type === 'custom:connection') {
    return this.getCustomConnectionPath(connection);
  }
};
