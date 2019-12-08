import NSModalBox from "../../modules/ns-modal-box/ns-modal-box.js";

const DetailInfoManager = {
	/** propsConfig */
	props: [
		{name: "SchemaName", caption: "SchemaName"},
		{name: "CardPageName", caption: "CardPageName"},
		{name: "entitySchemaName", caption: "entityName", isModelProp: true},
		{name: "MasterRecordId", caption: "MasterRecordId"},
		{name: "DetailColumnName", caption: "DetailColumn"}
	],

	/** Initialize */
	init() {
		window.document.addEventListener("click", this.onElClick.bind(this));
	},
	
	onElClick(event) {
		if (!event.altKey) {
			return;
		}
		let detail = this.getDetailByClick(event.target);
		if (!detail) {
			return;
		}
		this.displayDetailInfo({model: detail.model})
	},

	getDetailByClick(target) {
		var startEl1 = target;
		var el = startEl1;
		var detail;
		while (el) {
			detail = Ext.getCmp(el.id);
			if (detail && this.isDetailModel(detail.model)) {
				return detail;
			}
			el = el.parentElement;
		}
	},
	isDetailModel(model = {}) {
		let cls = [];
		while (model) {
			cls.push(model.$className);
			model = model.__proto__;
		}
		return cls.some(item => (item || "").startsWith("Terrasoft.model.BaseDetailV2"));
	},

	async displayDetailInfo({model}) {
		let items = this.getItems({model});
		let cnt = this.createEl("table.ns-detail-info-table");
		items.forEach(item => this.renderItem(item, cnt), this);
		new NSModalBox({
			content: cnt,
			style: {width: "500px"},
			caption: "Дані про деталь"
		});
	},

	getItems({model}) {
		let items = [];
		this.props.forEach(prop => {
			let value = prop.isModelProp ? model[prop.name] : model.get(prop.name);
			items.push({
				caption: prop.caption,
				value: value
			})
		});
		return items;
	},

	createEl(tag, innerText = "", props = {}) {
		let elTag = tag.split(".")[0];
		let className = tag.split(".")[1];
		let el = document.createElement(elTag);
		if (className) el.className = className;

		if (typeof innerText === "object") props = innerText;
		else el.innerText = String(innerText);

		for (let key in props) tr[key] = props[key];
		return el;
	},

	createCopyValueBtn(value) {
		let copy =this.createEl("span.nsdi-prop-copy");
		copy.addEventListener("click", function() {
			this.copyValue(value);
		}.bind(this));
		return copy;
	},

	renderItem(item, renderTo) {
		let tr = this.createEl("tr.ns-detail-info-prop-row");
		tr.appendChild(this.createEl("th.nsdi-prop-name", item.caption));
		tr.appendChild(this.createEl("td.nsdi-prop-value", item.value));
		let copyTd = this.createEl("td");
		copyTd.appendChild(this.createCopyValueBtn(item.value));
		tr.appendChild(copyTd);
		renderTo.appendChild(tr);
	},

	async copyValue(value) {
		await navigator.clipboard.writeText(value);
	}
}

DetailInfoManager.init();