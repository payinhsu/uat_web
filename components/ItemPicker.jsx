import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import Checkbox from 'material-ui/lib/checkbox';
import Divider from 'material-ui/lib/divider';

const styles = {
  radioButton: {
    marginTop: 10,
    marginRight: 10,
  },
};

/**
 * imput model: [{value:'..', name:'..', checked: boolean}, ..]
 */
export default class ItemPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      items: props.items
    };

    /** select items in defaultCheckedValues property if present */
    if(props.defaultCheckedValues){
      // 考量預設的 ID 不會有項目的資訊，所以傳入的 default 項目僅為 ID 清單.
      let itemsToCheck = this.state.items.filter(item => props.defaultCheckedValues.find(checkedValue => checkedValue === item.value));
      itemsToCheck.forEach(item => item.checked = true);
      this.state.items = this.state.items;
    }
  }

  componentWillReceiveProps = newProps => {
    this.setState({
      open: newProps.open,
      items: newProps.items
    });

    /** select items in defaultCheckedValues property if present */
    if(newProps.defaultCheckedValues){
      let itemsToCheck = this.state.items.filter(item => newProps.defaultCheckedValues.find(checkedItem => checkedItem.value === item.value));
      itemsToCheck.forEach(item => item.checked = true);
      this.setState({items: this.state.items });
    }
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
    this.props.onRequestClose();
  };

  handleItemCheck = (itemValue, itemName, e) => {
    console.log(`${itemName} checked: ${e.target.checked}`);
    this.state.items.find(item => item.value === itemValue).checked = e.target.checked;
    this.setState({items: this.state.items});
  };

  handleConfirm = () => {
    let checkedItems = this.state.items.filter(item => item.checked);
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

    const checkboxes = this.state.items.map((item,index)  => 
	    <label key={`checkboxes_${index}`}>
        <input
          type="checkbox"
          checked={item.checked}
          onChange={this.handleItemCheck.bind(this, item.value, item.name)}
          style={styles.radioButton}
        />
        {item.name}
      </label>
    );

    const checkedboxes = this.state.items.filter(item => item.checked).map((item,index)  => 
	    <label key={`checkedboxes_${index}`}>
        <input
          type="checkbox"
          checked={item.checked}
          onChange={this.handleItemCheck.bind(this, item.value, item.name)}
          style={styles.radioButton}
        />
        {item.name}
      </label>
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
        <h4>可選項目</h4>
        {checkboxes}
        </Dialog>
      </div>
    );
  }
}