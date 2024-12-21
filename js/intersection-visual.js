/* global AFRAME, THREE */
// whiteboard font-size is at the bottom
AFRAME.registerComponent('intersection-visual', {
    schema: {
        size: {
            type: "number",
            default: 10
        },
        color: {
            type: "color",
            default: "black"
        }
    },
    init: function () {
        this.boxes = {};  // Keep track of the boxes' positions

        this.el.addEventListener('raycaster-intersected', evt => {
            this.raycasterObj = evt.detail.el;
        });
        this.el.addEventListener('raycaster-intersected-cleared', evt => {
            this.raycasterObj = null;
            this.mesh.position.set(0, -1, 0);
        });        
      
        var controllers = document.querySelectorAll(".controller");
        controllers.forEach((controller) => {
            controller.addEventListener('triggerdown', evt => {
                this.triggerdown = true;
            });
            controller.addEventListener('triggerup', evt => {
                this.triggerdown = false;
            });
        })
      

        this.geometry = new THREE.SphereBufferGeometry(0.0005 * this.data.size);
        this.material = new THREE.MeshBasicMaterial({color: this.data.color, opacity: 0.5, transparent: true});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.el.sceneEl.object3D.add(this.mesh);
    },
    update: function() {
        this.el.sceneEl.object3D.remove(this.mesh);
        this.geometry = new THREE.SphereBufferGeometry(0.0005 * this.data.size);
        this.material = new THREE.MeshBasicMaterial({color: this.data.color, opacity: 0.5, transparent: true});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.el.sceneEl.object3D.add(this.mesh);
    },
    tick: function () {
      
      
        if (!this.raycasterObj) { return; }  // Not intersecting.
    
        let intersection = this.raycasterObj.components.raycaster.getIntersection(this.el);
        if (!intersection) { return; }
      
        this.mesh.position.set(intersection.point.x, intersection.point.y, intersection.point.z);        
    
        var points = intersection.point
        
        if (this.triggerdown){
                // Check if a sphere already exists at this position
                var positionStr = `${points.x},${points.y},${points.z}`;
                if (this.boxes[positionStr]) {
                    return;  // A sphere already exists here, so don't create a new one
                }

                // Create a new box entity
               var box = document.createElement('a-box');

                // Set the box attributes
                // Scale is for the font-size
                box.setAttribute('scale', '0.015 0.015 0.015');
                box.setAttribute('color', this.data.color);
                box.setAttribute('class', 'removable');
                box.setAttribute('position', {x: points.x, y: points.y, z: points.z}); 
                box.setAttribute('networked', 'template:#boxx;attachTemplateToLocal:false;');
          
                // Add the box to the scene
                var scene = document.querySelector('a-scene');
                scene.appendChild(box);

                // Add this sphere's position to the list
                this.boxes[positionStr] = true;
            };
    },
});
