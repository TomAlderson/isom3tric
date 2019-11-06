import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init() {
    console.log(this.world)
  }

  preload() {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.time.advancedTiming = true;

    this.load.setPreloadSprite(this.loaderBar)
    this.load.image('tile', 'assets/images/tile.png')
    this.load.image('tileHighlight', 'assets/images/tile_highlight.png')
  }

  create() {
    this.state.start('Game')
  }
}
