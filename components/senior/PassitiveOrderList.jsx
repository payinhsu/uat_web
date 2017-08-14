import React, { Component , PropTypes }   from 'react';
import { bindActionCreators } from 'redux';
import * as OrderActions       from 'actions/senior/OrderActions';
import PassitiveOrderListItem       from 'components/senior/PassitiveOrderListItem';

export default class PassitiveOrderList extends Component {
  constructor(props) {
    super(props);
    props.senior.query.type = PassitiveOrderList.orderType;
    this.state = {
      query: props.senior.query,
      searchToggleText: '關閉搜尋',
      searchBoxStyle: {"display":"block"}
    };
  }
  // static propTypes = {
  //   todos:    PropTypes.any.isRequired,
  //   dispatch: PropTypes.func.isRequired
  // };

  static orderType = 'P';

  static needs = [
    () => OrderActions.getOrders({type: PassitiveOrderList.orderType})
    // OrderActions.getOrders
  ];

  componentDidMount(){
    // 上方搜尋區塊，若 <div class="searchBox" status="open">
    // 則搜尋區塊為開啟狀態，若沒有寫 status，則一律預設關閉

    let $searchBox = $(this.refs.searchBox),
        $searchBtn = $(this.refs.searchBtn);

    if($searchBox.attr("status") == "open" )
    {
      this.setState({
        searchToggleText: "關閉搜尋",
        searchBoxStyle: {"display":"block"}
      });
    }
    else
    {
      this.setState({
        searchToggleText: "開啟搜尋",
        searchBoxStyle: {"display":"none"}
      });
    }
  }

  handleToggleSearchBlock = () => {

    let $searchBox = $(this.refs.searchBox),
        $searchBtn = $(this.refs.searchBtn);

    // 搜尋區塊 開啟或關閉的效果
    if($searchBox.css("display") == "block" )
    {
      $searchBox.hide(250);
      this.setState({searchToggleText: "開啟搜尋"});
    }
    else
    {
      $searchBox.show(250);
      this.setState({searchToggleText: "關閉搜尋"});
    }
  }

  handleChange = (field, e) => {
    let query = Object.assign(this.state.query)
    query[field] = e.target.value;

    if(field === 'rootServiceCategoryId' && e.target.value === '0'){
      // 如果是 '全部管家' 就移除管家的查詢條件
      query[field] = undefined;
    }

    const nextState = Object.assign(this.state, query);
    this.setState(query);
    this.props.changeQuery(query);
    if(field == 'type') this.props.getOrders();
  }

  queryOrders = () => {
    this.props.getOrders();
  }

  componentDidMount() {
    this.props.getOrders();
  };

  render() {
    const { orders, dispatch } = this.props;
    return (
      <div>
        <div className="location wrap">
         <div className="msg">{this.props.auth?this.props.auth.id + '(' + this.props.auth.familyName + this.props.auth.firstName + ')' : '未登入'}</div>
         首頁 > 訂單 > 照顧經理派案申請單 > 搜尋結果
        </div>

        <div className="content list wrap">

          <div className="title"><h1>照顧經理派案申請單</h1></div>

            <div ref="searchBox" className="searchBox" style={this.state.searchBoxStyle} status="open" >
                <p>
                  <select onChange={this.handleChange.bind(this, 'rootServiceCategoryId')} >
                    <option value="0">全部管家</option>
                    <option value="1">照顧管家</option>
                    <option value="2">餐食管家</option>
                    <option value="3">隨行管家</option>
                    <option value="4">家事管家</option>
                  </select>
                  <select name="provider">
                    <option value="0">選擇供應商類型</option>
                    <option value="1">機構</option>
                    <option value="2">素人</option>
                  </select>&nbsp;
                  起訖日期：
                  <input type="text" id="js_date_from" name="date_from"/> ~
                  <input type="text" id="js_date_to" name="date_to"/> 
                </p>
                <p>
                  申請者：<input type="text" name="applicant" style={{width: 155 + 'px'}}/> &nbsp;
                  被服務者：<input type="text" name="serviced" style={{width: 150 + 'px'}}/> &nbsp;
                  <select name="status">
                    <option value="0">選擇狀態</option>
                  </select>&nbsp;
                  服務區域：<input type="text" name="location" style={{width: 150 + 'px'}}/> &nbsp;
                  <input type="submit" name="submit" value="搜尋" className="submit" onClick={this.queryOrders}/>
                </p>
            </div>
            <div className="searchLine"></div>
            <div className="searchBtn" onClick={this.handleToggleSearchBlock}>{this.state.searchToggleText}</div>

            <div className="listTotal">目前共有999筆資料</div>

            <div className="listTB">
              <table>
                <thead>
                  <tr>
                    <th>下單時間 <a href="javascript:void(0);"></a></th>
                    <th>修改時間 <a href="javascript:void(0);"></a></th>
                    <th>訂單編號 <a href="javascript:void(0);"></a></th>
                    <th>被服務者 <a href="javascript:void(0);"></a></th>
                    <th>所在區域 <a href="javascript:void(0);"></a></th>
                    <th>服務日期/時間 <a href="javascript:void(0);"></a></th>
                    <th>管家類別 <a href="javascript:void(0);"></a></th>
                    <th>訂單金額 <a href="javascript:void(0);"></a></th>
                    <th>申請狀態 <a href="javascript:void(0);"></a></th>
                    <th>付款狀態 <a href="javascript:void(0);"></a></th>
                    <th>是否逾期未付款 <a href="javascript:void(0);"></a></th>
                    <th>派案者 <a href="javascript:void(0);"></a></th>
                    <th>訂單狀態 <a href="javascript:void(0);"></a></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.props.senior.orders.map(function(order, index) {
                      // console.log('list props > ' + JSON.stringify(this.props));
                      return <PassitiveOrderListItem key={index} orderIndex={index} order={order} {... this.props} />
                    }.bind(this))
                  }
                </tbody>
              </table>
            </div>

            <div className="listPages">
              <a href="javascript:void(0);">1</a>
              <a href="javascript:void(0);">2</a>
              <a href="javascript:void(0);">3</a>
              <a href="javascript:void(0);">4</a>
              <a href="javascript:void(0);">5</a>
              <a href="javascript:void(0);" className="on">6</a>
              <a href="javascript:void(0);">7</a>
              <a href="javascript:void(0);">8</a>
              <a href="javascript:void(0);">9</a>
              <a href="javascript:void(0);">10</a>
            </div>

            <div className="listTotal text-center">
              共 999 筆資料 / 99 頁
            </div>


        </div>
      </div>
    );
  }
}
