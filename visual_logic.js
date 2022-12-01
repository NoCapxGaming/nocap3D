/**
 * Generated by Verge3D Puzzles v.4.2.0
 * Thu, 01 Dec 2022 18:27:59 GMT
 * Prefer not editing this file as your changes may get overridden once Puzzles are saved.
 * Check out https://www.soft8soft.com/docs/manual/en/introduction/Using-JavaScript.html
 * for the information on how to add your own JavaScript to Verge3D apps.
 */
function createPL() {

// global variables/constants used by puzzles' functions

var LIST_NONE = '<none>';

var _pGlob = {};

_pGlob.objCache = {};
_pGlob.fadeAnnotations = true;
_pGlob.pickedObject = '';
_pGlob.hoveredObject = '';
_pGlob.mediaElements = {};
_pGlob.loadedFile = '';
_pGlob.states = [];
_pGlob.percentage = 0;
_pGlob.openedFile = '';
_pGlob.openedFileMeta = {};
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();
_pGlob.intervalTimers = {};
_pGlob.customEvents = new v3d.EventDispatcher();
_pGlob.eventListeners = [];

_pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
_pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
_pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
_pGlob.MIN_DRAG_SCALE = 10e-4;
_pGlob.SET_OBJ_ROT_EPS = 1e-8;

_pGlob.vec2Tmp = new v3d.Vector2();
_pGlob.vec2Tmp2 = new v3d.Vector2();
_pGlob.vec3Tmp = new v3d.Vector3();
_pGlob.vec3Tmp2 = new v3d.Vector3();
_pGlob.vec3Tmp3 = new v3d.Vector3();
_pGlob.vec3Tmp4 = new v3d.Vector3();
_pGlob.eulerTmp = new v3d.Euler();
_pGlob.eulerTmp2 = new v3d.Euler();
_pGlob.quatTmp = new v3d.Quaternion();
_pGlob.quatTmp2 = new v3d.Quaternion();
_pGlob.colorTmp = new v3d.Color();
_pGlob.mat4Tmp = new v3d.Matrix4();
_pGlob.planeTmp = new v3d.Plane();
_pGlob.raycasterTmp = new v3d.Raycaster();

var PL = {};
// backward compatibility
v3d.PL = v3d.puzzles = PL;

PL.procedures = PL.procedures || {};




PL.execInitPuzzles = function(options) {
    // always null, should not be available in "init" puzzles
    var appInstance = null;
    // app is more conventional than appInstance (used in exec script and app templates)
    var app = null;

    var _initGlob = {};
    _initGlob.percentage = 0;
    _initGlob.output = {
        initOptions: {
            fadeAnnotations: true,
            useBkgTransp: false,
            preserveDrawBuf: false,
            useCompAssets: false,
            useFullscreen: true,
            useCustomPreloader: false,
            preloaderStartCb: function() {},
            preloaderProgressCb: function() {},
            preloaderEndCb: function() {},
        }
    }

    // provide the container's id to puzzles that need access to the container
    _initGlob.container = options !== undefined && 'container' in options
            ? options.container : "";

    

    // initSettings puzzle
_initGlob.output.initOptions.fadeAnnotations = true;
_initGlob.output.initOptions.useBkgTransp = true;
_initGlob.output.initOptions.preserveDrawBuf = false;
_initGlob.output.initOptions.useCompAssets = false;
_initGlob.output.initOptions.useFullscreen = true;

    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {

// app is more conventional than appInstance (used in exec script and app templates)
var app = appInstance;

initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}



var models;

// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj) {
    return obj.type !== 'AmbientLight' &&
           obj.name !== '' &&
           !(obj.isMesh && obj.isMaterialGeneratedMesh) &&
           !obj.isAuxClippingMesh;
}


// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName) {
    var objFound;
    var runTime = _pGlob !== undefined;
    objFound = runTime ? _pGlob.objCache[objName] : null;

    if (objFound && objFound.name === objName)
        return objFound;

    if (appInstance.scene) {
        appInstance.scene.traverse(function(obj) {
            if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
                objFound = obj;
                if (runTime) {
                    _pGlob.objCache[objName] = objFound;
                }
            }
        });
    }
    return objFound;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects on the scene
