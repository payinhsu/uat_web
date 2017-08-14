import express                   from 'express';
import React                     from 'react';
import { renderToString, renderToStaticMarkup }        from 'react-dom/server'
import { RoutingContext, match } from 'react-router';
import createLocation            from 'history/lib/createLocation';
import routes                    from 'routes';
import { Provider }              from 'react-redux';
import fetchComponentData        from 'lib/fetchComponentData';
import path                      from 'path';
import configureStore from 'store';
import {authorize} from 'actions/AuthActions';
import {login} from 'auth';
import {sendmail} from 'lib/EmailUtil';
import querystring from 'querystring';
import session from 'express-session';
import redis from 'redis';

var http = require('http'),                 // my104 will always redirect to https url.
  passport = require("passport"),
  // express = require('express'), 
  request = require('request'),
  app = express(),
  //server = http.createServer(app),
  passport = require('passport'),
    SamlStrategy = require('passport-saml').Strategy,
  bodyParser = require('body-parser'),
  querysring = require('querystring'), 
  //domain = require('domain'), 
  //serverDomain = domain.create(), 
  //gracefulExit = require('express-graceful-exit'),
  moment = require('moment-timezone'),
  //spawn = require('child_process').spaw,
  config = require('config-prod.js'),
  redisStore = require('connect-redis')(session),
  server;

  let redisClient = undefined;
  if(!config.isLocalEnv){
    redisClient = redis.createClient(config.redis.port, config.redis.host);
  }

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');


  // config
  var fakeHeadPhoto = config.fakeHeadPhoto;
  var privateAPIUrl = config.privateAPIUrl;       // 104 對外 API URL.
  var seniorWebUrl = config.seniorWebUrl;
  var paymemtServiceUrl = config.paymemtServiceUrl;
  var seniorAPIUrl = config.seniorAPIUrl;
  var acSamlSsoUrl = config.acSamlSsoUrl;

  var acSamlSsoLogoutUrl = config.acSamlSsoLogoutUrl;

  var issuer = config.issuer;
  var acOauthConfig = config.acOauthConfig;

  /** EVN Setting END **/

  var app_token = '8e387797-da95-4366-9578-74714b61effc';
  var url_link = seniorWebUrl + '/payment/menu';        // payment back page.
  var url_response = seniorWebUrl + '/payment/consume';     // payment success, fail handler page.

  var payment_global_err_code = '999';
  var mc_error_code = '501';
  var profile_error_code = '502';

  var appDir = path.dirname(require.main.filename);

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

function careu(req, res, next){
  if(!req.url.startsWith('/__webpack_hmr') && !req.url.startsWith('/health')) console.log('req.url > ' + req.url);
  /* simulate an AC logged user if current running env is local */
  if(config.isLocalEnv){
    req.session.auth =
    {
      "returnCode": "000",
      "returnMsg": "success",
      "id": "4",
      "accessToken": "9311e858f8bd744cdbcb7220f442c0ba",
      "expiresIn": 23082896,
      "refreshToken": "8796b3337e8c17c4352513e474cb",
      "RJSSKey": "0010011100105DB5379801117014482448243222332270140999999906666FFFFFFF66660FFF8FFF70000999F9990000RJSS",
      "memberId": "1",
      "pid": "0000001",
      "familyName": "本地",
      "firstName": "開發者",
      "sex": "1",
      "cellphone": "0900104104",
      "photo": "http://file.104.com.tw/DocumentManagementTomcatAccess/imgs/104plus/6f1/965/68e/7db7da211d07438e9d9ebb2663c6c11a11_circleHeadXL.jpg?3d264fedc5da37477564e4dae6b6f2a6&v=i25v6icffq6viuci54"
    }

    // {
    //   "returnCode": "000",
    //   "returnMsg": "success",
    //   "id": "5",
    //   "accessToken": "9311e858f8bd744cdbcb7220f442c0ba",
    //   "expiresIn": 29784331,
    //   "refreshToken": "78c41bbeae51fe8518319d212e15ec5",
    //   "RJSSKey": "100101101001955B3B860110724716621662322323277247RJSS",
    //   "memberId": "5",
    //   "pid": "0000001",
    //   "familyName": "黃",
    //   "firstName": "筱容",
    //   "sex": "0",
    //   "cellphone": "0932922337",
    //   "photo": "http://52.192.56.20/resource/image/member/default.jpg",
    //   "roles": ["S","S","S","S","S","S","S","PORTAL_CARE_MANAGER"],
    //   "permission":[{"id": 0},{"id": 1}],
    //   "careManager" : {
    //       "areaIds" : [
    //         "6001008007",
    //         "6001002003"
    //       ]
    //   }
    // }


  }

  // console.log('before from > ' + req.session.from);
  // if(!req.session.from || req.query.from)
  //   req.session.from = req.query.from || 'portalApp';
  // console.log('after from > ' + req.session.from);

  // if(!req.query.from) req.query.from = 'portalApp';

  next();
}

