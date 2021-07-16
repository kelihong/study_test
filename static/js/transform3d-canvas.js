/**
 * 这是3d变换的处理文件
 * 
 * @type {{run: design_preview_d3_img.run}}
 */

function createNew3dImage(imageConfig) {
    let canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1600;
    let gl = canvas.getContext("webgl", { alpha: true });
    let texture = null;
    let u_Sampler = null;
    /**
     * 模型视图投影矩阵
     */
    let u_MvpMatrix = null;
    initialization();

    function initVertexBuffers() {



        //创建缓冲区对象
        let vertexTexCoordBuffer = gl.createBuffer();
        //将顶点坐标和纹理坐标写入缓冲区对象
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
        let verticesTexCoords = new Float32Array([
            //顶点坐标，纹理坐标
            -1.0, 1.0, 0.0, 1.0, -1.0, -1.0, 0.0, 0.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, -1.0, 1.0, 0.0
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
        let FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
        let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0); //将缓冲区对象分配给a_Position变量
        gl.enableVertexAttribArray(a_Position); //链接a_Position变量与分配给它的缓冲区对象

        let a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord'); //将纹理坐标分配给a_TextCoord并开启它
        gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
        gl.enableVertexAttribArray(a_TexCoord);
    }
    function initialization() {


        //顶点着色器
        let VSHADER_SOURCE = `
             attribute vec4 a_Position;
             attribute vec2 a_TexCoord;
             varying vec2 v_TexCoord;
             uniform mat4 u_MvpMatrix;
             void main(){
                 gl_Position=u_MvpMatrix*a_Position;
                 v_TexCoord=a_TexCoord;
             }`;
        //片元着色器
        let FSHADER_SOURCE = `
             #ifdef GL_ES
             precision highp float;
             #endif
             uniform sampler2D u_Sampler;
             varying vec2 v_TexCoord;
             void main() {
                 gl_FragColor = texture2D(u_Sampler,v_TexCoord);
             }`;
        //初始化着色器
        initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
        initVertexBuffers();
        config();
    }

    function config() {


        gl.enable(gl.BLEND); //激活片元的颜色融合计算        
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); //定义混合像素算法
        texture = gl.createTexture(); //创建纹理对象
        u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler'); //采样器，一个着色器变量
        u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //对纹理图像进行y轴翻转 
        gl.activeTexture(gl.TEXTURE0); //开启0号纹理单元
        gl.bindTexture(gl.TEXTURE_2D, texture); //向target绑定纹理对象      



        /*配置纹理对象的参数
        TEXTURE_WRAP_S 指定水平填充方法 gl.REPEAT=平铺
        TEXTURE_WRAP_T 指定垂直填充方法        
        */
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }

    function  matrix() {
        
        let modelMatrix = new Matrix4(); //模型矩阵
        let viewMatrix = new Matrix4(); //视图矩阵
        let projMatrix = new Matrix4(); //投影矩阵

        modelMatrix.setRotate(0, 1, 0, 0); //重置绕x轴旋转0度
        modelMatrix.setRotate(0, 0, 1, 0); //重置绕y轴旋转
        modelMatrix.setRotate(0, 0, 0, 1); //重置绕z轴旋转

        let config = JSON.parse(imageConfig.config); //读取config数据

        modelMatrix.setTranslate(config.PositionX, config.PositionY, config.PositionZ); //设置位移

        if (config.RotateX > 0) modelMatrix.rotate(config.RotateX, 1, 0, 0); //设置绕x轴旋转角度
        if (config.RotateY > 0) modelMatrix.rotate(config.RotateY, 0, 1, 0); //设置绕y轴旋转角度
        if (config.RotateZ > 0) modelMatrix.rotate(config.RotateZ, 0, 0, 1); //设置绕z轴旋转角度

        viewMatrix.setLookAt(config.EyeX, config.EyeY, config.EyeZ, 0, 0, 0, 0, 1, 0); //设置视点坐标，观察点坐标，上方向

        projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100); //定义透视投影可视空间

        let mvpMatrix = new Matrix4(); //模型视图投影矩阵
        mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix); //矩阵相乘
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements); //为uniform变量指定值
    }

        
    function  transform() {

        
        gl.clear(gl.COLOR_BUFFER_BIT); //清空颜色缓冲区        

        let clipedImg = new Image();
        let the = this;
        clipedImg.onload = function () {

            completeImgLoad(clipedImg);
        };
        clipedImg.src = imageConfig.url;
    }


    function completeImgLoad(image) {


        matrix();
        //配置纹理图像
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        //将0号纹理传递给着色器
        gl.uniform1i(u_Sampler, 0);
        draw();
    }




    function draw() {

        gl.clear(gl.COLOR_BUFFER_BIT); //用背景色清空        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); //执行顶点着色器，按照参数指定的方式绘制图形
        imageConfig.callback(canvas); //执行回调函数，传回base64变换后的图片
    }

    transform()
}