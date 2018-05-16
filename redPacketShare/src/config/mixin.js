import {
  getStyle
} from '@/config/mUtils'
export const imgClipping = {
  directives: {
    'imgClipping': {
      bind: (el, binding) => {
        var src = el.src;
        if (src) {
          let img = new Image();
          img.src = el.src;
          img.onload = function () {
            if (img.width > img.height) {
              el.style.height = "100%";
            } else {
              el.style.width = "100%";
            }
          }
        }
      }
    }
  }
};
