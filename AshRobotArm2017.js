//
//	USAGE
//
//C:\Users\atul>D:
//1. D:
//2. cd D:\AshData\Science Olympiad\robotArm\AshRobotArm
//3. node AshRobotArm2017.js
//
//
//D:\AshData\Science Olympiad\robotArm\AshRobotArm>node AshRobotArm2017.js
//
// use http://localhost:8888/
//

//
//	LIBRARIES
//
var five = require("johnny-five");
var Leap = require("leapjs");

//var http = require("http");
var fs = require('fs');
var qs = require("querystring");
var url = require('url');

var express = require('express');
var path = require('path');

//
//	CONSTANTS
//
var ARDUINO_COM_PORT = '/dev/cu.usbmodem449';	// MAC
//var ARDUINO_COM_PORT = 'COM7'; 				// WINDOWS 
var ANGLE_INC = 1;

// ARDUINO PINS ASSIGNED
var PIN_BASE = 4;
var PIN_VERT = 7;
var PIN_VERT_RIGHT = 6;
var PIN_ELBOW = 8;
var PIN_WRIST = 9;
var PIN_SPIN = 10;
var PIN_GRIP = 11;
var PIN_DISPENSER = 12;
var PIN_ANTENNA = 13;

var PIN_BASE_TEMP = "A5";
var PIN_BASE_TEMP2 = "A1";
// 12 UNUSED

// Names given to Servo for logging purposes and find corresponding angles.
var SERVO_BASE = 'servoBase';
var SERVO_VERT = 'servoVert';
var SERVO_ELBOW = 'servoElbow';
var SERVO_WRIST = 'wristServo';
var SERVO_SPIN = 'spinServo';
var SERVO_GRIP = 'gripServo';
var SERVO_DISPENSER = 'dispenserServo';
var SERVO_ANTENNA = 'antennaServo';

//
//	SERVO ANGLES
//
var GRIP_OPEN = 60;
var GRIP_CLOSE = 145;

var DISPENSE_PICKUP = 20;
var DISPENSE_DROP = 85;

var SPIN_PICK = 11;
var SPIN_DROP = 180;

var ANTENNA_OPEN = 120;
var ANTENNA_CLOSE = 20;

var TRAVEL_VERT = 62;

var SW_BASE_LOC = 42;
var SW_VERT_LOC = 35;
var SW_ELBOW_LOC = 141;
var SW_WRIST_LOC = 148;
var SW_SPIN_LOC = 17;

var W_BASE_LOC = 92;
var W_VERT_LOC = 40;
var W_ELBOW_LOC = 141;
var W_WRIST_LOC = 135;
var W_SPIN_LOC = 14;

var HOME_BASE_LOC = 82;
var HOME_VERT_LOC = 107;
var HOME_ELBOW_LOC = 6;
var HOME_WRIST_LOC = 94-45;

var OFF_BASE_LOC = 107;
var OFF_VERT_LOC = 151;
var OFF_ELBOW_LOC = 119;
var OFF_WRIST_LOC = 144;

var N_BASE_LOC = 117;
var N_VERT_LOC = 35;
var N_ELBOW_LOC = 86;
var N_WRIST_LOC = 92;
var N_SPIN_LOC = 14;

var E_BASE_LOC = 140;
var E_VERT_LOC = 41;
var E_ELBOW_LOC = 125;
var E_WRIST_LOC = 133;
var E_SPIN_LOC = 19;

var S_BASE_LOC = 129;
var S_VERT_LOC = 40;
var S_ELBOW_LOC = 109;
var S_WRIST_LOC = 16;
var S_SPIN_LOC = 180; 

//TARGETS

var T1_BASE_LOC = 130;
var T1_VERT_LOC = 44;
var T1_ELBOW_LOC = 115;
var T1_WRIST_LOC = 173-45;

var T2_BASE_LOC = 128;
var T2_VERT_LOC = 45;
var T2_ELBOW_LOC = 130;
var T2_WRIST_LOC = 180-45;

var T3_BASE_LOC = 128;
var T3_VERT_LOC = 46;
var T3_ELBOW_LOC = 139;
var T3_WRIST_LOC = 180-45;

var T4_BASE_LOC = 126;
var T4_VERT_LOC = 50;
var T4_ELBOW_LOC = 150;
var T4_WRIST_LOC = 170-45;

var T5_BASE_LOC = 125;
var T5_VERT_LOC = 43;
var T5_ELBOW_LOC = 103;
var T5_WRIST_LOC = 159-45;

//
//		VARIABLES
//
var servoBase, servoVert, servoVertRight, servoElbow, servoWrist, servoSpin, servoGrip, servoDispenser, servoAntenna;
var servos, animation;

var baseServoAngle = 111;
var vertServoAngle = 57; 
var elbowServoAngle = 91;
var wristServoAngle = 173-45;
var spinServoAngle = SPIN_PICK;
var gripServoAngle = GRIP_OPEN; 
var dispenserServoAngle = DISPENSE_PICKUP;

var CurrentTimeElapsed = 0;

var baseTemperature = 0;
var baseTemperature2 = 0;

//
//	JOHNY-FIVE (http://johnny-five.io/api/servo/)
//

