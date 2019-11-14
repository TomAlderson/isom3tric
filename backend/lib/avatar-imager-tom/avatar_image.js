const axios = require("axios");
const empty = require("locutus/php/var/empty");
const strstr = require("locutus/php/strings/strstr");
const reset = require("locutus/php/array/reset");
const { createCanvas } = require("canvas");
const LOCAL_RESOURCE_URL = process.env.BASE_URL + "/resource/";
require("dotenv").config();

var AvatarImageTom = function(
  figure,
  direction,
  headDirection,
  action,
  gesture,
  frame,
  isHeadOnly,
  scale
) {
  // Settings
  this.version = "1.0 / November.14 2019";
  this.processTime = 0;
  this.error = null;
  this.debug = "";
  this.settings = {};
  this.ready = false;
  this.format = "png";
  this.figure = [];
  this.direction = 0;
  this.headDirection = 0;
  this.action = ["std"]; //std, sit, lay, wlk, wav, sit-wav, swm
  this.gesture = "std"; //std, agr, sml, sad, srp, spk, eyb
  this.frame = [0];
  this.isLarge = false;
  this.isSmall = false;
  this.isHeadOnly = false;
  this.rectWidth = 64;
  this.rectHeight = 110;

  this.handItem = false;
  this.drawAction = {
    body: "std",
    wlk: false,
    sit: false,
    gesture: false,
    eye: false,
    speak: false,
    itemRight: false,
    handRight: false,
    handLeft: false,
    swm: false
  };
  this.drawOrder = "std";

  const avatarImage = this;

  // Functions
  this.initialize = onReady => {
    let p = this.loadSettings();
    Promise.all(p)
      .then(
        function(loaded) {
          avatarImage.ready = true;
          if (onReady != null) {
            onReady();
          }
        }.bind(this)
      )
      .catch(error => {
        console.log(error);
      });
  };

  // Download JSON Files.
  this.downloadJson = function(key, url) {
    return axios
      .get(url)
      .then(response => {
        // console.log(response.data);
        this.settings[key] = response.data;
      })
      .catch(error => {
        console.error(error);
        // reject("Error downloading " + url);
      });
  };

  this.loadSettings = () => {
    return [
      this.downloadJson("figuremap", LOCAL_RESOURCE_URL + "map.json"),
      this.downloadJson("figuredata", LOCAL_RESOURCE_URL + "figuredata.json"),
      this.downloadJson("partsets", LOCAL_RESOURCE_URL + "partsets.json"),
      this.downloadJson("draworder", LOCAL_RESOURCE_URL + "draworder.json"),
      this.downloadJson("animation", LOCAL_RESOURCE_URL + "animation.json")
    ];
  };

  // Constructor code.
  this.constructor = () => {
    let timeStart = new Date().getTime();

    avatarImage.direction = avatarImage.validateDirection(direction)
      ? direction
      : 0;
    avatarImage.headDirection = avatarImage.validateDirection(headDirection)
      ? headDirection
      : 0;

    switch (scale) {
      case "l":
        avatarImage.isLarge = true;
        break;
      case "s":
        avatarImage.isSmall = true;
        avatarImage.rectWidth = 32;
        avatarImage.rectHeight = 55;
        break;
    }

    if (isHeadOnly) {
      avatarImage.isHeadOnly = true;
    }

    if (figure) {
      let parts = figure.split(".");

      if (parts.length == 0) {
        let timeEnd = new Date().getTime();
        avatarImage.processTime = timeEnd - timeStart;
        return false;
      }

      parts.forEach(value => {
        let data = value.split("-");
        avatarImage.figure.push({
          type: data[0],
          id: data[1],
          color: [data[2], data[3]]
        });
      });

      frame = Array.isArray(frame) ? frame : [frame];

      frame.forEach(value => {
        let _frame = value.split("=");
        let _action = _frame[0] != "" ? _frame[0] : "def";
        if (_frame[1]) avatarImage.frame[_action] = _frame[1];
      });

      avatarImage.gesture = gesture;
      switch (avatarImage.gesture) {
        case "spk":
          avatarImage.drawAction["speak"] = avatarImage.gesture;
          break;
        case "eyb":
          avatarImage.drawAction["eyb"] = avatarImage.gesture;
          break;
        case "":
          avatarImage.drawAction["gesture"] = "std";
          break;
        default:
          avatarImage.drawAction["gesture"] = avatarImage.gesture;
          break;
      }

      avatarImage.action = Array.isArray(action) ? action : [action];
      avatarImage.action.forEach(value => {
        let _action = value.split("=");
        switch (_action[0]) {
          case "wlk":
          case "sit":
            avatarImage.drawAction[_action[0]] = _action[0];
            break;
          case "lay":
            avatarImage.drawAction["body"] = _action[0];
            avatarImage.drawAction["eye"] = _action[0];
            avatarImage.rectWidth = avatarImage.rectHeight;
            avatarImage.rectHeight = avatarImage.rectWidth;
            switch (avatarImage.gesture) {
              case "spk":
                avatarImage.drawAction["speak"] = "lsp";
                avatarImage.frame["lsp"] =
                  avatarImage.frame[avatarImage.gesture];
                break;
              case "eyb":
                avatarImage.drawAction["eye"] = "ley";
                break;
              case "std":
                avatarImage.drawAction["gesture"] = _action[0];
                break;
              default:
                avatarImage.drawAction["gesture"] =
                  "l" + this.gesture.substring(0, 2);
                break;
            }
            break;
          case "wav":
            avatarImage.drawAction["handLeft"] = _action[0];
            break;
          case "crr":
          case "drk":
            avatarImage.drawAction["handRight"] = _action[0];
            avatarImage.drawAction["itemRight"] = _action[0];
            avatarImage.handItem = _action[1];
            break;
          case "swm":
            avatarImage.drawAction[_action[0]] = _action[0];
            if (avatarImage.gesture == "spk") {
              avatarImage.drawAction["speak"] = "sws";
            }
            break;
          case "":
            avatarImage.drawAction["body"] = "std";
            break;
          default:
            avatarImage.drawAction["body"] = _action[0];
            break;
        }
      });

      if (avatarImage.drawAction["sit"] == "sit") {
        if (avatarImage.direction >= 2 && avatarImage.direction <= 4) {
          avatarImage.drawOrder = "sit";
          if (
            avatarImage.drawAction["handRight"] == "drk" &&
            avatarImage.direction >= 2 &&
            avatarImage.direction <= 3
          ) {
            avatarImage.drawOrder += ".rh-up";
          } else if (
            avatarImage.drawOrder["handLeft"] &&
            avatarImage.direction == 4
          ) {
            avatarImage.drawOrder += ".lh-up";
          }
        }
      } else if (avatarImage.drawAction["body"] == "lay") {
        avatarImage.drawOrder = "lay";
      } else if (
        avatarImage.drawAction["handRight"] == "drk" &&
        avatarImage.direction >= 0 &&
        avatarImage.direction <= 3
      ) {
        avatarImage.drawOrder = "rh-up";
      } else if (
        avatarImage.drawAction["handLeft"] &&
        avatarImage.direction >= 4 &&
        avatarImage.direction <= 6
      ) {
        avatarImage.drawOrder = "lh-up";
      }
    } else {
      avatarImage.action = action;
    }

    let timeEnd = new Date().getTime();
    avatarImage.processTime = timeEnd - timeStart;

    return true;
  };

  //Hex2RGB converter.
  this.hex2rgb = hex => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ]
      : null;
  };

  // validateDirection function.
  this.validateDirection = direction => {
    return Number.isInteger(direction) && direction >= 0 && direction <= 7;
  };

  // Get Active Part Set
  this.getActivePartSet = (partSet, addAttr = false) => {
    let ret = [];

    let activeParts =
      avatarImage.settings["partsets"]["activePartSet"][partSet]["activePart"];
    if (activeParts.length == 0) return false;
    let partSetData = avatarImage.settings["partsets"]["partSet"];
    console.log(ret);
    activeParts.forEach(type => {
      ret[type] = {
        active: true
      };
      if (addAttr) {
        let partData = partSetData[type];
        ret[type]["remove"] = partData["remove-set-type"];
        ret[type]["flip"] = partData["flipped-set-type"];
        ret[type]["swim"] = partData["swim"];
      }
    });

    return ret;
  };

  // Get the draw order.
  this.getDrawOrder = (action, direction) => {
    let drawOrder = avatarImage.settings["draworder"][action][direction];
    if (drawOrder.length == 0) return false;
    return drawOrder;
  };

  // Get the colour of a specific part.
  this.getPartColor = (type, partID, colorID) => {
    let ret = {};

    let partSet = avatarImage.settings["figuredata"]["settype"][type];
    let cnt = [];

    partSet["set"][partID]["part"].forEach(part => {
      ret[part["type"]][part["index"]] = {
        id: part["id"],
        colorable: part["colorable"],
        color: avatarImage.getColorByPaletteID(
          partSet["paletteid"],
          colorID[part["colorindex"] - 1]
        )
      };
    });
  };

  // Get the palette ID by colour.
  this.getColorByPaletteID = (paletteID, colorID) => {
    let ret =
      avatarImage.settings["figuredata"]["palette"][paletteID][colorID][
        "color"
      ];
    return ret.length == 0
      ? reset(avatarImage.settings["figuredata"]["palette"][paletteID])["color"]
      : ret;
  };

  // Get unique name of specific part.
  this.getPartUniqueName = (type, partID) => {
    let uniqueName = avatarImage.settings["map"][type][partID];
    if (empty(uniqueName) && type == "hrb")
      uniqueName = avatarImage.settings["map"]["hr"][partID];
    if (empty(uniqueName)) uniqueName = avatarImage.settings["map"][type][1];
    if (empty(uniqueName)) uniqueName = avatarImage.settings["map"][type][0];
    uniqueName = uniqueName.replace("_50_", "_");
    if (avatarImage.isSmall && strstr(uniqueName, "hh_human_"))
      uniqueName = uniqueName.replace("hh_human_", "hh_human_50_");
    return uniqueName;
  };

  this.getFrameNumber = (type, action, frame) => {
    const translations = { wav: "Wave", wlk: "Move", spk: "Talk" };
    if (translations[action] != null) {
      if (avatarImage.animation[translations[action]].part[type] != null) {
        const count =
          avatarImage.animation[translations[action]].part[type].length;
        if (
          avatarImage.animation[translations[action]].part[type][
            frame % count
          ] != null
        ) {
          return avatarImage.animation[translations[action]].part[type][
            frame % count
          ].number;
        }
      }
    }
    return 0;
  };

  this.buildResourceName = (
    action,
    type,
    partId,
    direction,
    frame,
    uniqueName = false
  ) => {
    let resourceName = "";

    if (uniqueName) {
      resourceName += LOCAL_RESOURCE_URL + uniqueName + "/" + uniqueName;
      resourceName += "_";
    }

    resourceName += avatarImage.isSmall ? "sh" : "h";
    resourceName += "_";
    resourceName += action;
    resourceName += "_";
    resourceName += type;
    resourceName += "_";
    resourceName += partId;
    resourceName += "_";
    resourceName += direction;
    resourceName += "_";
    resourceName += frame;

    if (uniqueName) {
      resourceName += ".png";
    }

    return resourceName;
  };

  this.getPartResource = (uniqueName, action, type, partId, direction) => {
    let frame = avatarImage.getFrameNumber(
      type,
      action,
      avatarImage.frame[action]
    );
    let isFlip = false;

    let resDirection = direction;

    if (type == "hd" && avatarImage.isSmall) partId = 1;
    if (type == "ey" && action == "std" && partId == 1 && direction == 3)
      action = "sml";
    if (
      type == "fa" &&
      action == "std" &&
      partId == 2 &&
      (direction == 2 || direcion == 4)
    )
      resDirection = 1;
    if (type == "he" && action == "std" && partId == 1) {
      if (direction == 2) {
        resDirection = 0;
      }
      if (direction >= 4 && direction <= 6) {
        return false;
      }
    }
    if (type == "he" && action == "std" && partId == 8)
      resDirection = direction % 2 == 0 ? 1 : resDirection;
    if (
      type == "he" &&
      action == "std" &&
      (partId == 2131 || partId == 2132) &&
      direction >= 2 &&
      direction <= 6
    )
      resDirection = 1;
    if (type == "ha" && action == "std" && partId == 2518)
      resDirection = direction % 2 == 0 ? 2 : 1;
    if (type == "ha" && action == "std" && partId == 2519)
      resDirection = direction % 2 == 0 ? 2 : 3;
    if (type == "ha" && action == "std" && partId == 2588) resDirection = 7;
    if (type == "ha" && action == "std" && partId == 2589) resDirection = 3;
    if (uniqueName == "acc_chest_U_backpack")
      uniqueName = "acc_chest_U_backpack1";

    let resourceName = LOCAL_RESOURCE_URL + uniqueName + "/" + uniqueName;
    resourceName += "_";
    resourceName += avatarImage.build;
  };

  this.setPartColor = (resource, color) => {
    let element = createCanvas("canvas");
    let c = element.getContext("2d");

    let rgb = this.hex2rgb(color);

    let width = resource.width;
    let height = resource.height;

    element.width = width;
    element.height = height;

    c.drawImage(resource, 0, 0);
    let imageData = c.getImageData(0, 0, width, height);
    // TODO - This will currently NOT work (I dont think as it will look for rgb.b,g and r which are not returned, but we can fix that later.)
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

  // Avatar generator.
  this.generate = format => {
    let timeStart = new Date().getTime();

    // Canvas generator for the image.
    let tempCanvas = createCanvas("canvas");
    let tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = avatarImage.rectWidth;
    tempCanvas.height = avatarImage.rectHeight;
    tempCtx.fillStyle = "rgba(255, 255, 255, 0)";
    tempCtx.fillRect(0, 0, avatarImage.rectWidth, avatarImage.rectHeight);

    let activeParts = {};
    activeParts["rect"] = avatarImage.getActivePartSet(
      avatarImage.isHeadOnly ? "head" : "figure",
      true
    );
    activeParts["head"] = avatarImage.getActivePartSet("head");
    activeParts["eye"] = avatarImage.getActivePartSet("eye");
    activeParts["gesture"] = avatarImage.getActivePartSet("gesture");
    activeParts["speak"] = avatarImage.getActivePartSet("speak");
    activeParts["walk"] = avatarImage.getActivePartSet("walk");
    activeParts["sit"] = avatarImage.getActivePartSet("sit");
    activeParts["itemRight"] = avatarImage.getActivePartSet("itemRight");
    activeParts["handRight"] = avatarImage.getActivePartSet("handRight");
    activeParts["handLeft"] = avatarImage.getActivePartSet("handLeft");
    activeParts["swim"] = avatarImage.getActivePartSet("swim");

    let drawParts = avatarImage.getDrawOrder(
      avatarImage.drawOrder,
      avatarImage.direction
    );
    if (drawParts === false) {
      drawParts = avatarImage.getDrawOrder("std", avatarImage.direction);
    }

    let setParts = [];
    avatarImage.figure.forEach(partSet => {
      setParts.concat(
        avatarImage.getPartColor(
          partSet["type"],
          partSet["id"],
          partSet["color"]
        )
      );
    });

    if (avatarImage.handItem != false) {
      setParts["ri"][0] = { id: avatarImage.handItem };
    }

    drawCount = 0;
    drawParts.forEach(type => {
      if (setParts[type]) {
        let drawPartArray = setParts[type];
      } else {
        return;
      }

      drawPartArray.forEach(drawPart => {
        if (setParts["hidden"][type]) {
          return;
        }

        if (Array.isArray(drawPart)) {
          return;
        }

        if (avatarImage.getPartUniqueName(type, drawPart["id"]) == "") {
          return;
        }

        if (avatarImage.isHeadOnly && !activeParts["rect"][type]["active"]) {
          return;
        }

        let drawDirection = avatarImage.direction;
        let drawAction = false;

        if (activeParts["rect"][type]["active"]) {
          drawAction = avatarImage.drawAction["body"];
        }

        if (activeParts["head"][type]["active"]) {
          drawDirection = avatarImage.headDirection;
        }

        if (
          activeParts["speak"][type]["active"] &&
          avatarImage.drawAction["speak"]
        ) {
          drawAction = avatarImage.drawAction["speak"];
        }

        if (
          activeParts["gesture"][type]["active"] &&
          avatarImage.drawAction["gesture"]
        ) {
          drawAction = avatarImage.drawAction["gesture"];
        }

        if (activeParts["eye"][type]["active"]) {
          drawPart["colorable"] = false;
          if (avatarImage.drawAction["eye"]) {
            drawAction = avatarImage.drawAction["eye"];
          }
        }

        if (
          activeParts["walk"][type]["active"] &&
          avatarImage.drawAction["wlk"]
        ) {
          drawAction = avatarImage.drawAction["wlk"];
        }

        if (
          activeParts["sit"][type]["active"] &&
          avatarImage.drawAction["sit"]
        ) {
          drawAction = avatarImage.drawAction["sit"];
        }

        if (
          activeParts["handRight"][type]["active"] &&
          avatarImage.drawAction["handRight"]
        ) {
          drawAction = avatarImage.drawAction["handRight"];
        }

        if (
          activeParts["itemRight"][type]["active"] &&
          avatarImage.drawAction["itemRight"]
        ) {
          drawAction = avatarImage.drawAction["itemRight"];
        }

        if (
          activeParts["handLeft"][type]["active"] &&
          avatarImage.drawAction["handLeft"]
        ) {
          drawAction = avatarImage.drawAction["handLeft"];
        }

        if (
          activeParts["swim"][type]["active"] &&
          avatarImage.drawAction["swm"]
        ) {
          drawAction = avatarImage.drawAction["swm"];
        }

        if (!drawAction) {
          return;
        }

        let uniqueName = avatarImage.getPartUniqueName(type, drawPart["id"]);

        let drawPartRect = avatarImage.getPartResource(
          uniqueName,
          drawAction,
          type,
          drawPart["id"],
          drawDirection
        );
        drawCount++;

        if (drawPartRect == false) {
          avatarImage.debug += `PART[${drawAction}][${type}][${
            drawPart["id"]
          }][${drawDirection}][${avatarImage.getFrameNumber(
            type,
            drawAction,
            avatarImage.frame[drawAction]
          )}]`;
          return;
        } else {
          avatarImage.debug += `${drawPartRect["lib"]}:${drawPartRect["name"]}(${drawPartRect["width"]}x${drawPartRect["height"]}:${drawPartRect["offset"]["x"]},${drawPartRect["offset"]["y"]})`;
        }

        // In the PHP version, this was setting the transparent colour of an image but for now I am storing the actual image in here.
        let drawPartResource = null;

        if (drawPart["colorable"]) {
          drawPartResource = avatarImage.setPartColor(
            drawPartRect["resource"],
            drawPart["color"]
          );
        }

        let _posX =
          drawPartRect["offset"]["x"] +
          (avatarImage.drawAction["body"] == "lay"
            ? avatarImage.rectWidth / 2
            : 0);
        let _posY =
          avatarImage.rectHeight / 2 -
          drawPartRect["offset"]["y"] +
          (avatarImage.drawAction["body"] == "lay"
            ? avatarImage.rectHeight / 3.5
            : avatarImage.rectHeight / 2.5);
        if (drawPartRect["isFlip"])
          _posX = _posX + drawPartRect["width"] - (avatarImage.rectWidth + 1);
        tempCtx.drawImage(drawPartResource, _posX, _posY);
        console.log(tempCanvas.toDataURL());
      });
    });
  };
};

module.exports = AvatarImageTom;
