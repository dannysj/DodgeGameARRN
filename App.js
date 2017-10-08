/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
   DeviceEventEmitter,
} from 'react-native';
import {ARKit} from 'react-native-arkit';
import PropTypes from 'prop-types';
import Animation from 'lottie-react-native';
import ActionButton from './components/ActionButton.js';
import * as colors from './components/styles/colors';
import * as dimension from './components/styles/dimension';
import TimerMixin from 'react-timer-mixin';

var {
    Accelerometer,
    Gyroscope,
    Magnetometer
} = require('NativeModules');

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

var steps = [];
var varSteps = [];

export default class App extends Component<{}> {

  constructor(props) {
    super(props)
    this.state = {
      numberOfSteps: 0,
      distance: 0,
      pikachuMode: 'A',
      pikachuSteps: 0,
      pikachuX: 0,
      pikachuY: -5,
      pikachuZ: -5,
      pikachu2X: 8,
      pikachu2Y: -5,
      pikachu2Z: 5,
      pikachuScale: 0.02,
      lat: 0,
      lon: 0,
      nlat: 0,
      nlon: 0,
      lastX: 0,
      lastZ: 0,
      xPlus: true,
      zPlus: true,
      pikachu2File: 'art.scnassets/pikachuSteadyFast.dae',
    };

    this._startUpdates = this._startUpdates.bind(this);
            this.updateHit = this.updateHit.bind(this);
                this.updateRun = this.updateRun.bind(this);
                    this.updateKenaHit = this.updateKenaHit.bind(this);
                    this.onHit = this.onHit.bind(this);
                    this.updateAnimation = this.updateAnimation.bind(this);


  }


  updateAnimation(object) {
    if (object == "A") {
      var counter = 0;
      var dx = 1.5 ;
        var dz = 1.5 ;
          var {xPlus, zPlus} = this.state;
        if (!xPlus) {
          dx = dx * -1;
        }
        if (!zPlus) {
          dz = dz * -1;
        }
        var that = this;
        var clearId = TimerMixin.setInterval(
          () => {
          counter += 1;

          if (counter == 3) {
            that.setState({pikachuMode: 'A'});
            console.log("Clearing ID" + clearId);
            TimerMixin.clearInterval(that.state.clearId);
          }
          else {
            var {pikachuX, pikachuZ} = that.state;

            that.setState({pikachuX: pikachuX + dx,
              pikachuZ: pikachuZ + dz,
              pikachuMode: "B"});

              }
        }, 500);

              this.setState({clearId: clearId})
              console.log(clearId);
    }

  }

  checkKenaHit(ballX, ballY, ballZ) {
    var height = 47;
    var width = 35;
    var depth = 51;

    var {pikachuX, pikachuY, pikachuZ,pikachu2X, pikachu2Y, pikachu2Z} = this.state;
    var startX = pikachuX - width/2.0;
    var endX = pikachuX + width/2.0;
    var depthStart = pikachuZ - (depth / 2.0);
    var depthEnd = pikachuZ + (depth / 2.0);

    var start2X = pikachu2X - width/2.0;
    var end2X = pikachu2X + width/2.0;
    var depthStart2 = pikachu2Z - (depth / 2.0);
    var depthEnd2 = pikachu2Z + (depth / 2.0);

    if ((startX <= end2X) && (startX >= start2X)) {
        if ((depthStart <= depthEnd2) && (depthStart2 >= depthStart)) {
            onHit();
        }
    }
  }

  onHit() {
    console.log("OOOOOOOOOOOOOOOOOO");
    this.setState({pikachu2File: 'art.scnassets/pikachuRunFast.dae'})
  }

  componentDidMount() {
    this._startUpdates();
  }

  componentDidUpdate() {
    this.checkKenaHit();
  }
  _startUpdates() {
    var that = this;
    Accelerometer.setAccelerometerUpdateInterval(0.1); // in seconds
        DeviceEventEmitter.addListener('AccelerationData', function (data) {
            var test = Math.sqrt( data.acceleration.x * data.acceleration.x + data.acceleration.y * data.acceleration.y + data.acceleration.z * data.acceleration.z );
            console.log("this is your output: " + test);
            steps.push(test);

            if (steps.length == 6) {
              var sum = 0;
              for (var i = 0; i < steps.length; i++) {
                sum += steps[i];
              }

              var mean = sum / 6.0;
              var ssd = 0
              for (var i = 0; i < steps.length; i++) {
                ssd += Math.pow((steps[i] - mean),2);
              }

              var variance = ssd / 5.0


              steps = [];


              if ((variance >= 0.05) && (variance <= .90)) {
                  console.log("The variance is " + ssd);
                  console.log("variance X:" + data.acceleration.x + "Z:"+  data.acceleration.z)
                  var {numberOfSteps, lastX, lastZ} = that.state;
                  that.setState({numberOfSteps: numberOfSteps + 1});
                  if (data.acceleration.x >= lastX) {
                    that.setState({xPlus: false});
                  } else {
                    that.setState({xPlus: true});
                  }
                  if (data.acceleration.z >= lastZ) {
                    that.setState({xPlus: false});
                  } else {
                    that.setState({xPlus: true});
                  }


                  that.setState({lastX: data.acceleration.x, lastZ: data.acceleration.z});

                  that.updateAnimation("A");
                }


            }
        });
        Accelerometer.startAccelerometerUpdates(); // you'll start getting AccelerationData events above

  }