var board = new five.Board(
	{
		port: ARDUINO_COM_PORT
	}
);


board.on("ready", function () {

	//servoBase = new five.Servo(PIN_BASE);
	//servoVert = new five.Servo(PIN_VERT);
	//servoElbow = new five.Servo(PIN_ELBOW);
	//servoWrist = new five.Servo(PIN_WRIST);

	servos = new five.Servos([PIN_BASE, PIN_VERT, PIN_ELBOW, PIN_WRIST, PIN_VERT_RIGHT, PIN_SPIN, PIN_GRIP, PIN_DISPENSER, PIN_ANTENNA]);
	animation = new five.Animation(servos);

	servoBase = servos[0];
	servoVert = servos[1];
	servoElbow = servos[2];
	servoWrist = servos[3];
	servoVertRight = servos[4];
	servoSpin = servos[5];
	servoGrip = servos[6];
	servoDispenser = servos[7];
	servoAntenna = servos[8];

	servoVertRight.invert = true;

	// STARTOFF 	
	servoBase.to(baseServoAngle);//, 2000);
	servoVert.to(vertServoAngle);//, 2000);
	servoVertRight.to(vertServoAngle);//, 2000);
	servoElbow.to(elbowServoAngle);//, 2000);
	servoWrist.to(wristServoAngle);//, 2000);
	servoSpin.to(SPIN_PICK);//, 2000);
	servoGrip.to(gripServoAngle);//, 2000);
	servoDispenser.to(dispenserServoAngle);//, 2000);
	servoAntenna.to(ANTENNA_OPEN);
	
	reloadAllServoPhyicalLocation();
	//logMsg("Vert: " + vertServoAngle);

	//gotoStartupLocation();

	 var baseThermometer = new five.Thermometer({
    		pin: PIN_BASE_TEMP
  		});

	var baseThermometer2 = new five.Thermometer({
    		pin: PIN_BASE_TEMP2
  		});

	baseThermometer.on("data", function() {
		baseTemperature = ConvertToTemp(this.C);
    	//console.log("Temp1: %d", getBaseTempString());
  	});

	baseThermometer2.on("data", function() {
			baseTemperature2 = ConvertToTemp(this.C);
			//console.log("Temp2: %d", getBaseTemp2String());
	});
});

function ConvertToTemp(count)
{
	// 70 deg maps to 278 counts; 104 deg maps to 900 counts
	// Use interpolation between two points
	// Slope = ((900-278) / (104-70) => 18.29
	// solve for b (Y Intercept)
	// b = -1002.3
	var temp = (count + 1002.3)/18.29;
	return temp;
}
//
// SERVO CONTROLS
//
function setAllServoPosition(baseA, vertA, elbowA, wristA) {

	setBaseServoAngle(baseA);

	setVertServoAngle(vertA);

	setElbowServoAngle(elbowA);

	setWristServoAngle(wristA);
}

function setAllServoPower(state) {
	moveToOffPosition();
	servoBase.stop();
	servoVert.stop();
	servoVertRight.stop();
	servoElbow.stop();
	servoWrist.stop();
	servoSpin.stop();
	servoGrip.stop();
	servoDispenser.stop();
	servoAntenna.stop();
}

function setBaseServoAngle(angle) {
	setServoPosition(servoBase, angle, SERVO_BASE);
	baseServoAngle = angle;
}
function setVertServoAngle(angle) {
	setServoPosition(servoVert, angle, SERVO_VERT);
	vertServoAngle = angle;
}
function setElbowServoAngle(angle) {
	setServoPosition(servoElbow, angle, SERVO_ELBOW);
	elbowServoAngle = angle;
}

function setWristServoAngle(angle) {

	setServoPosition(servoWrist, angle, SERVO_WRIST);
	wristServoAngle = angle;
}

function setSpinServoAngle(angle) {

	setServoPosition(servoSpin, angle, SERVO_SPIN);
	spinServoAngle = angle;
}

function setGripServoAngle(angle) {

	setServoPosition(servoGrip, angle, SERVO_GRIP);
	gripServoAngle = angle;
}

function setDispenserServoAngle(angle) {

	setServoPosition(servoDispenser, angle, SERVO_DISPENSER);
	dispenserServoAngle = angle;
}

function getPrevServoAngle(servoName) {
	switch (servoName) {
		case SERVO_BASE:
			return baseServoAngle;

		case SERVO_VERT:
			return vertServoAngle;

		case SERVO_ELBOW:
			return elbowServoAngle;

		case SERVO_WRIST:
			return wristServoAngle;

		default:
			return 0;
	}
}

var timeForEachAngle = 40.0; // 180 degree change should take 3000 ms. 60 deg per 1000ms. 1 degre in 100/6 second.
function setServoPosition(servo, servoAngle, servoName) {

	var prevAngle = getPrevServoAngle(servoName);

	var angleChange = Math.abs(servoAngle - prevAngle);
	var timeToTake = 0.0; // Right away
	var servoRight = null; 

	switch (servoName) {
		
		case SERVO_VERT:
			servoRight = servoVertRight;
			timeToTake = angleChange * timeForEachAngle;
			break;
		case SERVO_BASE:
		case SERVO_ELBOW:
			timeToTake = angleChange * timeForEachAngle;
			break;

		case SERVO_WRIST:
			timeToTake = 0;
			break;
	}

	logMsg(servoName + " from: " + prevAngle + " to: " + servoAngle + " in: " + timeToTake);
	servo.to(servoAngle, timeToTake);

	if (servoRight != null)
	{
		var oppAng = OppAngle(servoAngle);
		servoRight.to(oppAng, timeToTake);
	}
}

