/**
 * Copyright (c) 2024 Mozaika, Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
Variations

Except as contained in this notice, the name of Mozaika, Ltd. shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from Mozaika, Ltd.
 */

class Control extends ol.control.Control {
	/**
	 * @param {Object} [opt_options] Control options.
	 */
	constructor(opt_options) {
	  const options = opt_options || {};
  
	  const button = document.createElement('a');
	  button.innerHTML = `<i class="cil-${options.icon}"></i>`;
	  
	  if(options.title){
		button.title = options.title;
	  }



	  const element = document.createElement('div');
	  element.className = `${options.class} ol-unselectable ol-control`;
	  if(options.id)
	  	element.id = options.id;
	  element.appendChild(button);
  
	  super({
		element: element,
		target: options.target,
	  });
  
	  if(options.callback){
		button.addEventListener('click', options.callback.bind(this), false);
	  }

	}

  }