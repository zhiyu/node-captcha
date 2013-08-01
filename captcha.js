var Canvas = require('canvas');

module.exports = function(config, callback){
	config.fileMode   = config.fileMode || false;
    config.size       = config.size || 4;
    config.height     = config.height || 24;
    config.width      = config.width || config.height * config.size;
    config.color      = config.color || 'rgb(0,0,0)';
    config.background = config.background || 'rgb(255,255,255)';
    config.lineWidth  = config.lineWidth || 2;
    config.saveDir    = config.saveDir || __dirname;
    
    var fontSize = Math.round(config.height*0.7);
    var canvas = new Canvas(config.width, config.height);
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = config.background;
	ctx.fillRect(0, 0, config.width, config.height);
	ctx.fillStyle = config.color;
	ctx.lineWidth = config.lineWidth;
	ctx.strokeStyle = config.color;
	ctx.font = fontSize +'px sans';

	for (var i = 0; i < 2; i++) {
		ctx.moveTo(20, Math.random() * 150);
		ctx.bezierCurveTo(80, Math.random() * 150, 160, Math.random() * 150, 230, Math.random() * 150);
		ctx.stroke();
	}

	var text = ('' + Math.random()).substr(2, config.size);

	for (i = 0; i < text.length; i++) {
		ctx.setTransform(Math.random() * 0.5 + 1, Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5 + 1, config.height * i + (config.height-fontSize)/2, config.height-(config.height-fontSize)/2);
		ctx.fillText(text.charAt(i), 0, 0);
	}
   
    if(config.fileMode){
    	var fs = require('fs');
    	var filename = new Date().getTime() + Math.floor(Math.random()*1000) +'.png';
    	var out = fs.createWriteStream(config.saveDir  +"/"+ filename);
		var stream = canvas.pngStream();

		stream.on('data', function(chunk){
		  out.write(chunk);
		});

		stream.on('end', function(){
		    callback(text, filename);
		});
    }else{
	    canvas.toDataURL('image/png', function(err, data){
            callback(text, data);
	    });
    }

};