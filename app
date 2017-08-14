#!/bin/bash
case "$1" in
	-h|--help)
         echo 'avaliable commands: "start", "stop", "deploy" and "status".'
         exit 0
         ;;
	start)
                NODE_ENV=production NODE_PATH=$NODE_PATH:./shared ./node_modules/.bin/naught start --ipc-file server.ipc  --stdout stdout.log --stderr stderr.log ./index.js --harmory 
		;;
	stop)
		./node_modules/.bin/naught stop  server.ipc	
		;;
	deploy)
		./node_modules/.bin/naught deploy  server.ipc		
		;;
	status)
		./node_modules/.bin/naught status  server.ipc
		;;
esac
