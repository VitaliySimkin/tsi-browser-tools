/** BaseHTMLcontrol */
class NSBaseHtmlControl {
	/** Constructor */
	constructor() {
		this.listeners = [];
	}

	/** Add event listener
	 * @param {HTMLElement} el element
	 * @param {(keyof GlobalEventHandlersEventMap)} event event
	 * @param {Function} listener event listener
	 */
	addEventListener(el, event, listener) {
		if (this.getIndexOfListener({el, event, listener}) !== -1) {return;}
		let handler = listener.bind(this);
		this.listeners.push({el, event, listener, handler});
		el.addEventListener(event, handler);
	}

	/** Remove event listener
	 * @param {Object} param param
	 * @param {HTMLElement} param.el element
	 * @param {(keyof GlobalEventHandlersEventMap)} param.event event
	 * @param {Function} param.listener event listener
	 * @param {number} listenerIndex index in listeners
	 */
	removeEventListener({el, event, listener}, listenerIndex) {
		listenerIndex = listenerIndex || this.getIndexOfListener({el, event, listener});
		let handler = (this.listeners[listenerIndex] || {}).handler || listener;
		el.removeEventListener(event, handler);
		if (listenerIndex >= 0) {
			this.listeners.splice(listenerIndex, 1);
		}
	}

	/** Remove event listener
	 * @param {Object} param param
	 */
	getIndexOfListener(param) {
		let index = this.listeners.findIndex(i => i === param);
		if (index >= 0) { return index; }
		return this.listeners.findIndex(i => i.el === param.el
			&& i.event === param.event
			&& i.listener === param.listener);
	}

	/** remove event listeners */
	removeEventListeners() {
		while (this.listeners.length > 0) {
			this.removeEventListener(this.listeners[0], 0);
		}
	}

	/** Select element
	 * @param {string} selector selector
	 * @returns {HTMLElement}
	 */
	$(selector) {
		return this.container.querySelector(selector);
	}
}


/** Draggeble HTMLElement control */
class NSDragger extends NSBaseHtmlControl {
	/** Contructor
	 * @param {HTMLElement} dragControlEl drag control element
	 * @param {?HTMLElement} dragEl draggable element
	 */
	constructor(dragControlEl, dragEl) {
		super();
		this.initFields();
		this.dragControlEl = dragControlEl;
		this.dragEl = dragEl || dragControlEl;
		this.initEvents();
	}

	/** init object fields */
	initFields() {
		this.active = false;
		this.currentX;
		this.currentY;
		this.initialX;
		this.initialY;
		this.xOffset = 0;
		this.yOffset = 0;
	}

	/** Init events */
	initEvents() {
		this.addEventListener(this.dragControlEl, "mousedown", this.dragStart);
		this.addEventListener(this.dragControlEl, "mouseup", this.dragEnd);
		this.addEventListener(this.dragControlEl, "mousemove", this.drag);
	}

	/** Drag start handler
	 * @param {MouseEvent} e event
	 */
	dragStart(e) {
		e.stopPropagation();
		e.preventDefault();
		const isTouch = e.type === "touchstart";
		this.initialX = (isTouch ? e.touches[0].clientX : e.clientX) - this.xOffset;
		this.initialY = (isTouch ? e.touches[0].clientY : e.clientY) - this.yOffset;
		if (e.target === this.dragControlEl) {
			this.active = true;
		}
		this.addDocumentListeners();
	}

	/** Drag end handler */
	dragEnd() {
		this.initialX = this.currentX;
		this.initialY = this.currentY;
		this.active = false;
		this.removeDocumentListeners();
	}

	/** Drag handler
	 * @param {MouseEvent} e event
	 */
	drag(e) {
		if (!this.active) {return;}
		e.preventDefault();
		const isTouch = e.type === "touchstart";
		this.xOffset = this.currentX = (isTouch ? e.touches[0].clientX : e.clientX) - this.initialX;
		this.yOffset = this.currentY = (isTouch ? e.touches[0].clientY : e.clientY) - this.initialY;
		this.setTranslate();
	}

	/** Set translate */
	setTranslate() {
		this.dragEl.style.transform = "translate3d(" + this.currentX + "px, " + this.currentY + "px, 0)";
	}

	/** Add document event listeners */
	addDocumentListeners() {
		this.addEventListener(document, "mouseup", this.dragEnd);
		this.addEventListener(document, "mousemove", this.drag);
	}
	/** Remove document event listeners */
	removeDocumentListeners() {
		this.removeEventListener({el: document, event: "mouseup", listener: this.dragEnd});
		this.removeEventListener({el: document, event: "mousemove", listener: this.drag});
	}
}

