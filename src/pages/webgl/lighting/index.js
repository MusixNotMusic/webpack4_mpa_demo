'use strict'

// import { setColors } from "../../../static/color_f_3d"
import { setNormals } from '../../../static/normalize_f_3d'
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
    var normalLocation = gl.getAttribLocation(program, "a_normal")

    // var matrixLocation = gl.getUniformLocation(program, 'u_matrix')
    var worldViewProjectionLocation = gl.getUniformLocation(program, "u_worldViewProjection");
    var worldInverseTransposeLocation = gl.getUniformLocation(program, "u_worldInverseTranspose");
    var colorLocation = gl.getUniformLocation(program, 'u_color')
    var reverseLightDirectionLocation = gl.getUniformLocation(program, 'u_reverseLightDirection')
    
    var positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    setCameraGeometry(gl)

    var normalBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    setNormals(gl)

    function radToDeg(r) {
        return r * 180 / Math.PI
    }

    function degToRad(d) {
        return d * Math.PI / 180
    }

    var fieldOfViewRadians = degToRad(60)
    var fRotationRadians = 0 

    drawScene()


    // Setup a ui.
    webglLessonsUI.setupSlider("#cameraAngle", {value: radToDeg(fRotationRadians), slide: updateCameraAngle, min: -360, max: 360})
    function updateCameraAngle(event, ui) {
        fRotationRadians = degToRad(ui.value)
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
        gl.enableVertexAttribArray(normalLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
        var size = 3
        var type = gl.FLOAT
        var normalize = false
        var stride = 0
        var offset = 0
        gl.vertexAttribPointer(normalLocation, size, type, normalize, stride, offset)

        // compute the projection matrix
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
        var zNear = 1
        var zFar = 2000
        var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar)


        // Compute the camera's matrix
        var camera = [100, 150, 200];
        var target = [0, 35, 0];
        var up = [0, 1, 0];
        var cameraMatrix = m4.lookAt(camera, target, up);
        // Make a view matrix from the camera matrix
        var viewMatrix = m4.inverse(cameraMatrix)
        var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)
        // Draw a F at the origin
        var worldMatrix = m4.yRotation(fRotationRadians)
        //  Multiply the matries
       
        var worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, worldMatrix)
        var worldInverseMatrix = m4.inverse(worldMatrix)
        var worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix)

        // Set the matrices
        gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix);
        gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);

        // Set the color to use
        gl.uniform4fv(colorLocation, [0.2, 1, 0.2, 1]); // green

        // set the light direction.
        gl.uniform3fv(reverseLightDirectionLocation, m4.normalize([0.5, 0.7, 1]));
        // Draw the geometry
        var primitiveType = gl.TRIANGLES
        var offset = 0
        var count = 16 * 6
        gl.drawArrays(primitiveType, offset, count)
    }
}

main()