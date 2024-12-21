// Enable or disable collision between super-hands and entities
/* global AFRAME, THREE */
// Nothing to change here
AFRAME.registerComponent("phase-shift", {
    init: function () {    
      console.log("phase shifted")
      // enable collision VS enable grabbing
      var el = this.el;
      el.addEventListener("gripdown", function () {
        el.setAttribute("collision-filter", { collisionForces: true });
      });
      el.addEventListener("gripup", function () {
        el.setAttribute("collision-filter", { collisionForces: false });
      });
    },
  });
  