function getAllObjectNames() {
    var objNameList = [];
    appInstance.scene.traverse(function(obj) {
        if (notIgnoredObj(obj))
            objNameList.push(obj.name)
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects which belong to the group
function getObjectNamesByGroupName(targetGroupName) {
    var objNameList = [];
    appInstance.scene.traverse(function(obj){
        if (notIgnoredObj(obj)) {
            var groupNames = obj.groupNames;
            if (!groupNames)
                return;
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == targetGroupName) {
                    objNameList.push(obj.name);
                }
            }
        }
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames) {
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc.filter(function(name) {
        return name;
    });
}

function retrieveObjectNamesAcc(currObjNames, acc) {
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}

/**
 * Retrieve coordinate system from the loaded scene
 */
function getCoordSystem() {
    var scene = appInstance.scene;

    if (scene && 'coordSystem' in scene.userData) {
        return scene.userData.coordSystem;
    }

    return 'Y_UP_RIGHT';
}


/**
 * Transform coordinates from one space to another
 * Can be used with Vector3 or Euler.
 */
function coordsTransform(coords, from, to, noSignChange) {

    if (from == to)
        return coords;

    var y = coords.y, z = coords.z;

    if (from == 'Z_UP_RIGHT' && to == 'Y_UP_RIGHT') {
        coords.y = z;
        coords.z = noSignChange ? y : -y;
    } else if (from == 'Y_UP_RIGHT' && to == 'Z_UP_RIGHT') {
        coords.y = noSignChange ? z : -z;
        coords.z = y;
    } else {
        console.error('coordsTransform: Unsupported coordinate space');
    }

    return coords;
}


/**
 * Verge3D euler rotation to Blender/Max shortest.
 * 1) Convert from intrinsic rotation (v3d) to extrinsic XYZ (Blender/Max default
 *    order) via reversion: XYZ -> ZYX
 * 2) swizzle ZYX->YZX
 * 3) choose the shortest rotation to resemble Blender's behavior
 */
var eulerV3DToBlenderShortest = function() {

    var eulerTmp = new v3d.Euler();
    var eulerTmp2 = new v3d.Euler();
    var vec3Tmp = new v3d.Vector3();

    return function(euler, dest) {

        var eulerBlender = eulerTmp.copy(euler).reorder('YZX');
        var eulerBlenderAlt = eulerTmp2.copy(eulerBlender).makeAlternative();

        var len = eulerBlender.toVector3(vec3Tmp).lengthSq();
        var lenAlt = eulerBlenderAlt.toVector3(vec3Tmp).lengthSq();

        dest.copy(len < lenAlt ? eulerBlender : eulerBlenderAlt);
        return coordsTransform(dest, 'Y_UP_RIGHT', 'Z_UP_RIGHT');
    }

}();

// dragRotate puzzle
function dragRotate(objSelector, mode, isParentSpace, blockId, parentDragOverBlockId) {
    var camera = appInstance.getCamera(true);
    if (!camera)
        return;

    if (!_pGlob.objDragOverInfoByBlock)
        return;

    var objNames = retrieveObjectNames(objSelector);

    var info = _pGlob.objDragOverInfoByBlock[parentDragOverBlockId];
    if (!info) return;

    var coordSystem = getCoordSystem();

    for (var i = 0; i < objNames.length; i++) {
        var obj = getObjectByName(objNames[i]);
        if (!obj) {
            continue;
        }

        if (mode == "X" || mode == "Y" || mode == "Z") {
            var objPos = obj.getWorldPosition(_pGlob.vec3Tmp);
            objPos.project(camera);

            var objX = (objPos.x + 1) / 2 * appInstance.getWidth();
            var objY = (-objPos.y + 1) / 2 * appInstance.getHeight();
            var vecFrom = _pGlob.vec2Tmp.set(info.prevX - objX, objY - info.prevY);
            var vecTo = _pGlob.vec2Tmp2.set(info.currX - objX, objY - info.currY);

            if (coordSystem == 'Z_UP_RIGHT')
                var axis = _pGlob.vec3Tmp.copy(mode == "X" ? _pGlob.AXIS_X
                        : (mode == "Y" ? _pGlob.AXIS_Z : _pGlob.AXIS_Y));
            else
                var axis = _pGlob.vec3Tmp.copy(mode == "X" ? _pGlob.AXIS_X
                        : (mode == "Y" ? _pGlob.AXIS_Y : _pGlob.AXIS_Z));

            var quat = _pGlob.quatTmp.setFromAxisAngle(axis, vecTo.angle() - vecFrom.angle());

            // a rotation axis pointing backwards (i.e. co-directionally
            // aligned with the view vector) should have inverted rotation
            var objToCalcSpace = isParentSpace && obj.parent ? obj.parent : obj;
            axis.applyQuaternion(objToCalcSpace.getWorldQuaternion(_pGlob.quatTmp2));

            var viewVec = camera.getWorldDirection(_pGlob.vec3Tmp2);
            if (viewVec.dot(axis) > 0) {
                quat.conjugate();
            }

            if (isParentSpace) {
                obj.quaternion.premultiply(quat);
            } else {
                obj.quaternion.multiply(quat);
            }
            obj.updateMatrixWorld(true);
        }
    }
}

function eventGetOffsetCoords(e, touchId, dest) {
    if (e instanceof MouseEvent) {
        dest.set(e.offsetX, e.offsetY);
    } else if (window.TouchEvent && e instanceof TouchEvent) {
        var rect = e.target.getBoundingClientRect();
        var touches = e.touches;
        if (e.type == "touchstart" || e.type == "touchend" || e.type == "touchmove") {
            touches = e.changedTouches;
        }

        var touch = touches[0];
        for (var i = 0; i < touches.length; i++) {
            if (touches[i].identifier == touchId) {
                touch = touches[i];
                break;
            }
        }

        dest.set(touch.clientX - rect.left, touch.clientY - rect.top);
    }
    return dest;
}

function eventTouchIdGetFirst(e) {
    if (e instanceof MouseEvent) {
        return -1;
    } else if (window.TouchEvent && e instanceof TouchEvent) {
        if (e.type == "touchstart" || e.type == "touchend" || e.type == "touchmove") {
            return e.changedTouches[0].identifier;
        } else {
            return e.touches[0].identifier;
        }
    }
    return -1;
}

/**
 * For "touchstart", "touchend" and "touchmove" events returns true if a touch
 * object with the provided touch id is in the changedTouches array, otherwise
 * - false. For other events returns true.
 */
function eventTouchIdChangedFilter(e, touchId) {
    if (window.TouchEvent && e instanceof TouchEvent) {
        if (e.type == "touchstart" || e.type == "touchend" || e.type == "touchmove") {
            var isChanged = false;
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier == touchId) {
                    isChanged = true;
                    break;
                }
            }
            return isChanged;
        }
    }

    return true;
}

function initDragOverInfo() {
    return {
        draggedObjName: '',
        downX: 0, downY: 0,
        prevX: 0, prevY: 0,
        currX: 0, currY: 0,
        isDowned: false,
        isMoved: false,
        touchId: -1
    };
}

function _checkListenersSame(target0, type0, listener0, optionsOrUseCapture0,
        target1, type1, listener1, optionsOrUseCapture1) {
    const capture0 = Boolean(optionsOrUseCapture0 instanceof Object
            ? optionsOrUseCapture0.capture : optionsOrUseCapture0);
    const capture1 = Boolean(optionsOrUseCapture1 instanceof Object
            ? optionsOrUseCapture1.capture : optionsOrUseCapture1);
    return target0 === target1 && type0 === type1 && listener0 === listener1
            && capture0 === capture1;
}

/**
 * Add the specified event listener to the specified target. This function also
 * stores listener data for easier disposing.
 */
function bindListener(target, type, listener, optionsOrUseCapture) {
    const alreadyExists = _pGlob.eventListeners.some(elem => {
        return _checkListenersSame(elem.target, elem.type, elem.listener,
                elem.optionsOrUseCapture, target, type, listener,
                optionsOrUseCapture);
    });

    if (!alreadyExists) {
        target.addEventListener(type, listener, optionsOrUseCapture);
        _pGlob.eventListeners.push({ target, type, listener, optionsOrUseCapture });
    }
}

/**
 * Remove the specified event listener from the specified target.
 */
function unbindListener(target, type, listener, optionsOrUseCapture) {
    const index = _pGlob.eventListeners.findIndex(elem => {
        return _checkListenersSame(elem.target, elem.type, elem.listener,
            elem.optionsOrUseCapture, target, type, listener,
            optionsOrUseCapture);
    });

    if (index !== -1) {
        target.removeEventListener(type, listener, optionsOrUseCapture);
        _pGlob.eventListeners.splice(index, 1);
    }
}

// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function initObjectPicking(callback, eventType, mouseDownUseTouchStart, mouseButtons) {

    var elem = appInstance.renderer.domElement;
    bindListener(elem, eventType, pickListener);

    if (eventType == 'mousedown') {

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        bindListener(elem, touchEventName, pickListener);

    } else if (eventType == 'dblclick') {

        var prevTapTime = 0;

        function doubleTapCallback(event) {

            var now = new Date().getTime();
            var timesince = now - prevTapTime;

            if (timesince < 600 && timesince > 0) {

                pickListener(event);
                prevTapTime = 0;
                return;

            }

            prevTapTime = new Date().getTime();
        }

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        bindListener(elem, touchEventName, doubleTapCallback);
    }

    var raycaster = new v3d.Raycaster();

    function pickListener(event) {

        // to handle unload in loadScene puzzle
        if (!appInstance.getCamera())
            return;

        event.preventDefault();

        var xNorm = 0, yNorm = 0;
        if (event instanceof MouseEvent) {
            if (mouseButtons && mouseButtons.indexOf(event.button) == -1)
                return;
            xNorm = event.offsetX / elem.clientWidth;
            yNorm = event.offsetY / elem.clientHeight;
        } else if (event instanceof TouchEvent) {
            var rect = elem.getBoundingClientRect();
            xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
            yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
        }

        _pGlob.screenCoords.x = xNorm * 2 - 1;
        _pGlob.screenCoords.y = -yNorm * 2 + 1;
        raycaster.setFromCamera(_pGlob.screenCoords, appInstance.getCamera(true));
        var objList = [];
        appInstance.scene.traverse(function(obj){objList.push(obj);});
        var intersects = raycaster.intersectObjects(objList, false);
        callback(intersects, event);
    }
}

