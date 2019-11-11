const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const https = require("https");
var path = require("path");
var AvatarImager = require("../lib/avatar_imager");
var AvatarImage = require("../lib/avatar_image");

const router = express.Router();

router.get("/imager", (req, res, next) => {
  let inputFigure = req.query.figure;
  let inputAction = req.query.action;
  let inputGesture = req.query.gesture;
  let inputDirection = req.query.direction;
  let inputSize = req.query.size;
  let inputHeadDirection = req.query.head_direction;
  let inputFrame = req.query.frame;
  let inputHeadOnly = req.query.headonly;
  let inputFormat = req.query.img_format;

  let figureUrl =
    "http://localhost:1337/avatarimage.php?figure=" +
    inputFigure +
    "&action=" +
    inputAction +
    "&gesture=" +
    inputGesture +
    "&direction=" +
    inputDirection +
    "&size=" +
    inputSize +
    "&head_direction=" +
    inputHeadDirection +
    "&frame=" +
    inputFrame +
    "&headonly=" +
    inputHeadOnly +
    "&img_format=" +
    inputFormat;

  var image;

  var request = require("request").defaults({ encoding: null });

  request.get(figureUrl, (error, response, body) => {
    console.log(response);
    if (!error && response.statusCode == 200) {
      data =
        "data:" +
        response.headers["content-type"] +
        ";base64," +
        new Buffer(body).toString("base64");
      res.status(200).json({
        resource: data
      });
    }
  });
});

router.get("/imager/part", (req, res, next) => {
  let inputPartType = req.query.type;
  let inputPartID = req.query.id;
  let inputPartColor1 = req.query.color_1;
  let inputPartColor2 = req.query.color_2;
  let inputPartColor3 = req.query.color_3;
  let inputDirection = req.query.direction ? req.query.direction : 4;
  let inputSize = req.query.size ? req.query.size : "n";
  let inputAction = req.query.action ? req.query.action : "std";
  let inputFormat = req.query.img_format ? req.query.img_format : "png";

  let figureUrl =
    "http://localhost:1337/avatarimage_part.php?type=" +
    inputPartType +
    "&id=" +
    inputPartID +
    "&color_1=" +
    inputPartColor1 +
    "&color_2=" +
    inputPartColor2 +
    "&color_3=" +
    inputPartColor3 +
    "&direction=" +
    inputDirection +
    "&action=" +
    inputAction +
    "&size=" +
    inputSize +
    "&img_format=" +
    inputFormat;

  var image;

  console.log(figureUrl);

  var request = require("request").defaults({ encoding: null });

  request.get(figureUrl, (error, response, body) => {
    // console.log(response);
    if (!error && response.statusCode == 200) {
      data =
        "data:" +
        response.headers["content-type"] +
        ";base64," +
        new Buffer(body).toString("base64");
      res.status(200).json({
        resource: data
      });
    }
  });
});

router.get("/imager/test", (req, res, next) => {
  let inputFigure = req.query.figure;
  let inputAction = req.query.action;
  let inputGesture = req.query.gesture;
  let inputDirection = req.query.direction;
  let inputSize = req.query.size;
  let inputHeadDirection = req.query.head_direction;
  let inputFrame = req.query.frame;
  let inputHeadOnly = req.query.headonly;

  let avatarImager = new AvatarImager();

  avatarImager.initialize(() => {
    let avatar = new AvatarImage(
      inputFigure,
      inputDirection,
      inputHeadDirection,
      inputAction.split(","),
      inputGesture,
      inputFrame,
      inputHeadOnly,
      inputSize
    );

    avatarImager.generate(avatar, img => {
      res.setHeader("Content-Type", "image/png");
      img.pngStream().pipe(res);
    });
  });
});

module.exports = router;
