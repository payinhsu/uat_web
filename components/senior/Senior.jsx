import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import Sidebar from 'components/Sidebar';
import config from 'config-prod';

export default class Senior extends React.Component {

  static propTypes = {
    children: PropTypes.object
  };

  static links = [
    {url:`${config.webContext}senior/admin/activeOrders`, text:'主動預約紀錄管理'},
    {url:`${config.webContext}senior/admin/passiveOrders`, text:'照顧經理派案紀錄管理'}
  ];

  handleChooseType = (chooseType) => {
      this.setState({chooseType:chooseType});
      console.log("update : "+JSON.stringify(this.state.chooseType));
  } ;

  generateLinkView = (chooseType) => {

      if(chooseType == "I") {
          return (
              <div>
                <a href="/senior/admin/activeOrders" className="on" >主動預約訂單</a>
                <a href="/senior/admin/passiveOrders" >照顧經理派案申請單</a>
              </div>
          )
      } else {
          return (
              <div>
                <a href="/senior/admin/activeOrders">主動預約訂單</a>
                <a href="/senior/admin/passiveOrders" className="on">照顧經理派案申請單</a>
              </div>
          )  
      }
      
  } ;

  render() {
    return (
      <div id="portal">

        <div className="header">
          <div className="logo wrap"><a href="order_search.htm"><img src="/common/img/logo1.png"/></a></div>
          <div className="menu">
            <div className="wrap">
              <a href="javascript:void(0);"><span>客服</span></a>
              <a href="javascript:void(0);"><span>會員</span></a>
              <a href="javascript:void(0);"><span>供應商</span></a>
              <a href="javascript:void(0);"><span>上架</span></a>
              <a href="javascript:void(0);"><span>個案</span></a>
              <a href="javascript:void(0);"><span>LBS</span></a>
              <a href="javascript:void(0);"><span>排班</span></a>
              <a href="/senior/admin/activeOrders" className="on"><span>訂單</span></a>
              <a href="javascript:void(0);"><span>工作媒合</span></a>
              <a href="javascript:void(0);"><span>加值服務</span></a>
              <a href="javascript:void(0);"><span>廣告版位</span></a>
              <a href="javascript:void(0);"><span>帳務</span></a>
              <a href="javascript:void(0);"><span>統計報表</span></a>
              <a href="javascript:void(0);"><span>帳號</span></a>
            </div>
          </div>
          <div className="submenu">
            <div className="sm_order">
              {this.generateLinkView(this.props.senior.query.type)}
            </div>
          </div>
        </div>

        {this.props.children && React.cloneElement(this.props.children, this.props)}

        <div className="gototop">
          <div className="inner"><a href="javascript:void(0);"></a></div>
        </div>

        <div className="footer">
          <div className="copyright">一零四資訊科技股份有限公司　版權所有 &copy; <script type="text/javascript">document.write(new Date().getFullYear()); </script>　建議瀏覽器IE9.0以上</div>
        </div>

      </div>
    );
  }
}