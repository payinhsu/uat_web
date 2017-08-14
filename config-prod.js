var localhost = {
    name: "localhost",
    localPort: 3000,
    webContext: '/',
    fakeHeadPhoto: 'https://file.104.com.tw/DocumentManagementTomcatAccess/imgs/104plus/414/821/2b6/99b02639fbdd449989e5068544ac85e111_circleHeadXL.png?c04fb39da8b3e062d3400bf720a26173&v=i25v6icffq6viuci54',
    privateAPIUrl: 'https://privateapi.104.com.tw', // 104 對外 API URL.
    seniorWebUrl: 'http://localhost:3000',
    //var paymemtServiceUrl : 'http://easypay.104.com.tw';
    issuer: 'localhost',
    paymemtServiceUrl: 'http://60.251.43.128',
    seniorAPIUrl: 'http://localhost:8080',
    masterAPIUrl: 'http://localhost:8081',
    acSamlSsoUrl: 'https://ac.104.com.tw/amlsso?RelayState=NULL',
    acSamlSsoLogoutUrl: 'https://ac.104.com.tw/samlsso-common-login?RelayState=NULL',
    acOauthConfig: { // ac oauth request info
        url: 'https://privateapi.104.com.tw/services/oauth',
        form: {
            client_id: '3WEqZBWTyxBjM_y3Ylujgc3RfI4a',
            client_secret: 'DyJU_riyhQvbwNph4S531hnrZEka',
            redirect_uri: 'http://52.192.56.20/login/callback',
            scope: 'seniorapp',
            // code:authorization_code,
            grant_type: 'authorization_code'
        }
    },
    isLocalEnv: true,
    aws_ses: {
        accessKeyId: "AKIAJ2OBUCX6LMQRDZLA",
        secretAccessKey: "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",
        host: "email-smtp.us-west-2.amazonaws.com",
        port: 25,
        defaultFrom: "careu@104.com.tw",
        region: "us-west-2"
    },
    document: {
        apiUrl: 'http://api.staging.docapi.104.com.tw/docapi/v0',
        uploadUrl: 'http://ori.staging.docapi.104.com.tw'
        //apiUrl: 'http://docapi-staging-api-1712535865.us-west-2.elb.amazonaws.com/docapi/v0',
        //uploadUrl: 'http://docapi-staging-originbucket-1s73tnifzf5z3.s3.amazonaws.com/'
    },
    // 本地開發使用 memory store
    redis: {
        host: 'cluster-redis-2-8-24.klj5yq.0001.apne1.cache.amazonaws.com',
        port: 6379
    }
}

var uwcareu = {
    name: "uwcareu",
    localPort: 3000,
    webContext: '/',
    fakeHeadPhoto: 'https://file.104.com.tw/DocumentManagementTomcatAccess/imgs/104plus/414/821/2b6/99b02639fbdd449989e5068544ac85e111_circleHeadXL.png?c04fb39da8b3e062d3400bf720a26173&v=i25v6icffq6viuci54',
    privateAPIUrl: 'https://privateapi.104.com.tw', // 104 對外 API URL.
    seniorWebUrl: 'http://uwcareu.104dev.com',
    //var paymemtServiceUrl : 'http://easypay.104.com.tw';
    issuer: 'uwcareu',
    paymemtServiceUrl: 'http://60.251.43.128',
    seniorAPIUrl: 'http://uacareu.104dev.com/api',
    masterAPIUrl: 'http://uacareu.104dev.com/api/master',
    acSamlSsoUrl: 'https://ac.104.com.tw/samlsso?RelayState=NULL',
    acSamlSsoLogoutUrl: 'https://ac.104.com.tw/samlsso-common-login?RelayState=NULL',
    acOauthConfig: { // ac oauth request info
        url: 'https://privateapi.104.com.tw/services/oauth',
        form: {
            client_id: '8S90boRGn0OiffSGYQVrjba3ewUa',
            client_secret: 'tQESpx5FLhVkCY2ZA53nWKiMTcAa',
            redirect_uri: 'http://uwcareu.104dev.com/login/callback',
            scope: 'uwcareu',
            // code:authorization_code,
            grant_type: 'authorization_code'
        }
    },
    aws_ses: {
        accessKeyId: "AKIAJ2OBUCX6LMQRDZLA",
        secretAccessKey: "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",
        host: "email-smtp.us-west-2.amazonaws.com",
        port: 25,
        defaultFrom: "careu@104.com.tw",
        region: "us-west-2"
    },
    document: {
        apiUrl: 'http://api.staging.docapi.104.com.tw/docapi/v0',
        uploadUrl: 'http://ori.staging.docapi.104.com.tw/'
    },
    redis: {
        host: 'cluster-redis-2-8-24.klj5yq.0001.apne1.cache.amazonaws.com',
        port: 6379
    }
}

