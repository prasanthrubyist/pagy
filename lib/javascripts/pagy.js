// See the Pagy documentation: https://ddnexus.github.io/pagy/extras#javascript

// Pagy namespace
function Pagy(){}

Pagy.windowListeners = {};

Pagy.addInputEventListeners = function(input, handler){
                                // select the content on click: easier for typing a number
                                input.addEventListener('click', function(){ this.select() });
                                // go when the input looses focus
                                input.addEventListener('focusout', handler);
                                // … and when pressing enter inside the input
                                input.addEventListener('keyup', function(e){ if (e.which === 13) handler() }.bind(this));
                              };

Pagy.compact = function(id, marker, page, trim){
                 var pagyEl = document.getElementById(id),
                     input  = pagyEl.getElementsByTagName('input')[0],
                     link   = pagyEl.getElementsByTagName('a')[0],
                     linkP1 = pagyEl.getElementsByTagName('a')[1],
                     go     = function(){
                                if (page !== input.value) {
                                  if (trim === true && input.value === '1') { linkP1.click() }
                                  else {
                                    var href = link.getAttribute('href').replace(marker, input.value);
                                    link.setAttribute('href', href);
                                    link.click();
                                  }
                                }
                              };
                 Pagy.addInputEventListeners(input, go);
               };

Pagy.items = function(id, marker, from){
               var pagyEl  = document.getElementById(id),
                   input   = pagyEl.getElementsByTagName('input')[0],
                   current = input.value,
                   link    = pagyEl.getElementsByTagName('a')[0],
                   go      = function(){
                               var items = input.value;
                               if (current !== items) {
                                 var page = Math.max(Math.ceil(from / items),1);
                                 var href = link.getAttribute('href').replace(marker+'-page-', page).replace(marker+'-items-', items);
                                 link.setAttribute('href', href);
                                 link.click();
                               }
                             };
               Pagy.addInputEventListeners(input, go);
             };

Pagy.responsive = function(id, tags, widths, series){
                    var pagyEl    = document.getElementById(id),
                        container = pagyEl.parentElement,
                        lastWidth = undefined,
                        resizeId  = 0,
                        render    = function(){
                                      if (container.clientWidth === 0){ clearTimeout(resizeId); return setTimeout(render, 300) }
                                      var width = widths.find(function(w) {return container.clientWidth > w});
                                      if (width !== lastWidth) {
                                        while (pagyEl.firstChild) { pagyEl.removeChild(pagyEl.firstChild) }
                                        var html = tags['before'];
                                        series[width].forEach(function(item) {html += tags[item]});
                                        html += tags['after'];
                                        pagyEl.insertAdjacentHTML('beforeend', html);
                                        lastWidth = width;
                                      }
                                    },
                        resize    = function(){  // call render once, after window.resize is done
                                      clearTimeout(resizeId);
                                      resizeId = setTimeout(render, 300);
                                    };
                    // remove the previous window resize listener which may result in firing the render multiple times
                    window.removeEventListener('resize', Pagy.windowListeners[id], true);
                    window.addEventListener('resize', resize, true);
                    Pagy.windowListeners[id] = resize;
                    render();
                  };

Pagy.init = function(arg){
              var target   = arg instanceof Event || arg === undefined ? document : arg,
                  jsonTags = target.getElementsByClassName('pagy-json');
              for (var i = 0, len = jsonTags.length; i < len; i++) {
                var args = JSON.parse(jsonTags[i].innerHTML);
                Pagy[args.shift()].apply(null, args);
              }
            };

// namespace for custom init functions
function PagyInit(){}

Pagy.applyInit = function(name, payload){ PagyInit[name].apply(null, [payload]) };
