// Vertex shader program 
var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n' +
    'void main() {\n' + 
    '  gl_Position = a_Position;\n' + 
    '  gl_PointSize = 20.0;\n' +             // Set the point size 
    '}\n'; 

// Fragment shader program 
 var FSHADER_SOURCE = 
   'void main() {\n' + 
   '  gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n' + // Set the color 
   '}\n'; 

function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('example');  
    // Get the rendering context for WebGL
    var gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }   
    // Initialize shaders 
    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, VSHADER_SOURCE);
    gl.compileShader(vShader);

    if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader:', gl.getShaderInfoLog(vShader));
        gl.deleteShader(vShader);
        return null;
    }

    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, FSHADER_SOURCE);
    gl.compileShader(fShader);
 
    if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader:', gl.getShaderInfoLog(fShader));
        gl.deleteShader(fShader);
        return null;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    gl.useProgram(program);

     // Get the storage location of attribute variable 
    var a_Position = gl.getAttribLocation(program, 'a_Position');

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = function(ev) { click(ev, gl, canvas, a_Position); }; 

     // Pass vertex position to attribute variable 
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

    // Set the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);  
    // Draw a point 
    gl.drawArrays(gl.POINTS, 0, 1); 
} 

var g_points = []; // The array for a mouse press 
function click(ev, gl, canvas, a_Position) { 
    var x = ev.clientX; // x coordinate of a mouse pointer 
    var y = ev.clientY; // y coordinate of a mouse pointer 
    var rect = ev.target.getBoundingClientRect(); 
    x = ((x - rect.left) - canvas.height/2)/(canvas.height/2); 
    y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);
    // Store the coordinates to g_points array
    g_points.push(x); g_points.push(y); 
   // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT); 

    var len = g_points.length; 
    for(var i = 0; i < len; i+=2) { 
        // Pass the position of  a point to a_Position variable
        gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0); 

        // Draw a point
        gl.drawArrays(gl.POINTS, 0, 1); 
    } 
} 