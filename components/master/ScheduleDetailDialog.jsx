import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import Divider from 'material-ui/lib/divider';
import moment from 'moment';
import _ from 'lodash';

import SubTeachersPicker from 'components/master/SubTeachersPicker';

/**
  create single course schedule.
 */
export default class ScheduleDetailDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	open: props.open,
      schedule: _.cloneDeep(this.props.schedule),
      // schedule: this.emptyModel()
      definition: this.props.definition,
      originDate: this.props.schedule.date, 
      openSubTeachersPicker:false,
      teachers: _.cloneDeep(props.teachers), 
      teacherId : '' ,
      scheduleIndex: 0
    };
    //console.log("props : " + JSON.stringify(this.props.definition.teachers) ) ;
    //console.log("construct test *****" + this.props.teachers) ;
  }

  static propTypes = {
    open: React.PropTypes.bool.isRequired,
    schedule: React.PropTypes.object.isRequired,
    definition: React.PropTypes.object.isRequired,
    excludeDays: React.PropTypes.array.isRequired         // 已經被指定的行程日期清單，不得跟裡頭的日期重覆.
  };

  onConfirmSubTeacherId = (teacherId) => {
    //console.log("teacherId : " + teacherId) ;
    //console.log("index : " + this.state.scheduleIndex) ;
    this.state.schedule.details[this.state.scheduleIndex].teacherId = teacherId;
    //console.log("this.state.schedule.teacherId : " + this.state.schedule.teacherId) ;
  }

  onCloseSubTeachersDialog = () => {
      this.setState({openSubTeachersPicker:false});
  }

  // emptyModel = () => {
  //   return {
  //     date: moment().format("YYYY-MM-DD"),
  //     courseDateOrder: 1,
  //     startHour: '00',
  //     startMinute: '00',
  //     endHour: '00',
  //     endMinute: '00',
  //     content: '',
  //     type: '1',
  //     remark: ''
  //   }
  // }

  componentWillReceiveProps = newProps => {
    this.setState({
    	open: newProps.open,
      schedule: _.cloneDeep(newProps.schedule),
      originDate: newProps.schedule.date,
      definition: newProps.definition,
      teachers: _.cloneDeep(newProps.teachers)
    });
    //console.log("component test *****" + newProps.teachers) ;
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  // resetState(){
  //   this.setState({schedule: this.emptyModel()});
  // }

  handleClose = () => {
    this.setState({open: false});
    this.props.onRequestClose();
  };

  handleChangeScheduleDate = (e, date) => {
    console.log('schedule date > ' + date);
    let nextSchedule = Object.assign({}, this.state.schedule);
    nextSchedule.date = moment(date).format("YYYY-MM-DD");
    if(nextSchedule.date !== this.state.originDate && this.props.excludeDays.find(day => day == nextSchedule.date)){
      alert(`行程日期 ${nextSchedule.date} 不可重覆.`);
    }
    else{
      this.setState({schedule:nextSchedule});
    }
  };

  handleConfirm = () => {
    let s = this.state.schedule;
    // s.startTime = s.startHour + ':' + s.startMinute;
    // s.endTime = s.endHour + ':' + s.endMinute;
    if(s.details.find ( d => parseInt(d.propotion) > 100 || parseInt(d.propotion) < 0 ) ) {
        console.log(s.details.find ( d => parseInt(d.propotion) > 100 || parseInt(d.propotion) < 0 )) ;
        alert('佔比需再 0 ~ 100 之間') ;
    } else {
        this.props.onConfirm(s);
        this.handleClose();
    }
    
    // this.resetState();
  };

  scheduleTimeSelect(from, end, step, value, onChange){
    var options = [];
    // const from=8, end=18;
    for(var num=from; num<=end; num+=step){
      options.push(<option value={_.padStart(num,2,'0')} key={num}>{_.padStart(num,2,'0')}</option>);
    }
    return <select value={value} onChange={onChange}> {options} </select> ;
  }

  updateSchedule(field, e){
    this.state.schedule[field] = e.target.value;
    this.setState({schedule: this.state.schedule});
  }

  updateDetail(detail, field, e){
    detail[field] = e.target.value;
    this.setState({schedule: this.state.schedule});
  }

  updateDetailHour(detail, field, e){
    detail[field] = e.target.value + ':' + detail[field].split(':')[1];
    this.setState({schedule: this.state.schedule});
  }

  updateDetailMin(detail, field, e){
    detail[field] = detail[field].split(':')[0] + ':' + e.target.value;
    this.setState({schedule: this.state.schedule});
  }

  addDetail = (e) =>{
    e.preventDefault();
    this.state.schedule.details.push(this.emptyDetail());
    this.setState({schedule: this.state.schedule});
  }

  removeDetail = (index, e) =>{
    e.preventDefault();
    this.state.schedule.details.splice(index, 1);
    this.setState({schedule: this.state.schedule});
  }

  emptyDetail = () =>{
    return {
      startTime: '00:00',
      endTime: '00:00',
      chapterId: this.state.definition.chapters[0].id, 
      isEvaluate: false,
      propotion:0
    }
  }

  handleOpenSubTeachersPicker = (teacherId, index, e) => {
    e.preventDefault();
    this.state.teacherId = teacherId ;
    this.state.scheduleIndex = index ;
    //console.log(index + " index" ) ; 
    this.setState({openSubTeachersPicker:true});
  };

  handleScheduleIsEvaluate = (index, e) => {
    let nextSchedule = Object.assign({}, this.state.schedule);
    nextSchedule.details[index].isEvaluate = e.target.checked;
    if(e.target.checked == false) {
        nextSchedule.details[index].propotion = 0 ;
    }
    this.setState({schedule:nextSchedule});
  } ;

  handleSchedulePropotionChange = (index, e) => {
    this.state.schedule.details[index].propotion = parseInt(e.target.value);
    this.setState({schedule: this.state.schedule});
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
          title="課程行程"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <Divider />
          <form>
            <div><DatePicker value={moment(this.state.schedule.date).toDate()} onChange={this.handleChangeScheduleDate} /></div>
            <table className="schedule-edit-table">
              <tbody>
                <tr>
                    <td><button onClick={this.addDetail}>新增</button></td>
                    <td>開始時間</td>
                    <td>結束時間</td>
                    <td>課程單元</td>
                    <td>授課講師</td>
                    <td>評鑑</td>
                    <td>佔比</td>
                </tr>
                {this.state.schedule.details.map((detail, index) =>
                  <tr>
                    <td><button onClick={this.removeDetail.bind(this, index)}>刪除</button></td>
                    <td>
                      {this.scheduleTimeSelect(0, 24, 1, detail.startTime.split(':')[0], this.updateDetailHour.bind(this, detail, 'startTime'))} 
                      {this.scheduleTimeSelect(0, 60, 5, detail.startTime.split(':')[1], this.updateDetailMin.bind(this, detail, 'startTime'))}
                    </td>
                    <td>
                      {this.scheduleTimeSelect(0, 24, 1, detail.endTime.split(':')[0], this.updateDetailHour.bind(this, detail, 'endTime'))}
                      {this.scheduleTimeSelect(0, 60, 5, detail.endTime.split(':')[1], this.updateDetailMin.bind(this, detail, 'endTime'))}
                    </td>
                    <td>
                      <select value={detail.chapterId} onChange={this.updateDetail.bind(this, detail, 'chapterId')}>
                          {this.state.definition.chapters.map((chapter, index) => {
                            return <option value={chapter.id}>{chapter.name}</option>
                          })}
                      </select>
                    </td>
                    <td>
                      <input type="text" value={this.state.definition.teachers.filter( t => t.id == detail.teacherId)[0] == undefined ? '' : this.state.definition.teachers.filter( t => t.id == detail.teacherId)[0].familyName + this.state.definition.teachers.filter( t => t.id == detail.teacherId)[0].firstName  } onClick={this.handleOpenSubTeachersPicker.bind(this, detail.teacherId, index)} />
                    </td>
                    <td>
                      <input type="checkbox" checked={detail.isEvaluate} onChange={this.handleScheduleIsEvaluate.bind(this, index)} />
                    </td>
                    <td>
                      <input type="number" style={{width:'35'}} disabled={detail.isEvaluate != true} max="100" value={detail.propotion} onChange={this.handleSchedulePropotionChange.bind(this, index)} /> %
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </form>
          <SubTeachersPicker open={this.state.openSubTeachersPicker} teachers={this.state.teachers} defaultTeacherId={this.state.teacherId} onConfirm={this.onConfirmSubTeacherId} onRequestClose={this.onCloseSubTeachersDialog} />
      </Dialog>
    );
  }
}