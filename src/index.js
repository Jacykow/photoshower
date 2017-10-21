import Peer from 'simple-peer'
import React, { createElement } from 'react'
import { render } from 'react-dom'

import Wrtc from 'wrtc'
import QRCode from 'qrcode'
import Instascan from 'instascan';

//import PastebinAPI from 'pastebin-js';
//var pastebin = new PastebinAPI({
//     'api_dev_key' : '34fb1c0ba726c8eed518a827cb07cdcd',
//   'api_user_name' : '__shower',
// 'api_user_password' : '__shower'
//  });

let peer = null

let initiate = null // This is an ugly hack!
let connect = null
let signal_input = null
const ConnectForm = () => (
	<div>
	<input
	ref = { (el) => signal_input = el }
	placeholder = 'Enter signaling data here...'
	/>
	<button
	onClick = { () => connect(signal_input.value) }
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

//////////////////////////////////////////////////////

let T = 1; // 0 server
           // 1 client

let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
scanner.addListener('scan', function (content) {
	if (T == 1) {
		console.log("SCANED", content);
		update('T1 --> CLIENT SIE LACZY');
		connect(content);
	} else {
		update('T0 --> SERVER SIE LACZY');
		var obj = JSON.parse(content);
		console.log('CON 0', obj["0"]);
		console.log('CON 1', obj["1"]);
	
		connect(obj["0"]);
		connect(obj["1"]);
	}
});
Instascan.Camera.getCameras().then(function (cameras) {
	if (cameras.length > 0) {
		scanner.start(cameras[0]);
	} else {
		console.error('No cameras found.');
	}
}).catch(function (e) {
	console.error(e);
});

///////////////////////////////////////////////////////

initiate = () => {
	peer = Peer({config: { iceServers: [ { url: 'stun:stun.l.google.com:19302' } ] },wrtc: Wrtc, trickle: true, initiator: true, reconnectTimer: true, objectMode: true})

	peer.on('signal', (data) => {
		console.log('peer signal', data)
		//console.log(new Buffer("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'))
		//var uint8array = new TextEncoder("utf-8").encode("¢");
		//var string = new TextDecoder("utf-8").decode(uint8array);

		var canvas = document.getElementById('canvas')

		var bf = JSON.stringify(data)

		if (data["type"] == "offer") {
			T = 0;
			update('signal AA')
			update(JSON.stringify(data))

			/*			pastebin
				.createPaste({
					text: JSON.stringify(data),
				}).then(function (data) {
		// we have succesfully pasted it. Data contains the id
					console.log('TESTTEST', data);
				}).fail(function (err) {
		console.log('FAIL', err);
	});*/
		console.log('OFFER');
		QRCode.toCanvas(canvas, bf, function (error) {
			if (error) console.error(error)
			console.log('success!');
		})
		}
		console.log('>>> ', data, canvas, QRCode)
	})
}

let CON = 0;
let CON_DATA = {};

connect = (data) => {
	if (peer === null) {
		peer = Peer({config: { iceServers: [ { url: 'stun:stun.l.google.com:19302' } ] },wrtc: Wrtc, trickle: true, reconnectTimer: true, objectMode: true})
		peer.on('signal', (data) => {
			console.log('peer signal', data)
			if (CON < 2) {
				T = 1;
				update('signal BB')
				update(JSON.stringify(data))
				CON_DATA[CON] = JSON.stringify(data);
				CON++;
				if (CON == 2) {
					let bf = JSON.stringify(CON_DATA);
					console.log("BF_----->",bf);
					QRCode.toCanvas(canvas, bf, function (error) {
						if (error) console.error(error)
						console.log('success!');
					})
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
