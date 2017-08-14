/*
*  copy from api mananger
*  Andy
*/
var https = require('https');

module.exports = {

    sendMsg : function(message, icon, callback){
        console.log("sendMsg: " + JSON.stringify(message));
		if(!icon){
			icon = ":monkey_face:";
		}

        var msgFormat = {
            "text": message,
			"icon_emoji": icon
        };

        var post_data = JSON.stringify(msgFormat);
        
        //https://hooks.slack.com/services/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
        // An object of options to indicate where to post to
        var post_options = {
            host: 'hooks.slack.com',
            //port: '80',
            path: '/services/T12QV91J6/B275NB8TA/3Dws9NYa9T03l9o6YKqDtt6s',
            method: 'POST',
            //rejectUnauthorized: false,
            headers: {
                //'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
        };

        // Set up the request
        var body = '';
        var post_req = https.request(post_options, function(res) {
            console.log('Slack STATUS: ' + res.statusCode);
            console.log('Slack HEADERS: ' + JSON.stringify(res.headers));

            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                body += chunk;
                //console.log('Response: ' + chunk);
                
            });

            res.on('end', function() {
                //console.log("Slack Response: ", body);
                callback(true, body);
            }).on('error', function(e) {
                //console.log("Slack error: ", e);
                callback(false, e);
            }); 
            
        });
        /*
        post_req.on('socket', function (socket) {
            socket.setTimeout(30);  
            socket.on('timeout', function() {
                post_req.abort();
            });
        });
        */

        // post the data
        post_req.write(post_data);
        post_req.end();
        //callback(true, );
    }
};