function OppAngle(angle)
{
	if (angle == null)
		return null;

	var oppAng = 180-angle;
	return oppAng;
}


//
//	HTTP APP
//
var msgData = '';
var HTTP_LISTEN_PORT = 8888;

var app = express();

// Define the port to run on
app.set('port', HTTP_LISTEN_PORT);
app.use(express.static(path.join(__dirname, 'public')));

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  logMsg("Listening on: " + port);
});


app.all('/setServoAngle', function (request, response, next) {
  
  logMsg("path: " + path);
  var userData = '';
	var theUrl = url.parse(request.url);
	var path = theUrl.pathname;
	var queryObj = qs.parse(theUrl.query);


  	processUserAllAnglesChange(queryObj);

		response.writeHead(200, { "Content-Type": "application/json" });
		response.write(JSON.stringify("No response Needed (Ashray)"));
		response.end();

  next() // pass control to the next handler
});

app.all('/getNewData', function (request, response, next) {

//logMsg("path: " + path);
  	var toSend = buildNewDataToSend();
		var strToSend = JSON.stringify(toSend);

		//logMsg("Returning: " + strToSend);
		response.writeHead(200, { "Content-Type": "application/json" });
		response.write(strToSend);
		response.end();

  next() // pass control to the next handler
});


app.all('/', function (request, response) {
  //logMsg("request.method: " + request.method);
	var userData = '';
	var theUrl = url.parse(request.url);
	var path = theUrl.pathname;
	var queryObj = qs.parse(theUrl.query);

	logMsg("path: " + path);

	request.on("data", function (data) {
		//logMsg("data: " + data);
		userData += data;
	});

	request.on('end', function () {
		if (userData) {
			var formData = qs.parse(userData);
			userProcessAction(formData, response);
		}

		fs.readFile('WebAshRobotArm2017.html', function (err, data) {

			var str = data.toString();

			var str = str.replace("VAR_BASE_SERVO_ANGLE", baseServoAngle.toFixed(0));
			str = str.replace("VAR_VERT_SERVO_ANGLE", vertServoAngle.toFixed(0));
			str = str.replace("VAR_ELBOW_SERVO_ANGLE", elbowServoAngle.toFixed(0));
			str = str.replace("VAR_WRIST_SERVO_ANGLE", wristServoAngle.toFixed(0));
			str = str.replace("VAR_SPIN_SERVO_ANGLE",  spinServoAngle.toFixed(0));
			str = str.replace("VAR_GRIP_SERVO_ANGLE",  gripServoAngle.toFixed(0));
			str = str.replace("VAR_DISPENSER_SERVO_ANGLE",  dispenserServoAngle.toFixed(0));

			str = str.replace("VAR_SERVER_STATUS_MSG", msgData);
			str = str.replace("VAR_CURRENT_TIME_ELAPSED", CurrentTimeElapsed.toFixed(0));

			str = str.replace("VAR_CURRENT_BASE_TEMP", getBaseTempString());
			str = str.replace("VAR_CURRENT_BASE_TEMP2", getBaseTemp2String());

			//var htmlToUse = generateHtmlForUser();
			response.writeHead(200, { "Content-Type": "text/html" });
			//response.write(htmlToUse);
			response.write(str);
			response.end();
		});
	});
});


function logMsg(msg) {
	msgData = msg;
	console.log(msgData);
}

//
// USER ACTIONS
//
function userProcessAction(formData, response) {
	if (!formData)
		return;

	userClickLocationButton(formData);

	userSliderChange(formData);
}

function processUserAllAnglesChange(queryObj) {
	var i = 0;
	for (var key in queryObj) {
		switch (i) {
			case 0:
				var angleStr = queryObj[key];
				setBaseServoAngle(parseInt(angleStr));
				break;
			case 1:
				var angleStr = queryObj[key];
				setVertServoAngle(parseInt(angleStr));
				break;
			case 2:
				var angleStr = queryObj[key];
				setElbowServoAngle(parseInt(angleStr));
				break;
			case 3:
				var angleStr = queryObj[key];
				setWristServoAngle(parseInt(angleStr));
				break;
			case 4:
				var angleStr = queryObj[key];
				setSpinServoAngle(parseInt(angleStr));
				break;
			case 5:
				var angleStr = queryObj[key];
				setGripServoAngle(parseInt(angleStr));
				break;
			case 6:
				var angleStr = queryObj[key];
				setDispenserServoAngle(parseInt(angleStr));
				break;
		}
		i++;
	}
}

function getBaseTempString()
{
	return baseTemperature.toFixed(1);
}

function getBaseTemp2String()
{
	return baseTemperature2.toFixed(1);
}

