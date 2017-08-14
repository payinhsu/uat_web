import ability104 from 'mappings/ability104';
import position104 from 'mappings/position104';
import skill104 from 'mappings/skill104';
import tool104 from 'mappings/tool104';
import _ from 'lodash';

export function get104ItemsByIds(type, ids){
  var resource;
  if(type === 'ability') resource = ability104;
  else if(type === 'position') resource = position104;
  else if(type === 'skill') resource = skill104;
  else if(type === 'tool') resource = tool104;

  const allItems =
  _.flatten(resource.map(level1 =>
    _.flatten(level1.level1Content.map(level2 => level2.level2Content))
  ));

  return allItems.filter(item => ids.find(id => id === item.idLevel3));
}