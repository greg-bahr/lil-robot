# lil-robot
robot that be controlled from the web

This is the webserver that hosts the page for people to view the camera stream and to control the robot from the web. Robot controls are sent via websockets using socketio. The stream is being run using ffmpeg with [jsmpeg](https://github.com/phoboslab/jsmpeg).
