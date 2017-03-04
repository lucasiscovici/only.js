 (function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);
 (function($) {
     if ($.fn.style) {
         return;
     }

     // Escape regex chars with \
     var escape = function(text) {
         return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
     };

     // For those who need them (< IE 9), add support for CSS functions
     var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
     if (!isStyleFuncSupported) {
         CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
             return this.getAttribute(a);
         };
         CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority) {
             this.setAttribute(styleName, value);
             var priority = typeof priority != 'undefined' ? priority : '';
             if (priority != '') {
                 // Add priority manually
                 var rule = new RegExp(escape(styleName) + '\\s*:\\s*' + escape(value) +
                     '(\\s*;)?', 'gmi');
                 this.cssText =
                     this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
             }
         };
         CSSStyleDeclaration.prototype.removeProperty = function(a) {
             return this.removeAttribute(a);
         };
         CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
             var rule = new RegExp(escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?',
                 'gmi');
             return rule.test(this.cssText) ? 'important' : '';
         }
     }

     // The style function
     $.fn.cssImportant = function(dico) {
         // DOM node
         var node = this.get(0);

         priority = "";
         // Ensure we have a DOM node
         if (typeof node == 'undefined') {
             return this;
         }
         // CSSStyleDeclaration
         var style = this.get(0).style;
         // Getter/Setter
         for (styleName in dico) {
             value = dico[styleName];
             if (value.match(/!important/i)) {
                 priority = "important";
                 value = value.replace("!important", "");
             }
             if (typeof styleName != 'undefined') {
                 if (typeof value != 'undefined') {
                     // Set style property
                     priority = typeof priority != 'undefined' ? priority : '';
                     style.setProperty(styleName, value, priority);
                     return this;
                 } else {
                     // Get style property
                     return style.getPropertyValue(styleName);
                 }
             } else {
                 // Get CSSStyleDeclaration
                 return style;
             }
         }
     };
 })(jQuery);
 (function($) {

     $.extend($.expr[':'], {
         pattr: function(el, p) {
             al = 0;
             $.each($(el).attributes, function(i, it) {
                 if (this.name.match(p)) {
                     al += 1;
                     return false;
                 }
             })
             return (al > 0);
         }
     });
     jQuery.fn.extend({
         clone: function() {
             return $.extend(true, this);
         },
         attrp: function(p) {
             arr = [];
             $.each(this.attributes, function(i, t) {
                 if (this.name.match(p)) {
                     arr.push(this);
                 }
             });
             return arr;
         },
         attrP: function(p) {
             arr = [];

             $("*:pattr(" + m + ")").each(function(i, t) {
                 if (this.name.match(p)) {
                     arr.push(this);
                 }
             });
             return arr;
         }
     });

     function lucux() {

function attrP2(p) {
             arr = [];
             jQuery("*").each(function(i, it) {
                 $t = $(this);
                 arr2 = []
                 jQuery.each(this.attributes, function() {
                     if (this.name.match(p)) {
                         arr2.push(this);
                     }
                 });
                 if (arr2.length > 0) {
                     arr.push([$t, arr2]);
                 }
             });
             return $(arr);
         }
         function prep(p) {
            attrP2(p).each(function(b, lp) {

        for (var i = 0; i < lp[1].length; i++) {
              d = lp[1][i];

              sd = d.name.split("-");
              sd2 = sd[1].split("_");
             
              if (sd2.length > 1) {
                for (var j = 0; j < sd2.length; j++) {
                  dm=sd[0]+"-"+sd2[j]+"-"+sd[2];
                  if (lp[0].attr(dm)==null) {
                  lp[0].attr(dm,d.value);
}                }
                lp[0].removeAttr(d.name);
              }
        }
  });
}
     
         pp = {
             css: {},
             class: []
         };
         mo = {
             lg: pp,
             md: pp,
             sm: pp,
             xs: pp
         }
         model = {
             only: mo,
             nonly: mo
         };
         tab_n = [];
         tab_n_obj = [];
        
         var regex_first = "(n?only)";
         var regex_second = "(lg|sm|xs|md|mob)|(((lg|sm|xs|md|mob)_)+(lg|sm|xs|md|mob))";
         var regex_third = "(css|class)";
         var tab_second_aut = ["lg","md","sm","xs","mob"];
         var tab_third_aut_aut = ["css","class"];
          var tab_first = ["only","nonly"];

         var regex = "^" + regex_first + "-" + regex_second + "-" + regex_third + "$";
         m = new RegExp(regex, "i")
       var prefixe_tl = "tab_loop";
         var prefixe_tlt_v = prefixe_tl+"_third";
                  var prefixe_tlf_v = prefixe_tl+"_first";
         var tab_third_aut = {lg:tab_third_aut_aut,md:tab_third_aut_aut,sm:tab_third_aut_aut,xs:tab_third_aut_aut,mob:tab_third_aut_aut};
         var tab_second = {only:tab_second_aut,nonly:tab_second_aut};
         var tab_third = {only:tab_third_aut,nonly:tab_third_aut};

         function prefixe_tlt(t) {
            return prefixe_tlt_v+"_"+t.join("_");
         }
           function prefixe_tlf(t) {
            return prefixe_tlf_v+"_"+t.join("_");
         }
   tab_name = {
            only: prefixe_tlf(["only"]),
            nonly: prefixe_tlf(["nonly"]),
            css: prefixe_tlt(["css"]),
             class: prefixe_tlt(["class"])
         }
         //FUNCS
        function is_mob() {
        return jQuery.browser.mobile;
        }

         function is_lg() {
             return $(window).width() >= 1200;
         }

         function is_md() {
             return $(window).width() >= 992 && $(window).width() < 1200;
         }

         function is_sm() {
             return $(window).width() >= 768 && $(window).width() < 992;
         }

         function is_xs() {
             return $(window).width() < 768;
         }

         function func(name) {
             return eval(name + "()");
         }
          function func_p(name,p) {
             return eval(name + "("+p.join(',')+")");
         }
         function clone(d) {
             return $.extend(true, {}, d);
         }

         function only_keys(l) {
             f = {};
             for (i in l) {
                 f[i] = "";
             }
             return f;
         }

         function to_is(x){
            return "is_" + x;
         }


         //TAB LOOP
         function tab_loop_third_css(d,obj,k) {
           if (k) {
              obj.cssImportant(d);
          } else {
              obj.cssImportant(only_keys(d));
            }
         }

         function tab_loop_third_class(d,obj,k) {
          obj=$(tab_n_obj[obj]);
           for (var i = 0; i < d.length; i++) {
           if (k) {
               if (!obj.hasClass(d[i])) {
                   obj.addClass(d[i]);
               }
           } else {
               obj.removeClass(d[i]);
           }
            }
         }

         function tab_loop_third(j,u,x,k) {
            for (y in tab_n[j][u][x]) { // PARCOURS THIRD
              if ($.inArray(y , tab_third[u][x])) { // CHECK THIRD
                  d = tab_n[j][u][x][y];
                  prefi = tab_name[y]; // FUNCTION NAME TO SEND
                  vars = ["['"+d.join("'")+"']",j,k];
                  func_p(prefi,vars);
              }
            }
         }
         function tab_loop_first_only(j,u,x,dd){
              k = func(dd);
              tab_loop_third(j,u,x,k);

         }
         function tab_loop_first_nonly(j,u,x,dd){
            k = !func(dd);
            tab_loop_third(j,u,x,k);
         }

         //MAIN
        function re() {
          console.log(tab_n);
          for (var j = 0; j < tab_n.length; j++) { // PARCOURS ARRAYS (elems)
            for (u in tab_n[j]) { // PARCOURS FIRST 
              if ($.inArray(u, tab_first)) { // CHECK  FIRST
                for (x in tab_n[j][u]) { // PARCOURS SECONDS
                  if ($.inArray(x , tab_second[u])) { // CHECK SECOND
                    dd = to_is(x); // NAME FUNCTION TO CALL IS
                    prefi = tab_name[u]; // FUNCTION NAME TO SEND
                    vars = [j,"'"+String(u)+"'","'"+String(x)+"'","'"+String(dd)+"'"]; // PARAMS
                    func_p(prefi,vars); // CALL
                  }
                }
              }
            } 
          }
        }
         $(window).resize(function() {
             re();
         });
         var inter_tab = {
          css: ";",
          class: " ",
          cssi: ";"
         }
         var third_type = {
          css: "obj",
          cssi: "obj",
          class:"array"
         };
         function begin() {
            prep(m);
             // body...
             attrP2(m).each(function(b, lp) {
                 

                 tab_n_obj.push(lp[0].get(0));
                 tab_n.push({}); //NEW ARRAY

                 for (var oo = 0; oo < lp[1].length; oo++) {
                     l = lp[1][oo]; // NAME ATTRIBUTE

                     ds = l.name.split("-");
                     dd = l.value; // VAL ATTR
                     first=ds[0];
                     second=ds[1];
                     third=ds[2];
                                   if (!($.inArray(first,tab_first))) { // CHECK  FIRST
                                    break;
}
                            if (!($.inArray(second , tab_second[first]))) { // CHECK SECOND
                                break;
                            }
                                                               if (!($.inArray(third, tab_third[first][second]))) { // CHECK THIRD
break;
}
                      if (!(first in tab_n[tab_n.length-1])) {
                        tab_n[tab_n.length-1][first]={};

                      }

                      if (!(second in tab_n[tab_n.length-1][first])) {
                        tab_n[tab_n.length-1][first][second]={};
                        
                      }
                      if (!(third in tab_n[tab_n.length-1][first][second])) {
                        if (third_type[third]=="array") {
                            tab_n[tab_n.length-1][first][second][third]=[];
                        }else if (third_type[third]=="obj") {
                            tab_n[tab_n.length-1][first][second][third]={};
                        }
                      }
                     inter = inter_tab[third];



                     sd = dd.split(inter);
                     for (var j = 0; j < sd.length; j++) {
                         i = sd[j];
                         if (ds[2] == "css") {
                             ddz = i.split(":");
                             ss = ddz[0];
                             sss = ddz[1];
                             if (ss.length > 0) {
                                 tab_n[b][ds[0]][ds[1]][ds[2]][ss] = "" + sss + "";
                             }
                         } else if (ds[2] == "cssi") {
                             ds[2] = "css";
                             ddz = i.split(":");
                             ss = ddz[0];
                             sss = ddz[1];
                             if (ss.length > 0) {
                                 tab_n[b][ds[0]][ds[1]][ds[2]][ss] = "" + sss + " !important";
                             }
                         } else if (ds[2] == "class") {
                             sss = i;
                             tab_n[b][ds[0]][ds[1]][ds[2]].push(sss);

                         }
                     }

                 }
             });
             re();
         }
         begin();
     };

     lucux();
 }(jQuery));