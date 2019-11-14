var AvatarEditor =
  AvatarEditor ||
  function() {
    this.initialize();
    return this;
  };

var avatareditor;

window.onload = function() {
  avatareditor = new AvatarEditor();
};

AvatarEditor.Config = {
  club: true, // Selectable habbo-club items and colors.
  direction: {
    body: 4,
    head: 4
  },
  partSelectProbability: 70, // Probability of selecting a not mandatory parts, e.g. shirtless, barefoot...
  elements: {
    form: 'form[name="avatareditor-form"]',
    container: "#avatareditor-container",
    preview: "#avatareditor-preview",
    "preview-rect": "#avatareditor-preview-rect",
    "settype-tabs-primary": "#avatareditor-tabs-primary",
    "settype-tabs-secondary": "#avatareditor-tabs-secondary",
    "list-parts": "#avatareditor-list-parts",
    "list-color": "#avatareditor-list-color",
    config: "#avatareditor-config"
  },
  json: {
    // figuredata: "/json-demo/figuredata",
    // itemset: "/json-demo/itemset",
    figuredata: "http://localhost:4000/resource/figuredata.json",
    itemset: "http://localhost:4000/resource/itemset.json",
    // avatarimage: "http://localhost:4000/api/avatar/imager",
    avatarimage: "http://localhost:4000/api/avatar/figure/base64",
    "avatarimage-part": "http://localhost:4000/api/avatar/part/base64"
  }
};

