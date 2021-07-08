/**
 * 这是3d变换的处理文件
 * 
 * @type {{run: design_preview_d3_img.run}}
 */
class design_preview_d3_img {

    constructor(imageConfig) {
        if (imageConfig == undefined || imageConfig == null) return;

        /**
         * 图像配置
         */
        this.imageConfig = imageConfig;
        /**
         * 画布对象
         */
        this.canvas = document.createElement("canvas");
        this.canvas.width = 1600;
        this.canvas.height = 1600;
        /**
         * webgl上下文
         */
        this.gl = this.canvas.getContext("webgl", { alpha: true });
        /**
         * 纹理对象
         */
        this.texture = null;
        /**
         * 采样器
         */
        this.u_Sampler = null;
        /**
         * 模型视图投影矩阵
         */
        this.u_MvpMatrix = null;

        this.initialization();
    }
    /**
     * 初始化顶点数据
     */
    initVertexBuffers() {



        //创建缓冲区对象
        let vertexTexCoordBuffer = this.gl.createBuffer();
        //将顶点坐标和纹理坐标写入缓冲区对象
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexTexCoordBuffer);
        let verticesTexCoords = new Float32Array([
            //顶点坐标，纹理坐标
            -1.0, 1.0, 0.0, 1.0, -1.0, -1.0, 0.0, 0.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, -1.0, 1.0, 0.0
        ]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, verticesTexCoords, this.gl.STATIC_DRAW);
        let FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
        let a_Position = this.gl.getAttribLocation(this.gl.program, 'a_Position');
        this.gl.vertexAttribPointer(a_Position, 2, this.gl.FLOAT, false, FSIZE * 4, 0); //将缓冲区对象分配给a_Position变量
        this.gl.enableVertexAttribArray(a_Position); //链接a_Position变量与分配给它的缓冲区对象

        let a_TexCoord = this.gl.getAttribLocation(this.gl.program, 'a_TexCoord'); //将纹理坐标分配给a_TextCoord并开启它
        this.gl.vertexAttribPointer(a_TexCoord, 2, this.gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
        this.gl.enableVertexAttribArray(a_TexCoord);
    }
    /**
     * 
     */
    initialization() {


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
        initShaders(this.gl, VSHADER_SOURCE, FSHADER_SOURCE);
        this.initVertexBuffers();
        this.config();
    }
    /**
     * 配置gl渲染参数及纹理参数
     */
    config() {


        this.gl.enable(this.gl.BLEND); //激活片元的颜色融合计算        
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA); //定义混合像素算法
        this.texture = this.gl.createTexture(); //创建纹理对象
        this.u_Sampler = this.gl.getUniformLocation(this.gl.program, 'u_Sampler'); //采样器，一个着色器变量
        this.u_MvpMatrix = this.gl.getUniformLocation(this.gl.program, 'u_MvpMatrix');
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1); //对纹理图像进行y轴翻转 
        this.gl.activeTexture(this.gl.TEXTURE0); //开启0号纹理单元
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture); //向target绑定纹理对象      



        /*配置纹理对象的参数
        TEXTURE_WRAP_S 指定水平填充方法 gl.REPEAT=平铺
        TEXTURE_WRAP_T 指定垂直填充方法        
        */
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    }
    /**
     * 当图片被加完后的处理，包括矩阵操作，纹理操作，生成画操作
     * @param {image} image  要被3d变换的图片
     */
    completeImgLoad(image) {

       

        this.matrix();
        //配置纹理图像
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        //将0号纹理传递给着色器
        this.gl.uniform1i(this.u_Sampler, 0);
        this.draw();
    }

    /**
     * 进行3d变换
     * @returns Promise
     */
    transform() {

        
        this.gl.clear(this.gl.COLOR_BUFFER_BIT); //清空颜色缓冲区        

        let clipedImg = new Image();
        let the = this;
        clipedImg.onload = function () {

            the.completeImgLoad(clipedImg);
        };
        clipedImg.src = this.imageConfig.url;
    }
    /**
     * 当图片被加完后的处理，包括矩阵操作，纹理操作，生成画操作
     * @param {image} image  要被3d变换的图片
     */
    completeImgLoad(image) {


        this.matrix();
        //配置纹理图像
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        //将0号纹理传递给着色器
        this.gl.uniform1i(this.u_Sampler, 0);
        this.draw();
    }
    /**
     *进行矩阵变换操作
     */
    matrix() {
        
        let modelMatrix = new Matrix4(); //模型矩阵
        let viewMatrix = new Matrix4(); //视图矩阵
        let projMatrix = new Matrix4(); //投影矩阵

        modelMatrix.setRotate(0, 1, 0, 0); //重置绕x轴旋转0度
        modelMatrix.setRotate(0, 0, 1, 0); //重置绕y轴旋转
        modelMatrix.setRotate(0, 0, 0, 1); //重置绕z轴旋转

        let config = JSON.parse(this.imageConfig.config); //读取config数据

        modelMatrix.setTranslate(config.PositionX, config.PositionY, config.PositionZ); //设置位移

        if (config.RotateX > 0) modelMatrix.rotate(config.RotateX, 1, 0, 0); //设置绕x轴旋转角度
        if (config.RotateY > 0) modelMatrix.rotate(config.RotateY, 0, 1, 0); //设置绕y轴旋转角度
        if (config.RotateZ > 0) modelMatrix.rotate(config.RotateZ, 0, 0, 1); //设置绕z轴旋转角度

        viewMatrix.setLookAt(config.EyeX, config.EyeY, config.EyeZ, 0, 0, 0, 0, 1, 0); //设置视点坐标，观察点坐标，上方向

        projMatrix.setPerspective(30, this.canvas.width / this.canvas.height, 1, 100); //定义透视投影可视空间

        let mvpMatrix = new Matrix4(); //模型视图投影矩阵
        mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix); //矩阵相乘
        this.gl.uniformMatrix4fv(this.u_MvpMatrix, false, mvpMatrix.elements); //为uniform变量指定值
    }
    /**
     * 生成画
     */
    draw() {
        
        this.gl.clear(this.gl.COLOR_BUFFER_BIT); //用背景色清空        
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4); //执行顶点着色器，按照参数指定的方式绘制图形
        this.imageConfig.callback(this.canvas.toDataURL()); //执行回调函数，传回base64变换后的图片
    }
}