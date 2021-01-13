'use strict'

import { setColors } from "../../../static/color_f_3d"
import { setCameraGeometry } from "../../../static/vertex_f_3d"
import { m4 } from "../../../static/m4"
import '../../../assets/css/webgl.css'

function main() {
    var canvas = document.querySelector('#canvas')
    var gl = canvas.getContext('webgl')
    if (!gl) {
        return
    }
    var program = webglUtils.createProgramFromScripts(gl, ['vertex-shader-3d', 'fragment-shader-3d'])

    var positionLocation = gl.getAttribLocation(program, 'a_position')
    var colorLocation = gl.getAttribLocation(program, 'a_color')

    var matrixLocation = gl.getUniformLocation(program, 'u_matrix')
    
    var positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    setCameraGeometry(gl)

    var colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    setColors(gl)

    function radToDeg(r) {
        return r * 180 / Math.PI
    }

    function degToRad(d) {
        return d * Math.PI / 180
    }

    var cameraAngleRadians = degToRad(0)
    var fieldOfViewRadians = degToRad(60)

    drawScene()

    // Setup a ui.
    webglLessonsUI.setupSlider("#cameraAngle", {value: radToDeg(cameraAngleRadians), slide: updateCameraAngle, min: -360, max: 360})
    function updateCameraAngle(event, ui) {
        cameraAngleRadians = degToRad(ui.value)
        drawScene();
    }

    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas)

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.enable(gl.CULL_FACE)

        gl.enable(gl.DEPTH_TEST)

        gl.useProgram(program)
        // 使用
        gl.enableVertexAttribArray(positionLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        var size = 3
        var type = gl.FLOAT
        var normalize = false
        var stride = 0
        var offset = 0
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset)
        //  使用 colorLocation
        gl.enableVertexAttribArray(colorLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
        var size = 3
        var type = gl.UNSIGNED_BYTE
        var normalize = true
        var stride = 0
        var offset = 0
        gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset)

        var numFs = 5
        var radius = 200
        // compute the projection matrix
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
        var zNear = 1
        var zFar = 2000
        var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar)
        // compute a matrix for the camera
        // case 1 
        // var cameraMatrix = m4.yRotation(cameraAngleRadians)
        // cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 2)
        // var viewMatrix = m4.inverse(cameraMatrix)
        // var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)
        // case 2 
        var cameraMatrix = m4.yRotation(cameraAngleRadians)
        cameraMatrix = m4.translate(cameraMatrix, Math.cos(cameraAngleRadians - Math.PI / 2) * radius * 2, 0, Math.sin(cameraAngleRadians - Math.PI / 2) * radius * 2)
        var viewProjectionMatrix = m4.multiply(projectionMatrix, cameraMatrix)

        for (var ii = 0; ii < numFs; ++ii) {
            var angle = ii * Math.PI * 2 / numFs
            var x = Math.cos(angle) * radius
            var y = Math.sin(angle) * radius

            var matrix = m4.translate(viewProjectionMatrix, x, 0, y)

            gl.uniformMatrix4fv(matrixLocation, false, matrix)

            var primitiveType = gl.TRIANGLES
            var offset = 0
            var count = 16 * 6
            gl.drawArrays(primitiveType, offset, count)
        }
    }
}

main()