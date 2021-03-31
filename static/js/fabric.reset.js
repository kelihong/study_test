(function () {
  let controlSizeReset = {
    // 这个必须和 svg 图标的大小成正比
    normalSize: "16",
    funsSize: "48",
  };

  var degreesToRadians = fabric.util.degreesToRadians;

  // 设置控制点样式：
  fabric.Object.prototype.cornerColor = "#fdaf48";
  fabric.Object.prototype.cornerStyle = "circle";
  fabric.Object.prototype.cornerStrokeColor = "#fdaf48"; // 控制点填充颜色
  fabric.Object.prototype.cornerSize = controlSizeReset.normalSize;
  fabric.Group.prototype.originX = "center";
  fabric.Group.prototype.originY = "center";
  fabric.textureSize = 1024 * 1024 * 100; // 设置可操作图片的大小 （kb)

  // 设置Canvas 全局：
  fabric.Canvas.centeredRotation = true; // 不知道干啥用，先记着吧

  fabric.controlsUtils.renderImageControl = function (svgFun) {
  
    return function (ctx, left, top, styleOverride, fabricObject) {

        resetOverflowControl(fabricObject)
        // console.log(styleOverride)
       
      styleOverride = styleOverride || {};
      var xSize =
          this.sizeX || styleOverride.cornerSize || fabricObject.cornerSize,
        ySize =
          this.sizeY || styleOverride.cornerSize || fabricObject.cornerSize,
        transparentCorners =
          typeof styleOverride.transparentCorners !== "undefined"
            ? styleOverride.transparentCorners
            : fabricObject.transparentCorners,
        methodName = transparentCorners ? "stroke" : "fill",
        stroke =
          !transparentCorners &&
          (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor),
        xSizeBy2 = xSize / 2,
        ySizeBy2 = ySize / 2;

      ctx.save();
      ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor;
      ctx.strokeStyle =
        styleOverride.strokeCornerColor || fabricObject.strokeCornerColor;
      // this is still wrong
      ctx.lineWidth = 1;
      ctx.translate(left, top);

      ctx.rotate(degreesToRadians(fabricObject.angle));
      ctx.fillStyle = "#fff"; // 控制点背景色

      ctx.arc(-xSizeBy2, -ySizeBy2, 24, 0, Math.PI * 2, false);
      // ctx.fillRect(-xSizeBy2, -ySizeBy2, xSize, ySize); // 画灰色底图
      ctx.translate(-xSizeBy2, -ySizeBy2); // 将画板左上平移画控制点
      ctx.scale(3, 3);
      ctx = svgFun(ctx, left, top, xSize, ySize);
      ctx.transform(0, 0, 0, 0, 0, 0);

      ctx[methodName]();
      if (stroke) {
        ctx.stroke();
      }
      ctx.restore();
    };
  };

  // 重写画控制点方法：
  fabric.Object.prototype.drawControls = function (ctx, styleOverride) {
    styleOverride = styleOverride || {};
    ctx.save();
    ctx.setTransform(
      this.canvas.getRetinaScaling(),
      0,
      0,
      this.canvas.getRetinaScaling(),
      0,
      0
    );
    ctx.strokeStyle = ctx.fillStyle =
      styleOverride.cornerColor || this.cornerColor;
    if (!this.transparentCorners) {
      ctx.strokeStyle =
        styleOverride.cornerStrokeColor || this.cornerStrokeColor;
    }
    this._setLineDash(
      ctx,
      styleOverride.cornerDashArray || this.cornerDashArray,
      null
    );
    styleOverride
    this.setCoords();
    this.forEachControl(function (control, key, fabricObject) {
      if (control.getVisibility(fabricObject, key)) {
        if (key === "bl") {
          fabricObject.cornerStyle = "delete";

          fabricObject.cornerSize = controlSizeReset.funsSize;
        } else if (key === "tl") {
          fabricObject.cornerStyle = "cloned";
          fabricObject.cornerSize = controlSizeReset.funsSize;
        } else if (key === "tr") {
          fabricObject.cornerStyle = "rotate";
          fabricObject.cornerSize = controlSizeReset.funsSize;
        } else if (key === "br") {
          fabricObject.cornerStyle = "resize";
          fabricObject.cornerSize = controlSizeReset.funsSize;
        } else {
          fabricObject.cornerStyle = "circle";
          fabricObject.cornerSize = controlSizeReset.normalSize;
        }
        control.render(
          ctx,
          fabricObject.oCoords[key].x,
          fabricObject.oCoords[key].y,
          styleOverride,
          fabricObject
        );
      }
    });
    ctx.restore();
    return this;
  };

  // 获取到controls 的render 方法：
  fabric.Control.prototype.render = function (
    ctx,
    left,
    top,
    styleOverride,
    fabricObject
  ) {
    styleOverride = styleOverride || {};
    switch (styleOverride.cornerStyle || fabricObject.cornerStyle) {
      case "circle":
        fabric.controlsUtils.renderCircleControl.call(
          this,
          ctx,
          left,
          top,
          styleOverride,
          fabricObject
        );
        break;

      case "delete":
        fabric.controlsUtils.renderImageControl.call(
          this,
          drawDeleteSVGToCanvas
        )(ctx, left, top, styleOverride, fabricObject);
        break;
      case "cloned":
        fabric.controlsUtils.renderImageControl.call(
          this,
          drawClonedSVGToCanvas
        )(ctx, left, top, styleOverride, fabricObject);
        break;
      case "rotate":
        fabric.controlsUtils.renderImageControl.call(
          this,
          drawRotateSVGToCanvas
        )(ctx, left, top, styleOverride, fabricObject);
        break;
      case "resize":
        fabric.controlsUtils.renderImageControl.call(this, drawResizeToCanvas)(
          ctx,
          left,
          top,
          styleOverride,
          fabricObject
        );
        break;

      default:
        fabric.controlsUtils.renderSquareControl.call(
          this,
          ctx,
          left,
          top,
          styleOverride,
          fabricObject
        );
    }
  };

  // 设置controls
  let controlsUtils = fabric.controlsUtils;
  let objectControls = fabric.Object.prototype.controls;

  // 右上角是旋转
  objectControls.tr = new fabric.Control({
    x: 0.5,
    y: -0.5,
    actionHandler: controlsUtils.rotationWithSnapping,
    cursorStyleHandler: controlsUtils.rotationStyleHandler,

    // withConnection: true, // 是否有连接线
    actionName: "rotate",
  });

  // 左上角是克隆
  objectControls.tl = new fabric.Control({
    x: -0.5,
    y: -0.5,
    mouseUpHandler: clonedHandler,
    cursorStyleHandler: cursorPointerHandler,

    // withConnection: true, // 是否有连接线
    actionName: "cloned",
  });

  // 左下角是删除
  objectControls.bl = new fabric.Control({
    x: -0.5,
    y: 0.5,
    
    mouseUpHandler: deleteHandler,
    cursorStyleHandler: cursorPointerHandler,
    cornerStyle: cornerStyleHandler,
    // render: renderIcon(deleteIcon),
    // withConnection: true, // 是否有连接线
    actionName: "cloned",
  });

  // 左上角克隆funs
  function clonedHandler(eventData, transform, x, y) {
    let t = transform;
    let target = t.target;
    let canvas = target.canvas;

    divi.funs.doWhenLayerChanged(target, canvas, "add");

    // 复制
    target.clone(function (cloned) {
      cloned.left += 40;
      cloned.top += 40;

      canvas.add(cloned);

      canvas.setActiveObject(cloned); // 是否将复制的图层设为活动层
      canvas.renderAll();
    });
  }
  // 左下角删除funs
  function deleteHandler(eventData, transform) {
    let t = transform;
    let target = t.target;
    let canvas = target.canvas;
    divi.funs.doWhenLayerChanged(target, canvas, "delete");

    canvas.remove(target);
    canvas.renderAll();
  }

  // 删除样式：
  function cursorPointerHandler(eventData, controls, fabricObject) {
    return "pointer";
  }
  // 删除样式：
  function cornerStyleHandler(eventData, controls, fabricObject) {
    return "rect";
  }

  // 设置哪几个顶点需要展示
  fabric.Object.prototype.setControlsVisibility({
    // 设置哪几个顶点需要
    // tl: false,
    // tr: false,
    // bl: false,
    // br: false,
    mtr: false,
  });


   // 重设定位点
   function resetOverflowControl(active) {

      let aLeft = active.left;
      let aWidth = active.width * active.scaleX;
      let aHeight = active.height * active.scaleY;
      console.log(aLeft - aWidth / 2);
    
  }



  //svg生成的canvas:
  function drawResizeToCanvas(ctx, left, top, xSize, ySize) {
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.miterLimit = 4;
    ctx.font = "15px / 21.4286px ''";
    ctx.font = "   15px ";
    ctx.scale(0.9990243902439024, 0.9990243902439024);
    ctx.scale(0.015625, 0.015625);
    ctx.save();
    ctx.fillStyle = "#fdaf48";
    ctx.font = "   15px ";
    ctx.beginPath();
    ctx.moveTo(324.8, 444.8);
    ctx.lineTo(442.752, 325.632);
    ctx.lineTo(252.032, 131.968);
    ctx.lineTo(381.12, 1.152);
    ctx.lineTo(3.328, 1.152);
    ctx.lineTo(3.328, 384.256);
    ctx.lineTo(134.272, 251.392);
    ctx.lineTo(324.8, 444.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#fdaf48";
    ctx.font = "   15px ";
    ctx.beginPath();
    ctx.moveTo(1024.222643, 634.624);
    ctx.lineTo(885.248, 768.832);
    ctx.lineTo(691.136, 573.44);
    ctx.lineTo(570.752, 693.824);
    ctx.lineTo(765.248, 889.408);
    ctx.lineTo(637.504, 1022.808589);
    ctx.lineTo(1024.222643, 1022.808589);
    ctx.lineTo(1024.222643, 634.624);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return ctx;
  }
  //svg生成旋转的canvas:
  function drawRotateSVGToCanvas(ctx, left, top, xSize, ySize) {
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.miterLimit = 4;
    ctx.font = "15px / 21.4286px ''";
    ctx.font = "   15px ";
    ctx.scale(0.015625, 0.015625);
    ctx.save();
    ctx.fillStyle = "#fdaf48";
    ctx.font = "   15px ";
    ctx.beginPath();
    ctx.moveTo(716.8, 290.133333);
    ctx.bezierCurveTo(
      605.866667,
      187.733333,
      435.19999999999993,
      183.46666599999998,
      319.99999999999994,
      277.333333
    );
    ctx.bezierCurveTo(
      204.79999999999995,
      371.2,
      170.666667,
      537.6,
      247.466667,
      665.6
    );
    ctx.bezierCurveTo(
      307.2,
      772.266667,
      426.66666699999996,
      832,
      550.4,
      814.9333330000001
    );
    ctx.bezierCurveTo(
      674.133333,
      797.8666660000001,
      772.266667,
      712.5333330000001,
      806.4,
      593.066667
    );
    ctx.bezierCurveTo(
      814.933333,
      558.9333340000001,
      849.0666669999999,
      541.866667,
      883.1999999999999,
      550.4000000000001
    );
    ctx.bezierCurveTo(
      917.3333329999999,
      558.9333330000001,
      934.4,
      593.066667,
      925.8666669999999,
      627.2
    );
    ctx.bezierCurveTo(
      857.5999999999999,
      853.333333,
      622.9333339999998,
      981.333333,
      401.06666699999994,
      917.333333
    );
    ctx.bezierCurveTo(
      174.933333,
      853.333333,
      42.666667,
      618.666667,
      106.666667,
      392.533333
    );
    ctx.bezierCurveTo(
      149.333334,
      247.46666600000003,
      260.266667,
      136.53333300000003,
      405.33333300000004,
      93.866667
    );
    ctx.bezierCurveTo(
      550.3999990000001,
      51.200000999999986,
      704,
      93.866667,
      810.666667,
      196.266667
    );
    ctx.lineTo(891.7333329999999, 115.20000000000002);
    ctx.bezierCurveTo(
      900.2666659999999,
      106.66666700000002,
      913.0666659999999,
      102.40000000000002,
      925.8666669999999,
      106.66666700000002
    );
    ctx.bezierCurveTo(
      930.1333339999999,
      119.46666700000002,
      938.6666669999998,
      128.00000000000003,
      938.6666669999998,
      140.8
    );
    ctx.lineTo(938.6666669999998, 405.33333300000004);
    ctx.bezierCurveTo(
      938.6666669999998,
      422.40000000000003,
      925.8666669999999,
      435.20000000000005,
      908.7999999999998,
      435.20000000000005
    );
    ctx.lineTo(648.5333329999999, 435.20000000000005);
    ctx.bezierCurveTo(
      635.7333329999999,
      435.20000000000005,
      622.9333329999998,
      426.666667,
      618.6666669999998,
      418.13333300000005
    );
    ctx.bezierCurveTo(
      614.4000009999999,
      409.5999990000001,
      618.6666669999998,
      392.533333,
      627.1999999999998,
      384.00000000000006
    );
    ctx.lineTo(716.7999999999998, 290.13333300000005);
    ctx.closePath();
    ctx.moveTo(512, 601.6);
    ctx.bezierCurveTo(465.066667, 601.6, 426.666667, 563.2, 426.666667, 512);
    ctx.bezierCurveTo(
      426.666667,
      460.79999999999995,
      465.066667,
      422.4,
      512,
      422.4
    );
    ctx.bezierCurveTo(
      558.933333,
      422.4,
      597.333333,
      460.79999999999995,
      597.333333,
      512
    );
    ctx.bezierCurveTo(597.333333, 563.2, 558.9333330000001, 601.6, 512, 601.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return ctx;
  }

  function drawDeleteSVGToCanvas(ctx, left, top, xSize, ySize) {
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.miterLimit = 4;
    ctx.font = "15px / 21.4286px ''";
    ctx.font = "   15px ";
    ctx.scale(0.015625, 0.015625);
    ctx.save();
    ctx.fillStyle = "#fdaf48";
    ctx.font = "   15px ";
    ctx.beginPath();
    ctx.moveTo(799.2, 874.4);
    ctx.bezierCurveTo(799.2, 908.8, 771.2, 936.8, 736.832, 936.8);
    ctx.lineTo(287.2, 936.8);
    ctx.translate(287.2959263802815, 874.3040736197183);
    ctx.rotate(0);
    ctx.arc(0, 0, 62.496, 1.5723312477170088, 3.140057732667681, 0);
    ctx.rotate(0);
    ctx.translate(-287.2959263802815, -874.3040736197183);
    ctx.lineTo(224.79999999999998, 212);
    ctx.lineTo(799.1999999999999, 212);
    ctx.lineTo(799.1999999999999, 874.4);
    ctx.closePath();
    ctx.moveTo(349.6, 100);
    ctx.bezierCurveTo(
      349.6,
      92.8,
      355.20000000000005,
      87.2,
      362.40000000000003,
      87.2
    );
    ctx.lineTo(662.4000000000001, 87.2);
    ctx.bezierCurveTo(
      669.6000000000001,
      87.2,
      675.1680000000001,
      92.8,
      675.1680000000001,
      100
    );
    ctx.lineTo(675.1680000000001, 137.6);
    ctx.lineTo(349.6, 137.6);
    ctx.lineTo(349.6, 100);
    ctx.closePath();
    ctx.moveTo(986.4, 137.6);
    ctx.lineTo(749.6, 137.6);
    ctx.lineTo(749.6, 100);
    ctx.bezierCurveTo(
      749.6,
      52,
      710.4,
      12.799999999999997,
      662.4,
      12.799999999999997
    );
    ctx.lineTo(362.4, 12.799999999999997);
    ctx.translate(362.59178955009713, 100.19178955009717);
    ctx.rotate(0);
    ctx.arc(0, 0, 87.392, -1.5729909178792945, -3.1393980625053954, 1);
    ctx.rotate(0);
    ctx.translate(-362.59178955009713, -100.19178955009717);
    ctx.lineTo(275.2, 137.6);
    ctx.lineTo(37.6, 137.6);
    ctx.bezierCurveTo(16.8, 137.6, 0, 154.4, 0, 175.2);
    ctx.bezierCurveTo(
      0,
      195.99999999999997,
      16.8,
      212.79999999999998,
      37.6,
      212.79999999999998
    );
    ctx.lineTo(149.6, 212.79999999999998);
    ctx.lineTo(149.6, 874.4);
    ctx.translate(287.2, 874.4000000000001);
    ctx.rotate(0);
    ctx.arc(0, 0, 137.6, -3.141592653589793, -4.71238898038469, 1);
    ctx.rotate(0);
    ctx.translate(-287.2, -874.4000000000001);
    ctx.lineTo(736.8, 1012);
    ctx.translate(736.8, 874.4000000000001);
    ctx.rotate(0);
    ctx.arc(0, 0, 137.6, 1.5707963267948968, -2.220446049250313e-16, 1);
    ctx.rotate(0);
    ctx.translate(-736.8, -874.4000000000001);
    ctx.lineTo(874.4, 212);
    ctx.lineTo(986.4, 212);
    ctx.bezierCurveTo(1007.1999999999999, 212, 1024, 195.2, 1024, 174.4);
    ctx.bezierCurveTo(
      1024,
      153.60000000000002,
      1007.2,
      137.60000000000002,
      986.4,
      137.60000000000002
    );
    ctx.closePath();
    ctx.moveTo(512, 824);
    ctx.bezierCurveTo(532.8, 824, 549.6, 807.2, 549.6, 786.4);
    ctx.lineTo(549.6, 386.4);
    ctx.bezierCurveTo(
      549.6,
      365.59999999999997,
      532.832,
      348.79999999999995,
      512,
      348.79999999999995
    );
    ctx.bezierCurveTo(
      491.2,
      348.79999999999995,
      474.4,
      365.59999999999997,
      474.4,
      386.4
    );
    ctx.lineTo(474.4, 786.4);
    ctx.bezierCurveTo(474.4, 807.1999999999999, 491.2, 824, 512, 824);
    ctx.moveTo(336.8, 824);
    ctx.bezierCurveTo(
      357.6,
      824,
      374.40000000000003,
      807.2,
      374.40000000000003,
      786.4
    );
    ctx.lineTo(374.40000000000003, 386.4);
    ctx.bezierCurveTo(
      374.40000000000003,
      365.59999999999997,
      357.6,
      348.79999999999995,
      336.8,
      348.79999999999995
    );
    ctx.bezierCurveTo(
      316,
      348.79999999999995,
      299.2,
      365.59999999999997,
      299.2,
      386.4
    );
    ctx.lineTo(299.2, 786.4);
    ctx.bezierCurveTo(300, 807.1999999999999, 316.8, 824, 336.8, 824);
    ctx.moveTo(687.2, 824);
    ctx.bezierCurveTo(708, 824, 724.832, 807.2, 724.832, 786.4);
    ctx.lineTo(724.832, 386.4);
    ctx.bezierCurveTo(
      724.832,
      365.59999999999997,
      708.032,
      348.79999999999995,
      687.2,
      348.79999999999995
    );
    ctx.bezierCurveTo(
      666.432,
      348.79999999999995,
      649.6,
      365.59999999999997,
      649.6,
      386.4
    );
    ctx.lineTo(649.6, 786.4);
    ctx.bezierCurveTo(649.6, 807.1999999999999, 666.4, 824, 687.2, 824);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return ctx;
  }

  function drawClonedSVGToCanvas(ctx, left, top, xSize, ySize) {
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.miterLimit = 4;
    ctx.font = "15px / 21.4286px ''";
    ctx.font = "   15px ";
    ctx.scale(0.015625, 0.015625);
    ctx.save();
    ctx.fillStyle = "#fdaf48";
    ctx.font = "   15px ";
    ctx.beginPath();
    ctx.moveTo(96.1, 575.7);
    ctx.translate(128.3, 575.7);
    ctx.rotate(0);
    ctx.scale(1, 0.9968944099378881);
    ctx.arc(0, 0, 32.2, 3.141592653589793, 6.283185307179586, 1);
    ctx.scale(1, 1.003115264797508);
    ctx.rotate(0);
    ctx.translate(-128.3, -575.7);
    ctx.translate(128.3, 575.7);
    ctx.rotate(0);
    ctx.scale(1, 0.9968944099378881);
    ctx.arc(0, 0, 32.2, 0, 3.141592653589793, 1);
    ctx.scale(1, 1.003115264797508);
    ctx.rotate(0);
    ctx.translate(-128.3, -575.7);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#fdaf48";
    ctx.font = "   15px ";
    ctx.beginPath();
    ctx.moveTo(742.1, 450.7);
    ctx.lineTo(472.6, 448.59999999999997);
    ctx.bezierCurveTo(
      458.3,
      448.49999999999994,
      446.6,
      462.4,
      446.6,
      479.59999999999997
    );
    ctx.bezierCurveTo(
      446.6,
      496.79999999999995,
      458.3,
      510.9,
      472.6,
      510.99999999999994
    );
    ctx.lineTo(742.1, 513.0999999999999);
    ctx.bezierCurveTo(
      756.4,
      513.1999999999999,
      768.1,
      499.2999999999999,
      768.1,
      482.0999999999999
    );
    ctx.bezierCurveTo(
      768.1,
      464.8999999999999,
      756.4,
      450.7999999999999,
      742.1,
      450.69999999999993
    );
    ctx.closePath();
    ctx.moveTo(742.1, 577.7);
    ctx.lineTo(472.6, 575.6);
    ctx.bezierCurveTo(458.3, 575.5, 446.6, 589.4, 446.6, 606.6);
    ctx.bezierCurveTo(446.6, 623.8000000000001, 458.3, 637.9, 472.6, 638);
    ctx.lineTo(742.1, 640.1);
    ctx.bezierCurveTo(
      756.4,
      640.3000000000001,
      768.1,
      626.3000000000001,
      768.1,
      609.1
    );
    ctx.bezierCurveTo(768.1, 591.9, 756.4, 577.8000000000001, 742.1, 577.7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#fdaf48";
    ctx.font = "   15px ";
    ctx.beginPath();
    ctx.moveTo(736.1, 63.9);
    ctx.lineTo(417, 63.9);
    ctx.bezierCurveTo(346.6, 63.9, 289, 121.5, 289, 191.9);
    ctx.lineTo(224.1, 191.9);
    ctx.bezierCurveTo(153.7, 191.9, 96.1, 249.5, 96.1, 319.9);
    ctx.lineTo(96.1, 447.9);
    ctx.bezierCurveTo(96, 465.59999999999997, 110.5, 479.9, 128.3, 479.9);
    ctx.bezierCurveTo(
      146.10000000000002,
      479.9,
      160.5,
      465.5,
      160.5,
      447.79999999999995
    );
    ctx.lineTo(160.5, 320);
    ctx.bezierCurveTo(160.5, 284.8, 189.3, 256, 224.5, 256);
    ctx.lineTo(289, 256);
    ctx.lineTo(289, 703.8);
    ctx.bezierCurveTo(289, 774.1999999999999, 346.6, 831.8, 417, 831.8);
    ctx.lineTo(672.1, 831.8);
    ctx.bezierCurveTo(
      672,
      867,
      643.3000000000001,
      895.5999999999999,
      608.1,
      895.5999999999999
    );
    ctx.lineTo(224.5, 895.5999999999999);
    ctx.bezierCurveTo(
      189.3,
      895.5999999999999,
      160.5,
      866.8,
      160.5,
      831.5999999999999
    );
    ctx.lineTo(160.5, 703.5);
    ctx.bezierCurveTo(160.5, 685.8, 146.1, 671.4, 128.3, 671.4);
    ctx.bezierCurveTo(
      110.50000000000001,
      671.4,
      96.00000000000001,
      685.8,
      96.00000000000001,
      703.5
    );
    ctx.lineTo(96.00000000000001, 831.8);
    ctx.bezierCurveTo(
      96.00000000000001,
      902.1999999999999,
      153.60000000000002,
      959.8,
      224,
      959.8
    );
    ctx.lineTo(608.1, 959.8);
    ctx.bezierCurveTo(678.5, 959.8, 736.1, 902.1999999999999, 736.1, 831.8);
    ctx.lineTo(801.1, 831.8);
    ctx.bezierCurveTo(871.5, 831.8, 929.1, 774.1999999999999, 929.1, 703.8);
    ctx.lineTo(929.1, 255.9);
    ctx.lineTo(736.1, 63.900000000000006);
    ctx.closePath();
    ctx.moveTo(736.2, 127.3);
    ctx.lineTo(863.9000000000001, 255.60000000000002);
    ctx.lineTo(800, 255.60000000000002);
    ctx.bezierCurveTo(
      764.8,
      255.60000000000002,
      736,
      226.8,
      736,
      191.60000000000002
    );
    ctx.lineTo(736, 127.30000000000003);
    ctx.lineTo(736.2, 127.30000000000003);
    ctx.closePath();
    ctx.moveTo(800.2, 768.3);
    ctx.lineTo(416.1, 768.3);
    ctx.bezierCurveTo(380.90000000000003, 768.3, 352.1, 739.5, 352.1, 704.3);
    ctx.lineTo(352.1, 191.29999999999995);
    ctx.bezierCurveTo(
      352.1,
      156.09999999999997,
      380.90000000000003,
      127.29999999999995,
      416.1,
      127.29999999999995
    );
    ctx.lineTo(671, 127.29999999999995);
    ctx.lineTo(671, 191);
    ctx.bezierCurveTo(671, 261.4, 728.6, 319, 799, 319);
    ctx.lineTo(864.2, 319);
    ctx.lineTo(864.2, 704.3);
    ctx.bezierCurveTo(864.2, 739.5, 835.4000000000001, 768.3, 800.2, 768.3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return ctx;
  }
})();
