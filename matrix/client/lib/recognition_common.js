const EventEmitter = require('events');
const readLine = require('readline');
const fs = require('fs');
const grpc = require('grpc');

function readDescriptors (fileName, callback) {
  const rl = readLine.createInterface({
    input: fs.createReadStream(fileName),
  });
  let descriptors = [];
  rl.on('line', (line) => {
    descriptors.push(line.trim().split(' ').map(function(n) {
      return parseFloat(n) }));
  });
  rl.on('close', (line) => {
    callback(null, descriptors);
  });
}

class Recognizer {
  constructor(options) {
    let protoPath = options.protoBase + '/vision/recognition_service.proto';
    this.grpcProtos = grpc.load(protoPath).admobilize_vision;
    let credentials = options.useSsl ? grpc.credentials.createSsl() :
                                        grpc.credentials.createInsecure();
    this.context = new grpc.Metadata();
    this.context.add('authorization', 'Bearer ' + options.token.encoded)
    this.client = new this.grpcProtos.RecognitionService(
      options.serviceHost,
      credentials);
  }

  recognize(descriptors, callback) {
    let featureDescriptors = [];
    for (let i = 0; i < descriptors.length; ++i) {
      let feature = new this.grpcProtos.FeatureDescriptor();
      feature.data = descriptors[i];
      featureDescriptors.push(feature);
    }
    let descriptorList = new this.grpcProtos.FeatureDescriptorList()
    descriptorList.feature_descriptors = featureDescriptors
    this.client.recognize({
      feature_descriptor_list: descriptorList,
    }, this.context, (err, res) => {
      if (err) {
        callback(err, null);
      }
      if ('matches' in res) {
        callback(null, res.matches);
      } else {
        callback(null, []);
      }
    });
  }
}

class Trainer {
  constructor(options) {
  /*
    let protoPath = options.protoBase + '/vision/recognition_service.proto';
    this.grpcProtos = grpc.load(protoPath).admobilize_vision;
    this.client = new this.grpcProtos.RecognitionService(
      options.serviceHost,
      grpc.credentials.createInsecure());
    */
    let protoPath = options.protoBase + '/vision/recognition_service.proto';
    this.grpcProtos = grpc.load(protoPath).admobilize_vision;
    let credentials = options.useSsl ? grpc.credentials.createSsl() :
                                        grpc.credentials.createInsecure();
    this.context = new grpc.Metadata();
    this.context.add('authorization', 'Bearer ' + options.token.encoded)
    this.client = new this.grpcProtos.RecognitionService(
      options.serviceHost,
      credentials);
  }

  train(tags, descriptors, callback) {
    let feature_descriptors = [];
    for (let i = 0; i < descriptors.length; ++i) {
      let feature = new this.grpcProtos.FeatureDescriptor();
      feature.data = descriptors[i];
      feature.tags = tags;
      feature_descriptors.push(feature);
    }
    this.client.storeFeatureDescriptors({
      'tags' : tags,
      'feature_descriptors' : feature_descriptors,
    }, this.context, function(err, res) {
      callback(err, res);
    });
  }
}

class ListTags {
  constructor(options) {
    let protoPath = options.protoBase + '/vision/recognition_service.proto';
    this.grpcProtos = grpc.load(protoPath).admobilize_vision;
    let credentials = options.useSsl ? grpc.credentials.createSsl() :
                                        grpc.credentials.createInsecure();
    this.context = new grpc.Metadata();
    this.context.add('authorization', 'Bearer ' + options.token.encoded)
    this.client = new this.grpcProtos.RecognitionService(
      options.serviceHost,
      credentials);
  }

  list(callback) {
    this.client.getFeatureDescriptorTags({}, this.context,
      (err,res) => {
        if (err) {
          callback(err, null);
          return;
        }
        let ret = Array();
        if ('feature_tags_for_device' in res) {
          const tags_per_device = res['feature_tags_for_device']
          let all_tags = new Set()
          for (let i = 0; i < tags_per_device.length; ++i) {
            for (let j = 0; j < tags_per_device[i].tags.length; ++j) {
              all_tags.add(tags_per_device[i].tags[j])
            }
          }
          all_tags.forEach(x => {ret.push(x);});
        }
        callback(null, ret);
    });
  }
}

class DeleteTags {
  constructor(options) {
    let protoPath = options.protoBase + '/vision/recognition_service.proto';
    this.grpcProtos = grpc.load(protoPath).admobilize_vision;
    let credentials = options.useSsl ? grpc.credentials.createSsl() :
                                        grpc.credentials.createInsecure();
    this.context = new grpc.Metadata();
    this.context.add('authorization', 'Bearer ' + options.token.encoded)
    this.client = new this.grpcProtos.RecognitionService(
      options.serviceHost,
      credentials);
  }

  deleteTags(tags, callback) {
    this.client.deleteFeatureDescriptors({tags: tags},
      this.context,
      (err, res) => {
        callback(err, res);
    });
  }
}

// FIXME: Remove isDone and just stop listening to events.
// Use removeListener or removeAllListeners.
function getDescriptors(eye, howMany, verbose, done) {
  let descriptors = Array();
  let tracked_id;
  let isDone = false;

  if (verbose) {
    process.stderr.write('We need ' + howMany + ' descriptors\n');
  }

  eye.on('error', (msg) => {
    done(msg, null);
  });
  eye.on('trackingStart', (id) => {
    if (!tracked_id) {
      tracked_id = id;
    }
  });
  eye.on('faceDescriptor', (id, descriptor) => {
    if (id == tracked_id && !isDone) {
      descriptors.push(descriptor);
      if (descriptors.length >= howMany) {
        if (verbose) {
          process.stderr.write('Got descriptor: 100%\n');
        }
        done(null, descriptors);
        isDone = true;
        descriptors = []
      } else if (verbose) {
        process.stderr.write('Got descriptor: ' +
          Math.round(100 * descriptors.length / howMany) + '%\n');
      }
    }
  });
  eye.on('trackingEnd', (id, sessionTime, dwellTime) => {
    if (id == tracked_id && !isDone) {
      done(null, descriptors);
      isDone = true;
      descriptors = []
    }
  });
}

module.exports = {
  DeleteTags,
  getDescriptors,
  ListTags,
  readDescriptors,
  Recognizer,
  Trainer,
}
