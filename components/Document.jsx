import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import api from 'api/MasterAPI';
var config = require('config-prod');

export default class Document extends React.Component {

  static DOCAPI_URL = config.document.apiUrl;
  static DOC_UPLOAD_URL = config.document.uploadUrl;

  // static DOCAPI_URL = 'http://docapi-staging-api-1712535865.us-west-2.elb.amazonaws.com/docapi/v0';
  // static DOC_UPLOAD_URL = 'http://docapi-staging-originbucket-1s73tnifzf5z3.s3.amazonaws.com/';      // S3 URL

  static propTypes = {
    auth: React.PropTypes.object.isRequired,
    convertType: React.PropTypes.string.isRequired,       // 就像是銀髮的 extraNo
    onUpload: React.PropTypes.function,                 // callback: function(fileId)              - 上傳成功後的 callback
    onFileUrl: React.PropTypes.function,                // callback: function(fileId, filePath)    - 如果沒有這個 callback 就不會取 fileUrl
    displayTag: React.PropTypes.string,                 // 如果有設 onFileUrl 就要指定這個值         - 當該 tag 被轉檔完成後, onFileUrl 就會被執行.
    docType: React.PropTypes.string.required            // image, doc, video (option)
  };

  // upload config for each upload type
  // static docTypes = {
  //   'I': {name: '圖片'},
  //   'M': {name: '文件'},
  //   'V': {name: '影片'}
  // };

  // 這個 mapping 之後可能會移除
  static docIMV = {
    'image': 'I',
    'doc': 'M',
    'video': 'V'
  };

  static docTypes = {
    image: {
      accept: 'image/*',
      btnName: '選取圖片'
    },
    doc: {
      accept: 'application/x-jpg,application/x-png,application/msword,application/msword,application/vnd.ms-powerpoint,application/x-ppt,application/x-ppt,application/vnd.ms-excel,application/x-xls',
      btnName: '選取文件'
    },
    video: {
      accept: 'video/*',
      btnName: '選取影片'
    },
    refundImage: {
      accept: 'image/pjpeg,image/jpeg,image/bmp,image/gif,image/x-png,image/png',
      btnName: '選取圖片'
    },
    refundDoc: {
      accept: 'application/pdf',
      btnName: '選取文件'
    }
  }

  // constructor(props) { .. }

  handleChangeFile = e => {
    console.log('current file > ' + e.target.files[0].name);

    var file = e.target.files[0];
    var contentType = file.type;
    contentType = contentType.replace(/"/g, '');
    // if (VIDEO_TYPES.test(contentType)) {
    //   contentType = 'video/mpeg';
    // }

    // var signatureRequest = {
    //   apnum: '10400',
    //   pid: 'senior-pid-001',
    //   extra: Document.docTypes[this.props.type].extra,
    //   contenttype: contentType,
    //   contentDisposition: file.name,
    //   isP: 0,
    //   title: file.name,
    //   description: file.name,
    // };

    var sigReqParam = {
      fileName: file.name,
      fileType: file.type,
      //inputType: this.props.inputType,
      convertType: this.props.convertType,
      memberId: this.props.auth.memberId
    }

    new api(this.props.auth).getSignature(sigReqParam).then(this.signatureComplete(contentType, file), this.errorLogger).catch(this.errorLogger);
    // this.signature(signatureRequest).then(this.signatureComplete(contentType, file), this.errorLogger).catch(this.errorLogger);
  };

  // signature(data) {
  //   var url = Document.DOCAPI_URL + '/signature';
  //   return this.sendRequest(url, data);
  // };

  signatureComplete(contentType, file) {
    return function(signature) {
      console.log('signagure > ' + JSON.stringify(signature.objectKey));
      var s = signature.objectKey.split('/');
      var fileId = signature.fileId;
      var fileName = s[s.length-1];
      // return this.uploadFlite(fileId, file, contentType, signature, this.props.onUpload)
      //   .then(this.getFileUrl(fileId, contentType, this.props.onFileUrl), this.errorLogger).catch(this.errorLogger);

      var upload = this.uploadFile(fileId, fileName, file, contentType, signature, this.props.onUpload);
      if(this.props.onFileUrl){
        return upload.then(this.getFileUrl(fileId, [this.props.displayTag]), this.errorLogger).catch(this.errorLogger);
      }
      else{
        return upload.catch(this.errorLogger);
      }
    }.bind(this);
  }

  uploadFile(fileId, fileName, file, contentType, signature, onFileId) {
    return new Promise(function(resolve, reject) {
      var formData = new FormData();
      formData.append('key', signature.objectKey);
      formData.append('Content-Type', contentType);
      formData.append('acl', 'authenticated-read');
      formData.append('AWSAccessKeyId', signature.AWSAccessKeyId);
      formData.append('policy', signature.policyDocument);
      formData.append('signature', signature.signature);
      // file 要放最後
      formData.append('file', file);

      const request = new XMLHttpRequest();
      request.open('POST', Document.DOC_UPLOAD_URL, true);
      request.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          resolve();
          if(onFileId) onFileId(fileId, fileName);            // callback( fileId, fileName)
        } else {
          console.error('upload failed:', request);
          reject();
        }
      };
      request.onerror = () => {
        console.error('upload failed:', request);
        reject();
      };
      request.send(formData);
    });
  };

  getFileUrl(fileId, tags) {
    console.log(JSON.stringify(tags))
    new api(this.props.auth)
    .getFileUrl(fileId, tags)
    .then((resp) => {
      const tag = resp.tags.find(tag => tag.name === this.props.displayTag);
      if(tag.status === 'pending'){
        setTimeout(this.getFileUrl.bind(this, fileId, tags), 1000);
      }
      else{
        this.props.onFileUrl(tag.url);
      }
    })
    .catch(this.errorLogger);
  }

  // getFileUrl(fileId, fileName, contentType, onFileUrl) {
  //   return function() {
  //     var url = Document.DOCAPI_URL + '/getFileUrl';
  //     var getFileArr = [];
  //     // if (PICTURE_TYPES.test(contentType)) { // 圖片
  //       getFileArr.push({
  //         fileId: fileId
  //       });
  //     var data = {
  //       timestamp: parseInt((Date.now() + 3600000) / 1000, 10).toString(),
  //       getFileArr: getFileArr
  //     };
  //     return this.sendRequest(url, data).then(urlResp =>{
  //       console.log('first url > ' + urlResp[0].url[0]);
  //       if(onFileUrl) onFileUrl(fileId, fileName, urlResp[0].url[0]);         // callback( fileId, fileName, url )
  //     });
  //   }.bind(this);
  // }

  sendRequest(url, data) {
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();
      request.open('POST', url, true);
      request.setRequestHeader('Content-Type', 'application/json');
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          var resp = request.responseText;
          var result = JSON.parse(resp);
          resolve(result);
        } else {
          reject();
        }
      };
      request.onerror = () => {
        reject();
      };
      request.send(JSON.stringify(data));
    });
  };

  errorLogger() {
    console.error(arguments);
  };

  handleBtnClick = (e) => {
    e.preventDefault();
    console.log('trigger click file');
    this.refs.file.click();
  }

  render() {

    console.log('accept: ' + Document.docTypes[this.props.docType].accept);
    return (
      <span>
        <button type="button" onClick={this.handleBtnClick}>{Document.docTypes[this.props.docType].btnName}</button>
        <input className="hidden" ref="file" type="file" accept={Document.docTypes[this.props.docType].accept} onChange={this.handleChangeFile} />
      </span>
    );
  }
}