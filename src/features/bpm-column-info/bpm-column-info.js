import NSModalBox from '../../modules/ns-modal-box/ns-modal-box.js';

var NSBusinessRuleColumnInfo = {
	getModelRules(model) {
		var rules = [];
		model = model.__proto__;
		while (model) {
			model.rules && !Terrasoft.isEmptyObject(model.rules) && rules.push(model.rules);
			model = model.__proto__;
		}
		return rules.reduce((item, result) => this.mergeRules(result, item), {});
	},
	mergeRules(rules, businessRules) {
		rules = rules || {};
		businessRules = businessRules || {};
		var result = {};
		var columnNames = Ext.Array.merge(Ext.Object.getKeys(rules), Ext.Object.getKeys(businessRules));
		Terrasoft.each(columnNames, function(columnName) {
			result[columnName] = this.mergeColumnRules(rules[columnName], businessRules[columnName]);
		}, this);
		return result;
	},
	mergeColumnRules(columnRules, columnBusinessRules) {
		columnRules = columnRules || {};
		columnBusinessRules = columnBusinessRules || {};
		var result = {};
		var ruleNames = Ext.Array.merge(
			Ext.Object.getKeys(columnRules),
			Ext.Object.getKeys(columnBusinessRules));
		Terrasoft.each(ruleNames, function(ruleName) {
			result[ruleName] = Ext.apply(columnRules[ruleName] || {}, columnBusinessRules[ruleName]);
		}, this);
		return result;
	},
	async getBusinessRuleModule() {
		return new Promise((callback) => {
			require(['BusinessRuleModule'], function(BusinessRuleModule) {callback(BusinessRuleModule);});
		});
	},
	async getColumnBindRules(model, columnName) {
		let BusinessRuleModule = await this.getBusinessRuleModule();
		let rules = this.getModelRules(model)[columnName] || {};
		let isBINDPARAMETER = rule => rule.ruleType === BusinessRuleModule.enums.RuleType.BINDPARAMETER;
		let bindRules = Object.values(rules).filter(isBINDPARAMETER);
		return bindRules.map(rule => {
			let compr = cond => this.getPropNameByValue(Terrasoft.ComparisonType, cond.comparisonType);
			let getCondDesc = cond => `{${cond.leftExpression.attribute} ${compr(cond)} ${cond.rightExpression.value}}`;
			let separaor = this.getPropNameByValue(Terrasoft.LogicalOperatorType, rule.logical) || 'AND';
			let value = rule.conditions.map(getCondDesc).join(` ${separaor} `);
			let caption = this.getPropNameByValue(BusinessRuleModule.enums.Property, rule.property);
			return {caption, value};
		});
	},
	getPropNameByValue(obj, value) {
		return _.invert(obj)[value];
	}
};

const ColumnInfoManager = {
	/** propsConfig */
	props: [
		{name: 'caption', caption: 'caption'},
		{name: 'columnPath', caption: 'columnPath'},
		{name: 'dataValueType', caption: 'DataType', propOf: 'DataValueType'},
		{name: 'referenceSchemaName', caption: 'referenceSchema'},
		{name: 'type', caption: 'Type', propOf: 'ViewModelColumnType'},
		{name: 'uId', caption: 'UID'},
		{name: 'name', caption: 'pageName', isModelProp: true}
	],

	wait(time) {
		return new Promise(resolve => setTimeout(resolve, time));
	},

	/** Initialize */
	async init() {
		let scope = this;
		let waited = 0;
		while (!Terrasoft.BaseEdit && waited < 10) {
			await this.wait(1000);
			waited++;
		}
		let initDomEvents = Terrasoft.BaseEdit.prototype.initDomEvents;
		Terrasoft.BaseEdit.prototype.initDomEvents = function() {
			scope.appendColumnInfoClickHandler.call(scope, this);
			initDomEvents.apply(this, arguments);
		};
	},

	/** Append column info click handler */
	appendColumnInfoClickHandler(context) {
		let wrapEl = context.getWrapEl()
		wrapEl.on('click', function(event) {
			this.onEditWrapElClick(context, event);
		}, this);
	},

	/** Handle element click
	 * @param {Object} context el viewmodel
	 * @param {MouseEvent} event click event
	 */
	onEditWrapElClick(context, event) {
		if (!event.altKey) {
			return;
		}
		event.stopEvent();
		let config = {model: context.model, bindTo: context.bindings.value.modelItem};
		this.displayColumnInfo(config);
	},

	async displayColumnInfo({model, bindTo}) {
		let items = this.getItems({model, bindTo});
		let cnt = this.createEl('table.ns-column-info-table');
		items.forEach(item => this.renderItem(item, cnt), this);
		let rules = await NSBusinessRuleColumnInfo.getColumnBindRules(model, bindTo);
		rules.forEach(rule => this.renderItem(rule, cnt), this);
		new NSModalBox({
			content: cnt,
			style: {width: '500px'},
			caption: 'Column info'
		});
	},

	getItems(config) {
		let items = [];
		let _value = config.model && config.model.get(config.bindTo);
		let column = config.model.columns[config.bindTo];
		let value = (_value && _value.value) ? _value.value : _value;
		items.push({
			caption: 'value',
			value: value
		});
		if (typeof _value === 'object') {
			if (column.dataValueType !== Terrasoft.DataValueType.DATE_TIME) {
				items.push({
					caption: 'displayValue',
					value: _value.displayValue
				});
			}
		}
		this.props.forEach(prop => {
			let value = prop.isModelProp ? config.model[prop.name] : column[prop.name];
			if (prop.propOf) {
				let obj = Terrasoft[prop.propOf];
				for (let key in obj) {
					if (obj[key] === value) {
						value = key;
						break;
					}
				}
			}
			items.push({
				caption: prop.caption,
				value: value
			})
		});
		return items;
	},

	createEl(tag, innerText = '', props = {}) {
		let elTag = tag.split('.')[0];
		let className = tag.split('.')[1];
		let el = document.createElement(elTag);
		if (className) el.className = className;

		if (typeof innerText === 'object') props = innerText;
		else el.innerText = String(innerText);

		for (let key in props) tr[key] = props[key];
		return el;
	},

	createCopyValueBtn(value) {
		let copy =this.createEl('span.nsci-prop-copy');
		copy.addEventListener('click', function() {
			this.copyValue(value);
		}.bind(this));
		return copy;
	},

	renderItem(item, renderTo) {
		let tr = this.createEl('tr.ns-column-info-prop-row');
		tr.appendChild(this.createEl('th.nsci-prop-name', item.caption));
		tr.appendChild(this.createEl('td.nsci-prop-value', item.value));
		let copyTd = this.createEl('td');
		copyTd.appendChild(this.createCopyValueBtn(item.value));
		tr.appendChild(copyTd);
		renderTo.appendChild(tr);
	},

	async copyValue(value) {
		await navigator.clipboard.writeText(value);
	}
}

ColumnInfoManager.init();