function objectsIncludeObj(objNames, testedObjName) {
    if (!testedObjName) return false;

    for (var i = 0; i < objNames.length; i++) {
        if (testedObjName == objNames[i]) {
            return true;
        } else {
            // also check children which are auto-generated for multi-material objects
            var obj = getObjectByName(objNames[i]);
            if (obj && obj.type == "Group") {
                for (var j = 0; j < obj.children.length; j++) {
                    if (testedObjName == obj.children[j].name) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// utility function used by the whenClicked, whenHovered, whenDraggedOver, and raycast puzzles
function getPickedObjectName(obj) {
    // auto-generated from a multi-material object, use parent name instead
    if (obj.isMesh && obj.isMaterialGeneratedMesh && obj.parent) {
        return obj.parent.name;
    } else {
        return obj.name;
    }
}

// whenDraggedOver puzzle
_pGlob.objDragOverInfoGlobal = [];
_pGlob.objDragOverInfoByBlock = {}

initObjectPicking(function(intersects, downEvent) {

    _pGlob.objDragOverInfoGlobal.forEach(function(el) {

        if (downEvent instanceof MouseEvent)
            if (el.mouseButtons.indexOf(downEvent.button) == -1)
                return;

        var maxIntersects = el.xRay ? intersects.length : Math.min(1, intersects.length);

        for (var i = 0; i < maxIntersects; i++) {
            var obj = intersects[i].object;
            var objName = getPickedObjectName(obj);

            if (objectsIncludeObj([el.objName], objName)) {
                el.callback({ downEvent: downEvent, draggedObjName: objName });
            }

        }

    });

}, 'mousedown', true);

// whenDraggedOver puzzle
function registerOnDrag(objSelector, xRay, mouseButtons, cbStart, cbMove, cbDrop, blockId) {

    var cb = function(cbParam) {

        if (appInstance.controls) {
            appInstance.controls.enabled = false;
        }

        if (!(blockId in _pGlob.objDragOverInfoByBlock)) {
            _pGlob.objDragOverInfoByBlock[blockId] = initDragOverInfo();
        }
        var info = _pGlob.objDragOverInfoByBlock[blockId];

        // NOTE: don't use more than one pointing event, e.g. don't process
        // some events related to multitouch actions
        if (info.isDowned) {
            return;
        }

        var touchId = eventTouchIdGetFirst(cbParam.downEvent);
        var coords = eventGetOffsetCoords(cbParam.downEvent, touchId,
                _pGlob.vec2Tmp);

        info.downX = info.prevX = info.currX = coords.x;
        info.downY = info.prevY = info.currY = coords.y;
        info.touchId = touchId;
        info.isDowned = true;
        info.isMoved = false;
        info.draggedObjName = cbParam.draggedObjName;

        cbStart(cbParam.downEvent);

        var elem = appInstance.container;

        var moveCb = function(e) {
            if (!eventTouchIdChangedFilter(e, info.touchId)) {
                // don't handle events not intended for this particular touch
                return;
            }

            var coords = eventGetOffsetCoords(e, info.touchId, _pGlob.vec2Tmp);
            info.prevX = info.currX;
            info.prevY = info.currY;
            info.currX = coords.x;
            info.currY = coords.y;
            cbMove(e);
            info.isMoved = true;
        }
        var upCb = function(e) {
            if (!eventTouchIdChangedFilter(e, info.touchId)) {
                // don't handle events not intended for this particular touch
                return;
            }

            var coords = eventGetOffsetCoords(e, info.touchId, _pGlob.vec2Tmp);
            info.currX = coords.x;
            info.currY = coords.y;
            info.prevX = info.currX;
            info.prevY = info.currY;
            cbDrop(e);
            info.isDowned = false;

            unbindListener(elem, 'mousemove', moveCb);
            unbindListener(elem, 'touchmove', moveCb);
            unbindListener(elem, 'mouseup', upCb);
            unbindListener(elem, 'touchend', upCb);
            if (appInstance.controls) {
                appInstance.controls.enabled = true;
            }
        }

        bindListener(elem, 'mousemove', moveCb);
        bindListener(elem, 'touchmove', moveCb);
        bindListener(elem, 'mouseup', upCb);
        bindListener(elem, 'touchend', upCb);
    }

    var objNames = retrieveObjectNames(objSelector);

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        _pGlob.objDragOverInfoGlobal.push({
            objName: objName,
            callback: cb,
            xRay: xRay,
            mouseButtons: mouseButtons
        });
    }
}

// dragScale puzzle
_pGlob.dragScaleOrigins = {};

function dragScale(objSelector, mode, blockId, parentDragOverBlockId) {
    var camera = appInstance.getCamera(true);
    if (!camera)
        return;

    if (!_pGlob.objDragOverInfoByBlock)
        return;

    var objNames = retrieveObjectNames(objSelector);

    var info = _pGlob.objDragOverInfoByBlock[parentDragOverBlockId];
    if (!info) return;

    if (!(blockId in _pGlob.dragScaleOrigins)) {
        _pGlob.dragScaleOrigins[blockId] = [];
    }
    var scaleOrigins = _pGlob.dragScaleOrigins[blockId];
    var lenDiff = objNames.length - scaleOrigins.length;
    for (var i = 0; i < lenDiff; i++) {
        scaleOrigins.push(new v3d.Vector3());
    }

    var coordSystem = getCoordSystem();

    for (var i = 0; i < objNames.length; i++) {
        var obj = getObjectByName(objNames[i]);
        if (!obj) {
            continue;
        }

        var scaleOrigin = scaleOrigins[i];

        if (!info.isMoved) {
            // the object scale before the first move is used as an initial value
            scaleOrigin.copy(obj.scale);
        }

        if (mode == "X" || mode == "Y" || mode == "Z") {
            if (coordSystem == 'Z_UP_RIGHT')
                var coord = mode == "X" ? "x" : (mode == "Y" ? "z" : "y");
            else
                var coord = mode == "X" ? "x" : (mode == "Y" ? "y" : "z");

            var objPos = obj.getWorldPosition(_pGlob.vec3Tmp);
            objPos.project(camera);

            var objX = (objPos.x + 1) / 2 * appInstance.getWidth();
            var objY = (-objPos.y + 1) / 2 * appInstance.getHeight();

            var vecFrom = _pGlob.vec2Tmp.set(info.downX - objX, objY - info.downY);
            var vecTo = _pGlob.vec2Tmp2.set(info.currX - objX, objY - info.currY);

            obj.scale[coord] = Math.max(scaleOrigin[coord]
                    * vecTo.dot(vecFrom) / vecFrom.lengthSq(), _pGlob.MIN_DRAG_SCALE);
            obj.updateMatrixWorld(true);
        }
    }
}

/**
 * Get a scene that contains the root of the given action.
 */
function getSceneByAction(action) {
    var root = action.getRoot();
    var scene = root.type == "Scene" ? root : null;
    root.traverseAncestors(function(ancObj) {
        if (ancObj.type == "Scene") {
            scene = ancObj;
        }
    });
    return scene;
}

/**
 * Get the current scene's framerate.
 */
function getSceneAnimFrameRate(scene) {
    if (scene && 'animFrameRate' in scene.userData) {
        return scene.userData.animFrameRate;
    }
    return 24;
}

_pGlob.animMixerCallbacks = [];

var initAnimationMixer = function() {

    function onMixerFinished(e) {
        var cb = _pGlob.animMixerCallbacks;
        var found = [];
        for (var i = 0; i < cb.length; i++) {
            if (cb[i][0] == e.action) {
                cb[i][0] = null; // desactivate
                found.push(cb[i][1]);
            }
        }
        for (var i = 0; i < found.length; i++) {
            found[i]();
        }
    }

    return function initAnimationMixer() {
        if (appInstance.mixer && !appInstance.mixer.hasEventListener('finished', onMixerFinished)) {
            bindListener(appInstance.mixer, 'finished', onMixerFinished);
        }
    };

}();

// animation puzzles
function operateAnimation(operation, animations, from, to, loop, speed, callback, rev) {
    if (!animations)
        return;
    // input can be either single obj or array of objects
    if (typeof animations == "string")
        animations = [animations];

    function processAnimation(animName) {
        var action = v3d.SceneUtils.getAnimationActionByName(appInstance, animName);
        if (!action)
            return;
        switch (operation) {
        case 'PLAY':
            if (!action.isRunning()) {
                action.reset();
                if (loop && (loop != "AUTO"))
                    action.loop = v3d[loop];
                var scene = getSceneByAction(action);
                var frameRate = getSceneAnimFrameRate(scene);

                action.repetitions = Infinity;

                var timeScale = Math.abs(parseFloat(speed));
                if (rev)
                    timeScale *= -1;

                action.timeScale = timeScale;
                action.timeStart = from !== null ? from/frameRate : 0;
                if (to !== null) {
                    action.getClip().duration = to/frameRate;
                } else {
                    action.getClip().resetDuration();
                }
                action.time = timeScale >= 0 ? action.timeStart : action.getClip().duration;

                action.paused = false;
                action.play();

                // push unique callbacks only
                var callbacks = _pGlob.animMixerCallbacks;
                var found = false;

                for (var j = 0; j < callbacks.length; j++)
                    if (callbacks[j][0] == action && callbacks[j][1] == callback)
                        found = true;

                if (!found)
                    _pGlob.animMixerCallbacks.push([action, callback]);
            }
            break;
        case 'STOP':
            action.stop();

            // remove callbacks
            var callbacks = _pGlob.animMixerCallbacks;
            for (var j = 0; j < callbacks.length; j++)
                if (callbacks[j][0] == action) {
                    callbacks.splice(j, 1);
                    j--
                }

            break;
        case 'PAUSE':
            action.paused = true;
            break;
        case 'RESUME':
            action.paused = false;
            break;
        case 'SET_FRAME':
            var scene = getSceneByAction(action);
            var frameRate = getSceneAnimFrameRate(scene);
            action.time = from ? from/frameRate : 0;
            action.play();
            action.paused = true;
            break;
        case 'SET_SPEED':
            var timeScale = parseFloat(speed);
            action.timeScale = rev ? -timeScale : timeScale;
            break;
        }
    }

    for (var i = 0; i < animations.length; i++) {
        var animName = animations[i];
        if (animName)
            processAnimation(animName);
    }

    initAnimationMixer();
}

// removeObject puzzles
function removeObject(objSelector) {
    var objNames = retrieveObjectNames(objSelector);

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i]
        if (!objName)
            continue;
        var obj = getObjectByName(objName);
        if (!obj || !obj.parent)
            continue;

        obj.parent.remove(obj);

        // clean object cache
        _pGlob.objCache = {};
    }
}

// setTimeout puzzle
function registerSetTimeout(timeout, callback) {
    window.setTimeout(callback, 1000 * timeout);
}

// utility functions envoked by the HTML puzzles
function getElements(ids, isParent) {
    var elems = [];
    if (Array.isArray(ids) && ids[0] != 'CONTAINER' && ids[0] != 'WINDOW' &&
        ids[0] != 'DOCUMENT' && ids[0] != 'BODY' && ids[0] != 'QUERYSELECTOR') {
        for (var i = 0; i < ids.length; i++)
            elems.push(getElement(ids[i], isParent));
    } else {
        elems.push(getElement(ids, isParent));
    }
    return elems;
}

function getElement(id, isParent) {
    var elem;
    if (Array.isArray(id) && id[0] == 'CONTAINER') {
        if (appInstance !== null) {
            elem = appInstance.container;
        } else if (typeof _initGlob !== 'undefined') {
            // if we are on the initialization stage, we still can have access
            // to the container element
            var id = _initGlob.container;
            if (isParent) {
                elem = parent.document.getElementById(id);
            } else {
                elem = document.getElementById(id);
            }
        }
    } else if (Array.isArray(id) && id[0] == 'WINDOW') {
        if (isParent)
            elem = parent;
        else
            elem = window;
    } else if (Array.isArray(id) && id[0] == 'DOCUMENT') {
        if (isParent)
            elem = parent.document;
        else
            elem = document;
    } else if (Array.isArray(id) && id[0] == 'BODY') {
        if (isParent)
            elem = parent.document.body;
        else
            elem = document.body;
    } else if (Array.isArray(id) && id[0] == 'QUERYSELECTOR') {
        if (isParent)
            elem = parent.document.querySelector(id);
        else
            elem = document.querySelector(id);
    } else {
        if (isParent)
            elem = parent.document.getElementById(id);
        else
            elem = document.getElementById(id);
    }
    return elem;
}

// eventHTMLElem puzzle
function eventHTMLElem(eventType, ids, isParent, callback) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem)
            continue;

        bindListener(elem, eventType, callback);
    }
}


