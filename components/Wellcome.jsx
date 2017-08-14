import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import {admins} from 'mapping';

export default class Admin extends React.Component {
  static propTypes = {
    children: PropTypes.object
  };

  render() {
    /*
    let masterStyle = {};
    // 這裡的邏輯待角色權限導入後需要進行修改.
    if(!admins.find(admin => admin.pid === this.props.auth.pid)){
      // CM pid 先寫死，未來以 permission 作判別.
      switch(this.props.auth.pid){
        case '8648730':
        case '8707074':
        case '8707106':
        case '8707098':
          masterStyle.display = 'none';     // CM 不可見 Master (未來用 permission 判別)
      }
    }
    */
    let permissions = (this.props.auth.permission && this.props.auth.permission.length) ? this.props.auth.permission : [];
    let roles =  (this.props.auth.roles && this.props.auth.roles.length) ? this.props.auth.roles : [];
    // let isPortalAdmin = roles.find(r => r === "PORTAL_ADMIN");
    let isPortalCareManager = roles.find(r => r === "PORTAL_CARE_MANAGER");
    let isWebViewPortal = permissions.find(p => p.id === "WEB_VIEW_PORTAL");
    // let isWebViewMaster = permissions.find(p => p.id === "WEB_VIEW_MASTER");

    let masterStyle = {};
    // 這裡的邏輯待角色權限導入後需要進行修改.
    if(isPortalCareManager && isWebViewPortal){
      masterStyle.display = 'none';     // CM 不可見 Master
    }

    return (
      <div id="index">
      <div className="main wrap">
        <div className="logo"><img src="common/img/logo1.png"/></div>
        <div className="indexBox">
          <div className="mainBox box1"><Link to={"/senior"} className="box"></Link></div>
          <div style={masterStyle} className="mainBox box2">
            <Link to={"/master"} className="box"><div className="note">機構<br/>登入</div></Link>
            <Link to={"/master"}>第一次登入請點此處</Link>
          </div>
          <div style={masterStyle} className="mainBox box2">
            <Link to={"/master"} className="box"><div className="note">講師<br/>登入</div></Link>
          </div>
          <div style={masterStyle} className="mainBox box2">
             <Link to={"/master"} className="box"><div className="note">104<br/>登入</div></Link>
          </div>
          <div style={masterStyle} className="mainBox box3"><a href="Javascript:void(0);" className="box"></a></div>
          <div style={masterStyle} className="mainBox box4"><a href="Javascript:void(0);" className="box"></a></div>
        </div>
        <p className="text-center">({this.props.auth ? ' 您好, ' + this.props.auth.firstName : ' 未登入'})</p>
      </div>
      </div>
    );
  }
}


