////// RESET FUNCTION ////////
matrix.on('reset', function() {
  matrix.service('recognition').untrain('test');
  matrix.led('red').render();
  setTimeout(function() {
    matrix.led('black').render();
  }, 1000);
});

////// LIST TAG FUNCTION //////
matrix.on('listtag', function() {

matrix.service('recognition').getTags().then(function(tags) {
matrix.led('green').render();
setTimeout(function() {
    matrix.led('black').render();
}, 1000);
console.log('>>>>>>>>>>TAGS>>>>>>>>>>>>>>', tags);
});
});

////// TRAIN FACE FUNCTION /////
matrix.on('train', function(data) {

    var trained = false;
    console.log('training started>>>>>', data);
    // lighting
    var a = 180;
    var a2 = 0;
    var l = setInterval(function() {
    matrix.led([{
        arc: Math.round(180 * Math.sin(a)),
        color: 'darkgreen',
        start: a2
    }, {
        arc: -Math.round(180 * Math.sin(a)),
        color: 'darkgreen',
        start: a2 + 180
    }]).render();
    a = (a < 0) ? 180 : a - 0.1;
    //a2 = (a2 > 360) ? 0 : a2 + 5;
    }, 25);

    function stopLights() {
    clearInterval(l);
    }

    // starts training 
    matrix.service('recognition').train('test').then(function(data) {
    stopLights();
    if (!trained && data.hasOwnProperty('count')) {
        // means it's partially done
        matrix.led({
        arc: Math.round(360 * (data.count / data.target)),
        color: 'blue',
        start: 0
        }).render();
    } else {
        trained = true;
        matrix.led('blue').render();
        console.log('trained!', data);
        matrix.service('recognition').stop();

    }
  });
});
////// RECOGNITION FUNCTION //////
matrix.on('recog', function() {
  // lighting
  var a = 180;
  var a2 = 90;
  var l = setInterval(function() {
    matrix.led([{
      arc: Math.round(180 * Math.sin(a)),
      color: 'darkblue',
      start: a2
    }, {
      arc: -Math.round(180 * Math.sin(a)),
      color: 'darkblue',
      start: a2 + 180
    }]).render();
    a = (a < 0) ? 180 : a - 0.1;
    //a2 = (a2 > 360) ? 0 : a2 + 5;
  }, 25);

  function stopLights() {
    clearInterval(l);
  }
  // starts recognition
  matrix.service('recognition').start('test').then(function(data) {
    stopLights();
    console.log('RECOG>>>!', data);

    var MinDistanceFace = _.values(data.matches);
    MinDistanceFace = _.sortBy(MinDistanceFace, ['score'])[0];

    console.log('Min Distance Face', MinDistanceFace);
    if (MinDistanceFace.score < 0.80) {
      matrix.led('green').render();
    } else {
      matrix.led('red').render();
    }
  });
  console.log('recog!');
});

////// STOP SERVICE FUNCTION //////
matrix.on('stop', function(){
  matrix.service('recognition').stop();
});
