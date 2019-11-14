var AvatarPart = function(
  uniqueName,
  action,
  type,
  isSmall,
  partId,
  direction,
  frame,
  color
) {
  this.resDirection = direction;

  //r63 self alias
  if (type === "hd" && isSmall) partId = 1;
  if (type === "ey" && action === "std" && partId === 1 && direction === 3)
    action = "sml";
  if (
    type === "fa" &&
    action === "std" &&
    partId === 2 &&
    (direction === 2 || direction === 4)
  )
    this.resDirection = 1;
  if (type === "he" && action === "std" && partId === 1) {
    if (direction === 2) {
      this.resDirection = 0;
    }
    //if(direction >= 4 && direction <= 6) {
    //return false;
    //}
  }
  if (type === "he" && action === "std" && partId === 8)
    this.resDirection = direction % 2 === 0 ? 1 : this.resDirection;
  if (
    type === "he" &&
    action === "std" &&
    (partId === 2131 || partId === 2132) &&
    direction >= 2 &&
    direction <= 6
  )
    this.resDirection = 1;
  if (type === "ha" && action === "std" && partId === 2518)
    this.resDirection = direction % 2 === 0 ? 2 : 1;
  if (type === "ha" && action === "std" && partId === 2519)
    this.resDirection = direction % 2 === 0 ? 2 : 3;
  if (type === "ha" && action === "std" && partId === 2588)
    this.resDirection = 7;
  if (type === "ha" && action === "std" && partId === 2589)
    this.resDirection = 3;

  this.lib = uniqueName;
  this.isFlip = false;
  this.action = action;
  this.resAction = action;
  this.type = type;
  this.resType = type;
  this.isSmall = isSmall;
  this.partId = partId;
  this.direction = direction;
  this.frame = frame;
  this.resFrame = frame;
  this.color = color;
  this.resourceName = this.getResourceName();
  this.promise = null;
  this.resource = null;

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
    resourceName += this.resFrame;
    return resourceName;
  };

  this.downloadAsync = function() {
    if (this.promise == null) {
      let img = new Image();
      this.promise = new Promise((resolve, reject) => {
        img.onload = () => {
          this.resource = img;
          //console.log("downloaded " + this.lib + " -> " + this.getResourceName());
          resolve(img);
        };

        img.onerror = () => {
          //console.log("NOT DOWNLOADED " + this.lib + " -> " + this.getResourceName());
          reject("Could not load image: " + img.src);
        };
      });
      img.crossOrigin = "anonymous";
      img.src =
        LOCAL_RESOURCES_URL +
        this.lib +
        "/" +
        this.lib +
        "_" +
        this.getResourceName() +
        ".png";
    }
    return this.promise;
  };
};

module.exports = AvatarPart;
