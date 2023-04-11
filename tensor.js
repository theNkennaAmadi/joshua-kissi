/**
 * Tensor
 */
async function f1(img) {
  const model = depthEstimation.SupportedModels.ARPortraitDepth;
  const estimator = await depthEstimation.createEstimator(model);

  const image = img;
  const estimationConfig = {
    minDepth: 0, // The minimum depth value outputted by the estimator.
    maxDepth: 1 // The maximum depth value outputted by the estimator.
  };
  const depthMap = await estimator.estimateDepth(image, estimationConfig);
  const depthMapM = await depthMap.toCanvasImageSource();
  const newImage = await depthMapM.toDataURL("image/png");
  img.nextElementSibling.src = `${newImage}`;
  console.log(newImage);
}

allImages.map((img) => {
  //f1(img);
});

/**
 * mouse move
 */
("use strict");

function main(img) {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  let canvas = img.previousElementSibling.querySelector("canvas");
  let gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  let originalImage = { width: 1, height: 1 }; // replaced after loading
  const originalTexture = twgl.createTexture(
    gl,
    {
      src: img.src,
      crossOrigin: ""
    },
    (err, texture, source) => {
      originalImage = source;
    }
  );

  const mapTexture = twgl.createTexture(gl, {
    src: img.nextElementSibling.src,
    crossOrigin: ""
  });

  // compile shaders, link program, lookup location
  let programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);

  // calls gl.createBuffer, gl.bindBuffer, gl.bufferData for a quad
  let bufferInfo = twgl.primitives.createXYQuadBufferInfo(gl);

  const mouse = [0, 0];
  img.addEventListener("mousemove", (event) => {
    mouse[0] =
      ((event.clientX / img.parentElement.clientWidth) * 2 - 1) * -0.02;
    mouse[1] =
      ((event.clientY / img.parentElement.clientHeight) * 2 - 1) * -0.02;
  });

  img.addEventListener("touchmove", (event) => {
    mouse[0] =
      ((event.touches[0].clientX / gl.canvas.clientWidth) * 2 - 1) * -0.02;
    mouse[1] =
      ((event.touches[0].clientY / gl.canvas.clientHeight) * 2 - 1) * -0.02;
  });

  img.addEventListener("touchend", (event) => {
    mouse[0] = 0;
    mouse[1] = 0;
  });

  var nMouse = [0, 0];
  var oMouse = [0, 0];

  requestAnimationFrame(render);

  function render() {
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, img.width, img.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(programInfo.program);

    // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

    let canvasAspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let imageAspect = img.width / img.height;
    let mat = m3.scaling(imageAspect / canvasAspect, -1);

    nMouse[0] += (mouse[0] - nMouse[0]) * 0.05;
    nMouse[1] += (mouse[1] - nMouse[1]) * 0.05;

    // calls gl.activeTexture, gl.bindTexture, gl.uniformXXX
    twgl.setUniforms(programInfo, {
      u_matrix: mat,
      u_originalImage: originalTexture,
      u_mapImage: mapTexture,
      u_mouse: nMouse
    });

    // calls gl.drawArrays or gl.drawElements
    twgl.drawBufferInfo(gl, bufferInfo);

    requestAnimationFrame(render);
  }
}

allImages.map((img) => {
  setTimeout(() => {
    //main(img);
  }, 10000);
});
