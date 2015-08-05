var Canvas = require('canvas');

module.exports = function(config, callback){
    config.fileMode   = config.fileMode || 0;
    config.fileName   = config.fileName || new Date().getTime() + Math.floor(Math.random()*1000);
    config.size       = config.size || 4;
    config.height     = config.height || 24;
    config.width      = config.width || config.height * config.size;
    config.color      = config.color || 'rgb(0,0,0)';
    config.background = config.background || 'rgb(255,255,255)';
    config.lineWidth  = config.lineWidth || 2;
    config.saveDir    = config.saveDir || __dirname;
    config.text       = config.text || ('' + Math.random()).substr(2, config.size);
    config.noise      = config.noise || true;
    config.noiseColor = config.noiseColor || config.color;
    
    var fontSize = Math.round(config.height*0.7);
    var canvas = new Canvas(config.width, config.height);
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = config.background;
    ctx.fillRect(0, 0, config.width, config.height);
    ctx.fillStyle = config.color;
    ctx.lineWidth = config.lineWidth;
    ctx.font = fontSize +'px sans';

    if (config.noise) {
        ctx.strokeStyle = config.noiseColor;
        var noiseHeight = config.height * 2;
        for (var i = 0; i < 2; i++) {
            ctx.moveTo(20, Math.random() * noiseHeight);
            ctx.bezierCurveTo(80, Math.random() * noiseHeight, 160, Math.random() * noiseHeight, 230, Math.random() * noiseHeight);
            ctx.stroke();
        }
    }
    
    ctx.strokeStyle = config.color;
    for (var i = 0; i < config.text.length; i++) {
        ctx.setTransform(Math.random() * 0.5 + 1, Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5 + 1, config.height * i + (config.height-fontSize)/2, config.height-(config.height-fontSize)/2);
        ctx.fillText(config.text.charAt(i), 0, 0);
    }
   
    if (1 == config.fileMode) {
        var fs = require('fs');
        if (config.fileName.substr(config.fileName.length -4).toLowerCase() != '.png') {
            config.fileName = config.fileName + '.png';
        }  
        var out = fs.createWriteStream(config.saveDir  +"/"+ config.fileName);
        var stream = canvas.pngStream();

        stream.on('data', function(chunk){
          out.write(chunk);
        });

        stream.on('end', function(){
            callback(config.text, config.fileName);
        });
    }
    else if (2 == config.fileMode) {
        canvas.toBuffer(function(err, buf) {
            callback(config.text, buf);
        });
    }
    else {
        canvas.toDataURL('image/png', function(err, data){
            callback(config.text, data);
        });
    }

};
