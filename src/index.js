//===[CORE]
import Wrtc from 'wrtc'
import QRCode from 'qrcode'
import Instascan from 'instascan'
import Peer from 'simple-peer'

//===[HTML5]
import React, { createElement } from 'react'
import { render } from 'react-dom'

//===[SCANNER]
let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
var canvas = document.getElementById('canvas') // QR code (display mode)

Instascan.Camera.getCameras().then(function (cameras) {
	if (cameras.length > 0) { scanner.start(cameras[0]); }
	else { console.error('No cameras found.'); }
}).catch(function (e) { console.error(e);});

//===[XXX]
import PastebinAPI from 'pastebin-js';
var pastebin = new PastebinAPI({
	'api_dev_key':       '34fb1c0ba726c8eed518a827cb07cdcd',
	'api_user_name':     '__shower',
	'api_user_password': '__shower'
});

//===[DEFAULTS]
let peer = null, initiate = null, connect = null,
	signal_input = null, preconnect = null
let webrtc_config = {
	config: { iceServers: [ { url: 'stun:stun.l.google.com:19302' } ] },
	wrtc: Wrtc,
	trickle: true,
	reconnectTimer: true,
	objectMode: true}

////////////////////////////////////////////////////////////////////////////////

var base64 = exports;

base64.encode = function (unencoded) {
  return new Buffer(unencoded || '').toString('base64');
};

base64.decode = function (encoded) {
  return new Buffer(encoded || '', 'base64').toString('utf8');
};

////////////////////////////////////////////////////////////////////////////////


function get_code(data) {
var ID_FINAL = "";
	//get_code = function () {
var data_base64 = new Buffer(data).toString('base64');
var http = new XMLHttpRequest();
var url = "http://dpaste.com/api/v2/";
var params = "content="+data_base64; // tutaj json
console.log("GET_CODE_CONTENT", params);
http.open("POST", url, false);

//Send the proper header information along with the request
http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//http.setRequestHEader("");

// crossDomain: true
http.onreadystatechange = function() {
	var id_paste = http.responseText.replace("http://dpaste.com/", "");
	console.log("ID", id_paste, http.status, http.readyState);
	if(http.readyState == 4 && http.status == 201)
	{ console.log("OKAY", id_paste); ID_FINAL = id_paste; }
}
http.send(params);
return ID_FINAL;
}

function get_param(id, type) {
// 13BPBRQ
var PARAM_FINAL = "";
	//get_code = function () {
var http = new XMLHttpRequest();
var url = "http://dpaste.com/" + id + ".txt";
var params = "our=mac"; // tutaj json
http.open("POST", url, false);

//Send the proper header information along with the request
http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//http.setRequestHEader("");

// crossDomain: true
http.onreadystatechange = function() {
	var param_paste = http.responseText;
	console.log("HAVE", param_paste, http.readyState, http.status);
	if(http.readyState == 4 && http.status == 200)
	{ console.log("OKAY", param_paste);
		PARAM_FINAL = param_paste;
		let X = new Buffer(PARAM_FINAL, 'base64').toString();
		bridge(X, type); }
}
http.send(params);
}

//};

//var ID = get_code();
//console.log("REC --> ", ID);

////////////////////////////////////////////////////////////////////////////////

let TYPE = 1; // {0 - server; 1 - client}
let CODES = 0, __DATA = {}; // data for client

function bridge(data, type) {
	console.log('BRIDGE', data, type);
	if (type == 1) {
		update('T1 --> CLIENT SIE LACZY');
		connect(data); // klient wybiera serwer
	} else {
		update('T0 --> SERVER SIE LACZY');
		data = JSON.parse(data);
		connect(data["0"]); // polacz sie z serwerem
		connect(data["1"]); // polacz sie z TYM klientem		
	}
}

preconnect = (id_data) => {
	if (TYPE == 1)
	{ get_param(id_data, 1) } else
	{ get_param(id_data, 0) }
}

/*scanner.addListener('scan', function (content) {
	if (TYPE == 1) {
		update('T1 --> CLIENT SIE LACZY');
		connect(content); // klient wybiera serwer
	} else {
		update('T0 --> SERVER SIE LACZY');
		content = JSON.parse(content);
		connect(content["0"]); // polacz sie z serwerem
		connect(content["1"]); // polacz sie z TYM klientem
	}
});*/

////////////////////////////////////////////////////////////////////////////////

initiate = () => {
	let __webrtc_config = webrtc_config
	__webrtc_config.initiator = true
	peer = Peer(__webrtc_config)

	peer.on('signal', (data) => {
		if (data["type"] == "offer") {
			update('signal AA') // debug
			update(JSON.stringify(data))

			let code = get_code(JSON.stringify(data));
			console.log('CODE', code);
			update('CODE --> ' + code);

			// send package [SERVER]
			//TYPE = 0; let bf = JSON.stringify(data)
			TYPE = 0; let bf = code;
			/*QRCode.toCanvas(canvas, bf, function (error) {
				if (error) console.error(error)
				console.log('success!');
			})*/
		}
	})
}

connect = (data) => {
	if (peer === null) {
		peer = Peer(webrtc_config)
		peer.on('signal', (data) => {
			console.log('peer signal', data)
			if (CODES < 2) {
				// debug
				update('signal BB')
				update(JSON.stringify(data))

				TYPE = 1; CODES++; // update package
				__DATA[CODES] = JSON.stringify(data);

				if (CODES == 2) { // send package [CLIENT]
					let code = get_code(JSON.stringify(__DATA));
					console.log('CODE', code);
					update('CODE --> ' + code);

					let bf = JSON.stringify(__DATA)
					/*QRCode.toCanvas(canvas, bf, function (error) {
						if (error) console.error(error)
						console.log('success!');
					})*/
				}
			}
		})
	}
	peer.signal(data)

	peer.on('connect', () => {
		console.log('peer connected')
		update('connected')
	})
	peer.on('data', (data) => {
		const message = data.toString('utf-8')
		update('> ' + message)
		console.log('peer received', message)
	})
	peer.on('error', (error) => {
		update('!!! ' + error.message)
		console.error('peer error', error)
	})
	peer.on('close', () => {
		update('Connection closed')
		console.log('peer connection closed')
	})
}

////////////////////////////////////////////////////////////////////////////////

const ConnectForm = () => (
	<div>
	<input
	ref = { (el) => signal_input = el }
	placeholder = 'Enter signaling data here...'
	/>
	<button
	onClick = { () => preconnect(signal_input.value) }
	>
	Answer
	</button>
	<button
	onClick = { () => initiate() }
	>
	Initiate
	</button>

	</div>
)

let message_input = ''
const MessageForm = () => (
	<div>
	<input
	ref = { (el) => message_input = el }
	placeholder = 'Enter something nice here...'
	/>
	<button
	onClick = { () => {
		const message = message_input.value
		update('< ' + message)
		peer.send(message)
	} }
	>
	Send
	</button>
	</div>
)

const Root = (props) => (
	<div>
	{ !props.connected ? <ConnectForm /> : "" }
	{
		props.messages.map((message) => <pre>{ message }</pre>)
	}
	{ props.connected ? <MessageForm /> : "" }
	</div>
)

const container = document.getElementById('app-container')

let connected = false
let messages = []
const update = (message) => {
	messages = messages.concat(message)
	if (message === 'connected') { connected = true }
	const root = createElement(Root, { messages, connected })
	render(
		root,
		container
	)
}
update('')


