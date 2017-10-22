//===[CORE]
import Wrtc from 'wrtc'
import Peer from 'simple-peer'

//===[HTML5]
import React, { createElement } from 'react'
import { render } from 'react-dom'

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

function get_code(data) {
	var ID_FINAL = "";
	var data_base64 = new Buffer(data).toString('base64');
	var http = new XMLHttpRequest();
	var url = "http://dpaste.com/api/v2/";
	var params = "content="+data_base64;

	http.open("POST", url, false);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.onreadystatechange = function() {
		var id_paste = http.responseText.replace("http://dpaste.com/", "");
		console.log("ID", id_paste, http.status, http.readyState);
		if(http.readyState == 4 && http.status == 201)
		{ console.log("OKAY", id_paste); ID_FINAL = id_paste; }
	}
	http.send(params);

	return ID_FINAL;
}

function get_param(id, type2) {
	var PARAM_FINAL = "";
	var http = new XMLHttpRequest();
	var url = "http://dpaste.com/" + id + ".txt";
	var params = "our=mac";

	http.open("POST", url, false);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.onreadystatechange = function() {
		var param_paste = http.responseText;
		console.log("HAVE", param_paste, http.readyState, http.status);
		if(http.readyState == 4 && http.status == 200)
		{ console.log("OKAY", param_paste);
			PARAM_FINAL = param_paste;
			let X = new Buffer(PARAM_FINAL, 'base64').toString();
			bridge(X, type2); }
	}
	http.send(params);
}

////////////////////////////////////////////////////////////////////////////////

let TYPE = 1; // {0 - server; 1 - client}
let CODES = 0, __DATA = {}; // data for client

function bridge(data, type2) {
	console.log('BRIDGE', data, type2);
	data = JSON.parse(data);
	if (type2 == 1) {
		update('T1 --> CLIENT SIE LACZY');
		connect(data); // klient wybiera serwer
	} else {
		update('T0 --> SERVER SIE LACZY');
		//data = JSON.parse(data);
		connect(data["1"]); // polacz sie z serwerem
		connect(data["2"]); // polacz sie z TYM klientem		
	}
}

preconnect = (id_data) => {
	if (TYPE == 1)
	{ get_param(id_data, 1) } else
	{ get_param(id_data, 0) }
}

////////////////////////////////////////////////////////////////////////////////

initiate = () => {
	let __webrtc_config = webrtc_config
	__webrtc_config.initiator = true
	peer = Peer(__webrtc_config)

	peer.on('signal', (data) => {
		if (data["type"] == "offer") {
			update('signal AA') // debug
			update(JSON.stringify(data))

			TYPE = 0;
			let code = get_code(JSON.stringify(data));
			console.log('CODE', code);
			update('CODE --> ' + code);
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


