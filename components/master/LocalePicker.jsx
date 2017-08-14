import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Divider from 'material-ui/lib/divider';

/**
  the UI to filter and select a Locale.
 */
export default class LocalePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      localeId: props.localeId || this.props.locales[0].id
    };
  }

  componentWillReceiveProps = newProps => {
    let nextState = {
      open: newProps.open,
      localeId: newProps.localeId || newProps.locales[0].id
    };
    this.setState(nextState);
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  resetState(){
    this.setState({localeId: undefined, locales: []});
  }

  handleClose = () => {
    this.setState({open: false});
    this.props.onRequestClose();
  };

  handleConfirm = () => {
    const locale = this.props.locales.find(locale => locale.id === this.state.localeId);
    console.log('locale confirm > ' + JSON.stringify(locale));
    this.props.onConfirm(locale);
    this.handleClose();
    this.resetState();
  };

  handleChangeLocale = (e) => {
    console.log('check radio > ' + e.target.value);
    this.setState({localeId: e.target.value});
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

    return (
      <Dialog
          title="選擇場地"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <Divider />
          <form>
            <table className="locale-picker-table">
              <thead>
                <tr><th>選擇</th><th>場地編號</th><th>場地名稱</th><th>場地大小(坪以上)</th><th>瀏覽</th><th>場地區域</th><th>地址</th><th>備註</th></tr>
              </thead>
              <tbody>
                {this.props.locales.map(locale => {
                  return (
                    <tr key={`locale_${locale.id}`}>
                      <td><input type="radio" value={locale.id} checked={locale.id === this.state.localeId} onChange={this.handleChangeLocale} /></td>
                      <td>{locale.id}</td>
                      <td>{locale.name}</td>
                      <td>{locale.size}</td>
                      <td><img src={locale.images.length && locale.images[0]} /></td>
                      <td>{locale.zipId}</td>
                      <td>{locale.address}</td>
                      <td>{locale.remark}</td>
                    </tr>
                )})}
              </tbody>
            </table>
          </form>
      </Dialog>
    );
  }
}