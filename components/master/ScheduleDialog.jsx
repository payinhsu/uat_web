import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import LocalePicker from 'components/master/LocalePicker';
import Divider from 'material-ui/lib/divider';
import moment from 'moment';
import tv4 from 'tv4';
import {SCHEMA_COURSE_SCHEDULE} from 'lib/schema';
import _ from 'lodash';

/** building a schedule model */
export default class ScheduleDialog extends React.Component {
  constructor(props) {
    super(props);
    console.log('emptyScheduleModel > ' + JSON.stringify(this.emptyScheduleModel()));
    this.state = {
      openLocalePicker: false,
      open: props.open,
      schedule: this.emptyScheduleModel()
    };
  }

  static propTypes = {
    open: React.PropTypes.bool.isRequired,
    excludeDays: React.PropTypes.array.isRequired         // 已經被指定的行程日期清單，不得跟裡頭的日期重覆.
  };

  emptyScheduleModel(){
    return {
      date: moment().format("YYYY-MM-DD"),
      startTime: '08:00',
      endTime: '08:00',
      localId: undefined,
      details: []
    };
  };

  componentWillReceiveProps = newProps => {
    console.log('emptyScheduleModel > ' + JSON.stringify(this.emptyScheduleModel()));
    this.setState({
      open: newProps.open,
      schedule: this.emptyScheduleModel()
    });
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  resetState(){
    this.setState({schedule: this.emptyScheduleModel()});
  }

  handleClose = () => {
    this.setState({open: false});
    this.props.onRequestClose();
  };

  handleConfirm = () => {
    // const _schedule = Object.assign({}, this.state.schedule, {
    //   periods: this.state.classInfo.periods.map(period => parseInt(period))
    // });
    // let valid = tv4.validate(_schedule, SCHEMA_NEW_CLASS_INFO);
    let valid = tv4.validate(this.state.schedule, SCHEMA_COURSE_SCHEDULE);
    if(tv4.error){
      if(tv4.error.message === 'localeId' || tv4.error.dataPath.indexOf('localeId') > -1) {
          window.alert("請選擇上課場地");
      } else {
          window.alert(`${tv4.error.dataPath}: ${tv4.error.message}`);
      }
      
    }
    else{
      this.props.onConfirm(this.state.schedule);
      this.handleClose();
      this.resetState();
    }
  };

  handleCloseLocalePicker = () => {
    this.setState({openLocalePicker: false});
  };


  timeSelect(value, onChange){
    var options = [];
    const from=8, end=18;
    for(var hour=from; hour<=end; hour++){
      options.push(<option value={_.padStart(hour,2,'0') + ':00'} key={`${hour}:00`}>{_.padStart(hour,2,'0') + ':00'}</option>);
      if(hour !== end) options.push(<option value={_.padStart(hour,2,'0') + ':30'} key={`${hour}:30`}>{_.padStart(hour,2,'0') + ':30'}</option>);
    }
    return <select value={value} onChange={onChange}> {options} </select> ;
  }

  handleChangeSchedule(field, e){
    this.state.schedule[field] = e.target.value;
    this.setState({schedule: this.state.schedule});
  }

  handleChangeScheduleDate = (e, date) => {
    const dateStr = moment(date).format("YYYY-MM-DD");
    if(this.props.excludeDays.find(day => day == dateStr)){
      alert(`行程日期 ${dateStr} 不可重覆.`);
    }
    else{
      let schedule = Object.assign({}, this.state.schedule);
      schedule.date = dateStr;
      this.setState({schedule:schedule});
    }
  };

  onConfirmLocale = (locale) => {
    this.setState({
      openLocalePicker: false,
      schedule: Object.assign({}, this.state.schedule, {
        localeId: locale.id,
        localeName: locale.name,
        localeAddress: locale.address
      })
    });
  }

  handleOpenLocalePicker = (e) => {
    e.preventDefault();
    this.setState({openLocalePicker:true});
  }

  render() {
    const locale = this.props.master.definition.locales.find(locale => locale.id === this.state.schedule.localeId);
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

    const dateStyle = {width: 100};

    return (
      <Dialog
          title="班級上課資訊"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <Divider />
          <form>
            <table className="schedule-edit-table">
              <tbody>
              <tr>
                <td>上課日期</td>
                <td><DatePicker value={moment(this.state.schedule.date).toDate()} style={dateStyle} onChange={this.handleChangeScheduleDate} /></td>
              </tr>
              <tr>
                <td>開始時間</td>
                <td>
                  {this.timeSelect(this.state.schedule.startTime, this.handleChangeSchedule.bind(this, 'startTime'))}
                </td>
                <td>結束時間</td>
                <td>
                  {this.timeSelect(this.state.schedule.endTime, this.handleChangeSchedule.bind(this, 'endTime'))}
                </td>
              </tr>
              <tr><td>上課場地</td><td colSpan="3">{locale?locale.name:''}<button onClick={this.handleOpenLocalePicker}>選擇場地</button></td></tr>
              <tr><td>上課地址</td><td>{locale?locale.address:''}</td></tr>
              </tbody>
            </table>
          </form>
          <LocalePicker open={this.state.openLocalePicker} localeId={this.state.schedule.localeId} locales={this.props.master.definition.locales} onConfirm={this.onConfirmLocale} onRequestClose={this.handleCloseLocalePicker} />
      </Dialog>
    );
  }
}