// issuer, login callback url, webContext 都僅是為了 master 暫時上線版的申請，這個名稱及路徑未來正式都需要變更.
var uwcareu_test = {
    name: "uwcareu_test",
    localPort: 3009,
    webContext: '/testweb/',
    fakeHeadPhoto: 'https://file.104.com.tw/DocumentManagementTomcatAccess/imgs/104plus/414/821/2b6/99b02639fbdd449989e5068544ac85e111_circleHeadXL.png?c04fb39da8b3e062d3400bf720a26173&v=i25v6icffq6viuci54',
    privateAPIUrl: 'https://privateapi.104.com.tw', // 104 對外 API URL.
    seniorWebUrl: 'http://uwcareu.104dev.com/testweb',
    //var paymemtServiceUrl : 'http://easypay.104.com.tw';
    issuer: 'uwcareu_test',
    paymemtServiceUrl: 'http://60.251.43.128',
    seniorAPIUrl: 'http://uacareu.104dev.com/api',
    masterAPIUrl: 'http://uacareu.104dev.com/api/master',
    acSamlSsoUrl: 'https://ac.104.com.tw/samlsso?RelayState=NULL',
    acSamlSsoLogoutUrl: 'https://ac.104.com.tw/samlsso-common-login?RelayState=NULL',
    acOauthConfig: { // ac oauth request info
        url: 'https://privateapi.104.com.tw/services/oauth',
        form: {
            client_id: '8S90boRGn0OiffSGYQVrjba3ewUa',
            client_secret: 'tQESpx5FLhVkCY2ZA53nWKiMTcAa',
            redirect_uri: 'http://uwcareu.104dev.com/login/callback',
            scope: 'uwcareu',
            // code:authorization_code,
            grant_type: 'authorization_code'
        }
    },
    aws_ses: {
        accessKeyId: "AKIAJ2OBUCX6LMQRDZLA",
        secretAccessKey: "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",
        host: "email-smtp.us-west-2.amazonaws.com",
        port: 25,
        defaultFrom: "careu@104.com.tw",
        region: "us-west-2"
    },
    document: {
        apiUrl: 'http://api.staging.docapi.104.com.tw/docapi/v0',
        uploadUrl: 'http://ori.staging.docapi.104.com.tw/'
    },
    redis: {
        host: 'cluster-redis-2-8-24.klj5yq.0001.apne1.cache.amazonaws.com',
        port: 6379
    }
}

var swcareu = {
    name: "swcareu",
    localPort: 3000,
    webContext: '/',
    fakeHeadPhoto: 'https://file.104.com.tw/DocumentManagementTomcatAccess/imgs/104plus/414/821/2b6/99b02639fbdd449989e5068544ac85e111_circleHeadXL.png?c04fb39da8b3e062d3400bf720a26173&v=i25v6icffq6viuci54',
    privateAPIUrl: 'https://privateapi.104.com.tw', // 104 對外 API URL.
    seniorWebUrl: 'http://swcareu.104dev.com',
    //var paymemtServiceUrl : 'http://easypay.104.com.tw';
    issuer: 'swcareu',
    paymemtServiceUrl: 'http://60.251.43.128',
    seniorAPIUrl: 'http://sacareu.104dev.com/api',
    masterAPIUrl: 'http://sacareu.104dev.com/api/master',
    acSamlSsoUrl: 'https://ac.104.com.tw/samlsso?RelayState=NULL',
    acSamlSsoLogoutUrl: 'https://ac.104.com.tw/samlsso-common-login?RelayState=NULL',
    acOauthConfig: { // ac oauth request info
        url: 'https://privateapi.104.com.tw/services/oauth',
        form: {
            client_id: '1FHOwnmlMkO9OhLJ0mzNeU0Yp4Ma',
            client_secret: '0vnx0njuhfNrheJRF2Mi_cIfVYYa',
            redirect_uri: 'http://swcareu.104dev.com/login/callback',
            scope: 'swcareu',
            // code:authorization_code,
            grant_type: 'authorization_code'
        }
    },
    aws_ses: {
        accessKeyId: "AKIAJ2OBUCX6LMQRDZLA",
        secretAccessKey: "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",
        host: "email-smtp.us-west-2.amazonaws.com",
        port: 25,
        defaultFrom: "careu@104.com.tw",
        region: "us-west-2"
    },
    document: {
        apiUrl: 'http://api.staging.docapi.104.com.tw/docapi/v0',
        uploadUrl: 'http://ori.staging.docapi.104.com.tw/'
    },
    redis: {
        host: 'cluster-redis-2-8-24.klj5yq.0001.apne1.cache.amazonaws.com',
        port: 6379
    }
}

