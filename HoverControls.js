/**
 * Poorly Coded by jerome.
 * Date: 08/12/2011
 *
 * This is a JS port of the Away3D 3.6 HoverCamera Class that I had ported to Away3D 4!
 * It loosely follows the Controls already present in the Three.js library.
 *
 */


THREE.HoverControls = function (object, domElement) {


    // API

    this.object = object;
    this.domElement = ( domElement !== undefined ) ? domElement : document;
    this.panAngle = 0;
    this.tiltAngle = 0;
    this.distance = 1;
    this.minTiltAngle = -90;
    this.maxTiltAngle = 90;
    this.minPanAngle = -Infinity;
    this.maxPanAngle = Infinity;
    this.steps = 10;
    this.yfactor = 2;
    this.wrapPanAngle = false;
    this.target = new THREE.Vector3(0, 0, 0);
    this.enabled = true;

    // internals
    var _this = this;
    var _currentPanAngle = 0;
    var _currentTiltAngle = 0;
    var _cameraSpeed = 0.2;
    var _lastMouseX = 0;
    var _lastMouseY = 0;
    var _lastPanAngle = 0;
    var _lastTiltAngle = 0;
    var _move = false;
    var _toRadian =  Math.PI/180;

    this.update = function(jumpTo) {

        jumpTo = jumpTo || false;

        if (_this.tiltAngle != _currentTiltAngle || _this.panAngle != _currentPanAngle) {

            _this.tiltAngle = Math.max(_this.minTiltAngle, Math.min(_this.maxTiltAngle, _this.tiltAngle));
            _this.panAngle = Math.max(_this.minPanAngle, Math.min(_this.maxPanAngle, _this.panAngle));


            if (_this.wrapPanAngle) {
                if (_this.panAngle < 0)
                    _this.panAngle = (_this.panAngle % 360) + 360;
                else
                    _this.panAngle = _this.panAngle % 360;

                if (_this.panAngle - _currentPanAngle < -180)
                    _this.panAngle += 360;
                else if (_this.panAngle - _currentPanAngle > 180)
                    _this.panAngle -= 360;
            }

            if (jumpTo) {
                _currentTiltAngle = _this.tiltAngle;
                _currentPanAngle = _this.panAngle;
            } else {
                _currentTiltAngle += (_this.tiltAngle - _currentTiltAngle) / (_this.steps + 1);
                _currentPanAngle += (_this.panAngle - _currentPanAngle) / (_this.steps + 1);
            }

            //snap coords if angle differences are close
            if ((Math.abs(_this.tiltAngle - _currentTiltAngle) < 0.001) && (Math.abs(_this.panAngle - _currentPanAngle) < 0.001)) {
                _currentTiltAngle = _this.tiltAngle;
                _currentPanAngle = _this.panAngle;
            }

        }

        var gx = _this.target.x + _this.distance * Math.sin(_currentPanAngle * _toRadian) * Math.cos(_currentTiltAngle * _toRadian);
        var gz = _this.target.z + _this.distance * Math.cos(_currentPanAngle * _toRadian) * Math.cos(_currentTiltAngle * _toRadian);
        var gy = _this.target.y + _this.distance * Math.sin(_currentTiltAngle* _toRadian) * _this.yfactor;

        if ((_this.object.x == gx) && (_this.object.y == gy) && (_this.object.z == gz))
            return false;

        _this.object.position.x = gx;
        _this.object.position.y = gy;
        _this.object.position.z = gz;

        _this.object.lookAt(_this.target);

        console.log(_this.tiltAngle, this.panAngle);

        return true;
    };


    function mousedown(event) {

        if (!_this.enabled) return;

        event.preventDefault();
        event.stopPropagation();

        _lastPanAngle = _this.panAngle;
        _lastTiltAngle = _this.tiltAngle;
        _lastMouseX = event.clientX;
        _lastMouseY = event.clientY;
        _move = true;

    }


    function mouseup(event) {

        if (!_this.enabled) return;

        event.preventDefault();
        event.stopPropagation();

        _move = false;

    }

    function mousemove(event) {
        if (!_this.enabled) return;

        if (_move) {
            _this.panAngle = _cameraSpeed * (event.clientX - _lastMouseX) + _lastPanAngle;
            _this.tiltAngle = _cameraSpeed * (_lastMouseY - event.clientY) + _lastTiltAngle;
        }
    }

    this.domElement.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    }, false);

    this.domElement.addEventListener('mousemove', mousemove, false);
    this.domElement.addEventListener('mousedown', mousedown, false);
    this.domElement.addEventListener('mouseup', mouseup, false);
};
