/* globals __DEV__ */
import Phaser from 'phaser'
import { fetchWeather } from '../../api'
import Tile from '../sprites/Tile';
require('phaser-plugin-isometric/dist/phaser-plugin-isometric');


export default class extends Phaser.State {
  init() {
    this.isoGroup = null;
    this.cursorPos = null;
    console.log(this.world)
  }
  preload() {
    this.game.plugins.add(new Phaser.Plugin.Isometric(game));
    this.game.iso.anchor.setTo(0.5, 0.2);
  }

  create() {
    // const bannerText = 'Vue + Phaser + ES6 + Webpack'
    // const banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    // banner.font = 'Bangers'
    // banner.padding.set(10, 16)
    // banner.fontSize = 40
    // banner.fill = '#77BFA3'
    // banner.smoothed = false
    // banner.anchor.setTo(0.5)

    this.tile = new Tile({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'tile'
    });

    this.isoGroup = this.game.add.group();
    this.spawnTiles(this.game);

    this.cursorPos = new Phaser.Plugin.Isometric.Point3();

    // this.game.add.existing(this.tile);

    // this.getWeather()
  }

  update() {
    // Update the cursor position.
        // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
        // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
        this.game.iso.unproject(this.game.input.activePointer.position, this.cursorPos);

        // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
        this.isoGroup.forEach((tile) => {
            var inBounds = tile.isoBounds.containsXY(this.cursorPos.x, this.cursorPos.y);
            // If it does, do a little animation and tint change.
            if (!tile.selected && inBounds) {
                tile.selected = true;
                tile.loadTexture('tileHighlight', 0);
                // this.game.add.tween(tile).to({ isoZ: 4 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
            // If not, revert back to how it was.
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                tile.loadTexture('tile', 0);             
            }
        });
  }

  /**
   * Example for getting data from service
   */
  async getWeather() {
    const text = 'Service calling test...'
    const message = this.add.text(this.world.centerX, this.game.height - 150, text)
    message.anchor.setTo(0.5)
    try {
      const weather = await fetchWeather()
      message.setText(weather.data.name)
    } catch (err) {
      message.setText('Service calling test.... Get weather fail!')
      console.log(err.response)
    }
  }

  spawnTiles(game) {
    var tile;
        for (var xx = 0; xx < 258; xx += 38) {
            for (var yy = 0; yy < 258; yy += 38) {
                // Create a tile using the new game.add.isoSprite factory method at the specified position.
                // The last parameter is the group you want to add it to (just like game.add.sprite)
                tile = game.add.isoSprite(xx, yy, 0, 'tile', 0, this.isoGroup);
                tile.anchor.set(0.5, 0);
            }
        }
  }

  render() {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.tile, 32, 32)
    }
  }
}
