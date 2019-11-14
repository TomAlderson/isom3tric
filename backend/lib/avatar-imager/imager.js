const axios = require("axios");
var AvatarSprite = require("./sprite");
var path = require("path");
const { createCanvas, loadImage } = require("canvas");
require("dotenv").config();

var AvatarImager = function(ready, offsets) {
  this.LOCAL_RESOURCES_URL = process.env.BASE_URL + "/resource/";
  this.ready = ready ? ready : false;
  this.offsets = offsets ? offsets : {};

  this.initialize = onReady => {
    let p = this.loadFiles();
    Promise.all(p)
      .then(
        function(loaded) {
          this.ready = true;
          if (onReady != null) {
            onReady();
          }
        }.bind(this)
      )
      .catch(error => {
        console.log(error);
      });
  };

  this.isValidDirection = direction => {
    return Number.isInteger(direction) && direction >= 0 && direction <= 7;
  };

  this.getPartUniqueName = (type, partId) => {
    let uniqueName = this.figuremap[type][partId];
    if (uniqueName == null && type == "hrb") {
      uniqueName = this.figuremap["hr"][partId];
    }
    if (uniqueName == null) {
      uniqueName = this.figuremap[type][1];
    }
    if (uniqueName == null) {
      uniqueName = this.figuremap[type][0];
    }
    return uniqueName;
  };

  this.getFrameNumber = (type, action, frame) => {
    const translations = { wav: "Wave", wlk: "Move", spk: "Talk" };
    if (translations[action] != null) {
      if (this.animation[translations[action]].part[type] != null) {
        const count = this.animation[translations[action]].part[type].length;
        if (
          this.animation[translations[action]].part[type][frame % count] != null
        ) {
          return this.animation[translations[action]].part[type][frame % count]
            .number;
        }
      }
    }
    return 0;
  };

  this.getActivePartSet = partSet => {
    //let ret = [];
    let activeParts = this.partsets["activePartSet"][partSet]["activePart"];
    if (activeParts == null || activeParts.length == 0) {
      return false;
    }
    return activeParts;
    //let partSetData = this.partsets['partSet'];
    //activeParts.forEach(type => {
    //ret.push(type);
    //});
    //return ret;
  };

  this.getPartResource = (
    uniqueName,
    action,
    type,
    isSmall,
    partId,
    direction,
    frame,
    color
  ) => {
    let partFrame = this.getFrameNumber(type, action, frame);
    let resource = new AvatarSprite(
      uniqueName,
      action,
      type,
      isSmall,
      partId,
      direction,
      partFrame,
      color
    );
    return resource;
  };

  this.getDrawOrder = (action, direction) => {
    let drawOrder = this.draworder[action][direction];
    if (drawOrder == null || drawOrder.length == 0) {
      return false;
    }
    return drawOrder;
  };

  this.getColorByPaletteId = (paletteId, colorId) => {
    if (
      this.figuredata["palette"][paletteId] != null &&
      this.figuredata["palette"][paletteId][colorId] != null &&
      this.figuredata["palette"][paletteId][colorId]["color"] != null
    ) {
      return this.figuredata["palette"][paletteId][colorId]["color"];
    }
    return null;
  };

  this.getPartColor = figure => {
    let parts = {};
    let partSet = this.figuredata["settype"][figure.type];
    // console.log("partset", partSet["set"]);
    if (partSet["set"][figure.id]["part"] != null) {
      partSet["set"][figure.id]["part"].forEach(part => {
        //console.log(figure);
        //console.log(part);
        //console.log("paletteid: " + partSet.paletteid + " colors: " + figure.colors[part.colorindex - 1]);
        let element = {
          index: part.index,
          id: part.id,
          colorable: part.colorable
        };
        if (part.colorable) {
          element.color = this.getColorByPaletteId(
            partSet.paletteid,
            figure.colors[part.colorindex - 1]
          );
        }
        if (parts[part.type] == null) {
          parts[part.type] = [element];
        } else {
          parts[part.type].push(element);
        }
      });
    }
    //r63 ?

    parts.hidden = [];
    if (Array.isArray(partSet["set"][figure.id]["hidden"])) {
      for (partType of partSet["set"][figure.id]["hidden"]) {
        parts.hidden.push(partType);
      }
    }
    return parts;
  };

  this.getPartColorNew = (type, id, color) => {
    let ret = [];

    let partSet = this.figuredata["settype"][type];
    let cnt = [];

    partSet["set"][id]["part"].forEach(part => {
      ret[part["type"]][part["index"]] = {
        id: part["id"],
        colorable: part["colorable"],
        color: this.getColorByPaletteId(
          partset["paletteid"],
          color[part["colorindex"] - 1]
        )
      };

      if (part["type"] == "ch") {
        ret["cp"][part["index"]] = ret[part["type"]][part["index"]];
        cnt["cp"]++;
        ret["cc"][part["index"]] = ret[part["type"]][part["index"]];
        cnt["cc"]++;
      }
      if (part["type"] == "ls") {
        ret["lc"][part["index"]] = ret[part["type"]][part["index"]];
        cnt["lc"]++;
      }
      if (part["type"] == "rs") {
        ret["rc"][part["index"]] = ret[part["type"]][part["index"]];
        cnt["rc"]++;
      }
    });

    if (Array.isArray(partSet["set"][id]["hidden"])) {
      partSet["set"][id]["hidden"].forEach(partType => {
        ret["hidden"][type] = true;
      });
    }

    return ret;
  };

  this.generate = (avatarImage, canvasCallback) => {
    // console.log(avatarImage);
    if (!avatarImage.ok) {
      return null;
    }
    let tempCanvas = createCanvas("canvas");
    let tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = avatarImage.rectWidth;
    tempCanvas.height = avatarImage.rectHeight;
    tempCtx.fillStyle = "rgba(255, 255, 255, 0)";
    tempCtx.fillRect(0, 0, avatarImage.rectWidth, avatarImage.rectHeight);

    let activeParts = {};
    activeParts.rect = this.getActivePartSet(
      avatarImage.isHeadOnly ? "head" : "figure"
    );
    activeParts.head = this.getActivePartSet("head");
    activeParts.eye = this.getActivePartSet("eye");
    activeParts.gesture = this.getActivePartSet("gesture");
    activeParts.speak = this.getActivePartSet("speak");
    activeParts.walk = this.getActivePartSet("walk");
    activeParts.sit = this.getActivePartSet("sit");
    activeParts.itemRight = this.getActivePartSet("itemRight");
    activeParts.handRight = this.getActivePartSet("handRight");
    activeParts.handLeft = this.getActivePartSet("handLeft");
    activeParts.swim = this.getActivePartSet("swim");

    let drawParts = this.getDrawOrder(
      avatarImage.drawOrder,
      avatarImage.direction
    );
    if (drawParts === false) {
      drawParts = this.getDrawOrder("std", avatarImage.direction);
    }

    let setParts = {};
    for (partSet of avatarImage.figure) {
      const parts = this.getPartColor(partSet);
      for (type in parts) {
        if (setParts[type] == null) {
          setParts[type] = [];
        }
        setParts[type] = parts[type].concat(setParts[type]);
      }
    }

    if (avatarImage.handItem !== false) {
      setParts["ri"] = [{ index: 0, id: avatarImage.handItem }];
    }

    let chunks = [];
    let offsetsPromises = [];

    for (type of drawParts) {
      let drawableParts = setParts[type];
      if (drawableParts != null) {
        for (drawablePart of drawableParts) {
          let uniqueName = this.getPartUniqueName(type, drawablePart["id"]);
          if (uniqueName != null) {
            //console.log(type + " -> " + drawablePart["id"] + " -> " + uniqueName);

            if (setParts.hidden.includes(type)) {
              continue;
            }

            if (!activeParts.rect.includes(type)) {
              continue;
            }

            let drawDirection = avatarImage.direction;
            let drawAction = false;
            if (activeParts.rect.includes(type)) {
              drawAction = avatarImage.drawAction["body"];
            }
            if (activeParts.head.includes(type)) {
              drawDirection = avatarImage.headDirection;
            }
            if (
              activeParts.speak.includes(type) &&
              avatarImage.drawAction["speak"]
            ) {
              drawAction = avatarImage.drawAction["speak"];
            }
            if (
              activeParts.gesture.includes(type) &&
              avatarImage.drawAction["gesture"]
            ) {
              drawAction = avatarImage.drawAction["gesture"];
            }
            if (activeParts.eye.includes(type)) {
              drawablePart.colorable = false;
              if (avatarImage.drawAction["eye"]) {
                drawAction = avatarImage.drawAction["eye"];
              }
            }
            if (
              activeParts.walk.includes(type) &&
              avatarImage.drawAction["wlk"]
            ) {
              drawAction = avatarImage.drawAction["wlk"];
            }
            if (
              activeParts.sit.includes(type) &&
              avatarImage.drawAction["sit"]
            ) {
              drawAction = avatarImage.drawAction["sit"];
            }
            if (
              activeParts.handRight.includes(type) &&
              avatarImage.drawAction["handRight"]
            ) {
              drawAction = avatarImage.drawAction["handRight"];
            }
            if (
              activeParts.itemRight.includes(type) &&
              avatarImage.drawAction["itemRight"]
            ) {
              drawAction = avatarImage.drawAction["itemRight"];
            }
            if (
              activeParts.handLeft.includes(type) &&
              avatarImage.drawAction["handLeft"]
            ) {
              drawAction = avatarImage.drawAction["handLeft"];
            }
            if (
              activeParts.swim.includes(type) &&
              avatarImage.drawAction["swim"]
            ) {
              drawAction = avatarImage.drawAction["swim"];
            }

            if (!drawAction) {
              continue;
            }

            //if (this.offsets[uniqueName] == null) {
            offsetsPromises.push(this.downloadOffsetAsync(uniqueName));
            //}

            let color = drawablePart.colorable ? drawablePart.color : null;
            console.log(color);
            console.log(uniqueName);
            let drawPartChunk = this.getPartResource(
              uniqueName,
              drawAction,
              type,
              avatarImage.isSmall,
              drawablePart["id"],
              drawDirection,
              avatarImage.frame,
              color
            );
            chunks.push(drawPartChunk);
          }
        }
      }
    }

    Promise.all(offsetsPromises).then(
      function() {
        // console.log("offsets ok!");

        let chunksPromises = [];

        for (chunk of chunks) {
          //console.log(chunk);

          if (
            this.offsets[chunk.lib] != null &&
            this.offsets[chunk.lib][chunk.getResourceName()] != null &&
            !this.offsets[chunk.lib][chunk.getResourceName()].flipped
          ) {
            //console.log("Found sprite: " + chunk.getResourceName());
            chunksPromises.push(chunk.downloadAsync());
          } else {
            let flippedType = this.partsets.partSet[chunk.type][
              "flipped-set-type"
            ];
            if (flippedType != "") {
              chunk.resType = flippedType;
            }
            if (
              this.offsets[chunk.lib] == null ||
              this.offsets[chunk.lib][chunk.getResourceName()] == null ||
              (this.offsets[chunk.lib][chunk.getResourceName()].flipped &&
                chunk.action == "std")
            ) {
              //console.log("Not found... " + chunk.getResourceName());
              //chunk.resType = chunk.type;
              chunk.resAction = "spk";
            }
            if (
              this.offsets[chunk.lib] == null ||
              this.offsets[chunk.lib][chunk.getResourceName()] == null ||
              this.offsets[chunk.lib][chunk.getResourceName()].flipped
            ) {
              //console.log("Not found... " + chunk.getResourceName());
              chunk.isFlip = true;
              chunk.resAction = chunk.action;
              //chunk.resType = chunk.type;
              chunk.resDirection = 6 - chunk.direction;
            }
            if (
              this.offsets[chunk.lib] == null ||
              this.offsets[chunk.lib][chunk.getResourceName()] == null ||
              this.offsets[chunk.lib][chunk.getResourceName()].flipped
            ) {
              //console.log("Not found... " + chunk.getResourceName());
              chunk.resAction = chunk.action;
              chunk.resType = flippedType;
              chunk.resDirection = chunk.direction;
            }
            if (
              this.offsets[chunk.lib] == null ||
              this.offsets[chunk.lib][chunk.getResourceName()] == null ||
              (this.offsets[chunk.lib][chunk.getResourceName()].flipped &&
                chunk.artion == "std")
            ) {
              //console.log("Not found... " + chunk.getResourceName());
              chunk.resAction = "spk";
              chunk.resType = chunk.type;
            }
            if (
              this.offsets[chunk.lib] != null &&
              this.offsets[chunk.lib][chunk.getResourceName()] != null &&
              !this.offsets[chunk.lib][chunk.getResourceName()].flipped
            ) {
              //console.log("Found sprite: " + chunk.getResourceName());
              chunksPromises.push(chunk.downloadAsync());
            } else {
              //console.log("Not found... " + chunk.getResourceName());
            }
          }
        }

        Promise.all(chunksPromises)
          .catch(function(a) {})
          .then(
            function() {
              for (chunk of chunks) {
                if (
                  this.offsets[chunk.lib] != null &&
                  this.offsets[chunk.lib][chunk.getResourceName()] != null
                ) {
                  //console.log(chunk);
                  if (chunk.resource != null) {
                    let posX = -this.offsets[chunk.lib][chunk.getResourceName()]
                      .x;
                    let posY =
                      avatarImage.rectHeight / 2 -
                      this.offsets[chunk.lib][chunk.getResourceName()].y +
                      avatarImage.rectHeight / 2.5;
                    //console.log("x: " + posX + " - y: " + posY + " - color: " + chunk.color );

                    let img = chunk.resource;

                    if (chunk.color != null) {
                      img = this.tintSprite(img, chunk.color);
                      // console.log("tinted", img);
                    }
                    if (chunk.isFlip) {
                      posX = -(posX + img.width - avatarImage.rectWidth + 1);
                      img = this.flipSprite(img);
                    }
                    // Lay seems to plant the image too far to the left and too far down, this is the best fix I can do for now to get over this hump.
                    if (avatarImage.action.includes("lay")) {
                      posX += avatarImage.rectWidth / 2;
                      posY -= 5;
                    }
                    tempCtx.drawImage(img, posX, posY);
                  } else {
                    console.log("Missing resource: " + chunk.getResourceName());
                  }
                }
              }

              canvasCallback(tempCanvas);
            }.bind(this)
          );
      }.bind(this)
    );
  };

  this.generatePart = (avatarImage, partType, partID, partColor, format = "png", canvasCallback) => {
    let isHeadOnly = (partType == "hd");

    
    let tempCanvas = createCanvas("canvas");
    let tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = avatarImage.rectWidth;
    tempCanvas.height = avatarImage.rectHeight;
    tempCtx.fillStyle = "rgba(0, 0, 0, 0)";
    // tempCtx.fillRect(0, 0, avatarImage.rectWidth, avatarImage.rectHeight);

    let drawParts = this.getDrawOrder("std", avatarImage.direction);

    let activeParts = {};
    activeParts.rect = this.getActivePartSet(
      avatarImage.isHeadOnly ? "head" : "figure"
    );
    activeParts.eye = this.getActivePartSet("eye");

    let setParts = {};
    if(partType == "ri" || partType == "li") {
      setParts[partType] = [{ index: 0, id: partID, colorable: false }];
    }else{
      setParts = this.getPartColor({
        type: partType,
        id: partID,
        colors: partColor
      })
    }

    let chunks = [];
    let offsetsPromises = [];

    for (type of drawParts) {
      let drawableParts = setParts[type];
      if (drawableParts != null) {
        for (drawablePart of drawableParts) {
          let uniqueName = this.getPartUniqueName(type, drawablePart["id"]);
          if (uniqueName != null) {
            //console.log(type + " -> " + drawablePart["id"] + " -> " + uniqueName);

            if (setParts.hidden.includes(type)) {
              continue;
            }

            if (!activeParts.rect.includes(type)) {
              continue;
            }

            let drawDirection = avatarImage.direction;
            let drawAction = "std";
            drawablePart.colorable = true;

            if (activeParts.eye.includes(type)) {
              drawablePart.colorable = false;
            }
            
            

            if (!drawAction) {
              continue;
            }



            //if (this.offsets[uniqueName] == null) {
            offsetsPromises.push(this.downloadOffsetAsync(uniqueName));
            //}


            let color = drawablePart.colorable ? drawablePart.color : null;
            let drawPartChunk = this.getPartResource(
              uniqueName,
              drawAction,
              type,
              avatarImage.isSmall,
              drawablePart["id"],
              drawDirection,
              avatarImage.frame,
              color
            );
            chunks.push(drawPartChunk);
          }
        }
      }
    }

    Promise.all(offsetsPromises).then(
      function() {
        // console.log("offsets ok!");

        let chunksPromises = [];

        for (chunk of chunks) {
          //console.log(chunk);

          if (
            this.offsets[chunk.lib] != null &&
            this.offsets[chunk.lib][chunk.getResourceName()] != null &&
            !this.offsets[chunk.lib][chunk.getResourceName()].flipped
          ) {
            //console.log("Found sprite: " + chunk.getResourceName());
            chunksPromises.push(chunk.downloadAsync());
          } else {
            let flippedType = this.partsets.partSet[chunk.type][
              "flipped-set-type"
            ];
            if (flippedType != "") {
              chunk.resType = flippedType;
            }
            if (
              this.offsets[chunk.lib] == null ||
              this.offsets[chunk.lib][chunk.getResourceName()] == null ||
              (this.offsets[chunk.lib][chunk.getResourceName()].flipped &&
                chunk.action == "std")
            ) {
              //console.log("Not found... " + chunk.getResourceName());
              //chunk.resType = chunk.type;
              chunk.resAction = "spk";
            }
            if (
              this.offsets[chunk.lib] == null ||
              this.offsets[chunk.lib][chunk.getResourceName()] == null ||
              this.offsets[chunk.lib][chunk.getResourceName()].flipped
            ) {
              //console.log("Not found... " + chunk.getResourceName());
              chunk.isFlip = true;
              chunk.resAction = chunk.action;
              //chunk.resType = chunk.type;
              chunk.resDirection = 6 - chunk.direction;
            }
            if (
              this.offsets[chunk.lib] == null ||
              this.offsets[chunk.lib][chunk.getResourceName()] == null ||
              this.offsets[chunk.lib][chunk.getResourceName()].flipped
            ) {
              //console.log("Not found... " + chunk.getResourceName());
              chunk.resAction = chunk.action;
              chunk.resType = flippedType;
              chunk.resDirection = chunk.direction;
            }
            if (
              this.offsets[chunk.lib] == null ||
              this.offsets[chunk.lib][chunk.getResourceName()] == null ||
              (this.offsets[chunk.lib][chunk.getResourceName()].flipped &&
                chunk.artion == "std")
            ) {
              //console.log("Not found... " + chunk.getResourceName());
              chunk.resAction = "spk";
              chunk.resType = chunk.type;
            }
            if (
              this.offsets[chunk.lib] != null &&
              this.offsets[chunk.lib][chunk.getResourceName()] != null &&
              !this.offsets[chunk.lib][chunk.getResourceName()].flipped
            ) {
              //console.log("Found sprite: " + chunk.getResourceName());
              chunksPromises.push(chunk.downloadAsync());
            } else {
              //console.log("Not found... " + chunk.getResourceName());
            }
          }
        }

        Promise.all(chunksPromises)
          .catch(function(a) {})
          .then(
            function() {
              for (chunk of chunks) {
                if (
                  this.offsets[chunk.lib] != null &&
                  this.offsets[chunk.lib][chunk.getResourceName()] != null
                ) {
                  console.log(chunk);
                  if (chunk.resource != null) {
                    let posX = -this.offsets[chunk.lib][chunk.getResourceName()]
                      .x;
                    let posY =
                      avatarImage.rectHeight / 2 -
                      this.offsets[chunk.lib][chunk.getResourceName()].y +
                      avatarImage.rectHeight / 2.5;
                    //console.log("x: " + posX + " - y: " + posY + " - color: " + chunk.color );

                    let img = chunk.resource;
                    if (chunk.color != null) {
                      img = this.tintSprite(img, chunk.color);
                    }
                    if (chunk.isFlip) {
                      posX = -(posX + img.width - avatarImage.rectWidth + 1);
                      img = this.flipSprite(img);
                    }
                    tempCtx.drawImage(img, posX, posY);
                  } else {
                    console.log("Missing resource: " + chunk.getResourceName());
                  }
                }
              }

              canvasCallback(tempCanvas);
            }.bind(this)
          );
      }.bind(this)
    );

  }

  this.hex2rgb = hex => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  };

  this.flipSprite = img => {
    // A bit of debug to test flipping the canvas to.
    var temporaryCanvas = createCanvas("canvas");
    var temporaryContext = temporaryCanvas.getContext("2d");

    temporaryCanvas.width = img.width;
    temporaryCanvas.height = img.height;
    temporaryContext.translate(img.width, 0);
    temporaryContext.scale(-1, 1);
    temporaryContext.drawImage(img, 0, 0);
    // console.log(temporaryCanvas.toDataURL());
    // The above code is not used at all besides testing the ability to flip the canvas.

    return temporaryCanvas;
  };

  this.tintSprite = (img, color) => {
    let element = createCanvas("canvas");
    let c = element.getContext("2d");

    let rgb = this.hex2rgb(color);

    let width = img.width;
    let height = img.height;

    element.width = width;
    element.height = height;

    c.drawImage(img, 0, 0);
    let imageData = c.getImageData(0, 0, width, height);
    for (let y = 0; y < height; y++) {
      let inpos = y * width * 4;
      for (let x = 0; x < width; x++) {
        let pr = imageData.data[inpos++];
        let pg = imageData.data[inpos++];
        let pb = imageData.data[inpos++];
        let pa = imageData.data[inpos++];
        if (pa != 0) {
          imageData.data[inpos - 2] = Math.round(
            (rgb.b * imageData.data[inpos - 2]) / 255
          ); //B
          imageData.data[inpos - 3] = Math.round(
            (rgb.g * imageData.data[inpos - 3]) / 255
          ); //G
          imageData.data[inpos - 4] = Math.round(
            (rgb.r * imageData.data[inpos - 4]) / 255
          ); //R
        }
      }
    }
    c.putImageData(imageData, 0, 0);
    return element;
  };

  this.downloadJsonAsync = (key, url) => {
    return axios
      .get(url)
      .then(response => {
        // console.log(response.data);
        this[key] = response.data;
      })
      .catch(error => {
        console.error(error);
        // reject("Error downloading " + url);
      });
  };

  this.downloadOffsetAsync = uniqueName => {
    this.offsets[uniqueName] = {};
    return axios
      .get(this.LOCAL_RESOURCES_URL + uniqueName + "/offset.json")
      .then(response => {
        this.offsets[uniqueName] = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  };

  this.loadFiles = () => {
    return [
      this.downloadJsonAsync(
        "figuremap",
        this.LOCAL_RESOURCES_URL + "map.json"
      ),
      this.downloadJsonAsync(
        "figuredata",
        this.LOCAL_RESOURCES_URL + "figuredata.json"
      ),
      this.downloadJsonAsync(
        "partsets",
        this.LOCAL_RESOURCES_URL + "partsets.json"
      ),
      this.downloadJsonAsync(
        "draworder",
        this.LOCAL_RESOURCES_URL + "draworder.json"
      ),
      this.downloadJsonAsync(
        "animation",
        this.LOCAL_RESOURCES_URL + "animation.json"
      )
    ];
  };
};

module.exports = AvatarImager;
