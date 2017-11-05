"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    leapmotion: { adaptor: "leapmotion" }
  },

  devices: {
    leapmotion: { driver: "leapmotion" }
  },

  work: function(my) {
    var range = {
      throttle: {
        min: 1000,
        max: 0
      },
      rudder: {
        min: 1000,
        max: 0
      },
      aileron: {
        min: 1000,
        max: 0
      },
      elevator: {
        min: 1000,
        max: 0
      }
    }
    
    my.leapmotion.on("hand", function(hand) {
      console.log(hand.rotation)
      // halt()
      // range.aileron.min = Math.min(range.aileron.min,hand.palmX)
      // range.aileron.max = Math.max(range.aileron.max,hand.palmX)
      // range.throttle.min = Math.min(range.throttle.min,hand.palmY)
      // range.throttle.max = Math.max(range.throttle.max,hand.palmY)
      // range.elevator.min = Math.min(range.elevator.min,hand.palmZ)
      // range.elevator.max = Math.max(range.elevator.max,hand.palmZ)
      // range.rudder.min = Math.min(range.rudder.min,0.5)
      // range.elevator.max = Math.max(range.rudder.max,0.5)
      // console.log(range);
    });
  }
}).start();