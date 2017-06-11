module.exports = {
	reset: matrixReset,
	listTags: matrixListTags,
	trainFace: trainFace,
	recognize: recogFace,
	stop: stop
}
function matrixReset(username_email) {
    matrix.service('recognition').untrain(username_email);
    matrix.led('red').render();
    setTimeout(function() {
        matrix.led('black').render();
    }, 1000);
}
////// LIST TAG FUNCTION //////
// Unknown
function matrixListTags() {
    matrix.service('recognition').getTags().then(function(tags) {
        matrix.led('green').render();
        setTimeout(function() {
            matrix.led('black').render();
        }, 1000);
        console.log('>>>>>>>>>>TAGS>>>>>>>>>>>>>>', tags);
    });
}
////// TRAIN FACE FUNCTION /////
// trains a user's face
function trainFace(username_email) {
    var trained = false;
    console.log('training started>>>>>');
    // lighting
    var a = 180;
    var a2 = 0;
    var l = setInterval(function() {
        matrix.led([{
            arc: Math.round(180 * Math.sin(a)),
            color: 'blue',
            start: a2
        }, {
            arc: -Math.round(180 * Math.sin(a)),
            color: 'blue',
            start: a2 + 180
        }]).render();
        a = (a < 0) ? 180 : a - 0.1;
    }, 25);
    function stopLights() {
        clearInterval(l);
    }
    // starts training 
    matrix.service('recognition').train(username_email).then(function(data) {
        stopLights();
        //continue if training is not finished
        if (!trained && data.hasOwnProperty('count')) {
            // means it's partially done
            matrix.led({
                arc: Math.round(360 * (data.count / data.target)),
                color: 'blue',
                start: 0
            }).render();
        }
        //training is finished
        else {
            trained = true;
            matrix.led('green').render();
            console.log('trained!', data);
            matrix.service('recognition').stop();
            setTimeout(function() {
            matrix.led('black').render();
            }, 1000);
            io.emit('TrainSuccess', true); //SEND DATA TO CLIENT
        }
    });
}
////// RECOGNITION FUNCTION //////
// can verify if a person is registered
function recogFace() {
    // lighting
    var a = 180;
    var a2 = 0;
    var l = setInterval(function() {
        matrix.led([{
            arc: Math.round(180 * Math.sin(a)),
            color: 'blue',
            start: a2
        }, {
            arc: -Math.round(180 * Math.sin(a)),
            color: 'blue',
            start: a2 + 180
        }]).render();
        a = (a < 0) ? 180 : a - 0.1;
    }, 25);
    function stopLights() {
        clearInterval(l);
    }
    // starts recognition
    matrix.service('recognition').start(username_email).then(function(data) {
        stopLights();
        console.log('RECOG>>>!', data);
        var MinDistanceFace = _.values(data.matches);
        MinDistanceFace = _.sortBy(MinDistanceFace, ['score'])[0];
        //console.log('<<<<<<<Matches>>>>>>>>>>>>>>>>>'+ JSON.stringify(data.matches));
        console.log('Min Distance Face', MinDistanceFace);
        if (MinDistanceFace.score < 0.85) {
            matrix.led('green').render();
            console.log('I know dis guy');
            matrix.service('recognition').stop();
            setTimeout(function() {
            matrix.led('black').render();
            }, 1000);
            
        } else {
            matrix.led('red').render();
            console.log('I don know dis guy');
            matrix.service('recognition').stop();
            setTimeout(function() {
            matrix.led('black').render();
            }, 1000);
        }
    });
    console.log('recog!');
}
////// STOP SERVICE FUNCTION //////
matrix.on('stop', function() {
    matrix.service('recognition').stop();
});
