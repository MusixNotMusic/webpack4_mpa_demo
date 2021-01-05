'use strict'
import '../../../assets/css/webgl.css'

function main() {
    var image = new Image()
    // image.src = require("../../../assets/images/leaves.jpg")
    image.src = require("../../../assets/images/earth.jpg")
    image.onload = function() {
        render(image)
    }
}

function render(image) {
    var canvas = document.querySelector('#canvas')
    var gl = canvas.getContext('webgl')
    if(!gl) {
        return;
    }

    var program = webglUtils.createProgramFromScripts(gl, ['vertex-shader-2d', 'fragment-shader-2d'])
    var positionLocation = gl.getAttribLocation(program, 'a_position')
    var texcoordLocation = gl.getAttribLocation(program, 'a_texCoord')

    var positionBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    setRectangle(gl, 0, 0, image.width / 4, image.height / 4)

    var texcoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0
    ]), gl.STATIC_DRAW)

    var texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    var resolutionLocation = gl.getUniformLocation(program, 'u_resolution')

    webglUtils.resizeCanvasToDisplaySize(gl.canvas)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    gl.clearColor(0, 0, 0, 0)

    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)

    gl.enableVertexAttribArray(positionLocation)

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    var size = 2
    var type = gl.FLOAT
    var normalize = false
    var stride = 0
    var offset = 0
    gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset)

    gl.enableVertexAttribArray(texcoordLocation)

    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)

    var size = 2
    var type = gl.FLOAT
    var normalize = false
    var stride = 0
    var offset = 0
    gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset)

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)

    var primitiveType = gl.TRIANGLES
    var offset = 0
    var count = 6
    gl.drawArrays(primitiveType, offset, count)
}

function setRectangle(gl, x, y, width, height) {
    var x1 = x
    var x2 = x + width
    var y1 = y
    var y2 = y + height
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1, 
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
    ]), gl.STATIC_DRAW)
}

main()