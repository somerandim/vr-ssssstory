// Erase all the writings on the board
// Nothing to change here
// Only deletes assets with class="removable"
/* global AFRAME, THREE */
AFRAME.registerComponent("erase-all", {
    init: function () {
      this.el.addEventListener("raycaster-intersected", (evt) => {
        var removableEntities = document.querySelectorAll(".removable");
  
        // Loop through each entity
        removableEntities.forEach((entity) => {
          // Remove the entity
          entity.parentNode.removeChild(entity);
        });
      });
    },
  });
  