window.NSEntityInfo = {
	container: null,
	entity: null,
	columnsProp: [
		{name: "name", caption: "Назва", getter(item) {return item.name}},
		{name: "caption", caption: "Caption", getter(item) {return item.caption}},
		{name: "dataValueType", caption: "DataValueType", getter(item) {
			return this.getPropNameByValue(Terrasoft.DataValueType, item.dataValueType);
		}},
		{name: "lookup", caption: "LookupSchemaName", getter(item) {return item.referenceSchemaName || "";}}
	],

	createElement(tagName, prop = {}) {
		let el = document.createElement(tagName);
		for (const key in prop) {
			if (prop.hasOwnProperty(key)) {
				el[key] = prop[key];
			}
		}
		return el;
	},

	getPropNameByValue(obj, value) {
		for (const prop in obj) {
			if (obj.hasOwnProperty(prop) && obj[prop] === value) {
				return prop;
			}
		}
		return "";
	},

	open() {
		this.container.style.display = "";
		this.handleDocumentClick();
	},

	close() {
		this.container.style.display = "none";
	},

	init() {
		this.createContainer();
		this.addOpenListener();
	},

	handleDocumentClick() {
		let scope = this;
		let onClick = function() {
			let clickedInsidePage = Boolean(event.target.closest("#ns-entity-info-cnt"));
			if (clickedInsidePage) {
				return;
			}
			document.removeEventListener("click", onClick);
			scope.close();
		};
		document.addEventListener("click", onClick);
	},

	addOpenListener() {
		let scope = this;
		document.addEventListener("keyup", function(event) {
			if (event.keyCode === 69 && event.shiftKey === true && event.ctrlKey === true) {
				event.stopPropagation();
				scope.open();
			}
		});
	},

	loadEntityInfo({entityName}) {
		this.showInfoNotFound();
		this.entity = null;
		let scope = this;
		require([entityName], function(entity) {
			scope.entity = entity;
			scope.onEntityInfoLoaded(entity);
		});
	},

	onEntityInfoLoaded(entity) {
		this.generateColumnInfoTable(entity);
	},

	generateColumnInfoTable(entity) {
		let cnt = this.createElement("table", {className: "ns-ei-column-table"});
		cnt.appendChild(this.generateColumnInfoHeader());
		cnt.appendChild(this.generateColumnInfoContent(entity));
		this.tableContainer.innerHTML = "";
		this.tableContainer.appendChild(cnt);
	},

	generateColumnInfoContent(entity) {
		let content = this.createElement("tbody", {className: "ns-ei-column-table-content"});
		let columns = Object.values(entity.columns);
		let appenColumnInfoToContent = column => content.appendChild(this.createColumnInfoRow(column));
		columns.forEach(appenColumnInfoToContent, this);
		this.tbody = content;
		return content;
	},

	createColumnInfoRow(column) {
		let row = this.createElement("tr", {className: "ns-ei-column-info-row"});
		row.setAttribute("column-name", column.name);
		this.columnsProp.forEach(columnProp => {
			let el = this.createElement("td");
			el.innerText = columnProp.getter.call(this, column);
			row.appendChild(el);
		}, this);
		return row;
	},

	generateColumnInfoHeader() {
		let header = this.createElement("thead", {className: "ns-ei-column-table-header"});
		let captionRow = this.createElement("tr");
		header.appendChild(captionRow);
		this.columnsProp.forEach(column => {
			let el = this.createElement("th");
			el.innerText = column.caption;
			el.setAttribute("column-name", column.name);
			captionRow.appendChild(el);
		}, this);
		return header;
	},

	createContainer() {
		var cnt = document.createElement("div");
		cnt.className = "ns-entity-info-cnt";
		cnt.id = "ns-entity-info-cnt";
		this.container = cnt;
		this.container.style.display = "none";
		this.generateHeader();
		this.tableContainer = this.createElement("div", {className: "ns-ei-table-cnt"});
		this.showInfoNotFound();
		cnt.appendChild(this.tableContainer);
		document.body.appendChild(cnt);
		return cnt;
	},

	showInfoNotFound() {
		this.tableContainer.innerHTML = ""
		this.tableContainer.appendChild(this.getInfoNotFound());
	},

	getInfoNotFound() {
		let cnt = this.createElement("span", {className: "ns-ei-info-not-found"});
		cnt.innerText = "ENTITY NOT FOUND";
		return cnt;
	},

	onEntityChanged(value) {
		this.loadEntityInfo({entityName: value});
	},

	generateHeader() {
		let header = this.createElement("div", {className: "ns-ei-header"});
		this.entityFilter = this.createHeaderFilter(header, "EntityName", this.onEntityChanged, this);
		this.columnFilter = this.createHeaderFilter(header, "ColumnName", this.onColumnFilterChanged, this);
		this.container.appendChild(header);
	},

	createHeaderFilter(header, caption, onEnter, scope) {
		let cnt = this.createElement("span");
		let text = this.createElement("span", {className: "ns-ei-filter-caption"});
		text.innerText = caption;
		cnt.appendChild(text);
		let input = this.createElement("input");
		input.addEventListener("keyup", (event) => {
			if (event.keyCode === 13) {
				event.preventDefault();
				onEnter.call(scope, input.value);
			}
		});
		cnt.appendChild(input);
		header.appendChild(cnt);
		return input;
	},

	onColumnFilterChanged() {
		this.filterColumns();
	},

	filterColumns() {
		let value = this.columnFilter.value.toLowerCase();
		let filter = col => col.name.toLowerCase().includes(value) || col.caption.toLowerCase().includes(value);
		if (!value) {
			filter = () => true;
		}
		let columns = Object.values(this.entity.columns);
		let visibleColumns = columns.filter(filter).map(col => col.name);
		this.tbody.childNodes.forEach(item => {
			let itemColumn = item.getAttribute("column-name");
			let visible = visibleColumns.includes(itemColumn);
			item.style.display = visible ? "" : "none";
		}, this)
	}
}
NSEntityInfo.init();
// NSEntityInfo.loadEntityInfo({entityName: "Contact"});