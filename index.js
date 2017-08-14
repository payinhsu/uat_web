require('module').Module._initPaths();
require('babel-core/register')({});
require('babel-polyfill');

var pm2 = require('pm2');
var sendmail = require('./lib/EmailUtil');
var slackbot = require('./lib/slackbotModule');

pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  
  pm2.start({
    script    : 'app.js',         // Script to be run
    exec_mode : 'cluster',        // Allow your app to be clustered
    instances : 1,                // Optional: Scale your app by 4
    //max_memory_restart : '100M' ,  // Optional: Restart your app if it reaches 100Mo
    log_date_format : 'YYYY-MM-DD HH:mm Z'
  }, function(err, apps) {
    pm2.disconnect();   // Disconnect from PM2
    if (err) throw err
  });

  pm2.launchBus(function(err, bus) {

  bus.on('process:event', function(data) { 
     if (data.event === "exit") {
        console.log("App Crash :" + JSON.stringify(data));  
        //sendmail.sendmail("" , "microbean@gmail.com" , "Senior Web Crash" , JSON.stringify(data));   

        slackbot.sendMsg("SeniorWeb:Senior Web Crash: event: " + data.event + ", pm_exec_path: " + data.process.pm_exec_path , ":broken_heart:", function(success, slackRes){
          if(success){
            console.log("Slack Response: ", JSON.stringify(slackRes));
          }else{
            console.log("Slack error: ", JSON.stringify(slackRes));
          } 
        });                                                                                                              
      }
  });

  bus.on('log:err', function(data) { 
    if(data.data.toLowerCase().indexOf('warn') != 0){
      console.log("log:err: " + JSON.stringify(data));
      //sendmail.sendmail("" , "microbean@gmail.com" , "Senior Web 500 Error" , JSON.stringify(data)); 
      
      slackbot.sendMsg("SeniorWeb:log:err: " + JSON.stringify(data) , ":angry:", function(success, slackRes){
        if(success){
          console.log("Slack Response: ", JSON.stringify(slackRes));
        }else{
          console.log("Slack error: ", JSON.stringify(slackRes));
        } 
      });
    }
  });


  bus.on('log:out', function(data) { 
    console.log("log:out: " + JSON.stringify(data));
    /*
    slackbot.sendMsg("SeniorWeb:log:out: " + JSON.stringify(data) , null, function(success, slackRes){
        if(success){
          console.log("Slack Response: ", JSON.stringify(slackRes));
        }else{
          console.log("Slack error: ", JSON.stringify(slackRes));
        } 
    });
    */
  });

  });

});

