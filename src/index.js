//===[CORE]
import Wrtc from 'wrtc'
import QRCode from 'qrcode'
import Instascan from 'instascan'
import Peer from 'simple-peer'

//===[HTML5]
import React, { createElement } from 'react'
import { render } from 'react-dom'

import sql from 'mssql'

/*
photoshowerdb.database.windows.net
dbmaster
3xfcuTS8cMYakE8t

*/


    try {
        const pool = sql.connect('mssql://dbmaster:3xfcuTS8cMYakE8t@photoshowerdb.database.windows.net/photoshowerdb')
        const result = sql.query`select * from Messages`
        console.log("OKAY", result)
    } catch (err) {
        console.log("SQL TO DUPA", err)
    }

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
let peer = null, initiate = null, connect = null, signal_input = null
let webrtc_config = {
	config: { iceServers: [ { url: 'stun:stun.l.google.com:19302' } ] },
	wrtc: Wrtc,
	trickle: true,
	reconnectTimer: true,
	objectMode: true}

////////////////////////////////////////////////////////////////////////////////

let TYPE = 1; // {0 - server; 1 - client}
let CODES = 0, __DATA = {}; // data for client

scanner.addListener('scan', function (content) {
	if (TYPE == 1) {
		update('T1 --> CLIENT SIE LACZY');
		connect(content); // klient wybiera serwer
	} else {
		update('T0 --> SERVER SIE LACZY');
		content = JSON.parse(content);
		connect(content["0"]); // polacz sie z serwerem
		connect(content["1"]); // polacz sie z TYM klientem
	}
});

////////////////////////////////////////////////////////////////////////////////

initiate = () => {
	let __webrtc_config = webrtc_config
	__webrtc_config.initiator = true
	peer = Peer(__webrtc_config)

	peer.on('signal', (data) => {
		if (data["type"] == "offer") {
			update('signal AA') // debug
			update(JSON.stringify(data))

pastebin
  .createPaste("Test from pastebin-js", "pastebin-js")
  .then(function (data) {
    // paste succesfully created, data contains the id
    console.log("PS", data);
  })
  .fail(function (err) {
    // Something went wrong
    console.log("PS", err);
  })

			pastebin
  .getPaste('76b2yNRt')
  .then(function (data) {
    // data contains the raw paste
    console.log(data);
  })
  .fail(function (err) {
    // Something went wrong
    console.log(err);
  })

			// send package [SERVER]
			TYPE = 0; let bf = JSON.stringify(data)
			QRCode.toCanvas(canvas, bf, function (error) {
				if (error) console.error(error)
				console.log('success!');
			})
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
					let bf = JSON.stringify(__DATA)
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

////////////////////////////////////////////////////////////////////////////////

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


