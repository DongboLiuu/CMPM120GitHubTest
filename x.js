var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var player;

 //https://gist.github.com/MatthewBarker/032c325ef8577c6d0188
 Phaser.Filter.Glow = function (game) {
    'use strict';
    Phaser.Filter.call(this, game);
    this.uniforms.alpha = { type: '1f', value: 1.0 };
    //the shader, remove cosine/sine to make it a static glow
    this.fragmentSrc = [
        'precision lowp float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform sampler2D uSampler;',
        'uniform float alpha;',
        'uniform float time;',
        'void main() {',
            'vec4 sum = vec4(0);',
            'vec2 texcoord = vTextureCoord;',
            'for(int xx = -4; xx <= 4; xx++) {',
                'for(int yy = -4; yy <= 4; yy++) {',
                    'float dist = sqrt(float(xx*xx) + float(yy*yy));',
                    'float factor = 0.0;',
                    'if (dist == 0.0) {',
                        'factor = 2.0;',
                    '} else {',
                        'factor = 2.0/abs(float(dist));',
                    '}',
                    'sum += texture2D(uSampler, texcoord + vec2(xx, yy) * 0.002) * (abs(sin(time))+0.06);',
                '}',
            '}',
            'gl_FragColor = sum * 0.025 + texture2D(uSampler, texcoord)*alpha;',
        '}'
    ];
};
  
Phaser.Filter.Glow.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Glow.prototype.constructor = Phaser.Filter.Glow;

Object.defineProperty(Phaser.Filter.Glow.prototype, 'alpha', {

    get: function() {
        return this.uniforms.alpha.value;
    },

    set: function(value) {
        this.uniforms.alpha.value = value;
    }

});


function preload() {
     game.load.baseURL = '//examples.phaser.io/';
    game.load.crossOrigin = 'anonymous';
    //game.load.spritesheet('gameboy', 'assets/sprites/gameboy_seize_color_40x60.png', 40, 60);
    game.load.image('object', 'assets/sprites/phaser-dude.png');
  
 }

function create() {

    
  player = game.add.sprite(150, 150,'object');

  glowFilter=new Phaser.Filter.Glow(game);
  player.filters=[glowFilter];
    
  line = game.add.graphics(200,200);
  line.boundsPadding=600;
  line.lineStyle(5,0xffffff,1);
  line.lineTo(200,0);
  line.filters=[glowFilter];

}

function update() {
  //remove this for static glow
  glowFilter.update();
}

function render() {

}