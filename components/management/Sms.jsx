import React from 'react';
import {Link} from 'react-router';

export default class Sms extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            phones:"",
            smsText:"",
            response:props.management.sms,
            smsStatus:props.management.smsStatus,
            tempResponses:[]
        }
    }

    componentWillReceiveProps = (newProps) => {
        // let nextState = {
        //   response: newProps.management.sms
        // };
        const smsStatus = newProps.management.smsStatus;
        this.setState({
            response: newProps.management.sms
        });
        if(this.state.smsStatus !== smsStatus){
            const phone = this.state.response.find(res => res.code == smsStatus.code) ? this.state.response.find(res => res.code == smsStatus.code).phone : '';
            const code = this.state.response.find(res => res.code == smsStatus.code) ? smsStatus.code : '';
            const status = this.state.response.find(res => res.code == smsStatus.code) ? this.state.response.find(res => res.code == smsStatus.code).status : '';
            let tempRes = new Array();
            this.state.response.map( res => {
                    if(res.code === code){
                        let tempObj = new Object();
                        tempObj.phone = phone;
                        tempObj.code = code;
                        tempObj.status = status;
                        tempRes.push(tempObj);
                    }else{
                        let tempObj = new Object();
                        tempObj.phone = res.phone;
                        tempObj.code = res.code;
                        tempObj.status = res.status;
                        tempRes.push(tempObj);
                    }
                }
            );
            this.setState({
                tempResponses:tempRes
            });
        }

        // window.alert(nextState.response);
    };

    getStatus = (code) => {
        this.props.getSmsStatus(code);
    }

    cellPhoneIsValid = (phones) => {
        const cellphonePattern = /^(09)(\d{8})$/;
        let errorIndex = new Array();
        for(let i=0;i<phones.length;i++){
            if(!cellphonePattern.test(phones[i])){
                errorIndex.push(i);
            }
        }
        return errorIndex;
    }

    handleSendSms = (e) => {
        e.preventDefault();
        var phonesArr = this.state.phones.split(/[,; ]+/);
        let errorIndexes = this.cellPhoneIsValid(phonesArr);
        if(errorIndexes.length == 0) {
            var smsJson = new Object();
            smsJson.phones = phonesArr;
            smsJson.smsText = this.state.smsText;
            this.props.sendSms(JSON.stringify(smsJson)).then((resp) => {
                const results = resp.response;
                for (let result in results) {
                    if (result.status === '佇列中' || result.status === '處理中') {
                        setTimeout(this.getStatus(result.code), 5000);
                    }
                }
            }).catch(this.errorLogger);
        }else{
            let tempStr = '';
            for(let i=0;i<errorIndexes.length;i++){
                tempStr += phonesArr[errorIndexes[i]]+'\n'
            }
            alert('手機格式有誤,錯誤的號碼有:\n'+tempStr);
        }
    };

    render() {
        return (
            <form className="component-form">
                <fieldset>
                    <legend>簡訊功能</legend>
                    <p/> <label className="field">電話:</label> <textarea value={this.state.phones} onChange={(e)=> this.setState({phones:e.target.value})}/>
                    <p/> <label className="field">簡訊內容:</label> <textarea value={this.state.smsText} onChange={(e)=>this.setState({smsText:e.target.value})}/>
                    <p/> <button onClick={this.handleSendSms}>傳送</button>
                </fieldset>
                {this.state.tempResponses ?
                    <div>
                        <table>
                            <tbody>
                            <tr className="tr-blue">
                                <th>電話</th>
                                <th>狀態</th>
                            </tr>
                            {this.state.tempResponses.map(res => (
                                <tr>
                                    <td>{res.phone}</td>
                                    <td>
                                        {res.status}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div> : (
                    this.state.response ?
                        <div>
                            <table>
                                <tbody>
                                <tr className="tr-blue">
                                    <th>電話</th>
                                    <th>狀態</th>
                                </tr>
                                {this.state.response.map(res => (
                                    <tr>
                                        <td>{res.phone}</td>
                                        <td>
                                            {res.status}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div> : <div/>
                    )
                }
            </form>
        )
    }
}