registerOnDrag('Laptop', false, [0,1,2], function() {}, function() {
  dragRotate('Laptop', 'Z', true, 'QGVlzOem$fyBnPBMu.a|', ']a[jj6+|n%Fd5*w+Z!b9');
}, function() {}, ']a[jj6+|n%Fd5*w+Z!b9');

dragScale('Retro_Laser_Gun', 'X', 'mGXqEp.G|%dd!hUi*)o`', '');
dragScale('Retro_Laser_Gun', 'Y', 'k]Nzm/DD7e98U(tAm0fA', '');
dragScale('Retro_Laser_Gun', 'Z', 'N=4dmnk5;w]OS%=C%B`$', '');

eventHTMLElem('click', 'next_button', true, function(event) {
  if (models == 0) {

    operateAnimation('PLAY', 'Laptop', null, null, 'LoopOnce', 1,
            function() {}, false);

        registerSetTimeout(3, function() {
      removeObject('Laptop');
    });
  }
});

models = 0;



} // end of PL.init function

PL.disposeListeners = function() {
    if (_pGlob) {
        _pGlob.eventListeners.forEach(({ target, type, listener, optionsOrUseCapture }) => {
            target.removeEventListener(type, listener, optionsOrUseCapture);
        });
        _pGlob.eventListeners.length = 0;
    }
}

PL.dispose = function() {
    PL.disposeListeners();
    _pGlob = null;
    // backward compatibility
    delete v3d.PL;
    delete v3d.puzzles;
}



return PL;

}

export { createPL };
