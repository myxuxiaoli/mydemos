  // 构造方法，实例化的时候将会被调用，如果不指定，那么会有一个不带参数的默认构造函数.
  var clip = function (file, callback) {
    this.clipView = document.createElement('div');
    this.clipView.id = 'clipView';

    var html = '<div class="header">';
    html += '<a id="colse"></a>';
    html += '上传头像';
    html += '<button id="saves">上传</button>';
    html += '</div>';
    html += '<div class="clipBox" id="clipBox">';
    html += '<div class="narrow">';
    html += '<span id="enlarge"></span>';
    html += '<span id="narrow"></span>';
    html += '</div>';
    html += '<canvas id="image-box"></canvas>';
    html += '<div id="cover-box"></div>';
    html += '</div>';
    this.clipView.innerHTML = html;

    document.body.appendChild(this.clipView);

    document.body.style.overflow = 'hidden';

    var _this = this;
    //想要图片的比例
    this.proportion = 50 / 50;
    //图片剪切框
    this.wpId = document.getElementById('clipBox');

    this.getImage = document.getElementById('image-box');
    this.editBox = document.getElementById('cover-box');

    //画布高宽
    this.boxWidth = this.wpId.offsetWidth;
    this.boxHeight = this.wpId.offsetHeight;
    //图片的初始倍数
    this.size = 1;
    this.sx = 0; //裁剪框的初始宽
    this.sy = 0; //裁剪框的初始高
    //图片初始移动位置
    this.deviationX = 0;
    this.deviationY = 0;
    this.cxt = document.getElementById('image-box').getContext('2d');
    handleFiles(file);
    //图片旋转状态
    this.orientation = 1;

    //第一步把图片对象转换为base64
    function handleFiles(file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        _this.imgUrl = this.result;
        //检查如果是苹果手机上传图片先转换一下
        _this.getOrientation(file, function (orientation) {
          if (orientation == 6) {
            var rotateCanvas = document.createElement('canvas');
            var rot = rotateCanvas.getContext('2d');
            var images = new Image();
            images.src = _this.imgUrl;
            images.onload = function () {
              rotateCanvas.width = images.height;
              rotateCanvas.height = images.width;
              rot.drawImage(images, -rotateCanvas.height / 2, -rotateCanvas.width / 2, images.height, images.width);
              rot.save(); //保存状态
              rot.translate(images.height / 2, images.width / 2); //设置画布上的(0,0)位置，也就是旋转的中心点
              rot.rotate(90 * Math.PI / 180);
              rot.drawImage(images, -rotateCanvas.height / 2, -rotateCanvas.width / 2);
              rot.restore();
              _this.imgUrl = rotateCanvas.toDataURL('image/jpeg', 1);
              _this.paintImg(function (imgScale) {
                _thist.cutImage(imgScale);
                _this.drag();
              });
            }
          } else {
            _this.paintImg(function (imgScale) {
              _this.cutImage(imgScale);
              _this.drag();
            });
          }
        });
      };

    }
    //第二步把图片显示到画布上
    this.paintImg = function (callback) {
      var img = new Image();
      img.src = _this.imgUrl;
      img.onload = function () {
        _this.img = img;
        //先清空画布
        _this.cxt.clearRect(0, 0, _this.getImage.width, _this.getImage.height);
        var imgScale = img.width / img.height;
        var boxScale = _this.boxWidth / _this.boxHeight;

        //判断盒子与图片的比列
        if (imgScale < boxScale) {
          //设置图片的像素
          if (_this.boxWidth < _this.boxHeight) {
            _this.imgWidth = _this.boxWidth * 0.8;
            _this.imgHeight = _this.imgWidth / imgScale;
          } else {
            _this.imgWidth = _this.boxHeight * 0.8;
            _this.imgHeight = _this.imgWidth / imgScale;
          }
          _this.deviationX = (_this.boxWidth - _this.imgWidth * _this.size) / 2;
          _this.deviationY = (_this.boxHeight - _this.imgHeight * _this.size) / 2;
        } else {
          //设置图片的像素
          if (_this.boxWidth < _this.boxHeight) {
            _this.imgHeight = _this.boxWidth * 0.8;
            _this.imgWidth = _this.imgHeight * imgScale;
          } else {
            _this.imgHeight = _this.boxHeight * 0.8;
            _this.imgWidth = _this.imgHeight * imgScale;
          }
          _this.deviationX = (_this.boxWidth - _this.imgWidth * _this.size) / 2;
          _this.deviationY = (_this.boxHeight - _this.imgHeight * _this.size) / 2;
        }
        //高分屏下图片模糊，需要2倍处理
        _this.getImage.height = _this.boxHeight;
        _this.getImage.width = _this.boxWidth;

        _this.cxt.drawImage(img, _this.deviationX, _this.deviationY, _this.imgWidth * _this.size, _this.imgHeight * _this.size)
        if (callback) {
          callback(imgScale);
        }
      }
    }
    //第三步调整遮罩层高宽：
    this.cutImage = function (imgScale) {
      //判断图片与选择框的比例大小，作出裁剪
      if (_this.boxHeight > _this.boxWidth) {
        //设置选择框的像素
        _this.sWidth = _this.boxWidth * 0.8;
        _this.sHeight = (_this.boxWidth / _this.proportion) * 0.8;
      } else {
        //设置选择框的像素
        _this.sWidth = (_this.boxHeight * _this.proportion) * 0.8;
        _this.sHeight = _this.boxHeight * 0.8;
      }
      //绘制遮罩层：
      _this.editBox.style.width = _this.sWidth + 'px';
      _this.editBox.style.height = _this.sHeight + 'px';
    }
    //第四步鼠标拖动选取
    this.drag = function () {
      var draging = false;
      //记录初始点击的pageX，pageY。用于记录位移
      var pageX = 0;
      var pageY = 0;

      //记录首次的位置
      var startX = 0;
      var startY = 0;

      //获取图片X移动的最大距离
      _this.imgLeftMax = (_this.boxWidth - _this.sWidth) / 2;
      //获取图片Y移动的最大距离
      _this.imgTopMax = (_this.boxHeight - _this.sHeight) / 2;
      //获取图片X移动的最小距离
      _this.imgLeftMin = (_this.imgLeftMax + _this.sWidth) - (_this.imgWidth * _this.size);
      //获取图片Y移动的最小距离
      _this.imgTopMin = (_this.imgTopMax + _this.sHeight) - (_this.imgHeight * _this.size);
      _this.wpId.addEventListener('touchstart', function (ev) {
        var e = ev.touches[0];
        draging = true;
        //
        pageX = e.pageX;
        pageY = e.pageY;
        //记录首次的位置
        startX = _this.deviationX;
        startY = _this.deviationY;

      })
      _this.wpId.addEventListener('touchmove', function (ev) {
        var e = ev.touches[0];
        var offsetX = e.pageX - pageX;
        var offsetY = e.pageY - pageY;
        if (draging) {
          _this.cxt.clearRect(0, 0, _this.getImage.width, _this.getImage.height);
          _this.deviationX = offsetX + startX;
          _this.deviationY = offsetY + startY;

          // 大于最大移动距离
          // if (t.deviationX > t.imgLeftMax) {
          //   t.deviationX = t.imgLeftMax;
          // } else if (t.deviationX < t.imgLeftMin) {
          //   t.deviationX = t.imgLeftMin;
          // }
          // if (t.deviationY > t.imgTopMax) {
          //   t.deviationY = t.imgTopMax;
          // } else if (t.deviationY < t.imgTopMin) {
          //   t.deviationY = t.imgTopMin;
          // }
          _this.cxt.drawImage(_this.img, _this.deviationX, _this.deviationY, _this.imgWidth * _this.size, _this.imgHeight * _this.size)
        }
      });
      _this.wpId.addEventListener('touchend', function () {
        draging = false;
      })
    }
    //第五步放大缩小功能
    //放大
    document.getElementById('enlarge').onclick = function () {
      var sizeMax = _this.size * 2;
      if (sizeMax > 5) {
        _this.size = 5;
      } else {
        _this.size = sizeMax;
        _this.paintImg(function (imgScale) {
          _this.drag();
        });
      }
    }
    //缩小
    document.getElementById('narrow').onclick = function () {
      var sizeMax = _this.size / 2;
      if (sizeMax < 0.1) {
        _this.size = 0.1;
      } else {
        _this.size = sizeMax;
        _this.paintImg(function (imgScale) {
          _this.drag();
        });
      }
    }
    //第六步 截取生成图片
    document.getElementById('saves').onclick = function () {
      var saveCanvas = document.createElement('canvas');
      var ctx = saveCanvas.getContext('2d');
      //图片裁剪后的尺寸
      saveCanvas.width = _this.sWidth;
      saveCanvas.height = _this.sHeight;
      var images = new Image();
      images.src = _this.imgUrl;

      images.onload = function () {
        //计算偏移的距离
        var imagesX = _this.deviationX - _this.imgLeftMax;
        var imagesY = _this.deviationY - _this.imgTopMax;

        var vertSquashRatio = _this.detectVerticalSquash(images);
        ctx.drawImage(images, imagesX, imagesY, _this.imgWidth * _this.size, _this.imgHeight * _this.size);
        var clipUrl = saveCanvas.toDataURL('image/jpeg', 1);
        if (callback) {
          callback(dataURItoBlob(clipUrl));
        }
        document.body.style.overflow = 'visible';
        document.body.removeChild(_this.clipView);
      }
    }
    document.getElementById('colse').onclick = function () {
      document.body.style.overflow = 'visible';
      document.body.removeChild(_this.clipView);
    }
    //转换为二进制数据图片
    function dataURItoBlob(base64Data) {
      var byteString;
      if (base64Data.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(base64Data.split(',')[1]);
      } else {
        byteString = unescape(base64Data.split(',')[1]);
      }
      var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], {
        type: mimeString
      });
    }
    //用于修复ios下的canvas截图问题
    //详情可以看这里http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
    this.detectVerticalSquash = function (img) {
      if (/png$/i.test(img.src)) {
        return 1;
      }
      var iw = img.naturalWidth,
        ih = img.naturalHeight;
      var canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = ih;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      var data = ctx.getImageData(0, 0, 1, ih).data;

      var sy = 0;
      var ey = ih;
      var py = ih;
      while (py > sy) {
        var alpha = data[(py - 1) * 4 + 3];
        if (alpha === 0) {
          ey = py;
        } else {
          sy = py;
        }
        py = (ey + sy) >> 1;
      }
      var ratio = (py / ih);
      return (ratio === 0) ? 1 : ratio;
    };
    //检测图像是否是横向的（苹果手机）
    this.getOrientation = function (file, callback) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var view = new DataView(e.target.result);
        if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
        var length = view.byteLength,
          offset = 2;
        while (offset < length) {
          var marker = view.getUint16(offset, false);
          offset += 2;
          if (marker == 0xFFE1) {
            if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
            var little = view.getUint16(offset += 6, false) == 0x4949;
            offset += view.getUint32(offset + 4, little);
            var tags = view.getUint16(offset, little);
            offset += 2;
            for (var i = 0; i < tags; i++)
              if (view.getUint16(offset + (i * 12), little) == 0x0112)
                return callback(view.getUint16(offset + (i * 12) + 8, little));
          } else if ((marker & 0xFF00) != 0xFF00) break;
          else offset += view.getUint16(offset, false);
        }
        return callback(-1);
      };
      reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    }

  }