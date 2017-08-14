import config  from '../config-prod.js';
import aws from 'aws-sdk';

export function sendmail(FROM , TO , SUBJECT , BODY , callback){
	aws.config.update({accessKeyId: config.aws_ses.accessKeyId, secretAccessKey: config.aws_ses.secretAccessKey, region: config.aws_ses.region});
	let ses = new aws.SES({apiVersion: '2010-12-01'});
	let to = [];
	let from = FROM;

	if (from == undefined || from == "") 
		from = config.aws_ses.defaultFrom;

		to = TO.split(",");
		console.log('aws->sendEmail:' + to);

		ses.sendEmail( { 
			 Source: from, 
			 Destination: { ToAddresses: to},
			 Message: {
				 Subject:{
					Data: SUBJECT
				 },
				 Body: {
					 //Text: {
						 //Data: 'Stop your messing around'
					 //},
					 Html:{
						   Data: BODY
					 }
				}
			 }
		  }
		  , function(err, data) {
			  if(err){
				  console.log(err);
				  //console.log(opsworks.endpoint);
			  }else{
				  console.log('Email sent');
				 
			  }

			  if (callback != undefined)
			  	callback(err,data);
		});
	
};