function buildNewDataToSend(){

	reloadAllServoPhyicalLocation();

	var newData    = [        
        {	"baseTemp" :  getBaseTempString(),
			"baseTemp2" :  getBaseTemp2String(),
			"servoBase" : baseServoAngle.toFixed(0),
			"servoVert" : vertServoAngle.toFixed(0),
			"servoElbow" : elbowServoAngle.toFixed(0),
			"wristServo" : wristServoAngle.toFixed(0),
			"spinServo" : spinServoAngle.toFixed(0),
			"gripServo" : gripServoAngle.toFixed(0),
			"dispenserServo" : dispenserServoAngle.toFixed(0),
			"msgData" : msgData			
		}        
    ];

	return newData;
}
//
//	Kickoff using Animations
//

// GOOD
function prepWest() {

	logMsg("WEST PREP ...");
	animation.stop();

	var vertPoint2 = TRAVEL_VERT;
	var vertPoint4 = W_VERT_LOC;

	var baseNoChangeAngle = baseServoAngle;
	var elbowNoChangeAngle = elbowServoAngle;
	var wristNoChangeAngle = wristServoAngle;
	var spinNoChangeAngle = spinServoAngle;

	var aSegment = {
		duration: 2500,
		cuePoints: [0, .25, .65,  1],
		keyFrames: [
			[null, {degrees: baseNoChangeAngle}, 	{ degrees: W_BASE_LOC },	null					], // HORIZ
			[null, { degrees: vertPoint2}, 			{ degrees: vertPoint2}, 	{ degrees: vertPoint4 }	], // VERT
			[null, { degrees: elbowNoChangeAngle},	{ degrees: W_ELBOW_LOC },	null					], // ELBOW
			[null, { degrees: wristNoChangeAngle},	{ degrees: W_WRIST_LOC }, 	null					], // WRIST
			[null, { degrees: vertPoint2}, 			{ degrees: vertPoint2 }, 	{ degrees: vertPoint4 }	], // VERT-RIGHT
			[null, { degrees: spinNoChangeAngle},	{ degrees:W_SPIN_LOC} , 	null					], // SPIN
			[null, { degrees:GRIP_OPEN}, 			null,						null					], // GRIP
			[null, { degrees:DISPENSE_DROP}, 		null,						null					] // DISPENSER
		],
		oncomplete: function () {
			//reloadAllServoPhyicalLocation();
			logMsg("West Prep done.")
		}
	}

	animation.enqueue(aSegment);
}

function prepEast() {

	logMsg("EAST PREP ...");
	animation.stop();

	var vertPoint2 = TRAVEL_VERT;
	var vertPoint4 = E_VERT_LOC;

	var baseNoChangeAngle = baseServoAngle;
	var elbowNoChangeAngle = elbowServoAngle;
	var wristNoChangeAngle = wristServoAngle;
	var spinNoChangeAngle = spinServoAngle;

	var aSegment = {
		duration: 2500,
		cuePoints: [0, .25, .65, 1],
		keyFrames: [
			[null, { degrees: baseNoChangeAngle},	{ degrees: E_BASE_LOC }, 	null,  					], // HORIZ
			[null, { degrees: vertPoint2}, 			{ degrees: vertPoint2}, 	{ degrees: vertPoint4}	], // VERT
			[null, { degrees: elbowNoChangeAngle},	{ degrees: E_ELBOW_LOC },  	null,					], // ELBOW
			[null, { degrees: wristNoChangeAngle}, 	{ degrees: E_WRIST_LOC }, 	null,					], // WRIST
			[null, { degrees: vertPoint2}, 			{ degrees: vertPoint2},  	{ degrees: vertPoint4}	], // VERT-RIGHT
			[null, { degrees: spinNoChangeAngle} , 	{ degrees:E_SPIN_LOC}, 		null, 					], // SPIN
			[null, { degrees:GRIP_OPEN}, 			null,				 		null,					], // GRIP
			[null, { degrees:DISPENSE_DROP}, 		null, 						null, 					] // DISPENSER
		],
		oncomplete: function () {
			//reloadAllServoPhyicalLocation();
			logMsg("East Prep done.")
		}
	}

	animation.enqueue(aSegment);
}

function prepNorth() {

	logMsg("NORTH PREP ...");
	animation.stop();

	var vertPoint2 = TRAVEL_VERT;
	var vertPoint4 = N_VERT_LOC;

	var baseNoChangeAngle = baseServoAngle;
	var elbowNoChangeAngle = elbowServoAngle;
	var wristNoChangeAngle = wristServoAngle;
	var spinNoChangeAngle = spinServoAngle;

	var aSegment = {
		duration: 2500,
		cuePoints: [0, .25, .65, 1],
		keyFrames: [
			[null, { degrees: baseNoChangeAngle},	{ degrees: N_BASE_LOC }, 	null], // HORIZ
			[null, { degrees: vertPoint2}, 			{ degrees: vertPoint2},		{ degrees: vertPoint4 }	], // VERT
			[null, { degrees: elbowNoChangeAngle},	{ degrees: N_ELBOW_LOC },	null], // ELBOW
			[null, { degrees: wristNoChangeAngle}, 	{ degrees: N_WRIST_LOC },	null,					], // WRIST
			[null, { degrees: vertPoint2}, 			{ degrees: vertPoint2},		{ degrees: vertPoint4 }	], // VERT-RIGHT
			[null, { degrees: spinNoChangeAngle} , 	{ degrees:N_SPIN_LOC}, 		null, 					], // SPIN
			[null, { degrees:GRIP_OPEN}, 			null,				 		null,					], // GRIP
			[null, { degrees:DISPENSE_DROP}, 		null, 						null, 					] // DISPENSER
		],
		oncomplete: function () {
			//reloadAllServoPhyicalLocation();
			logMsg("North Prep done.")
		}
	}

	animation.enqueue(aSegment);
}

