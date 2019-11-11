var AvatarImage = function(
  figure,
  direction,
  headDirection,
  action,
  gesture,
  frame,
  isHeadOnly,
  scale
) {
  this.isLarge = false;
  this.isSmall = false;
  this.rectWidth = 64;
  this.rectHeight = 110;
  this.isValidDirection = function(direction) {
    direction = parseInt(direction);
    return Number.isInteger(direction) && direction >= 0 && direction <= 7;
  };

  switch (scale) {
    case "l":
      this.isLarge = true;
      this.rectWidth = 128;
      this.rectHeight = 220;
      break;
    case "s":
      this.isSmall = true;
      this.rectWidth = 32;
      this.rectHeight = 55;
      break;
    case "n":
    default:
      break;
  }
  this.isHeadOnly = isHeadOnly === true;
  this.figure = [];

  for (part of figure.split(".")) {
    let data = part.split("-");
    let figurePart = { type: data[0], id: data[1], colors: [data[2]] };
    if (data[3] != null) {
      figurePart.colors.push(data[3]);
    }
    this.figure.push(figurePart);
  }

  this.frame = Array.isArray(frame) ? frame : [frame];
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
  }; //std, sit, lay, wlk, wav, sit-wav, swm
  this.handItem = false;
  this.drawOrder = "std";
  this.ok = false;
  this.gesture = gesture; //std, agr, sml, sad, srp, spk, eyb
  this.direction = this.isValidDirection(direction) ? direction : 0;
  this.headDirection = this.isValidDirection(headDirection) ? headDirection : 0;

  switch (this.gesture) {
    case "spk":
      this.drawAction["speak"] = this.gesture;
      break;
    case "eyb":
      this.drawAction["eye"] = this.gesture;
      break;
    case "":
      this.drawAction["gesture"] = "std";
      break;
    default:
      this.drawAction["gesture"] = this.gesture;
      break;
  }

  this.action = Array.isArray(action) ? action : [action];
  for (value of this.action) {
    let actionParams = value.split("=");
    switch (actionParams[0]) {
      case "wlk":
      case "sit":
        this.drawAction[actionParams[0]] = actionParams[0];
        break;

      case "lay":
        this.drawAction["body"] = actionParams[0];
        this.drawAction["eye"] = actionParams[0];

        let temp = this.rectWidth;
        this.rectWidth = this.rectHeight;
        this.rectHeight = temp;

        switch (this.gesture) {
          case "spk":
            this.drawAction["speak"] = "lsp";
            this.frame["lsp"] = this.frame[this.gesture];
            break;

          case "eyb":
            this.drawAction["eye"] = "ley";
            break;

          case "std":
            this.drawAction["gesture"] = actionParams[0];
            break;

          default:
            this.drawAction["gesture"] = "l" + this.gesture.substr(0, 2);
            break;
        }
        break;

      case "wav":
        this.drawAction["handLeft"] = actionParams[0];
        break;

      case "crr":
      case "drk":
        this.drawAction["handRight"] = actionParams[0];
        this.drawAction["itemRight"] = actionParams[0];
        this.handItem = actionParams[1];
        break;

      case "swm":
        this.drawAction[actionParams[0]] = actionParams[0];
        if (this.gesture == "spk") {
          this.drawAction["speak"] = "sws";
        }
        break;

      case "":
        this.drawAction["body"] = "std";
        break;

      default:
        this.drawAction["body"] = actionParams[0];
        break;
    }
  }

  if (this.drawAction["sit"] == "sit") {
    if (this.direction >= 2 && this.direction <= 4) {
      this.drawOrder = "sit";
      if (
        this.drawAction["handRight"] == "drk" &&
        this.direction >= 2 &&
        this.direction <= 3
      ) {
        this.drawOrder += ".rh-up";
      } else if (this.drawAction["handLeft"] && this.direction == 4) {
        this.drawOrder += ".lh-up";
      }
    }
  } else if (this.drawAction["body"] == "lay") {
    this.drawOrder = "lay";
  } else if (
    this.drawAction["handRight"] == "drk" &&
    this.direction >= 0 &&
    this.direction <= 3
  ) {
    this.drawOrder = "rh-up";
  } else if (
    this.drawAction["handLeft"] &&
    this.direction >= 4 &&
    this.direction <= 6
  ) {
    this.drawOrder = "lh-up";
  }

  this.ok = true;

  this.initialize = onReady => {
    let p = this.loadFiles();
    Promise.all(p).then(
      function(loaded) {
        this.ready = true;
        if (onReady != null) {
          onReady();
        }
      }.bind(this)
    );
  };
};

module.exports = AvatarImage;
