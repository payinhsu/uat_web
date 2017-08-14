import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import Checkbox from 'material-ui/lib/checkbox';
import Divider from 'material-ui/lib/divider';
import _ from 'lodash';

const styles = {
  radioButton: {
    marginTop: 10,
    marginRight: 10,
  },
};

/**
 * this picker component is fully comstomized for 104 specific select components.
 * input model (layerItems):
 [
  {
    "idLevel1": "12004000000",
    "nameLevel1": "硬體開發類",
    "level1Content": [
      {
        "idLevel2": "12004001000",
        "nameLevel2": "設計類",
        "level2Content": [
          {
            "idLevel3": "12004001001",
            "nameLevel3": "ADC"
          },..
		]
      },..
    ]
  },..	
]
 */
export default class ItemPicker104 extends React.Component {
  constructor(props) {
    super(props);

  	const layer1 = this.props.layerItems[0];

    /**
     * item:{
     *   checked: 預設是勾選
     *   tempChecked: 本次勾選項目的暫存
     * }
     */
  	const allItems =
	  _.flatten(this.props.layerItems.map(layer1 =>
      // _.flatten(layer1.level1Content.map(layer2 => layer2.level2Content))
      _.flatten(layer1.level1Content.map(layer2 => {
        layer2.tempChecked = !!layer2.checked;
        return layer2.level2Content;
      }))
	  ));

    this.state = {
      open: props.open,
      layerItems: props.layerItems,		// user passed source items.
      allItems							// all layer3 items
    };

  	const layerInfo = this.onChangeLayer(layer1.idLevel1, undefined, false);
  	this.state = {...this.state, ...layerInfo};

    /** select items in defalutCheckedItems property if present */
    if(props.defalutCheckedItems){
      allItems.filter(item => props.defalutCheckedItems.find(checkedItem => checkedItem.idLevel3 === item.idLevel3))
      .forEach(item => {item.checked = true; item.tempChecked = true});
    }

  }

  componentWillReceiveProps = newProps => {
  	const layer1 = newProps.layerItems[0];
  	const allItems =
	  _.flatten(newProps.layerItems.map(layer1 =>
	    // _.flatten(layer1.level1Content.map(layer2 => layer2.level2Content))
      _.flatten(layer1.level1Content.map(layer2 => {
        layer2.tempChecked = !!layer2.checked;
        return layer2.level2Content;
      }))
	  ));

  	const {_layer1, layer2, layer3Items} = this.onChangeLayer(layer1.idLevel1);

    /** select items in defalutCheckedItems property if present */
    if(newProps.defalutCheckedItems){
      allItems.filter(item => newProps.defalutCheckedItems.find(checkedItem => checkedItem.idLevel3 === item.idLevel3))
      .forEach(item => {item.checked = true; item.tempChecked = true});
    }

    this.setState(Object.assign({}, this.state, {
      open: newProps.open,
      layer1,
      layer2,
      layer3Items,
      allItems					// all layer3 items
    }));

  };

  /* setup current visiable items by layer id */
  onChangeLayer(layer1Id, layer2Id = undefined, changeState=true){
  	const layer1 = this.state.layerItems.find(layer1 => layer1.idLevel1 === layer1Id);
  	let layer2 = null;
  	if(layer2Id) layer2 = layer1.level1Content.find(layer1 => layer1.idLevel2 === layer2Id);
  	if(!layer2) layer2 = layer1.level1Content[0];		// if layer2 is not a child of layer1, use its first child instead.
  	const itemInfo = {layer1, layer2, layer3Items: layer2.level2Content}
  	if(changeState) this.setState(itemInfo);
  	return itemInfo;
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    // this._checkServices.splice(0, this._checkServices.length);

    // reset tempChecked items
    this.state.allItems.forEach(item => item.tempChecked = item.checked);
    this.setState({open: false});
    this.props.onRequestClose();
  };

  handleLayer1Change = (e) => {
  	this.onChangeLayer(e.target.value);
  };

  handleLayer2Change = (e) => {
  	this.onChangeLayer(this.state.layer1.idLevel1, e.target.value);
  };

  handleItemCheck = (itemValue, itemName, e) => {
    console.log(`${itemName} checked: ${e.target.checked}`);
    // this.state.allItems.find(item => item.idLevel3 === itemValue).checked = e.target.checked;
    this.state.allItems.find(item => item.idLevel3 === itemValue).tempChecked = e.target.checked;
    this.setState({allItems: this.state.allItems});
  };

  handleConfirm = () => {
    // comfirm tempChecked items
    this.state.allItems.forEach(item => item.checked = item.tempChecked);
    let checkedItems = this.state.allItems.filter(item => item.checked);
    this.props.onConfirm(checkedItems);
    this.handleClose();
  };


  render() {
    const actions = [
      <FlatButton
        label="取消"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="確認"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleConfirm}
      />,
    ];

    const checkboxes = this.state.layer3Items.map((item,index)  =>
	  <label key={`checkboxes_${index}`}>
        <input
          type="checkbox"
          checked={item.tempChecked}
          onChange={this.handleItemCheck.bind(this, item.idLevel3, item.nameLevel3)}
          style={styles.radioButton}
        />
        {item.nameLevel3}
      </label>
    );

    const checkedboxes = this.state.allItems.filter(item => item.tempChecked).map((item,index)  =>
	  <label key={`checkedboxes_${index}`}>
        <input
          type="checkbox"
          checked={item.tempChecked}
          onChange={this.handleItemCheck.bind(this, item.idLevel3, item.nameLevel3)}
          style={styles.radioButton}
        />
        {item.nameLevel3}
      </label>
    );

 	const layer1Select = (
      <select value={this.state.layer1.idLevel1} onChange={this.handleLayer1Change}>
        {this.state.layerItems.map((layer1, index) =>
          <option value={layer1.idLevel1} key={`layer1_${index}`}>{layer1.nameLevel1}</option>
        )}
      </select>
      );

 	const layer2Select = (
      <select value={this.state.layer2.idLevel2} onChange={this.handleLayer2Change}>
        {this.state.layer1.level1Content.map((layer2, index) =>
          <option value={layer2.idLevel2} key={`layer2_${index}`}>{layer2.nameLevel2}</option>
        )}
      </select>
      );

    return (
      <div>
        <Dialog
          title={this.props.title}
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <h4>已選項目</h4>
        {checkedboxes}
        <Divider />
        <h4>分類選單</h4>
    		{layer1Select} {layer2Select}
        <h4>可選項目</h4>
        {checkboxes}
        </Dialog>
      </div>
    );
  }
}