AvatarEditor.prototype = {
  figuredata: {},
  partTypeTabs: {
    primary: null,
    secondary: null
  },
  paletteIndex: {},
  active: {
    direction: {
      body: 0,
      head: 0
    },
    gender: "M",
    partParent: null,
    partType: null,
    partName: null,
    partID: 0,
    paletteID: 0,
    colorIndexMax: 0,
    color: [0, 0, 0],
    figure: {},
    options: {
      scale: null,
      headonly: false,
      format: null,
      gesture: null,
      action: null,
      "action-primary": "",
      "action-secondary": [],
      frame: []
    }
  },

  initialize: function() {
    this.updateConfig();
    this.getActiveFigure();
    this.active.direction = AvatarEditor.Config.direction;
    this.partTypeTabs = {
      primary: $(
        AvatarEditor.Config.elements["settype-tabs-primary"] + " > ul > li"
      ),
      secondary: $(
        AvatarEditor.Config.elements["settype-tabs-secondary"] + " > ul"
      )
    };

    $.getJSON(AvatarEditor.Config.json.figuredata, function(data) {
      avatareditor.figuredata = data;

      $.each(avatareditor.figuredata.palette, function(pid, palette) {
        $.each(palette, function(cid, color) {
          if (color.index == 0) avatareditor.paletteIndex[pid] = cid;
          return false;
        });
      });
      avatareditor.partTypeTabs.primary.each(function(i) {
        if (i == 0) {
          avatareditor.active.partParent = $(this)
            .children("a")
            .attr("data-settype-parent");
          $(this).addClass("active");
        }
      });
      avatareditor.partTypeTabs.secondary.each(function(i) {
        if ($(this).attr("data-parent-type") == avatareditor.active.partParent)
          $(this).addClass("active");
        $(this)
          .find("li:eq(0)")
          .addClass("active");
      });
      avatareditor.changePartType();
    });

    $(document).on(
      "click",
      AvatarEditor.Config.elements["list-parts"] + " > ul > li > a",
      function(e) {
        e.preventDefault();
        avatareditor.changePart($(this).text());
      }
    );
    $(document).on(
      "click",
      AvatarEditor.Config.elements["list-color"] + " > ul > li > a",
      function(e) {
        e.preventDefault();
        avatareditor.changeColor($(this).text(), 0);
      }
    );

    this.partTypeTabs.primary.children("a").on("click", function(e) {
      e.preventDefault();
      avatareditor.active.partParent = $(this).attr("data-settype-parent");
      $(this)
        .parent("li")
        .siblings("li")
        .removeClass("active")
        .end()
        .addClass("active");
      avatareditor.partTypeTabs.secondary
        .removeClass("active")
        .filter("[data-parent-type=" + avatareditor.active.partParent + "]")
        .addClass("active");
      avatareditor.changePartType();
    });
    this.partTypeTabs.secondary.find("li > a").on("click", function(e) {
      var gender = $(this).attr("data-gender");
      if (
        typeof gender != "undefined" &&
        avatareditor.active.gender != gender
      ) {
        avatareditor.active.gender = gender;
        avatareditor.randomizeFigure();
      }
      $(this)
        .parent("li")
        .siblings("li")
        .removeClass("active")
        .end()
        .addClass("active");
      avatareditor.changePartType();
    });

    $(AvatarEditor.Config.elements["preview-rect"] + " > button").on(
      "click",
      function(e) {
        e.preventDefault();
        var dir_body = avatareditor.active.direction.body;
        var dir = $(this).val();
        if (avatareditor.active.options["action-primary"] == "lay") {
          avatareditor.active.direction.body = avatareditor.active.direction.head =
            avatareditor.active.direction.body == 4 ? 2 : 4;
        } else {
          if (dir == "next") {
            avatareditor.active.direction.head =
              avatareditor.active.direction.head == 0
                ? 7
                : avatareditor.active.direction.head - 1;
            if ($(this).attr("name") == "change-direction") {
              avatareditor.active.direction.body =
                avatareditor.active.direction.body == 0
                  ? 7
                  : avatareditor.active.direction.body - 1;
            }
          } else {
            avatareditor.active.direction.head =
              avatareditor.active.direction.head == 7
                ? 0
                : avatareditor.active.direction.head + 1;
            if ($(this).attr("name") == "change-direction") {
              avatareditor.active.direction.body =
                avatareditor.active.direction.body == 7
                  ? 0
                  : avatareditor.active.direction.body + 1;
            }
          }
        }
        avatareditor.updateRect();
      }
    );

    $(
      AvatarEditor.Config.elements["container"] +
        ' button[name="figure-randomize"]'
    ).on("click", function(e) {
      e.preventDefault();
      avatareditor.randomizeFigure();
    });

    $(AvatarEditor.Config.elements.config).on(
      "change",
      "select, input",
      function() {
        avatareditor.updateConfig();
        avatareditor.updateRect();
      }
    );

    this.updateRect();
  },

  getInputValue: function(name, def) {
    var object = $(AvatarEditor.Config.elements.form)
      .find("input, textarea, select")
      .filter('[name="' + name + '"]');
    var tag = object.prop("tagName");
    if (typeof tag != "undefined") {
      switch (tag.toLowerCase()) {
        case "input":
          var type = object.attr("type");
          switch (type) {
            case "checkbox":
              if (object.length == 1) {
                return object.is(":checked");
              } else {
                return object.filter(":checked").map(function(index, el) {
                  return $(this).val();
                });
              }
            case "radio":
              return object.filter(":checked").val();
            default:
              return object.val();
          }
        case "textarea":
          return object.val();
        case "select":
          return object.children("option:selected").val();
        default:
          return typeof def != "undefined" ? def : false;
      }
    } else {
      return typeof def != "undefined" ? def : false;
    }
  },

  getActiveFigure: function() {
    var figure = this.getInputValue("figure").split(".");
    for (var i in figure) {
      var data = figure[i].split("-");
      this.active.figure[data[0]] = {
        type: data[0],
        id: Number(data[1]),
        color: [
          typeof data[2] != "undefined" ? Number(data[2]) : 0,
          typeof data[3] != "undefined" ? Number(data[3]) : 0,
          typeof data[4] != "undefined" ? Number(data[4]) : 0
        ]
      };
    }
  },

  changePartType: function() {
    var active = avatareditor.partTypeTabs.secondary
      .filter('[data-parent-type="' + this.active.partParent + '"]')
      .find("li.active > a");
    avatareditor.active.partType = active.attr("data-settype");
    avatareditor.active.partName = active.text();

    this.buildPartsList(false);
    this.buildPalette();
  },

  changePart: function(partID) {
    var partList = $(AvatarEditor.Config.elements["list-parts"] + " > ul > li")
      .filter(".active")
      .removeClass("active")
      .end();
    this.active.figure[this.active.partType] = {
      type: this.active.partType,
      id: Number(partID),
      color: [this.active.color[0], this.active.color[1], this.active.color[2]]
    };
    if (partID == 0 || typeof partID == "undefined") {
      partList.filter(".no-select").addClass("active");
      this.active.figure[this.active.partType].color = [
        this.paletteIndex[this.active.paletteID]
      ];
    } else {
      partList.filter('[data-id="' + partID + '"]').addClass("active");
    }
    this.updateRect();
  },

  changeColor: function(colorID, index) {
    this.active.figure[this.active.partType].color[index] = Number(colorID);
    $(AvatarEditor.Config.elements["list-color"] + " > ul > li")
      .filter(".active-" + index)
      .removeClass("active active-" + index)
      .end()
      .filter('[data-id="' + colorID + '"]')
      .addClass("active active-" + index);
    this.buildPartsList(true);
    this.updateRect();
  },

  randomizeFigure: function() {
    var getRandomArbitary = function(min, max) {
      return Math.round(Math.random() * (max - min) + min);
    };

    $.each(this.figuredata.settype, function(type, data) {
      var isSet = true;
      var part = 0;
      var list = Object.keys(data.set);
      if (!data["mand_" + avatareditor.active.gender.toLowerCase() + "_1"]) {
        isSet =
          getRandomArbitary(0, 100) <=
          AvatarEditor.Config.partSelectProbability;
      }
      if (isSet) {
        while (true) {
          part = list[getRandomArbitary(0, list.length - 1)];
          if (
            ((!AvatarEditor.Config.club && data.set[part].club != 2) ||
              AvatarEditor.Config.club) &&
            data.set[part].selectable == true &&
            (data.set[part].gender == avatareditor.active.gender ||
              data.set[part].gender == "U")
          )
            break;
        }
        var palette = Object.keys(
          avatareditor.figuredata.palette[data.paletteid]
        );
        while (true) {
          var color = palette[getRandomArbitary(0, palette.length - 1)];
          if (
            ((!AvatarEditor.Config.club &&
              avatareditor.figuredata.palette[data.paletteid][color].club !=
                2) ||
              AvatarEditor.Config.club) &&
            avatareditor.figuredata.palette[data.paletteid][color].selectable ==
              true
          )
            break;
        }
        avatareditor.active.figure[type] = {
          type: type,
          id: Number(part),
          color: [Number(color), 0, 0]
        };
      } else {
        avatareditor.active.figure[type] = {
          type: type,
          id: 0,
          color: [avatareditor.paletteIndex[data.paletteid], 0, 0]
        };
      }
    });
    this.updateRect();
    this.buildPartsList(true);
    this.buildPalette();
  },

  buildPartsList: function(isScrollHold) {
    var partLists = $('<ul data-settype="' + this.active.partType + '" />');
    var currentData = {};
    if (typeof this.active.figure[this.active.partType] == "undefined") {
      this.active.figure[this.active.partType] = {
        type: this.active.partType,
        id: 0,
        color: [this.paletteIndex[this.active.paletteID], 0, 0]
      };
      this.active.color = this.active.figure[this.active.partType].color;
    }
    this.active.partID = this.active.figure[this.active.partType].id;
    this.active.color = this.active.figure[this.active.partType].color;
    if (
      !this.figuredata.settype[this.active.partType][
        "mand_" + this.active.gender.toLowerCase() + "_1"
      ]
    ) {
      var part = $('<li class="no-select" data-id="0"><a /></li>');
      if (this.active.partID == 0) {
        part.addClass("active");
      }
      part.appendTo(partLists);
    }
    $.each(this.figuredata.settype[this.active.partType].set, function(
      id,
      data
    ) {
      if (AvatarEditor.Config.club != true && data.club == 2) return;
      if (data.selectable != true) return;
      if (data.gender != avatareditor.active.gender && data.gender != "U")
        return;
      var partsets = "";
      var maxindex = 0;
      for (var i in data.part) {
        partsets += data.part[i].type + "-" + data.part[i].id + ",";
        var index = data.part[i].colorindex;
        if (maxindex < index) maxindex = index;
      }
      var part = $("<li><a>" + id + "</a></li>")
        .attr({
          "data-id": id,
          "data-selectable": data.selectable,
          "data-club": data.club,
          "data-sellable": data.sellable,
          "data-legacy": data.legacy,
          "data-colormaxindex": maxindex,
          "data-partsets": partsets.slice(0, -1)
        })
        .css("background-position", "center center")
        .appendTo(partLists);

      console.log({
        type: avatareditor.active.partType,
        id: id,
        color_1: avatareditor.active.color[0],
        color_2: avatareditor.active.color[1],
        color_3: avatareditor.active.color[2],
        direction: avatareditor.active.direction.body
      });
      $.ajax({
        dataType: "json",
        url: AvatarEditor.Config.json["avatarimage-part"],
        data: {
          type: avatareditor.active.partType,
          id: id,
          color_1: avatareditor.active.color[0],
          color_2: avatareditor.active.color[1],
          color_3: avatareditor.active.color[2],
          direction: avatareditor.active.direction.body
        },
        success: function(data) {
          console.log(part);
          part.css({
            "background-image": "url('" + data.resource + "')",
            "background-position": ""
          });
        },
        error: function(data) {
          console.log("error", data);
        }
      });

      if (avatareditor.active.partID == id) part.addClass("active");
    });
    var listPartsElement = $(AvatarEditor.Config.elements["list-parts"]);

    if (isScrollHold)
      var scrollTop = listPartsElement.children("ul").scrollTop();

    listPartsElement
      .children("ul")
      .remove()
      .end()
      .append(partLists)
      .find(".str-partname")
      .text(this.active.partName);

    if (isScrollHold) listPartsElement.children("ul").scrollTop(scrollTop);
  },

  buildPalette: function() {
    this.active.colorIndex = 0;
    var partLists = $("<ul />");
    var currentData = this.active.figure[this.active.partType];
    this.active.paletteID = this.figuredata.settype[
      this.active.partType
    ].paletteid;
    this.active.color =
      typeof currentData != "undefined"
        ? currentData.color
        : [this.paletteIndex[this.active.paletteID], 0, 0];
    $.each(this.figuredata.palette[this.active.paletteID], function(id, data) {
      if (AvatarEditor.Config.club != true && data.club == 2) return;
      if (data.selectable != true) return;
      var color = $("<li><a>" + id + "</a></li>")
        .attr({
          "data-id": id,
          "data-club": data.club,
          "data-color": data.color
        })
        .css("background-color", "#" + data.color)
        .appendTo(partLists);

      if (avatareditor.active.color[0] == id) color.addClass("active active-0");
      if (avatareditor.active.color[1] == id) color.addClass("active active-1");
      if (avatareditor.active.color[2] == id) color.addClass("active active-2");
    });
    $(AvatarEditor.Config.elements["list-color"])
      .children("ul")
      .remove()
      .end()
      .append(partLists);
  },

  buildFigureString: function() {
    var figure = "";
    for (var type in this.active.figure) {
      if (!this.active.figure.hasOwnProperty(type)) continue;
      var s = this.active.figure[type];
      if (s.id == 0) continue;
      figure += s.type + "-" + s.id;
      if (s.color[0] > 0) figure += "-" + s.color[0];
      if (s.color[1] > 0) figure += "-" + s.color[1];
      if (s.color[2] > 0) figure += "-" + s.color[2];
      figure += ".";
    }
    figure = figure.slice(0, -1);
    $(AvatarEditor.Config.elements.form + ' input[name="figure"]').val(figure);
    return figure;
  },

  updateRect: function() {
    var input = {
      figure: this.buildFigureString(),
      action: this.active.options.action,
      gesture: this.active.options.gesture,
      direction: this.active.direction.body,
      size: this.active.options.scale,
      head_direction: this.active.direction.head,
      frame:
        this.active.options.frame.length > 0
          ? this.active.options.frame.join(",")
          : null,
      headonly: Number(this.active.options.headonly),
      img_format: this.active.options.format
    };
    $(AvatarEditor.Config.elements.form + ' input[name="figure"]').val(
      input.figure
    );
    console.log(AvatarEditor.Config.json.avatarimage);
    $.ajax({
      dataType: "json",
      url: AvatarEditor.Config.json.avatarimage,
      data: input,
      success: function(data) {
        console.log(data.resource);
        $(AvatarEditor.Config.elements["preview-rect"])
          .removeClass("scale-l scale-n scale-s")
          .children("img")
          .remove()
          .end()
          .append('<img id="avatarimg" src="' + data.resource + '">')
          .addClass("scale-" + avatareditor.active.options.scale);
        $(AvatarEditor.Config.elements.preview).attr({
          "data-scale": avatareditor.active.options.scale,
          "data-headonly": avatareditor.active.options.headonly
        });
      }
    });
  },

  updateConfig: function() {
    var config = $(AvatarEditor.Config.elements.config);
    var options = this.active.options;

    // options.format = this.getInputValue("config-format", "png");
    options.scale = this.getInputValue("config-size", "l");
    // options.headonly = this.getInputValue("config-headonly", false);
  }
};

$(function() {
  $.widget("custom.partIconSelectMenu", $.ui.selectmenu, {
    _renderItem: function(ul, item) {
      var li = $("<li>", { text: item.label });

      if (item.disabled) {
        li.addClass("ui-state-disabled");
      }

      $("<span>", {
        style: item.element.attr("data-style"),
        class: "ui-icon " + item.element.attr("data-class")
      }).appendTo(li);

      return li.appendTo(ul);
    }
  });
});
