exports.spoke = function(iterations){
	var count = 0;
	var refresh = setInterval(function(){
		
		if(count > iterations){
			clearInterval(refresh);
		}
		
		var red = {
			color: 'red',
			angle: 0
		};

		var blue = {
			color: 'blue',
			angle: 90
		};

		
		var green = {
			color: 'green',
			angle: 180
		};
		
			
		var yellow = {
			color: 'yellow',
			angle: 270
		};

		matrix.led([red,blue,green,yellow]).rotate(count).render();
		count++

	},1);
	
	//clear
	matrix.led('black').render();
};

exports.success = function (){
	matrix.led('green').render();
	setTimeout(function(){
		matrix.led('black').render();
	},1000);
}

exports.error = function (){
	matrix.led('red').render();
	setTimeout(function(){
		matrix.led('black').render();
	},1000);
}

