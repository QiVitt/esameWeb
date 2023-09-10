build_function(){
    cd /usr/src/client
    npm i
    npm run build
    cp -r /usr/src/client/dist/* /usr/src/app/client
}
check_mock(){
  fileFirst="first.run"
	if [ ! -f "$fileFirst" ]; then
	  touch "$fileFirst"
		node mock.js
	fi
}

build_function &
cd /usr/src/app
npm i
check_mock &
nodemon --watch . -e js app.js
