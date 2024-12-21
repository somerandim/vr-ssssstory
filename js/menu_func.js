// Selection Menu functionalities
/* global AFRAME, THREE*/

// You can modify it to add items inside.  


// provide a valid Index for an Array if the desiredIndex is greater or less than an array's length by "looping" around
function loopIndex(desiredIndex, arrayLength) {
    if (desiredIndex > arrayLength - 1) {
      return desiredIndex - arrayLength;
    }
    if (desiredIndex < 0) {
      return arrayLength + desiredIndex;
    }
    return desiredIndex;
  }
  
  // provide vector(x,y,z) that contains the bounding box sizes.
  function getBBSize(glbNames, index) {
    return new Promise((resolve, reject) => {
      var loader = new THREE.GLTFLoader();
  
      // Get the URL of the asset from <a-asset-item>
      const assetItem = document.getElementById(glbNames[index]);
      const srcUrl = assetItem.getAttribute("src");
  
      loader.load(
        srcUrl,
        (gltf) => {
          // Create a bounding box for the model
          let box = new THREE.Box3().setFromObject(gltf.scene);
  
          // Get the size of the bounding box
          let size = box.getSize(new THREE.Vector3());
  
          // Resolve the Promise with the size
          resolve(size);
        },
        undefined,
        reject
      ); // Pass the reject function to loader.load() in case of errors
    });
  }
  
  // This is the main menu component, added to the left controller
  // Having less than 3 elements will allow for duplicates to be shown
  // on the menu.
  AFRAME.registerComponent("menu-visibility", {
    schema: {
      flag: { default: true },
    },
    
    init: function () { 
      
          var currentIndex = 1;
          var loadingAssets = false;
          var arr = []; //whatever you need to insert in the selection menu 
          var glbNamesArray = ["car1", "sky", "light"];
          var glbURLs = ["https://cdn.glitch.global/c6122b7a-3eab-4004-b4fd-7b30b6f768c9/1974_volkswagen_golf_mk1_lp.glb?v=1710408026561",
                      "https://cdn.glitch.global/c6122b7a-3eab-4004-b4fd-7b30b6f768c9/sky_sphere.glb?v=1710405215865",
                      "https://cdn.glitch.global/c6122b7a-3eab-4004-b4fd-7b30b6f768c9/light_bulb.glb?v=1710405217672"]
     
      
          this.el.addEventListener("triggerup", (event) => {
            // Make the selection menu visible or invisible
            let controller1 = document.getElementById("lhand");
            let controller2 = document.getElementById("rhand");
            let vrEntity = document.getElementById("menu");
  
            if (this.flag) {
              // If the menu is turning on, remove movement control
              controller1.removeAttribute("oculus-thumbstick-controls");
              controller2.removeAttribute("oculus-thumbstick-controls");
  
              // Toggle visibility: On
              vrEntity.object3D.visible = true;  
              this.loadAssets(currentIndex);
  
              this.flag = false;
            } else {
              // Toggle visibility: Off
              vrEntity.object3D.visible = false;
  
              // If menu turning off, return the movement control
              controller1.setAttribute("oculus-thumbstick-controls", "");
              controller2.setAttribute("oculus-thumbstick-controls", "");
  
              this.flag = true;
            }
          });
  
          this.el.addEventListener("thumbstickmoved", (event) => {
            if (!loadingAssets && !this.flag) {
              loadingAssets = true;
              const thumbstickX = event.detail.x;
              if (thumbstickX > 0) {
                // Move right
                currentIndex = currentIndex + 1;
                if (currentIndex == glbNamesArray.length) {
                  currentIndex = 0;
                }
  
                // Get the arrow element
                const arrow = document.getElementById("arrow_right");
                const originalColor = arrow.getAttribute("color");
  
                // Change the color to yellow
                arrow.setAttribute("color", "yellow");
  
                // Revert the color back to original after 0.5 seconds
                setTimeout(() => {
                  arrow.setAttribute("color", originalColor);
                }, 200);
              } else if (thumbstickX < 0) {
                // Move left
                currentIndex = currentIndex - 1;
                if (currentIndex < 0) {
                  currentIndex = glbNamesArray.length - 1;
                }
                // Get the arrow element
                const arrow = document.getElementById("arrow_left");
                const originalColor = arrow.getAttribute("color");
  
                // Change the color to yellow
                arrow.setAttribute("color", "yellow");
  
                // Revert the color back to original after 0.5 seconds
                setTimeout(() => {
                  arrow.setAttribute("color", originalColor);
                }, 200);
              }
              this.loadAssets(currentIndex);
              setTimeout(() => {
                loadingAssets = false;
              }, 250);
            }
          });
      
          this.el.addEventListener("thumbstickup", (event) => { //if the thumbstick is pressed and released 
            if (!this.flag) {
              var currIndex = loopIndex(currentIndex, glbNamesArray.length);
  
              
              // If the sky is selected => change the color of the sky
              if (glbNamesArray[currIndex]=="sky"){
                
                var sky = document.getElementById("sky");
                
                // Get the current color of the sky
                var currentColor = sky.getAttribute("color");
  
                // If the current color is lightblue, change it to red; otherwise, change it to lightblue
                if (currentColor === "lightblue") {
                  sky.setAttribute("color", "red");
                } else {
                  sky.setAttribute("color", "lightblue");
                } 
              }
              
              // If the light is selected => change color of the light
              else if(glbNamesArray[currIndex]=="light"){
                 var light = document.getElementById("light");
  
                  // Get the current color of the light
                  var currentColor = light.getAttribute("color");
  
                  // If the current color is white, change it to green; otherwise, change it to white
                  if (currentColor === "white") {
                    light.setAttribute("color", "green");
                  } else {
                    light.setAttribute("color", "white");
                  }
              }
              else {
              // if the car is selected => add car on the scene
              var glbSrcs = ["car1", "sky1", "light1"]
              
              //get bounding box size and add the car 
              getBBSize(glbSrcs, currentIndex)
                .then((size) => {
                  var newEntity = document.createElement("a-entity");
                  newEntity.setAttribute("gltf-model", "#" + glbSrcs[currentIndex]); 
                  newEntity.setAttribute("position", `0 0 0`);
  
  
                  // to make the car grabbable add the mixin and dynamic body to bb (bounding box, not to the car itself)
                  var bb = document.createElement("a-entity");  
                  bb.setAttribute("geometry", `primitive: box; width: ${size.x}; height: ${size.y}; depth: ${size.z}`)
                  bb.setAttribute("material", "color:white; opacity:0")
                  bb.setAttribute("position", "-4 0.15 -7") 
                
                
                  // append the car inside the bounding box
                  bb.appendChild(newEntity)
                
                  // Add to the main scene, the bounding  box that contains the car
                  var scene = document.getElementById("scene");
                  scene.appendChild(bb);
  
                
                  // make the menu invisible after adding the asset
                  // Make the selection menu visible or invisible
                  let controller1 = document.getElementById("lhand");
                  let controller2 = document.getElementById("rhand");
                  let vrEntity = document.getElementById("menu");
                  // Toggle visibility: Off
                  vrEntity.object3D.visible = false;
  
                  // If menu turning off, return the movement control
                  controller1.setAttribute("oculus-thumbstick-controls", "");
                  controller2.setAttribute("oculus-thumbstick-controls", "");
  
                  this.flag = true;
                })
                .catch((error) => {
                  console.error("Error loading model:", error);
                });            }
            }
          });
      
    },
    tick: function () {},
    loadAssets: function(currentIndex){
      // this load assets is to show the assets on the menu with the text
      var glbSrcs = ["car1", "sky1", "light1"];
      var glbText = ["car", "sky", "light"];
      
      // check where we are in our circular array 0>1>2>0>1>2>0...
      var currIndex = loopIndex(currentIndex, glbSrcs.length);
      var prevIndex = loopIndex(currIndex - 1, glbSrcs.length);
      var nextIndex = loopIndex(currIndex + 1, glbSrcs.length);
  
      var menuAssets = document.getElementById("assets_menu");
  
      // empty the older assets to replace them with the correct ones
      while (menuAssets.firstChild) {
        menuAssets.removeChild(menuAssets.firstChild);
      }
      
      // add three new assets
      [prevIndex, currIndex, nextIndex].forEach((index, i) => {
        // Create a new entity
  
        getBBSize(glbSrcs, index)
          .then((size) => {
            var newEntity = document.createElement("a-entity");
            newEntity.setAttribute("gltf-model", "#" + glbSrcs[index]);
            newEntity.setAttribute("position", (i - 1) / 8.3 + " 0 0.03");
  
            // assets size
            var x = size.x;
            var y = size.y;
            var z = size.z;
  
           // resize them to 0.05 in order to fit better inside the menu
            newEntity.setAttribute(
              "scale",
              0.05 / x + " " + 0.05 / y + " " + 0.05 / z
            );
  
            // Add the new entity as a child of <a-entity id="menu_assets">
            menuAssets.appendChild(newEntity);
  
            // Create a text entity for the asset name
            var textEntity = document.createElement("a-entity");
            textEntity.setAttribute("text", {
              value: glbText[index],
              color: "#000000", // Black color
              width: 1, // Width of the text
              align: "center", // Center alignment
            });
            textEntity.setAttribute("position", (i - 1) / 8.3 + " -0.0425 0"); // Position above the model
            textEntity.setAttribute("scale", "0.2 0.2 0.2"); // Scale down the text
            menuAssets.appendChild(textEntity);
          })
          .catch((error) => {
            console.error("Error loading model:", error);
          });
      });
      
    }
  });