  updateHit(){
    console.log('Hit! Hit Hit!');
    this.setState({pikachuMode: 'C'});

    var that = this;

    var counter = 0;
    var clearId = TimerMixin.setInterval(() =>
    {
      counter +=1;

      if (counter == 3) {

        console.log("Clearing ID" + clearId);
        TimerMixin.clearInterval(that.state.clearId);
        var {pikachuX,pikachuZ} = this.state;
        this.setState({
        pikachuZ: pikachuZ - 2,
        pikachuMode: 'A'
      });

    } else {
      var {pikachuX,pikachuZ} = this.state;
      this.setState({
      pikachuZ: pikachuZ + 1,

    });
  }
  }, 500);

    this.setState({clearId: clearId})
    console.log(clearId);
  }

  updateRun() {
    this.setState({pikachuMode: 'B'});

  }

  updateKenaHit() {
    this.setState({pikachuMode:'D'});
  }

  componentDidUpdate() {
    var {pikachuMode} = this.state;

  }


  render() {
    var {pikachuScale, pikachuX, pikachuY, pikachuZ, pikachu2X,pikachu2Y,pikachu2Z, pikachuMode, pikachu2File} = this.state;

    console.log(pikachuMode);

    var pikachuFile = 'art.scnassets/pikachuSteadyFast.dae';

    switch (pikachuMode) {
      case 'A':
        console.log("TF");
        pikachuFile = 'art.scnassets/pikachuSteadyFast.dae'
      break;

      case 'B':
      console.log("OK");
        pikachuFile = 'art.scnassets/pikachuRunFast.dae';
      break;

      case 'C':
      console.log("HUH");
        pikachuFile = 'art.scnassets/pikachuQuickAttack.dae';
      break;

      case 'D':
      console.log("WTF");
      pikachuFile = 'art.scnassets/pikachuKenaHitFast.dae';
      break;

      default:
      console.log("WTFWTF");
      break;
    }

    return (
      <View style={styles.container}>

        <TouchableOpacity
                  onPress={this.updateHit}
                style={{
                  position: 'absolute',
                  backgroundColor: '#111',
                  opacity: 0.5,
                  borderRadius: height * 0.3,
                  alignSelf: 'flex-end',
                  padding: height * 0.05,
                  marginBottom: height * 0.3,
                  marginRight: height * 0.3,
                  width: height * 0.2,
                  height: height * 0.2,
                  bottom: -160,
                  right: -180,
                  zIndex: 10,
                    }}
            />

            <ARKit
              style={{ flex: 1 , zIndex: 9}}
              debug // debug mode will show feature points detected and 3D axis
              planeDetection // turn on plane detection
              lightEstimation // turn on light estimation
              onPlaneDetected={console.log} // event listener for plane detection
              onPlaneUpdate={console.log} // event listener for plane update
              >

              <ARKit.Model
                   position={{ x: pikachuX, y: pikachuY, z: pikachuZ, frame: 'local' }}
                   model={{
                     file: pikachuFile, // make sure you have the model file in the ios project
                     scale: pikachuScale,
                   }}
                 />

                 <ARKit.Model
                      position={{ x: pikachu2X, y: pikachu2Y, z: pikachu2Z, frame: 'local' }}
                      model={{
                        file: pikachu2File, // make sure you have the model file in the ios project
                        scale: pikachuScale,
                      }}
                    />

              </ARKit>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'flex-end',

  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    position: 'absolute',
    paddingVertical: dimension.height * .08,
    paddingHorizontal: dimension.height * .08,
    width: dimension.width * .08,
    height: dimension.height * .08,

  },
});


App.propTypes = {
  numberOfSteps: PropTypes.number,
  distance: PropTypes.number,
  pikachuMode: PropTypes.number,
  pikachuSteps: PropTypes.number,
  pikachuX: PropTypes.number,
  pikachuY: PropTypes.number,
  pikachuZ: PropTypes.number,
  pikachuFile: PropTypes.string,
  pikachuScale: PropTypes.number,
  currentLat: PropTypes.number,
  currentLon: PropTypes.number,
};