function b64(req, res, next){
  //if(req.url.startsWith('/login')){
  if(req.url.indexOf('/login') >= 0){
    console.log(new Date());
    console.info('process b64 encode ..');

    // if(req.url.indexOf('/login/callback') === -1){

    if(!req.session.loginQuery) req.session.loginQuery = {};

    var from = 'portalApp', registrationId;
    // priority -> 讀 url -> 讀 session -> 設置 default.

    if(req.query.from){
      from = req.query.from;
      console.log('using from param from user queryString.');
      req.session.loginQuery.from = from;
    }
    else if(req.session.loginQuery && req.session.loginQuery.from){
        from = req.session.loginQuery.from;
        console.log('using from in cached session.');
    }

    if(req.query.registrationId){
        registrationId = req.query.registrationId;
        console.log('using registrationId param from user queryString.');
        req.session.loginQuery.registrationId = registrationId;
    }
    else if(req.session.loginQuery && req.session.loginQuery.registrationId){
        registrationId = req.session.loginQuery.registrationId;
        console.log('using registrationId in cached session.');
    }

    console.log('[req.cookies] > ' + JSON.stringify(req.cookies));
    console.log('[login info] > from: ' + from + ', registrationId: ' + registrationId);

    // 自訂的 loginQuery 請求參數會被展開到 AC 的請求參數
    req.query.loginQuery = {seniorFrom: from, registrationId: registrationId};

    // }

    console.info('test req body ..');
    console.info(req.body);
    if(JSON.stringify(req.body) !== '{}'){
      console.info('req.body >');
      console.info(req.body);
      var samlResp = new Buffer(req.body.SAMLResponse);
      var b64Resp = samlResp.toString('base64');
      
      var origBody = req.body;
      origBody.SAMLResponse = b64Resp;
      req.body = origBody;
    }
  }
  next();
}
/*
serverDomain.on('error', function(err){ 
  let errmsg = "Senior Web serverDomain error:"  + err.stack;
  console.log(errmsg);

  sendmail("" , "microbean@gmail.com" , "Senior Web 500 Error" , errmsg);    
});
*/


//serverDomain.run(function() {

  server = http.createServer(app);  
  /* ---------------- server domain ------------ 
  process.on('message', function(message) {
    if (message === 'shutdown') {
      gracefulExit.gracefulExitHandler(app, server,{log:true,suicideTimeout:6*1000});
      console.log("server message shutdown");
      // process.exit(0);
    } else {
      console.log(message);
    }
  });

  function sendOfflineMsg() {
     console.log("server sendOfflineMsg");
     if (process.send) process.send('offline')
  }

  function doGracefulExit(err) {
    console.log("server doGracefulExit:" + err.stack );
    gracefulExit.gracefulExitHandler(app, server,{log:true,suicideTimeout:6*1000});
  }
  
  */

  /* ---------------- server domain ------------ 
  app.use(gracefulExit.middleware(app))
  app.use(function (req, res, next) {
    var reqDomain = domain.create();
    reqDomain.add(req);
    reqDomain.add(res);

    res.on('close', function() {
      reqDomain.dispose();
    })

    // Only process one error, the rest we will ignore
    reqDomain.once('error', function(err) {
      let errmsg = "Senior Web reqDomain error:" + err.stack;
      console.log(errmsg);
      sendOfflineMsg(err);
      res.writeHeader(500, {'Content-Type' : "text/html"});
      res.write("<br><br><center><h2>Sorry ! Something Wrong !</h2><h4>We had reported it to our engineer.</h4><h5>- 104 senior developer team -</h5><h5>Back to <a href='/'>Home</a></h5></center>");
      res.end();

      sendmail("" , "microbean@gmail.com" , "Senior Web 500 Error" , errmsg);    
      
      doGracefulExit(err);
    })

    reqDomain.run(next);
  });
  */

  //app.use(express.static(path.join(__dirname, 'dist')));
  app.use('/bundle', express.static(appDir + '/dist'));
  app.use('/resource', express.static(appDir + '/resource'));
  app.use('/common', express.static(appDir + '/common'));
  app.use(nocache);
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(require('body-parser').urlencoded({extended: false}));
  app.use(require('cookie-parser')());
  app.use(session({
    secret: '104 senior secret',
    // use redis as store only in production mode.

    store: config.isLocalEnv ? undefined : new redisStore({client: redisClient}),
    resave: false,
    saveUninitialized: false
  }));
  app.use(b64);
  app.use(careu);

  passport.serializeUser(function(user, done){
    console.log("serializeUser : ", user);
    done(null, user);
  });

  passport.deserializeUser(function(user, done){
    console.log("deserializeUser  : ", user);
    done(null, user);
  });