/** Modal box class */
class NSModalBox extends NSBaseHtmlControl {
	/** Constructor
	 * @param {Object} config config
	 */
	constructor(config = {}) {
		super();
		this.id = config.id || this.generateUUID();
		this.config = config;
		this.template = this.getTemplate();
		this.container = this.createCnt();
		this.contentHTML = config.contentHTML;
		this.content = config.content;
		this.touched = false;
		this.listeners = [];
		this.initDraggable();
		this.open();
	}

	/** Open modal box */
	open() {
		this.setContent();
		this.addEventListeners();
		document.body.appendChild(this.container);
	}

	/** Set html of content container */
	setContent(html) {
		let el = this.getContentCnt();
		el.innerHTML = "";
		if (html === undefined) {
			html = this.content || this.contentHTML || "";
		}
		if (typeof html === "string") el.innerHTML = html;
		else el.appendChild(this.content);
	}

	/** Generate UUID */
	generateUUID() {
		let replacer = (c,r)=>("x" === c ? (r=Math.random()*16|0):(r&0x3|0x8)).toString(16);
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, replacer);
	}

	/** Get modal box html template */
	getTemplate() {
		return `<div class="ns-modal-box-cnt" id="ns-modal-box-outer-${this.id}">
			<div class="ns-modal-box-header">
				<div class="ns-modal-box-title" id="ns-modal-box-title-${this.id}">
					<span class="ns-modal-box-title-caption">${this.config.caption}</span>
				</div>
				<div class="ns-modal-box-header-left">
					<span class="ns-modal-box-btn" id="ns-modal-box-attach-btn"></span>
					<span class="ns-modal-box-btn" id="ns-modal-box-close-btn"></span>
				</div>
			</div>
			<div class="ns-modal-box-content-cnt" id="${this.getContentCntId()}"></div>
		</div>`;
	}

	/** Get id of content container */
	getContentCntId() {
		return `ns-modal-box-cnt-${this.id}`;
	}

	/** Get content container element */
	getContentCnt() {
		return this.container.querySelector("#" + this.getContentCntId());
	}

	/** Create modal box container */
	createCnt() {
		let tmpDiv = document.createElement("div");
		tmpDiv.innerHTML = this.template;
		/** @type {HTMLElement} */
		let cnt = tmpDiv.firstElementChild;
		let style = this.config.style || Object.create(null);
		for (let key in style) {
			cnt.style[key] = style[key];
		}
		return cnt;
	}

	/** init draggables */
	initDraggable() {
		this.header = this.container.querySelector(".ns-modal-box-header");
		this.dragger = new NSDragger(this.header, this.container);
	}

	/** close modal box
	 * @param {MouseEvent} e event
	 */
	close(e) {
		e.stopPropagation();
		e.preventDefault();
		this.removeEventListeners();
		this.removeElements();
	}

	/** add event listeners */
	addEventListeners() {
		this.addEventListener(this.$("span#ns-modal-box-close-btn"), "click", this.close);
		this.addEventListener(this.$("span#ns-modal-box-attach-btn"), "click", this.onAttachBtnClick);
		this.addEventListener(document, "click", this.onDocumentBodyClick);
	}

	/** Attach button click handler
	 * @param {MouseEvent} e event
	 */
	onAttachBtnClick(e) {
		e.stopPropagation();
		e.preventDefault();
		this.touched = !this.touched;
		let btn = this.$("span#ns-modal-box-attach-btn");
		btn.style.backgroundImage = this.touched ? "url(https://image.flaticon.com/icons/svg/149/149831.svg)" : null;
		btn.style.filter = this.touched ? "none" : null;
	}

	/** document body click handler
	 * @param {MouseEvent} e event
	 */
	onDocumentBodyClick(e) {
		if (this.touched) { return; }
		if (this.isClickInsideContainer(e)) { return; }
		this.close(e);
	}

	/** document body click handler
	 * @param {MouseEvent} e event
	 */
	isClickInsideContainer(e) {
		let el = e.target;
		while (el) {
			if (el === this.container) { return true; }
			el = el.parentElement;
		}
		return false;
	}

	/** remove elements */
	removeElements() {
		this.container.remove();
	}
}

window.NSModalBox = NSModalBox;
export default NSModalBox;