function prepSouthWest() {

	logMsg("SW PREP ...");
	animation.stop();

	var vertPoint2 = TRAVEL_VERT;
	var vertPoint4 = SW_VERT_LOC;

	var baseNoChangeAngle = baseServoAngle;
	var elbowNoChangeAngle = elbowServoAngle;
	var wristNoChangeAngle = wristServoAngle;
	var spinNoChangeAngle = spinServoAngle;

	var aSegment = {
		duration: 3000,
		cuePoints: [0, .33, .65, 1],
		keyFrames: [
			[null, { degrees: baseNoChangeAngle},	{ degrees: SW_BASE_LOC }, 	null], // HORIZ
			[null, { degrees: vertPoint2}, 			{ degrees: vertPoint2}, 	{ degrees: vertPoint4 }], // VERT
			[null, { degrees: elbowNoChangeAngle},	{ degrees: SW_ELBOW_LOC },	null], // ELBOW
			[null, { degrees: wristNoChangeAngle}, 	{ degrees: SW_WRIST_LOC },	null], // WRIST
			[null, { degrees: vertPoint2}, 			{ degrees: vertPoint2},		{ degrees: vertPoint4 }], // VERT-RIGHT
			[null, { degrees: spinNoChangeAngle} , 	{ degrees: SW_SPIN_LOC}, 	null], // SPIN
			[null, { degrees:GRIP_OPEN}, 			null,						null], // GRIP
			[null, { degrees:DISPENSE_DROP}, 		null, 						null] // DISPENSER
		],
		oncomplete: function () {
			//reloadAllServoPhyicalLocation();
			logMsg("SW Prep done.")
		}
	}

	animation.enqueue(aSegment);
}

function prepSouth() {

	logMsg("SOUTH PREP ...");
	animation.stop();

	var vertPoint2 = 91;
	var vertPoint4 = S_VERT_LOC;

	var baseNoChangeAngle = baseServoAngle;
	var vertNoChangeAngle = vertServoAngle;
	var elbowNoChangeAngle = elbowServoAngle;
	var wristNoChangeAngle = wristServoAngle;
	var spinNoChangeAngle = spinServoAngle;
	var gripNoChangeAngle = gripServoAngle;
	var dispNoChangeAngle = dispenserServoAngle;

	// 1. Home position + S_BASE
	// 2. Turn WristDown
	// 3. Turn ElbowDown
	// 4. Turn Vert Down
	var aSegment = {
		duration: 5000,
		cuePoints: [0, .5, .7,  1],
		keyFrames: [
			[{ degrees: baseNoChangeAngle},			{ degrees: S_BASE_LOC},		null, 						null					], // HORIZ
			[{ degrees: vertNoChangeAngle}, 		{ degrees: HOME_VERT_LOC}, 	{ degrees: HOME_VERT_LOC}, 	{ degrees: S_VERT_LOC }	], // VERT
			[{ degrees: elbowNoChangeAngle},		{ degrees: HOME_ELBOW_LOC},	{ degrees: S_ELBOW_LOC },	null					], // ELBOW
			[{ degrees: wristNoChangeAngle}, 		{ degrees: HOME_WRIST_LOC}, { degrees: S_WRIST_LOC}, 	null					], // WRIST
			[{ degrees: vertNoChangeAngle}, 		{ degrees: HOME_VERT_LOC}, 	{ degrees: HOME_VERT_LOC}, 	{ degrees: S_VERT_LOC }	], // VERT-RIGHT
			[{ degrees: spinNoChangeAngle},			{ degrees: S_SPIN_LOC} , 	null, 						null					], // SPIN
			[{ degrees:gripNoChangeAngle}, 			{ degrees:GRIP_OPEN}, 		null,						null					], // GRIP
			[{ degrees:dispNoChangeAngle}, 			{ degrees:DISPENSE_PICKUP}, null, 						null 					] // DISPENSER
		],
		oncomplete: function () {
			//reloadAllServoPhyicalLocation();
			logMsg("South Prep done.")
		}
	}

	animation.enqueue(aSegment);
}

