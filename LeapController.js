"use strict";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const Cylon = require('cylon');
const https = require('https')

let range = { 
	x: { min: -200, max: 200 },
	y: { min:  150, max: 550 },
	z: { min: -200, max: 200 },
	a: { min: -0.7, max: 0.7 } 
}

const 
	hostname = '192.168.1.13',
	port = 3000,
	route = '/api/robots/Drone/commands',	
	command = {
		set: route + '/set',
		kill: route + '/kill'
	},
	endpoint = {
		set: {
			hostname: hostname,
			port: port,
			path: command.set,
			method: 'POST',
			headers: { 'Content-Type': 'application/json'	}
		},
		kill: {
			hostname: hostname,
			port: port,
			path: command.kill,
			method: 'POST',
			headers: { 'Content-Type': 'application/json'	}
		}
	};

Cylon.robot({
	connections: {
		leapmotion: { adaptor: "leapmotion" }
	},
	
	devices: {
		leapmotion: { driver: "leapmotion" }
	},
	
	work: (my) => {
		let delay = { count: 0, frequency: 30, bang: false }

		my.leapmotion.on('frame', (frame) => {
			( delay.count >= delay.frequency ) ? delay.bang = true : delay.bang = !delay.bang; delay.count++

			if ( frame.hands.length === 0 && delay.bang) {
				var req = https.request(endpoint.kill,  (res) => {
					var chunks = [];
					res.on("data", function (chunk) {
						chunks.push(chunk);
					});
				
					res.on("end", function () {
						var body = Buffer.concat(chunks);
						//console.log('no hands')
					});
				})
				req.write(JSON.stringify({}))
				req.end()
				delay.count = 0
			}
		})

		my.leapmotion.on("hand", (hand) => {
			if (!delay.bang) { return }

			var scaled = {
				throttle: ((hand.palmY).fromScale(range.y.min,range.y.max)).toFixed(2),
				rudder: ((hand.rotation.matrix).fromScale( range.a.min, range.a.max )).toFixed(2),
				aileron: ((hand.palmX).fromScale( range.x.min ,range.x.max )).toFixed(2),
				elevator: (1.0 - (hand.palmZ).fromScale( range.z.min ,range.z.max )).toFixed(2)
			}

			var req = https.request(endpoint.set, function (res) {
				var chunks = [];
				res.on("data", function (chunk) {
					chunks.push(chunk);
				});
				
				res.on("end", function () {
					var body = Buffer.concat(chunks);
					//console.log(body.toString())
				});
			});
			
			req.write(JSON.stringify({ 
				t: scaled.throttle, 
				r: scaled.rudder, 
				a: scaled.aileron, 
				e: scaled.elevator
			}));

			req.end();

			delay.count = 0
		});
	}
}).start();

