"use strict";

const Cylon = require('cylon');

let range = { 
	x: { min: -200, max: 200 },
	y: { min:  150, max: 550 },
	z: { min: -200, max: 200 },
	a: { min: -2.5, max: 2.5 } 
}

let controls = {
	throttle: 0,
	rudder: 0.5,
	aileron: 0.5,
	elevator: 0.5
}

Cylon.robot({
	name: 'Controller',

	connections: {
		leapmotion: { adaptor: "leapmotion" }
	},
	
	devices: {
		leapmotion: { driver: "leapmotion" }
	},
	
	work: (my) => {
		
		my.leapmotion.on('frame', (frame) => {
			if ( frame.hands.length === 0) {
				controls.throttle = 0,
				controls.rudder = 0.5,
				controls.aileron = 0.5,
				controls.elevator = 0.5
			}
		})

		my.leapmotion.on("hand", (hand) => {
			controls.throttle = ((hand.palmY).fromScale(range.y.min,range.y.max)).toFixed(2),
			controls.rudder = ((hand.rotation.matrix).fromScale( range.a.min, range.a.max )).toFixed(2),
			controls.aileron = ((hand.palmX).fromScale( range.x.min ,range.x.max )).toFixed(2),
			controls.elevator = (1.0 - (hand.palmZ).fromScale( range.z.min ,range.z.max )).toFixed(2)
		});
	},

	commands: {
		controls: () => {
			return {
				t: controls.throttle,
				r: controls.rudder,
				a: controls.aileron,
				e: controls.elevator
			}
		}
	},

})

Cylon.api('http',
{
  host: '0.0.0.0',
  port: '3000'
});

Cylon.start();