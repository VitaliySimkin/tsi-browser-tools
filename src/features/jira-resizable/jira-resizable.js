(function() {

try {
	var NSJiraResizer = {
		/** @type {number} */
		lastWidth: 0,
	
		/**
		 * @type {HTMLElement}
		 */
		detailViewEl: null,
	
		/**
		 * @type {HTMLElement}
		 */
		resizeElement: null,
	
		/** Инициализация */
		init() {
			this.overrideJiraFn();
			this.resize();
		},

		getGhxColumns() {
			this.ghxColumns = document.getElementsByClassName("ghx-columns")[0];
			return this.ghxColumns;
		},

		getColumnHeaderGroup() {
			let alreadyExists = this.columnHeaderGroup && this.columnHeaderGroup.parentElement;
			if (!alreadyExists) {
				this.columnHeaderGroup = document.getElementById("ghx-column-header-group");
			}
			return this.columnHeaderGroup;
		},
	
		resize() {
			let detailViewEl = this.getDetailViewElement();
			let isVisibleDetailViewEl = detailViewEl && detailViewEl.childElementCount > 0;
			let isExistResizer = detailViewEl.contains(this.resizeElement);
			if (!isVisibleDetailViewEl || isExistResizer) {
				return;
			}
			this.createResizeElement();
			this.appendResizeElement();
		},
	
		overrideJiraFn() {
			var scope = this;
			var baseShow = GH.DetailsView.show;
			GH.DetailsView.show = function(...arg) {
				baseShow(...arg);
				scope.resize();
			}
			var baseGetWidth = GH.DetailsView.getWidth;
			GH.DetailsView.getWidth = function(...arg) {
				return scope.lastWidth || baseGetWidth(...arg);
			}
		},
	
		/** Создать елемент для изменения ширины
		 * @returns {HTMLElement}
		 */
		createResizeElement() {
			this.resizeElement = document.createElement("div");
			this.resizeElement.classList.add("simk-resizer");
			this.resizeElement.addEventListener("mousedown", this.onMouseDown.bind(this))
			return this.resizeElement;
		},
	
		/** Обработка движения мыши
		 * @param {MouseEvent} event событие
		 */
		onMouseMove(event) {
			this.updateSize(event);
		},
		
		updateSize(event) {
			let width = document.body.clientWidth - event.clientX;
			let max = 1400;
			let min = 350;
			width = width > max ? max : width < min ? min : width;
			this.lastWidth = width;
			this.setWidth(width);
		},
	
		setWidth(width) {
			this.detailViewEl.style.width = `${width}px`;
			let ghxColumns = this.getGhxColumns();
			let columnHeaderGroup = this.getColumnHeaderGroup();
			if (columnHeaderGroup && ghxColumns) {
				columnHeaderGroup.style.width = ghxColumns.clientWidth + "px";
			}
		},
	
		onMouseDown() {
			let scope = this;
			document.body.style.userSelect = "none";
			let moveHandler = function() {
				scope.onMouseMove.apply(scope, arguments);
			}
			document.addEventListener("mousemove", moveHandler);
			let upHandler = function(event) {
				document.body.style.userSelect = null;
				scope.updateSize.call(scope, event);
				document.removeEventListener("mousemove", moveHandler);
				document.removeEventListener("mouseup", upHandler);
			}
			document.addEventListener("mouseup", upHandler);
		},
	
		appendResizeElement() {
			this.detailViewEl = this.getDetailViewElement();
			this.detailViewEl.prepend(this.resizeElement);
		},
	
		/** Получить елемент отображаюший детали таски
		 * @
		 */
		getDetailViewElement() {
			return document.getElementById("ghx-detail-view");
		}
	};
	
	NSJiraResizer.init();
} catch (err) {}
})();