function unravelSouth(){

	logMsg("SOUTH PREP ...");
	animation.stop();

	var vertPoint2 = 91;
	var vertPoint4 = S_VERT_LOC;

	var baseNoChangeAngle = baseServoAngle;
	var vertNoChangeAngle = vertServoAngle;
	var elbowNoChangeAngle = elbowServoAngle;
	var wristNoChangeAngle = wristServoAngle;
	var spinNoChangeAngle = spinServoAngle;

	// 1. Home position
	// 2. Turn WristDown
	// 3. Turn ElbowDown
	// 4. Turn Vert Down
	var aSegment = {
		duration: 6000,
		cuePoints: [0, .6, .8, 1],
		keyFrames: [
			[null,									null,							null, 							null,  					], // HORIZ
			[{ degrees: vertNoChangeAngle}, 		{ degrees: HOME_VERT_LOC}, 		null, 							null, 					], // VERT
			[{ degrees: elbowNoChangeAngle},		{ degrees: elbowNoChangeAngle},	{ degrees: HOME_ELBOW_LOC}, 	null					],// ELBOW
			[{ degrees: wristNoChangeAngle}, 		{ degrees: wristNoChangeAngle}, { degrees: wristNoChangeAngle}, { degrees: HOME_WRIST_LOC}], // WRIST
			[{ degrees: vertNoChangeAngle}, 		{ degrees: HOME_VERT_LOC}, 		null, 							null,					], // VERT-RIGHT
			[null,									null , 	null, 					null, 							null,					], // SPIN
			[null, 									null, 		null,				null,							null,					], // GRIP
			[null, 									null, null, 					null, 							null, 					] // DISPENSER
		],
		oncomplete: function () {
			//reloadAllServoPhyicalLocation();
			logMsg("South Prep done.")
		}
	}

	animation.enqueue(aSegment);
}


function GoToHome() {

	animation.stop();

	var vertPoint2 = HOME_VERT_LOC;
	
	var eSeqment = {
		duration: 2500,
		cuePoints: [0, 1],
		keyFrames: [
			[null, { degrees: HOME_BASE_LOC }], // HORIZ
			[null, { degrees: vertPoint2 }], // VERT
			[null, { degrees: HOME_ELBOW_LOC }], // ELBOW
			[null, { degrees: HOME_WRIST_LOC }], // WRIST
			[null, { degrees: vertPoint2 }], // VERT-RIGHT
			[null, null], // SPIN
			[null, null], // GRIP
			[null, null] // DISPENSER
		],
		oncomplete: function () {
			reloadAllServoPhyicalLocation();
		}
	}

	animation.enqueue(eSeqment);
}

function moveToOffPosition() {
	animation.stop();

	var vertPoint2 = OFF_VERT_LOC;	

	var eSeqment = {
		duration: 3000,
		cuePoints: [0, .75, 1],
		keyFrames: [
			[null, null, null], // HORIZ
			[null, { degrees: vertPoint2 }, null], // VERT
			[null, { degrees: OFF_ELBOW_LOC }, null], // ELBOW
			[null, 0, { degrees: OFF_WRIST_LOC }], // WRIST
			[null, { degrees: vertPoint2 }, null], // VERT-RIGHT
			[null, null, null], // SPIN
			[null, null, null], // GRIP
			[null, null, null] // DISPENSER
		],
		oncomplete: function () {
			reloadAllServoPhyicalLocation();
		}
	}

	animation.enqueue(eSeqment);
}

function reloadAllServoPhyicalLocation() {
	if (servoBase == null)
		return;
	baseServoAngle = servoBase.position;
	vertServoAngle = servoVert.position;
	elbowServoAngle = servoElbow.position;
	wristServoAngle = servoWrist.position;
	spinServoAngle = servoSpin.position;
	gripServoAngle = servoGrip.position;
	dispenserServoAngle = servoDispenser.position;
}

// 
//  MANUAL ACTIONS
//


function OpenGripper(){

	logMsg("Opening Gripper...");
	animation.stop();	

	var aSegment = {
		duration: 3000,
		cuePoints: [0,  1],
		keyFrames: [
			[null, null], // HORIZ
			[null, null], // VERT
			[null, null], // ELBOW
			[null, null], // WRIST
			[null, null], // VERT-RIGHT
			[null, null], // SPIN
			[null, { degrees: GRIP_OPEN}], // GRIP
			[null, null] // DISPENSER
		],
		oncomplete: function () {
			//reloadAllServoPhyicalLocation();
			logMsg("Gripper Opened.");
		}
	}

	animation.enqueue(aSegment);
}

function ToggleSpin(){
	
	logMsg("Toggle Spinner...");
	animation.stop();	

	newSpinAngle = 0;
	if (spinServoAngle < 90)
		newSpinAngle = SPIN_DROP;
	else
		newSpinAngle = SPIN_PICK;

	var aSegment = {
		duration: 3000,
		cuePoints: [0,  1],
		keyFrames: [
			[null, null], // HORIZ
			[null, null], // VERT
			[null, null], // ELBOW
			[null, null], // WRIST
			[null, null], // VERT-RIGHT
			[null, {degrees: newSpinAngle}], // SPIN
			[null, null], // GRIP
			[null, null] // DISPENSER
		],
		oncomplete: function () {
			//reloadAllServoPhyicalLocation();
			logMsg("Spinner Toggled.");
		}
	}

	animation.enqueue(aSegment);
}

