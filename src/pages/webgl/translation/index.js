"use strict";
import '../../../assets/css/webgl.css'
var canvas = document.querySelector('#canvas')
function main() {
    var gl = canvas.getContext('webgl')
    if(!gl) {
        return
    }

    var program = webglUtils.createProgramFromScripts(gl, ['vertex-shader-2d', 'fragment-shader-2d'])

    var positionLocation = gl.getAttribLocation(program, 'a_position')

    var resolutionLocation = gl.getUniformLocation(program, 'u_resolution')

    var colorLocation = gl.getUniformLocation(program, 'u_color')

    var positionBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    var translation = [0, 0]
    var width = 100
    var height = 80
    var color = [Math.random(), Math.random(), Math.random(), 1]

    drawScene()

    webglLessonsUI.setupSlider('#x', { slide: updateLocation(0), max: gl.canvas.width})
    webglLessonsUI.setupSlider('#y', { slide: updateLocation(1), max: gl.canvas.height})

    function updateLocation(index) {
        return function(event, ui) {
            translation[index] = ui.value
            drawScene()
        }
    }
    canvas.onmousemove = function(event) {
        var x = event.offsetX
        var y = event.offsetY
        translation = [x, y]
        drawScene()
    }

    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas)

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        gl.clear(gl.COLOR_BUFFER_BIT)

        gl.useProgram(program)

        gl.enableVertexAttribArray(positionLocation)

        setRectangle(gl, translation[0], translation[1], width, height)

        var size = 2
        var type = gl.FLOAT
        var normalize = false
        var stride = 0
        var offset = 0
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset)

        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)

        gl.uniform4fv(colorLocation, color)

        var primitiveType = gl.TRIANGLES
        var offset = 0
        var count = 6
        gl.drawArrays(primitiveType, offset, count)
    }
}

function setRectangle(gl, x, y, width, height) {
    var x1 = x
    var x2 = x + width
    var y1 = y
    var y2 = y + height
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2
        ]),
        gl.STATIC_DRAW
    )
}

// function setGeometry(gl) {
//     gl.bufferData(
//         gl.ARRAY_BUFFER,
//         new Float32Array([
//             // left column
//             0, 0,
//             30, 0,
//             0, 150,
//             0, 150,
//             30, 0,
//             30, 150,
  
//             // top rung
//             30, 0,
//             100, 0,
//             30, 30,
//             30, 30,
//             100, 0,
//             100, 30,
  
//             // middle rung
//             30, 60,
//             67, 60,
//             30, 90,
//             30, 90,
//             67, 60,
//             67, 90,
//         ]),
//         gl.STATIC_DRAW);
// }
main()