var swcareu_test = {
    name: "swcareu_test",
    localPort: 3009,
    webContext: '/testweb/',
    fakeHeadPhoto: 'https://file.104.com.tw/DocumentManagementTomcatAccess/imgs/104plus/414/821/2b6/99b02639fbdd449989e5068544ac85e111_circleHeadXL.png?c04fb39da8b3e062d3400bf720a26173&v=i25v6icffq6viuci54',
    privateAPIUrl: 'https://privateapi.104.com.tw', // 104 對外 API URL.
    seniorWebUrl: 'http://swcareu.104dev.com/testweb',
    //var paymemtServiceUrl : 'http://easypay.104.com.tw';
    issuer: 'swcareu_test',
    paymemtServiceUrl: 'http://60.251.43.128',
    seniorAPIUrl: 'http://sacareu.104dev.com/api',
    masterAPIUrl: 'http://sacareu.104dev.com/api/master',
    acSamlSsoUrl: 'https://ac.104.com.tw/samlsso?RelayState=NULL',
    acSamlSsoLogoutUrl: 'https://ac.104.com.tw/samlsso-common-login?RelayState=NULL',
    acOauthConfig: { // ac oauth request info
        url: 'https://privateapi.104.com.tw/services/oauth',
        form: {
            client_id: '1FHOwnmlMkO9OhLJ0mzNeU0Yp4Ma',
            client_secret: '0vnx0njuhfNrheJRF2Mi_cIfVYYa',
            redirect_uri: 'http://swcareu.104dev.com/login/callback',
            scope: 'swcareu',
            // code:authorization_code,
            grant_type: 'authorization_code'
        }
    },
    aws_ses: {
        accessKeyId: "AKIAJ2OBUCX6LMQRDZLA",
        secretAccessKey: "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",
        host: "email-smtp.us-west-2.amazonaws.com",
        port: 25,
        defaultFrom: "careu@104.com.tw",
        region: "us-west-2"
    },
    document: {
        apiUrl: 'http://api.staging.docapi.104.com.tw/docapi/v0',
        uploadUrl: 'http://ori.staging.docapi.104.com.tw/'
    },
    redis: {
        host: 'cluster-redis-2-8-24.klj5yq.0001.apne1.cache.amazonaws.com',
        port: 6379
    }
}

var careu = {
    name: "careu",
    localPort: 3000,
    webContext: '/',
    fakeHeadPhoto: 'https://file.104.com.tw/DocumentManagementTomcatAccess/imgs/104plus/414/821/2b6/99b02639fbdd449989e5068544ac85e111_circleHeadXL.png?c04fb39da8b3e062d3400bf720a26173&v=i25v6icffq6viuci54',
    privateAPIUrl: 'https://privateapi.104.com.tw', // 104 對外 API URL.
    seniorWebUrl: 'http://careu.104.com.tw',
    //var paymemtServiceUrl : 'http://easypay.104.com.tw';
    issuer: 'careu',
    paymemtServiceUrl: 'http://60.251.43.128',
    seniorAPIUrl: 'https://api.careu.104.com.tw/api',
    masterAPIUrl: 'https://api.careu.104.com.tw/api/master',
    acSamlSsoUrl: 'https://ac.104.com.tw/samlsso?RelayState=NULL',
    acSamlSsoLogoutUrl: 'https://ac.104.com.tw/samlsso-common-login?RelayState=NULL',
    acOauthConfig: { // ac oauth request info
        url: 'https://privateapi.104.com.tw/services/oauth',
        form: {
            client_id: 'tApfgftOImidfouM0NGr0ROVKysa',
            client_secret: 'fNRwXYneUEo6Anfsz6LGeoDk4Zsa',
            redirect_uri: 'https://careu.104.com.tw/login/callback',
            scope: 'careu',
            // code:authorization_code,
            grant_type: 'authorization_code'
        }
    },
    aws_ses: {
        accessKeyId: "AKIAJ2OBUCX6LMQRDZLA",
        secretAccessKey: "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",
        host: "email-smtp.us-west-2.amazonaws.com",
        port: 25,
        defaultFrom: "careu@104.com.tw",
        region: "us-west-2"
    },
    document: {
        apiUrl: 'http://docapi-api-1899905132.us-west-2.elb.amazonaws.com',
        uploadUrl: 'http://docapi-originbucket-66pqdvc62uw2.s3.amazonaws.com/'
    },
    redis: {
        host: 'cluster-redis-2-8-24.klj5yq.0001.apne1.cache.amazonaws.com',
        port: 6379
    }
}


/** set this field to switch env */
module.exports = localhost; // localhost, uwcareu, swcareu, careu (uwcareu_test, swcareu_test 目前是暫時用途.)
