'use strict'
import '../../../assets/css/webgl.css'
import { m4 } from '../m4'
import { setGeometry } from '../vertex_f_3d'
import { setColors } from '../color_f_3d'

function main() {
    var canvas = document.querySelector('#canvas')
    var gl = canvas.getContext('webgl')
    if (!gl) {
        return
    }

    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-3d", "fragment-shader-3d"])

    var positionLocation = gl.getAttribLocation(program, "a_position");
    var colorLocation = gl.getAttribLocation(program, 'a_color')
    var matrixLocation = gl.getUniformLocation(program, 'u_matrix')

    var positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    setGeometry(gl)

    var colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    setColors(gl)


    function radToDeg(r) {
        return r * 180 / Math.PI
    }

    function degToRad(d) {
        return d * Math.PI / 180
    }

    var translation = [gl.canvas.clientWidth / 2, gl.canvas.clientHeight / 2, 0]
    var rotation = [degToRad(40), degToRad(25), degToRad(325)]
    var scale = [1, 1, 1]
    // var color = [Math.random(), Math.random(), Math.random(), 1]

    drawScene()

    // Setup a ui.
    webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#z", {value: translation[2], slide: updatePosition(2), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#angleX", {value: radToDeg(rotation[0]), slide: updateRotation(0), max: 360});
    webglLessonsUI.setupSlider("#angleY", {value: radToDeg(rotation[1]), slide: updateRotation(1), max: 360});
    webglLessonsUI.setupSlider("#angleZ", {value: radToDeg(rotation[2]), slide: updateRotation(2), max: 360});
    webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
    webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
    webglLessonsUI.setupSlider("#scaleZ", {value: scale[2], slide: updateScale(2), min: -5, max: 5, step: 0.01, precision: 2});

    function updatePosition(index) {
        return function(event, ui) {
        translation[index] = ui.value;
        drawScene();
        };
    }

    function updateRotation(index) {
        return function(event, ui) {
            var angleInDegrees = ui.value;
            var angleInRadians = angleInDegrees * Math.PI / 180;
            rotation[index] = angleInRadians;
            drawScene();
        };
    }

    function updateScale(index) {
        return function(event, ui) {
        scale[index] = ui.value;
        drawScene();
        };
    }

    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas)

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.useProgram(program)
        //  剔除背面三角形
        gl.enable(gl.CULL_FACE)
        gl.enable(gl.DEPTH_TEST)

        // position location
        gl.enableVertexAttribArray(positionLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        var size = 3
        var type = gl.FLOAT
        var normalize = false
        var stride = 0
        var offset = 0
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset)
        // color location 
        gl.enableVertexAttribArray(colorLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
        var size = 3
        var type = gl.UNSIGNED_BYTE
        var normalize = true
        var stride = 0
        var offset = 0
        gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset)
        // matrix
        var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400)
        matrix = m4.translate(matrix, translation[0], translation[1], translation[2])
        matrix = m4.xRotate(matrix, rotation[0])
        matrix = m4.yRotate(matrix, rotation[1])
        matrix = m4.zRotate(matrix, rotation[2])
        matrix = m4.scale(matrix, scale[0], scale[1], scale[2])

        gl.uniformMatrix4fv(matrixLocation, false, matrix)

        var primitiveType = gl.TRIANGLES
        var offset = 0
        var count = 16 * 6
        gl.drawArrays(primitiveType, offset, count)
    }
}
  
  main()