var samlStrategy = new SamlStrategy({
    callbackUrl: seniorWebUrl + '/login/callback',
    // entryPoint: 'https://is.cloud.s104.com.tw/samlsso?RelayState=NULL',
    entryPoint: acSamlSsoUrl,
    //entryPoint: 'https://localhost:9443/samlsso',
    issuer: issuer,
    acceptedClockSkewMs: 3600000,
    passReqToCallback: true,
    logoutUrl: acSamlSsoLogoutUrl
  },
  function(req, profile, done) {   
    console.log("Auth with", profile);        
    console.log('Auth req.query > ' + JSON.stringify(req.query));
    //var data = {nameID : profile.nameID};
    var data = {
      nameID : profile.nameID,
      nameIDFormat: profile.nameIDFormat || 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient'
    };

    /*
    req.user = {
      nameID: profile.nameID,
      nameIDFormat: profile.nameIDFormat
    };
    */

    if(req.query.loginQuery){
      data.from = req.query.loginQuery.seniorFrom;
      data.registrationId = req.query.loginQuery.registrationId;
    }
    return done(null, data);
  });


  passport.use(samlStrategy);
/*
 passport.use(new SamlStrategy(
    { 
      callbackUrl: seniorWebUrl + '/login/callback',
      // entryPoint: 'https://is.cloud.s104.com.tw/samlsso?RelayState=NULL',
      entryPoint: acSamlSsoUrl,
      //entryPoint: 'https://localhost:9443/samlsso',
      issuer: issuer,
      acceptedClockSkewMs: 3600000,
      passReqToCallback: true
    },
    function(req, profile, done) {   
      console.log("Auth with", profile);        
      console.log('Auth req.query > ' + JSON.stringify(req.query));
      var data = {nameID : profile.nameID};
      if(req.query.loginQuery){
        data.from = req.query.loginQuery.seniorFrom;
        data.registrationId = req.query.loginQuery.registrationId;
      }
      return done(null, data);
    })
  );
*/
  app.use(passport.initialize());
  app.use(passport.session());

  /** important: this page is for ELB health detection, do not remove it! **/
  app.get('/health', function(req, res) {
    res.send('ok!');
  });
  
  app.get('/fail', function(req, res) {
    res.send('request fail!');
    }
  );

  app.get('/login',
    passport.authenticate('saml', { failureRedirect: '/fail', failureFlash: true }),
    function(req, res) {
    console.log('redirect to / ..');
    res.redirect('/');
  });




  app.get('/logout', function(req, res){
    console.log('req.user before logout > ' + JSON.stringify(req.user));
    req.user.nameID = req.session.passport.user.nameID;
    console.log('req.user before logout > ' + JSON.stringify(req.user));
    samlStrategy.logout(req, function(err, requestUrl) {
      // // LOCAL logout
      // req.logout();
      // redirect to the IdP with the encrypted SAML logout request
      console.log('========== logout process > ' + requestUrl);
      res.redirect(requestUrl);
    });
  });

 // app.get('/logout', function(req, res) {
  //   console.log('process logout destroy session ..');
  //   req.session.destroy();
  //   res.clearCookie('CS');
  //   res.redirect('/');
  //   // res.end(html)
  // });

  app.post('/logout/callback', function(req, res) {
     console.log('[logout callback] process logout destroy session ..');
     req.session.destroy();
     res.clearCookie('CS');
     res.redirect('/');
     // res.end(html)
  });

    
  /*
  {
    error: '...',               // 有錯誤才有 error 欄位.
    name: data.familyName + data.firstName,
    sex: data.sex,
    cellphone: data.cellphone,
    pid: data.pid,
    photo: data.headPhoto,
    registrationId: req.session.registrationId,
    oauthToken: access_token
  };
  */

  app.post('/login/callback', 
    passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
    function(req, res) {
    // console.log('/login/callback:' + JSON.stringify(req.headers));
    console.log('enter /login/callback ');
    console.log("/login/callback req.body >>>> " + JSON.stringify(req.body));
    console.log("/login/callback req.query >>>> " + JSON.stringify(req.query));

    /**
     * if user has already logged in, AC will directly redirect user back.
     * in this case:
     * the 'from' param will not be available, try to get it from session or set 'portalWeb' as its default.
     */

    console.log('[login/callback] req.session.passport.user > ' + JSON.stringify(req.session.passport.user));
    console.log('[login/callback] session.loginQuery > ' + JSON.stringify(req.session.loginQuery));

    // var pid = req.session.passport.user.nameID,
    //     from = req.session.passport.user.from,
    //     registrationId = req.session.passport.user.registrationId;

    var pid = req.session.passport.user.nameID;

    var addQuery = querystring.parse(req.body.queryString);
    var from = addQuery.seniorFrom;
    var registrationId = addQuery.registrationId;

    // 如果 callback 沒有 from 資料就從 session 抓.
    if(!from){ from = req.session.loginQuery.from;}

    // 如果 callback 沒有 registrationId 資料就從 session 抓.
    // if(!registrationId){ registrationId = req.session.loginQuery.registrationId;   }

    if(!from){
      from = req.session.loginQuery.from || req.session.passport.user.from;
    }


    console.log('pid > ' + pid);
    console.log('from > ' + from);
    console.log('registrationId > ' + registrationId);


    var authorization_code = req.body.RelayState;
    console.log("authorization_code > " + authorization_code);
    
    if(authorization_code !== 'NULL'){
      loadUserDataFromAC(req, res, pid, authorization_code, function(loginParam){
        loginParam.from = from;
        loginParam.registrationId = registrationId;
        seniorACLogin(loginParam);
      });
    } else {
      /** login senior only use pid as param **/
      seniorACLogin({pid: pid, from: from, registrationId: registrationId});
    }
    
    /** sync data by senior ac login api **/
    function seniorACLogin(loginParam){
      // temporarily hard code assing 'app' parameter as 'P' - Portal
      // loginParam.app = 'P';
      // loginParam.from = from; 
      console.log('call seniorACLogin > ' + JSON.stringify(loginParam));
      request({
        url: seniorAPIUrl + '/member/login',        // senior ac member login api.
        method: "POST",
        headers: { 
          'content-type': 'application/json', 
          'Authorization': 'Bearer ' + app_token
        },
        json: loginParam
      }, function(err,httpResponse,data){
        if(err) {
          console.log('call senior login error > ' + JSON.stringify(err));
          // res.send(JSON.stringify(err));
          res.send(html_begin + JSON.stringify(err) + html_end);
        }
        else{
          console.log('call senior login return > ' + JSON.stringify(data));
          // res.send(JSON.stringify(accountData.data));
          
          /*
          if(data.returnCode && data.returnCode == '000'){
            res.send(JSON.stringify(seniorLoginData));
          } else{}
          */

          /*
          loginParam.returnCode = data.returnCode;
          loginParam.returnMsg = data.returnMsg;
          
          // reload token data from ac login api
          // seniorLoginData.expiresIn = data.expiresIn;
          // seniorLoginData.refreshToken = data.refreshToken;
          loginParam.accessToken = data.accessToken;        // only show accessToken.
          loginParam.memberId = data.id;
          loginParam.RJSSKey = data.RJSSKey;
          
          delete loginParam.expiresIn
          delete loginParam.refreshToken
          */
          
          // res.send(JSON.stringify(seniorLoginData));
          // res.send(html_begin + JSON.stringify(loginParam) + html_end);


          // res.send(html_begin + JSON.stringify(data) + html_end);

          console.log('session > ' + JSON.stringify(req.session));
          if(loginParam.from && loginParam.from === 'portalWeb'){
            // save senior login response as session auth property.
            req.session.auth = data;
            console.log(`redirect to ${config.webContext}?from=portalWeb`);
            res.redirect(`${config.webContext}?from=portalWeb`);
          } else {
            console.log('show login info on page');
            res.send(html_begin + JSON.stringify(data) + html_end);
          }
        }
      });
    }
    
    // res.redirect('/');
    }
  );

  /**
  load AC user data by authorization_code returned from saml response.
  */
  function loadUserDataFromAC(req, res, pid, authorization_code, callback){
    /*
    {
      "token_type":"bearer",
      "expires_in":31465899,
      "refresh_token":"f59032aa4a64e7eb2270b81639294463",
      "access_token":"185795394deef611331cd38da11c80d1"
    }
    */
    getAccessToken(authorization_code, function(err, tokenResp){
      if (err) {
        return console.error('upload failed:', err);
      }
      console.log('token resp > ' + JSON.stringify(tokenResp));
      // console.log('got access token > ' + access_token);         // [object Object]
      // console.log('req.session obj > ' + JSON.stringify(req.session)); // {"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"passport":{"user":{"nameID":"209047"}}}
      
      var tokenObj = {
        expiresIn: tokenResp.expires_in,
        refreshToken: tokenResp.refresh_token,
        accessToken: tokenResp.access_token
      };
      
      console.log('tokenObj > ' + JSON.stringify(tokenObj));
      
      getACMemberData(res, pid, tokenResp.access_token, function(accountData){
        // var html_begin = '<!doctype html><html><body style="background-color:#555555"><div id="m104careu_login_success" style="visibility:hidden">';
        // var html_end = '</div></body></html>';

        console.log('accountData > ' + accountData);
        console.log('accountData >> ' + JSON.stringify(accountData));
        // if(accountData.err){
        if(accountData.returnCode !== '000'){
          console.log('fail to get ac member data > ' + JSON.stringify(accountData));
          //res.send(html_begin + JSON.stringify(accountData) + html_end);
          callback(accountData);
        }
        else{
          var data = accountData.data;
          console.log('data > ' + JSON.stringify(data));
          console.log('req.session > ' + JSON.stringify(req.session));

          // if(req.session && req.session.registrationId)
          //   data.registrationId = req.session.registrationId;

          // if(req.session && req.session.from)
          //   data.from = req.session.from;
          
          console.log('success get ac member data > ' + JSON.stringify(data));
          // call senior api to sync login data.


          var email = null;
          if(Array.isArray(data.email) && data.email.length > 0){
            var item = data.email.find(function(item){
              return item.isMain.toString() === 'true' || data.email[0];
            });
            email = item.email;
          }
          console.log('resolve email > ' + email);
          var seniorLoginParam = {
            familyName: data.familyName,
            firstName: data.firstName,
            sex: data.sex,
            cellphone: data.cellphone,
            pid: data.pid,
            photo: data.headPhoto,
            email: email,
            // registrationId: req.session.registrationId,
            // accessToken: access_token
            expiresIn: tokenObj.expiresIn,
            refreshToken: tokenObj.refreshToken,
            accessToken: tokenObj.accessToken,
            RJSSKey: data.encodePid
          };
          
          // if(req.session && req.session.registrationId)
          //   seniorLoginParam.registrationId = req.session.registrationId;
          
          // console.log('senior login query json >');
          // console.log(JSON.stringify(seniorLoginParam));
          // console.log('< senior login query json');
          
          callback(seniorLoginParam);
        }

      });
      
      // res.redirect('/');
    });
    
  }

    /*    [Response format]
    {
      "error": '..',
      "headPhoto": '..',
      "pid": "108170",
      "familyName": "分享",
      "firstName": "活動7",
      "cellphone": "",
      "birthday": "1976-06-08",
      "sex": "1",
      "email": [
      {
        "pid": "108170",
        "email": "joyce.lu@104.com.tw",
        "isMain": "false",
        "id": "36141",
        "isVerified": "0",
        "emailVcode": {
        "@nil": "true"
        },
        "emailVdate": {
        "@nil": "true"
        },
        "emailCrypt": "1aaaa2e8269e94da44fbaede4fa1d457c606c19e5b9765dda4722fd2cb4a7603f"
      }
      ],
      "encodePid": "001010100010539573861010034743144314232333360347RJSS"
    }
    */
    function getACMemberData(res, pid, access_token, callback){
      
      /*
      returnCode:
        000: success
        xxx: senior api error       // 轉送
        210: account api error
        220: mc api error
        230: profile api error
      */
      
      console.log('MC get url > ' + privateAPIUrl + '/services/ExtMcService.0.0/GetKey?Key=' + issuer + ':' + pid);
      console.log('MC get url token > Authorization : Bearer ' + access_token);
      // request.get({    // MC API
      //    //url: 'http://intesb.cloud.s104.com.tw/services/McService.0.0/GetKey?Key=temp:seniorapp:' + pid
      //    // url: 'http://privateapi.104.com.tw/services/McService.0.0/GetKey?Key=temp:seniorapp:' + pid
      //    url: privateAPIUrl + '/services/ExtMcService.0.0/GetKey?Key=seniorapp:' + pid
          
      //  },

      request({
        url: privateAPIUrl + '/services/ExtMcService.0.0/GetKey?Key=' + issuer + ':' + pid,        // senior ac member login api.
        method: "GET",
        headers: { 
          'content-type': 'application/json', 
          'Authorization': 'Bearer ' + access_token
        }
        //,json: loginData
      }, function(err,httpResponse,body){
        // if(err) return callback({error: err});
        if(err) return callback({returnCode: '220', returnMsg: err});
        
        console.log('mc body > ' + body);
        var MCJson = getTextInXML(body, '<ns:return>', '</ns:return>');
        if(!MCJson) {
          htmlJson(res, {
            returnCode: mc_error_code, 
            returnMsg: 'cannot get a logged user data.'
          });
        }
        var accountData = {err: err, data:JSON.parse(MCJson)};
        console.log('got account data from MC > ' + JSON.stringify(accountData));

        /** add senior channel start **/
        var profileInitUrl = 'http://plus.104.com.tw/sso/profile-init';
        console.log('enable plus account > ' + profileInitUrl);
      
        request({                             // request: init plus profile
          url: profileInitUrl,
          method: "GET"
        }, function(err,httpResponse,body){
          if(err){
            console.log('fail init plus profile > ' + err);
          }
          else{
            console.log('init plus profile result > ' + body);
            console.log('call ChannelFacade >> ');
            var channelFacadeUrl = privateAPIUrl + '/services/ChannelFacade.0.0/isUserSubscribeByChannel?productKey=10400&companyId=0&pid=' + pid + '&channelId=13393';
            console.log('ChannelFacade url >> ' + channelFacadeUrl);
            // http://privateapi.104.com.tw:80/services/ChannelFacade.0.0/isUserSubscribeByChannel?productKey=10400&companyId=0&pid=100083&channelId=7967
            request({
              url: channelFacadeUrl,
              method: "GET",
              headers: { 
                'content-type': 'application/json', 
                'Authorization': 'Bearer ' + access_token
              }
              //,json: loginData
            }, function(err,httpResponse,body){
              if(err) 
                consoel.log('fail to call channel api > ' + err);
              else{
                var isSubscribePayload = getTextInXML(body, '<ns:return>', '</ns:return>');
                if(!isSubscribePayload) {
                  console.log('no subscribe payload in response.');
                  // htmlJson(res, {
                  //   returnCode: profile_error_code, 
                  //   returnMsg: 'cannot get the channel subcribe info of the logged user.'
                  // });
                } else {
                  var isSubscribeResponse = JSON.parse(isSubscribePayload).response;
                  console.log('isSubscribeResponse > ' + isSubscribeResponse);
                  
                  if(!isSubscribeResponse){
                    // subscribe senior channel
                    var joinGroupApiUrl = privateAPIUrl + '/services/JoinPublicGroupService.0.0/verifyJoinedPublicGroup?productKey=10400&pid=' + pid + '&groupId=3&passed=true';
                    console.log('subcribing senior channel > ');
                    request({
                      url: joinGroupApiUrl,
                      method: "GET",
                      headers: { 
                        'content-type': 'application/json', 
                        'Authorization': 'Bearer ' + access_token
                      }
                      //,json: loginData
                      }, function(err,httpResponse,body){
                        if(err) 
                          console.log('fail to call join channel > ' + err);
                        // return callback({returnCode: '230', returnMsg: err});
                        else{
                          console.log('join channel success > ' + body);
                        }
                      }
                    );
                  }
                }
              }
            });
          }
        });
        /** add senior channel end **/
          
      // get user photo from avatar service.
      request({
        url: privateAPIUrl + '/services/AvatarService.0.0/getProfileMulti?productKey=10400&headTag=circleHeadXL&pids=' + pid,       // senior ac member login api.
        method: "GET",
        headers: { 
          'content-type': 'application/json', 
          'Authorization': 'Bearer ' + access_token
        }
        //,json: loginData
      }, function(err,httpResponse,body){
        if(err) 
          return callback({returnCode: '230', returnMsg: err});
        else{
          console.log('body > ' + body);
          var payload = getTextInXML(body, '<ns:return>', '</ns:return>');

          if(!payload) {
            htmlJson(res, {
              returnCode: profile_error_code, 
              returnMsg: 'cannot get the profile photo of the logged user.'
            });
          }
          var response = JSON.parse(payload).response;
          console.log('response > ' + JSON.stringify(response));
          var photoUrl = response.length > 0 ? 'http:' + response[0].userFileUrl : fakeHeadPhoto;
          photoUrl = photoUrl.replace('amp;','');
          console.log('photoUrl > ' + photoUrl);
          
          accountData.returnCode = '000';
          accountData.returnMsg = 'success';
          accountData.data.headPhoto = photoUrl;
          callback(accountData);
        }
      });
          

          // // 暫帶 plus 預設頭像圓圖. START
          // accountData.data.headPhoto = fakeHeadPhoto;   // 先帶假的.
          // accountData.returnCode = '000';
          // accountData.returnMsg = 'success';
          // callback(accountData);
          // // END.

          // request.get({ // Profile API
          //   url: 'http://esb.cloud.s104.com.tw/services/profile/headphoto/' + pid + '/circleHeadXL/0/https/'          
          //   }, function(err,httpResponse,body){
          //   // if(err) return callback({error: err});
          //   if(err) return callback({returnCode: '230', returnMsg: err});
            
          //   // console.log('mc body > ' + body);
          //   var profileResp = JSON.parse(body)
          //   console.log('profile response > ' + JSON.stringify(profileResp));
          //   if(profileResp.success === 'true'){
          //     accountData.err = err;
          //     console.log('profile headPhoto > ' + profileResp.data.headPhoto);
          //     accountData.data.headPhoto = profileResp.data.headPhoto;
          //     console.log('accountData.data.headPhoto > ' + accountData.data.headPhoto);
              
          //     accountData.returnCode = '000';
          //     accountData.returnMsg = 'success';
          //     callback(accountData)
          //   }
          //   else{
          //     // callback({error:profileResp.error})
          //     if(err) return callback({returnCode: '230', returnMsg: profileResp.error});
          //   }
          // }); 
      });
    }

    function getAccessToken(authorization_code, callback){
      console.log('getAccessToken > ' + JSON.stringify(acOauthConfig));
      var requestConf = JSON.parse(JSON.stringify(acOauthConfig));
      requestConf.form.code = authorization_code;
      console.log('getAccessToken req > ' + JSON.stringify(requestConf));
      request.post(requestConf, function(err,httpResponse,body){
        if(err) 
          callback(err);
        else {
          callback(err, JSON.parse(body));
          /*
          {
            "token_type":"bearer",
            "expires_in":31465899,
            "refresh_token":"f59032aa4a64e7eb2270b81639294463",
            "access_token":"185795394deef611331cd38da11c80d1"
          }
          */
        }
      });
    }

    function getTextInXML(xml, openTag, closeTag){
      var openTagIndex = xml.indexOf(openTag);
      var closeTagIndex = xml.indexOf(closeTag);
      if(closeTagIndex > 0){
      var text = xml.substring(openTagIndex + openTag.length, closeTagIndex);
      return text;
      }
      else{
      return null;
      }
    }
    
    // function getTextInXML(xml, openTag, closeTag){
    //   var text = xml.substring(xml.indexOf(openTag) + openTag.length, xml.indexOf(closeTag));
    //   //console.log('extract string from xml >' + text)
    //   return text;
    // }

    /** payment url_link 參數指定的網址, 點選頁面中 "重新選擇付款方式" & timeout 時返回的頁面 **/
    app.post('/payment/menu', function(req, res) {
      console.info('response_code is undefined return fail without update db.');
      htmlJson(res, {
        returnCode: payment_global_err_code, 
        returnMsg: 'back to url_link page.'
      });
      return ;
    });


    /** payment **/
  app.post('/payment/consume', function(req, res) {

    console.log('from payment > ' + JSON.stringify(req.body));
    /*
    if(req.body.response_code === undefined){
      console.info('response_code is undefined return fail without update db.');
      htmlJson(res, {
        returnCode: payment_global_err_code, 
        returnMsg: 'payment has no response_code.'
      });
      return ;
    }
    */

    var tokenHeader = req.header('Authorization');
    console.log('header Authorization: ' + tokenHeader);
    // var token = tokenHeader.replace('Authorization', '').trim();

    var addPaymentApiUrl = seniorAPIUrl + '/order/' + req.body.order_id + '/payment';

    var paymentData = {
      transDate: req.body.trans_date.replace(/\//g,"-"),
      paymentType: req.body.payment_type,
      gatewayId: req.body.gateway_id,
      responseCode: req.body.response_code,
      responseMsg: req.body.response_msg,
      orderPayId: req.body.order_pay_id
    };

    console.log('send info:');
    console.log('url: ' + addPaymentApiUrl);
    console.log('param: ' + JSON.stringify(paymentData));
    console.log('header: ' + JSON.stringify({ 
      'content-type': 'application/json', 
      'Authorization': 'Bearer ' + app_token
    }));

    request({
        url: addPaymentApiUrl,
        method: "POST",
        headers: { 
          'content-type': 'application/json', 
          'Authorization': 'Bearer ' + app_token
        },
        json: paymentData
      }, function(err,httpResponse,body){
        if(err){
          console.log('fail update payment > ' + err);
          htmlJson(res, {
            returnCode: payment_global_err_code, 
            returnMsg: 'fail to update payment.'
          });
        }
        else{
          console.log('success update payment >');
          console.log(body);
          htmlJson(res, body);
          // res.json(body);
        }
      });
  });


  app.get('/payment', function(req, res) {
    var orderId = req.query.orderId;
    console.log('[/payment] orderId > ' + orderId);

    if(!orderId){
      htmlJson(res, {
        returnCode: payment_global_err_code, 
        returnMsg: 'orderId not specified.'
      });
      return;
    }

    var tokenHeader = req.header('Authorization');
    console.log('header Authorization: ' + tokenHeader);
    // var token = tokenHeader.replace('Authorization', '').trim();

    var addPaymentApiUrl = seniorAPIUrl + '/order/' + orderId + '/payment';
    var paymentData = {
      "transDate":moment().tz('Asia/Taipei').format("YYYY-MM-DD HH:mm:ss"),
      "paymentType":"1",
      "gatewayId": "NCCC",
      "responseCode":"00",
      "responseMsg":"付款成功(銀髮測試訊息)",
      "orderPayId":orderId
    };

    console.log('send info:');
    console.log('url: ' + addPaymentApiUrl);
    console.log('param: ' + JSON.stringify(paymentData));
    console.log('header: ' + JSON.stringify({ 
      'content-type': 'application/json', 
      // 'Authorization': 'Bearer ' + app_token
      'Authorization': tokenHeader
    }));

    request({
        url: addPaymentApiUrl,
        method: "POST",
        headers: { 
          'content-type': 'application/json', 
          'Authorization': tokenHeader
        },
        json: paymentData
      }, function(err,httpResponse,body){
        if(err){
          console.log('fail update payment > ' + err);
          htmlJson(res, {
            returnCode: payment_global_err_code, 
            returnMsg: 'fail to update payment.'
          });
        }
        else{
          console.log('success update payment >');
          console.log(body);
          htmlJson(res, body);
          // res.json(body);
        }
      });

  });

app.get('/payment104', function(req, res) {
    // var orderId = req.params.orderId;
    var orderId = req.query.orderId;

    if(!orderId){
      htmlJson(res, {
        returnCode: payment_global_err_code, 
        returnMsg: 'orderId not specified.'
      });
      return;
    }
    console.log('got param > ' + orderId);

    var getOrderDetailUrl = seniorAPIUrl + '/order/' + orderId + '/detail';
    // var accessToken = req.get('Authorization').replace('Bearer', '').trim();

    request({
      url: getOrderDetailUrl,
      method: "GET",
      headers: { 
        'content-type': 'application/json', 
        'Authorization': req.get('Authorization')     // by pass request token.
      }
    }, function(err,httpResponse, orderDetail){
      if(err){
        console.log('fail to get order for id > ' + orderId);
        console.log(err);
        htmlJson(res, {
          returnCode: payment_global_err_code, 
          returnMsg: 'fail to get order detail.'
        });
      }
      else{
        console.log('success getOrderDetail > ' + orderId);
        //console.log(JSON.stringify(orderDetail));
        console.log(orderDetail);
        orderDetail = JSON.parse(orderDetail);
        if(orderDetail.returnCode === '000'){
          delete orderDetail.returnCode;
          delete orderDetail.returnMsg;
          orderDetail.url_link = url_link;
          orderDetail.url_response = url_response;
          console.log('send to payment main > ');
          console.log(JSON.stringify(orderDetail));

          /** send to payment main page **/

          var orderChkSum_param = {
            storeId: orderDetail.store_id,
            orderId: orderDetail.order_id,
            amount: orderDetail.pay_amount,
            accId: orderDetail.acc_id,
            code: orderDetail.code,
            manberSn: orderDetail.manber_sn
          };

          console.log('GET orderChkSum_param > ');
          console.log(paymemtServiceUrl + '/services/chksum/orderChkSum/' + JSON.stringify(orderChkSum_param));

          request.get({     // Account API
            url: paymemtServiceUrl + '/services/chksum/orderChkSum/' + JSON.stringify(orderChkSum_param)
          }, function(err,httpResponse,body){
            if(err){
              console.log('fail to call orderChkSum > ' + err);
              htmlJson(res, {
                returnCode: payment_global_err_code, 
                returnMsg: 'fail to process orderChkSum.'
              });
            }
            else{
              console.log("order chksum success > " + body);      //  {"result":"success","createDate":"2015-12-03 11:19:07"}
              var resp = JSON.parse(body);
              
              if(resp.result && resp.result === 'success'){
                var paramString = querysring.stringify(orderDetail);

                console.log(paymemtServiceUrl + '/main.jsp?' + paramString);
                res.redirect(paymemtServiceUrl + '/main.jsp?' + paramString);
              }else{
                console.log('fail to call orderChkSum.');
                console.log(body);
                htmlJson(res, {
                  returnCode: payment_global_err_code, 
                  returnMsg: 'fail to process orderChkSum.'
                });
              }
            }
          });
        }
        else{
          console.log('get order detail return code > ' + orderDetail);
          htmlJson(res, {
            returnCode: payment_global_err_code, 
            returnMsg: 'fail to get order detail.'
          });

          // res.json({
          //  returnCode: payment_global_err_code, 
          //  returnMsg: 'fail to get order detail.'
          // });
        }
      }
    });
  });


  var html_begin = '<!doctype html><html><body style="background-color:#555555"><div id="m104careu_login_success" style="visibility:hidden">';
  var html_end = '</div></body></html>';
  function htmlJson(res, json){
    res.send(html_begin + JSON.stringify(json) + html_end);
  }

  // ======================== for react ========================

  if (process.env.NODE_ENV !== 'production') {
    require('webpack.dev').default(app);
  }

  app.get('*', (req, res) => {
    const location = createLocation(req.url);

    let store = configureStore();

    console.log('react session > ' + JSON.stringify(req.session.auth));
    if(req.session.auth){
      console.log('setting auth ..');
      store.getState().auth = req.session.auth;
    }

    match({ routes:routes(store), location }, (err, redirectLocation, renderProps) => {
      if(err) {
        console.error(err);
        return res.status(500).end('Internal server error');
      } else if(redirectLocation) {
        res.redirect(301, redirectLocation.pathname + redirectLocation.search)
      } else if(!renderProps) {
        return res.status(404).end('Not found');
      }


      function renderView() {
        console.log('[render view] =============');
        const InitialView = (
          <Provider store={store}>
            <RoutingContext  {...renderProps} />
          </Provider>
        );

        const COMPONENT_HTML = renderToString(InitialView);
        const __INITIAL_STATE__ = store.getState();
        const WEB_CONTEXT = config.webContext;

        console.log('react session > ' + JSON.stringify(req.session.auth));
        if(req.session.auth){   // if(false){
          console.log('setting auth > ' + JSON.stringify(__INITIAL_STATE__.auth));
          __INITIAL_STATE__.auth = req.session.auth;
          res.render('index', {__INITIAL_STATE__:JSON.stringify(__INITIAL_STATE__), COMPONENT_HTML, WEB_CONTEXT});
        }
        else{
          // 未登入者，導向臨時首頁.
          res.render('temp_home', {});
        }
      }

      if(renderProps !== undefined){
        fetchComponentData(store.dispatch, renderProps.components, renderProps.params)
          // .then(renderView)
          // .then(html => res.end(html))
          .then(renderView)
          .catch(err => res.end(err.message));
      }
      else {
        return res.status(404).end('Not found');
      }
    });
  });
//});
export default server;