function GripStack(){

	logMsg("Gripping Stack...");
	animation.stop();	

	servoAntenna.to(ANTENNA_CLOSE);

	var aSegment = {
		duration: 3000,
		cuePoints: [0, .2, 1],
		keyFrames: [
			[null, null, null], // HORIZ
			[null, null, null], // VERT
			[null, null, null], // ELBOW
			[null, null, null], // WRIST
			[null, null, null], // VERT-RIGHT
			[null, null, null], // SPIN
			[null, { degrees: GRIP_OPEN}, { degrees: GRIP_CLOSE}], // GRIP
			[null, { degrees:DISPENSE_PICKUP}, null] // DISPENSER
		],
		oncomplete: function () {
			//reloadAllServoPhyicalLocation();
			logMsg("Stack Grabbed.");
			servoAntenna.to(ANTENNA_OPEN);
		}
	}

	animation.enqueue(aSegment);
}

var countPennyDispensed = 0;
function DispenseAllPennies(horizInc){
	countPennyDispensed = 0;
	animation.stop();	
	DispensePennyAndMove(horizInc);
}

function DispenseSinglePenny(){
      logMsg("Dispensing Penny");

		// 1. Make sure Dispenser is in PICKUP LOCATION (TO HELP ANIMATION LIBRRY WITH NEXT STEP)
		// 2. DROP ONE Penny
		// 3. Move HORIZ
		// 4. REPEAT
		var aSegment = {
			duration: 3000,
			cuePoints: [0, .3, .6, 1],
			keyFrames: [
				[null, null, null, null], // HORIZ
				[null, null, null, null], // VERT
				[null, null, null, null], // ELBOW
				[null, null, null, null], // WRIST
				[null, null, null, null], // VERT-RIGHT
				[null, null, null, null], // SPIN
				[null, null, null, null], // GRIP
				[null, { degrees:DISPENSE_PICKUP}, { degrees:DISPENSE_DROP}, null] // DISPENSER
			],
			oncomplete: function () {
				  logMsg("Peny Dispensed");

				//reloadAllServoPhyicalLocation();
			}
		}

		animation.enqueue(aSegment); 
}

function DispensePennyAndMove(horizInc){	

		logMsg("Dispensing Penny #" + (countPennyDispensed + 1));

		// 1. Make sure Dispenser is in PICKUP LOCATION (TO HELP ANIMATION LIBRRY WITH NEXT STEP)
		// 2. DROP ONE Penny
		// 3. Move HORIZ
		// 4. REPEAT
		var aSegment = {
			duration: 1500,
			cuePoints: [0, .33,  1],
			keyFrames: [
				[null, horizInc, 					null], // HORIZ
				[null, 0, 							null], // VERT
				[null, null, 						null], // ELBOW
				[null, null, 						null], // WRIST
				[null, null, 						null], // VERT-RIGHT
				[null, null, 						null], // SPIN
				[null, null, 						null], // GRIP
				[null, { degrees:DISPENSE_PICKUP}, 	{ degrees:DISPENSE_DROP}] // DISPENSER
			],
			oncomplete: function () {
				countPennyDispensed ++;
				if (countPennyDispensed < 10)
					DispensePennyAndMove(horizInc);  // RECURSION
				else
				  logMsg("All Pennies Dispensed.")

				//reloadAllServoPhyicalLocation();
			}
		}

		animation.enqueue(aSegment); 	
}

function GoToTarget(tBase, tVert, tElbow, tWrist, horizInc)
{
	animation.stop();

	var vertNoChangeAngle = vertServoAngle;
	var baseNoChangeAngle = baseServoAngle;
	var elbowNoChangeAngle = elbowServoAngle;
	var wristNoChangeAngle = wristServoAngle;
	var spinNoChangeAngle = spinServoAngle;

	var vertPoint2 = TRAVEL_VERT;
	var vertPoint4 = tVert;

	// 1. LIFT UP
	// 2. GoTo location
	// 3. SPIN
	// 4. GO LOWER
	// 5. Kick off 10 penny dispenser
	var aSegment = {
		duration: 3000,
		cuePoints: [0, .2, .5, .9, 1],
		keyFrames: [
			[null, {degrees: baseNoChangeAngle},	{ degrees: tBase }, 	null, null], // HORIZ
			[{degrees: vertNoChangeAngle}, { degrees: vertPoint2}, 			{ degrees: vertPoint2}, 						null, { degrees: vertPoint4 }], // VERT
			[null, {degrees: elbowNoChangeAngle},	{ degrees: tElbow }, 	null, null], // ELBOW
			[null, {degrees: wristNoChangeAngle},	{ degrees: tWrist }, 	null, null], // WRIST
			[{degrees: vertNoChangeAngle}, { degrees: vertPoint2}, 			{ degrees: vertPoint2}, 	null, { degrees: vertPoint4 }], // VERT-RIGHT
			[null, {degrees: spinNoChangeAngle}, 	{ degrees:SPIN_DROP}, 		null, null], // SPIN
			[null, null, 							null, 						null, null], // GRIP
			[null, null, 							null, 						null, null] // DISPENSER
		],
		oncomplete: function () {
			// 5.
			DispenseAllPennies(horizInc);
			//reloadAllServoPhyicalLocation();
		}
	}

	animation.enqueue(aSegment);
}

function GoToTarget1()
{
	logMsg("TARGET-1...");
	GoToTarget(T1_BASE_LOC, T1_VERT_LOC, T1_ELBOW_LOC, T1_WRIST_LOC, -3);
}

