const canvas = require("canvas");

var AvatarSprite = function(
  uniqueName,
  action,
  type,
  isSmall,
  partId,
  direction,
  frame,
  color
) {
  this.LOCAL_RESOURCES_URL = "http://localhost:4000/resource/";

  let resDirection = direction;

  this.getResourceName = function() {
    let resourceName = this.isSmall ? "sh" : "h";
    resourceName += "_";
    resourceName += this.resAction;
    resourceName += "_";
    resourceName += this.resType;
    resourceName += "_";
    resourceName += this.partId;
    resourceName += "_";
    resourceName += this.resDirection;
    resourceName += "_";
    resourceName += this.frame;
    return resourceName;
  };
  //r63 self alias
  if (type == "hd" && isSmall) partId = 1;
  if (type == "ey" && action == "std" && partId == 1 && direction == 3)
    action = "sml";
  if (
    type == "fa" &&
    action == "std" &&
    partId == 2 &&
    (direction == 2 || direction == 4)
  )
    resDirection = 1;
  if (type == "he" && action == "std" && partId == 1) {
    if (direction == 2) {
      resDirection = 0;
    }
    //if(direction >= 4 && direction <= 6) {
    //return false;
    //}
  }
  if (type == "he" && action == "std" && partId == 8)
    resDirection = direction % 2 == 0 ? 1 : resDirection;
  if (
    type == "he" &&
    action == "std" &&
    (partId == 2131 || partId == 2132) &&
    (direction >= 2 && direction <= 6)
  )
    resDirection = 1;
  if (type == "ha" && action == "std" && partId == 2518)
    resDirection = direction % 2 == 0 ? 2 : 1;
  if (type == "ha" && action == "std" && partId == 2519)
    resDirection = direction % 2 == 0 ? 2 : 3;
  if (type == "ha" && action == "std" && partId == 2588) resDirection = 7;
  if (type == "ha" && action == "std" && partId == 2589) resDirection = 3;
  //if(type == "lg" && action == "std" && partId == 2) action = "wlk";

  this.lib = uniqueName;
  this.isFlip = false;
  this.action = action;
  this.resAction = action;
  this.type = type;
  this.resType = type;
  this.isSmall = isSmall;
  this.partId = partId;
  this.direction = direction;
  this.resDirection = resDirection;
  this.frame = frame;
  this.color = color;
  this.resourceName = this.getResourceName();

  this.downloadAsync = () => {
    let img = new canvas.Image();
    let d = new Promise(
      function(resolve, reject) {
        img.onload = function() {
          this.resource = img;
          //console.log("downloaded " + this.lib + " -> " + this.getResourceName());
          resolve(img);
        }.bind(this);

        img.onerror = function() {
          console.log(
            "NOT DOWNLOADED " + this.lib + " -> " + this.getResourceName()
          );
          reject("Could not load image: " + img.src);
        }.bind(this);
      }.bind(this)
    );

    img.src =
      this.LOCAL_RESOURCES_URL +
      this.lib +
      "/" +
      this.lib +
      "_" +
      this.getResourceName() +
      ".png";
    return d;
  };
};

module.exports = AvatarSprite;
