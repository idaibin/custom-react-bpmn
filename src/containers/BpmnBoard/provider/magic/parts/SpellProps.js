import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';


export default function(group, element) {

  // Only return an entry, if the currently selected
  // element is a start event.

  // "extends": [
  //   "bpmn:FlowNode"
  // ], 添加该属性则有前缀
  // group.entries.push(entryFactory.textField({
  //   id: 'author',
  //   description: 'author',
  //   label: '作者',
  //   modelProperty: 'author'
  // }));
  // group.entries.push(entryFactory.textField({
  //   id: 'text',
  //   description: 'text',
  //   label: '文本',
  //   modelProperty: 'text'
  // }));

  if (is(element, 'bpmn:StartEvent')) {
    group.entries.push(entryFactory.selectBox({
      id: 'spell',
      description: 'Apply a black magic spell',
      label: 'Spell',
      modelProperty: 'spell',
      // emptyParameter: true, // 默认值添加到最后一条，希望添加到第一条
      selectOptions: [{
        name: '',
        value: ''
      }, {
        name: 'one',
        value: 1
      }, {
        name: 'two',
        value: 2
      }, {
        name: 'three',
        value: 3
      }]
    }));
    group.entries.push(entryFactory.textField({
      id: 'spell Name',
      description: 'Apply a black magic spell text',
      label: 'Spell Name',
      modelProperty: 'spell-name'
    }));
  }
  if (element.drink) {
    group.entries.push(entryFactory.selectBox({
      id: 'Drink Size',
      description: 'drink size',
      label: '杯型',
      modelProperty: 'drink-size',
      // emptyParameter: true, // 默认值添加到最后一条，希望添加到第一条
      selectOptions: [{
        name: '',
        value: ''
      }, {
        name: '小杯',
        value: 'small'
      }, {
        name: '中杯',
        value: 'media'
      }, {
        name: '大杯',
        value: 'large'
      }]
    }));
    group.entries.push(entryFactory.textField({
      id: 'Drink Brand',
      description: '输入喜欢的品牌',
      label: '品牌',
      modelProperty: 'drink-brand'
    }));
  }
}
