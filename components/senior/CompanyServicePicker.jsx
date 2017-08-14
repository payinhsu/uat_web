import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import Checkbox from 'material-ui/lib/checkbox';
import Divider from 'material-ui/lib/divider';
import * as OrderActions       from 'actions/senior/OrderActions';
import { connect }            from 'react-redux';

export class CompanyServicePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       open: props.open,
       reqRootServiceCategory: props.reqRootServiceCategory,
       rootServiceCategory: props.rootServiceCategory,
       rootCategoryId: props.rootServiceCategory.id,
       companyCandidates: props.companyCandidates,
       companyId: props.rootServiceCategory.companyId,
       companyName: props.rootServiceCategory.companyName,
       careManager: props.careManager
     };
     this._checkServices=[];
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this._checkServices.splice(0, this._checkServices.length);
    this.setState({open: false});
    this.props.onRequestClose();
  };

  handleConfirm = () => {
    let checkedServices = this._checkServices.filter(service => service.checked);
    // this.props.assignCompanyServices(this.state.rootCategoryId, this.state.companyId, checkedServices);
    this.handleClose();
   this.props.onConfirm(this.state.rootCategoryId, this.state.companyId, this.state.companyName, checkedServices);
  };

  handleCancel = () => {
    this.handleClose();
  };

  handleCompanyChange = (e, companyId) => {
    const company = this.state.companyCandidates.find(company => company.id === companyId);
    this.setState(Object.assign(this.state, {companyId, companyName: company.name}));
  };

  componentWillReceiveProps = newProps => {
      this.setState(Object.assign({}, this.state, {
        open: newProps.open,
        reqRootServiceCategory: newProps.reqRootServiceCategory,
        rootServiceCategory: newProps.rootServiceCategory,
        rootCategoryId: newProps.rootServiceCategory.id,
        companyCandidates: newProps.companyCandidates,
        companyId: newProps.rootServiceCategory.companyId,
        companyName: newProps.rootServiceCategory.companyName,
        careManager: newProps.careManager
      }));
  };

  handleServiceCheck = (serviceId, serviceName, e) => {
    console.log(`${serviceName} checked: ${e.target.checked}`);
    this._checkServices.find(service => service.id === serviceId).checked = e.target.checked;
  }

  initCheckBoxes = (companyServices) => {
    this._checkServices.splice(0, this._checkServices.length);
    companyServices.forEach(service => {
      const anyAssigned = this.state.rootServiceCategory.details.find(detail => detail.companyServiceId);
      let defaultChecked = anyAssigned ?
        _.some(this.state.rootServiceCategory.details, detail => detail.companyServiceId === service.id) :
        _.some(this.state.reqRootServiceCategory.details, detail => this.state.reqRootServiceCategory.id !== '2' && detail.serviceDefId === service.serviceDefId)
      this._checkServices.push({checked:defaultChecked, ... service});
    });
  };

  render() {
    const actions = [
      <FlatButton
        label="取消"
        secondary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="確定"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleConfirm}
      />,
    ];

    const styles = {
      block: {
        maxWidth: 250,
      },
      radioButton: {
        marginBottom: 16,
      },
      checkbox: {
        marginBottom: 16,
      },
    };

    this._checkServices.splice(0, this._checkServices.length);
    // 如果當前公司的管家在事後被移除的話，會有找不到 company 的問題，這時候預設不選取公司。且不選取任何的 checkbox。
    const company = this.state.companyId ? this.state.companyCandidates.find(company => company.id === this.state.companyId) : [];
    const rootCompanyServices =  (company && company.rootServiceCategories) ? company.companyServices.filter(service => service.rootServiceCategoryId === this.state.rootCategoryId) : [];
    const careManager = this.state.careManager
    this.initCheckBoxes(rootCompanyServices);
    return (
      <div>
        <Dialog
          title="請選擇機構"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
        >
          {
            this.state.companyCandidates.length?
                <RadioButtonGroup name="company" defaultSelected={this.state.companyId} onChange={this.handleCompanyChange} >
                  {
                    careManager ?
                        careManager.areaIds.map(area =>(
                            this.state.companyCandidates.filter(company => company.zipId === area).map(company =>(
                                    <RadioButton value={company.id} label={company.name} style={styles.radioButton} />))
                        ))
                        :
                        this.state.companyCandidates.map(company =>(
                            <RadioButton value={company.id} label={company.name} style={styles.radioButton} />
                        ))
                  }
                </RadioButtonGroup> : <div></div>
          }

        <Divider />
          {
            this._checkServices.length? this._checkServices.map(service => {
              return (
                <Checkbox
                    key={`services_candidate_${service.id}`}
                    label={service.name}
                    style={styles.checkbox}
                    onCheck={this.handleServiceCheck.bind(this, service.id, service.name)}
                    defaultChecked={service.checked}
                  />
              )
            }) : <div />
          }
        </Dialog>
      </div>
    );
  }
}

export default connect(null, {... OrderActions})(CompanyServicePicker)

