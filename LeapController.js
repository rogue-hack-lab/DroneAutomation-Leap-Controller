"use strict";

var Cylon = require('cylon');
var https = require('https')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var i = 0
var range = { 
	x: { min: -200, max: 200 },
	y: { min:  150, max: 550 },
	z: { min: -200, max: 200 },
	a: { min: -0.7, max: 0.7 } 
	// x: { min: -207.524, max: 183.213, sensitivity: 0.5 },
	// y: { min: 100.7524, max: 342.398, sensitivity: 1 },
	// z: { min: -117.294, max: 179.392, sensitivity: 0.5 } 
}
var options = {
	hostname: '192.168.1.13',
	port: 3000,
	path: '/api/robots/Drone/commands/set',
	method: 'POST',
	headers: { 'Content-Type': 'application/json'	}
};

Cylon.robot({
	connections: {
		leapmotion: { adaptor: "leapmotion" }
	},
	
	devices: {
		leapmotion: { driver: "leapmotion" }
	},
	
	work: function(my) {
		my.leapmotion.on("hand", function(hand) {
			if (i < 40 ) { i++; return }
			
			// range.X.min = Math.max(range.X.min, hand.palmX)
			// range.X.max = Math.min(range.X.max, hand.palmX)
			// range.Y.min = Math.max(range.Y.min, hand.palmY)
			// range.Y.max = Math.min(range.Y.max, hand.palmY)

			var scaled = {
				throttle: ((hand.palmY).fromScale(range.y.min,range.y.max)).toFixed(2),
				rudder: ((hand.rotation.matrix).fromScale( range.a.min, range.a.max )).toFixed(2),
				aileron: ((hand.palmX).fromScale( range.x.min ,range.x.max )).toFixed(2),
				elevator: (1.0 - (hand.palmZ).fromScale( range.z.min ,range.z.max )).toFixed(2)
			}

			console.log(scaled)
			var req = https.request(options, function (res) {
				var chunks = [];
				res.on("data", function (chunk) {
					chunks.push(chunk);
				});
			
				res.on("end", function () {
					var body = Buffer.concat(chunks);
					//console.log(body.toString());
				});
			});
			
			req.write(JSON.stringify({ 
				t: scaled.throttle, 
				r: scaled.rudder, 
				a: scaled.aileron, 
				e: scaled.elevator
			}));
			req.end();
			i = 0
		});
	}
}).start();