function GoToTarget2()
{
	logMsg("TARGET-2...");
	GoToTarget(T2_BASE_LOC, T2_VERT_LOC, T2_ELBOW_LOC, T2_WRIST_LOC, -3 );
}

function GoToTarget3()
{
	logMsg("TARGET-3...");
	GoToTarget(T3_BASE_LOC, T3_VERT_LOC, T3_ELBOW_LOC, T3_WRIST_LOC, -3);
}

function GoToTarget4()
{
	logMsg("TARGET-4...");
	GoToTarget(T4_BASE_LOC, T4_VERT_LOC, T4_ELBOW_LOC, T4_WRIST_LOC, -3);
}

function GoToTarget5()
{
	logMsg("TARGET-5...");
	GoToTarget(T5_BASE_LOC, T5_VERT_LOC, T5_ELBOW_LOC, T5_WRIST_LOC, -3);
}

// SLIDER RELATED
function userSliderChange(formData) {
	switch (formData.ServoBtn) {
		// BASE
		case 'baseServoAngle':
			setBaseServoAngle(Number(formData.baseServoAngle));
			break;
		case 'BaseLeft':
			setBaseServoAngle(baseServoAngle - ANGLE_INC);
			break;
		case 'BaseRight':
			setBaseServoAngle(baseServoAngle + ANGLE_INC);
			break;

		// VERT
		case 'vertServoAngle':
			setVertServoAngle(Number(formData.vertServoAngle));
			break;
		case 'VertUp':
			setVertServoAngle(vertServoAngle + ANGLE_INC);
			break;
		case 'VertDown':
			setVertServoAngle(vertServoAngle - ANGLE_INC);
			break;

		// ELBOW
		case 'elbowServoAngle':
			setElbowServoAngle(Number(formData.elbowServoAngle));
			break;
		case 'ElbowUp':
			setElbowServoAngle(elbowServoAngle - ANGLE_INC);
			break;
		case 'ElbowDown':
			setElbowServoAngle(elbowServoAngle + ANGLE_INC);
			break;

		// WRIST
		case 'wristServoAngle':
			setWristServoAngle(Number(formData.wristServoAngle));
			break;
		case 'WristUp':
			setWristServoAngle(wristServoAngle + ANGLE_INC);
			break;
		case 'WristDown':
			setWristServoAngle(wristServoAngle - ANGLE_INC);
			break;

		// SPIN
		case 'spinServoAngle':
			setSpinServoAngle(Number(formData.spinServoAngle));
			break;
		case 'spinLeft':
			setSpinServoAngle(spinServoAngle - ANGLE_INC);
			break;
		case 'spinRight':
			setSpinServoAngle(spinServoAngle + ANGLE_INC);
			break;

		// GRIP
		case 'gripServoAngle':
			setGripServoAngle(Number(formData.gripServoAngle));
			break;
		case 'gripLeft':
			setGripServoAngle(gripServoAngle + ANGLE_INC);
			break;
		case 'gripRight':
			setGripServoAngle(gripServoAngle - ANGLE_INC);
			break;

			// DISPENSER
		case 'dispenserServoAngle':
			setDispenserServoAngle(Number(formData.dispenserServoAngle));
			break;
		case 'dispenserLeft':
			setDispenserServoAngle(dispenserServoAngle + ANGLE_INC);
			break;
		case 'dispenserRight':
			setDispenserServoAngle(dispenserServoAngle - ANGLE_INC);
			break;

	}
}

function userClickLocationButton(formData) {
	switch (formData.Btn) {

		case "WEST-PREP":
			prepWest();			
			break;

		case "EAST-PREP":
			prepEast();			
			break;

		case "NORTH-PREP":
			prepNorth();			
			break;

		case "SOUTHWEST-PREP":
			prepSouthWest();			
			break;


		case "SOUTH-PREP":
			prepSouth();			
			break;

		case "SOUTH-UNRAVEL":
			unravelSouth();			
			break;

		//
		//  MANUAL + CORRECTION Actions
		//

		case "GripStack":
			GripStack();		
			break;

		case "DispenseAllPennies":
			DispenseAllPennies(-5);			
			break;

		case "SingleDispensePenny":
			DispenseSinglePenny();
			break;

		case "Open-Gripper":
			OpenGripper();
			break;

		case "Toggle-Spin":
			ToggleSpin();
			break;


		//
		// TARGET
		//
		case "TARGET-1":
			GoToTarget1();			
			break;
		case "TARGET-2":
			GoToTarget2();			
			break;
		case "TARGET-3":
			GoToTarget3();			
			break;
		case "TARGET-4":
			GoToTarget4();			
			break;
		case "TARGET-5":
			GoToTarget5();			
			break;

		//
		//	OTHER
		//
		case "HOME":
			GoToHome();
			logMsg("HOME...");
			break;

		case "Refresh":
			logMsg("Refresh...");
			break;

		case "ResetTimerBtn":
			CurrentTimeElapsed = 0;
			logMsg("ResetTimerBtn...");
			break;

		case "PowerOn":
			setAllServoPower('ON');
			logMsg("PowerON...");
			break;

		case "PowerOff":
			setAllServoPower('OFF');
			logMsg("PowerOff...");
			break;
	}
}