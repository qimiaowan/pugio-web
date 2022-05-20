/* eslint-disable @typescript-eslint/prefer-optional-chain */
(function(window, document){
    let slice = [].slice;
    let removeClass = function(elem){
        elem.classList.remove('focus-within');
    };
    let update = (function(){
        let running; let last;
        let action = function(){
            let element = document.activeElement;
            running = false;
            if (last !== element){
                last = element;
                slice.call(document.getElementsByClassName('focus-within')).forEach(removeClass);
                while (element && element.classList){
                    element.classList.add('focus-within');
                    element = element.parentNode;
                }
            }
        };
        return function(){
            if (!running){
                requestAnimationFrame(action);
                running = true;
            }
        };
    })();
    document.addEventListener('focus', update, true);
    document.addEventListener('blur', update, true);
    update();
})(window, document);
