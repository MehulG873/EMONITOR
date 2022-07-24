var request = require('request-promise');
const url = require('url');
const path = require('path');

const {spawn} = require('child_process');
const { parse } = require('path');
const nc=require('node-notifier');
const notifier = new nc.NotificationCenter();
const { errorMonitor } = require('events');


const { app, BrowserWindow, Menu, ipcMain, Notification} = require(
    'electron');

var lastAngry = 0


let MainWindow;
let SettingsWindow;
let worker;
var recording = false;

// Listen for the app to ready:
app.on('ready', function () {
    // Create new window:
    MainWindow = new BrowserWindow({
        webPreferences: {nodeIntegration: true, contextIsolation: false, enableRemoteModule: true} });
    // Load html file into window
    MainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'HTML Templates/Home.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Quit app when cloed
    MainWindow.on('closed', function(){
        app.quit(); 
    })

    MainWindow.on('close', function(){
        killServer()
    })

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert Menu
    Menu.setApplicationMenu(mainMenu);
    const childPython = spawn('python3', ['backend/server.py']);
    console.log("SPAWNED SERVER")
    childPython.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
    })
    childPython.stderr.on('error', (error) => {
        console.log(`${error}`)
    } )
    childPython.on("close", (code) => {
        console.log(`exited on code: ${code}`)
        exitLoading()
    })
    startLoop()
});

function exitLoading(){
    MainWindow.webContents.send('exit:loading');
}

function startLoop(){
    setTimeout(() => {
        // console.log("hi");
        if(recording){
            const Data = record();
            isAngry()
        }
        startLoop();
    }, 500)
}

function sendAngryNotification(){
    lastAngry = 60
    new Notification({title: "Emonitor", body:'Woah! Calm down and try to smile!'}).show()
}

// Create Main Menu Template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

async function isAngry() {

	// This variable contains the data
	// you want to send
	var data = {
	}

	var options = {
		method: 'POST',
        timeout: 180000,
		// http:flaskserverurl:port/route
		uri: 'http://127.0.0.1:5000/isangry',
        
		// Automatically stringifies
		// the body to JSON
		json: true
	};

	var sendrequest = await request(options)

		// The parsedBody contains the data
		// sent back from the Flask server
		.then(function (parsedBody) {
			// console.log(parsedBody);
			
			// You can do something with
			// returned data
			let result;
			result = parsedBody['isangry'];
            console.log(result)
            console.log(typeof(result))
            if (result && lastAngry <= 0) {
                sendAngryNotification()
            }
            else{
                lastAngry = lastAngry - 1
            }
            return result;
		})
		.catch(function (err) {
			console.log(err);
            return 0;
		});
}

async function record() {

	// This variable contains the data
	// you want to send
	var data = {
        "photoSize": 1
	}

	var options = {
		method: 'POST',
        timeout: 180000,
		// http:flaskserverurl:port/route
		uri: 'http://127.0.0.1:5000/takeimage',
		body: data,
        
		// Automatically stringifies
		// the body to JSON
		json: true
	};

	var sendrequest = await request(options)

		// The parsedBody contains the data
		// sent back from the Flask server
		.then(function (parsedBody) {
			// console.log(parsedBody);
			
			// You can do something with
			// returned data
			let result;
			result = parsedBody['emotions'];
			console.log("Sum of Array from Python: ", result[0], result[1], result[2], result[3], result[4], result[5], result);
            MainWindow.webContents.send("data:update", result[5], result[2], result[7], result[6], result[4], result[3]);
            return parsedBody['emotions'];
		})
		.catch(function (err) {
			console.log(err);
            return 0;
		});
}

async function summarize(emotion1, emotion2, emotion3, comparing){
	var data = {
        "emotion1": emotion1,
        "emotion2": emotion2,
        "emotion3": emotion3,
        "comparing": comparing
	}

    var options = {
		method: 'POST',

		// http:flaskserverurl:port/route
		uri: 'http://127.0.0.1:5000/summarize',
		body: data,

		// Automatically stringifies
		// the body to JSON
		json: true
	};

	var sendrequest = await request(options)

		// The parsedBody contains the data
		// sent back from the Flask server
		.then(function (parsedBody) {
			let result;
			console.log(parsedBody);
            appEmo = parsedBody['result'];
            console.log("RESULT ARRIVED");
            console.log(appEmo);
            var keys = Object.keys(appEmo);
            var values = Object.values(appEmo);
            console.log(keys);
            console.log(values);
            var topSixKeys = keys.slice(Math.max(-5, -keys.length))
            var topSixValues = values.slice(Math.max(-5, -keys.length))
            MainWindow.webContents.send("emotion:summary", topSixKeys, topSixValues)
            return result;
			
			// You can do something with
			// returned data
		})
		.catch(function (err) {
			console.log(err);
            return 0;
		});
}


async function killServer() {
    
    var options = {
		method: 'POST',

		// http:flaskserverurl:port/route
		uri: 'http://127.0.0.1:5000/kill',

		// Automatically stringifies
		// the body to JSON
		json: true
	};

	var sendrequest = await request(options)

		// The parsedBody contains the data
		// sent back from the Flask server
		.then(function (parsedBody) {
			console.log(parsedBody);
			
			// You can do something with
			// returned data
			let result;
		})
		.catch(function (err) {
			console.log(err);
		});
}


async function endSession(){
    console.log("ended Session")

    var options = {
		method: 'POST',

		// http:flaskserverurl:port/route
		uri: 'http://127.0.0.1:5000/endsession',

		// Automatically stringifies
		// the body to JSON
		json: true
	};

	var sendrequest = await request(options)

		// The parsedBody contains the data
		// sent back from the Flask server
		.then(function (parsedBody) {
			console.log(parsedBody);
			
			// You can do something with
			// returned data
			let result;
		})
		.catch(function (err) {
			console.log(err);
		});
}

ipcMain.on("recorder:change", function(e){
    recording=!recording;
    if (!recording){
        endSession();
    }
});

function createSettingsWindow(){
    // Create new window:
    SettingsWindow = new BrowserWindow({
        width: 1200, 
        height: 720, 
        title: 'Settings',
        resizable: false, 
        fullscreen: false,
        webPreferences: {nodeIntegration: true, contextIsolation:false} 
    });
    // Load html file into window
    SettingsWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'HTML Templates/Settings.html'),
        protocol: 'file:',
        slashes: true
    }));



    //Garbage Collection
    SettingsWindow.on('close', function(){
        SettingsWindow=null
    });
}

ipcMain.on("open:settings", function(e){
    console.log("ok");
    if(SettingsWindow==null){
        createSettingsWindow();
    }
    else{
        SettingsWindow.show();
    }
})

ipcMain.on("summary:emotions", function(e, emotion1, emotion2, emotion3, comparing){
    console.log(emotion1, emotion2, emotion3)
    var appEmo = summarize(emotion1, emotion2, emotion3, comparing)
    console.log(appEmo)
    console.log(typeof appEmo)
})

if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',      
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',

                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }, 
            {
                role: 'reload'
            }
        ]
    });
}