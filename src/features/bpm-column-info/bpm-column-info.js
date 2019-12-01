(function() {
try {
	/**
	 * @typedef TsiColumnInfoConfig
	 * @property {string} bindTo value bind
	 * @property {Object} model model
	 */
	
	const TsiColumnInfo = {
		props: [
			{name: "caption", caption: "caption"},
			{name: "columnPath", caption: "columnPath"},
			{name: "dataValueType", caption: "DataType", propOf: "DataValueType"},
			{name: "referenceSchemaName", caption: "referenceSchema"},
			{name: "type", caption: "Type", propOf: "ViewModelColumnType"},
			{name: "uId", caption: "UID"},
			{name: "name", caption: "pageName", isModelProp: true}
		],

		init() {
			this.extendTerrasoftBaseEdit();
			this.container = this.createContainer();
		},

		render(config, renderTo) {
			let items = this.getItems(config);
			let cnt = document.createElement("div");
			cnt.className = "column-info-cnt";
			items.forEach(item => this.renderItem(item, cnt), this);
			renderTo.innerHTML = "";
			renderTo.appendChild(cnt);
		},

		renderItem(item, renderTo) {
			let cnt = document.createElement("div");
			cnt.className = "column-info-item";

			let name = document.createElement("span");
			name.className = "column-info-prop-name";
			name.innerText = String(item.caption);
			cnt.appendChild(name);

			let value = document.createElement("span");
			value.className = "column-info-prop-value";
			value.innerText = String(item.value);
			cnt.appendChild(value);


			let copy = document.createElement("span");
			copy.className = "conlumn-info-prop-copy";
			copy.addEventListener("click", function() {
				TsiColumnInfo.copyValue(item.value);
			});
			cnt.appendChild(copy);

			renderTo.appendChild(cnt);
		},

		generateHtml(config) {
			let items = this.getItems(config);
			let itemsHtml = items.map(item => this.generateItemHtml(item));
			return `<div class="column-info-cnt">${itemsHtml.join("")}</div>`
		},
		generateItemHtml(item) {
			return `<div class="column-info-item">
				<span class="column-info-prop-name">${item.caption}</span>
				<span class="column-info-prop-value">${item.value}</span>
				<span class=""></span>
			</div>`;
		},
		/** getItems
		 * @param {TsiColumnInfoConfig} config конфиг */
		getItems(config) {
			let items = [];
			let _value = config.model && config.model.get(config.bindTo);
			let value = (_value && _value.value) ? _value.value : _value;
			items.push({
				caption: "value",
				value: value
			});
			if (typeof _value === "object") {
				items.push({
					caption: "displayValue",
					value: _value.displayValue
				});
			}
			let column = config.model.columns[config.bindTo];
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

		// #region Terrasoft.BaseEdit override
		extendTerrasoftBaseEdit() {
			let scope = this;
			let initDomEvents = Terrasoft.BaseEdit.prototype.initDomEvents;
			Terrasoft.BaseEdit.prototype.initDomEvents = function() {
				scope.appendColumnInfo.call(scope, this);
				initDomEvents.apply(this, arguments);
			};
		},

		appendColumnInfo(context) {
			let wrapEl = context.getWrapEl()
			wrapEl.on("click", function(event) {
				this.onEditWrapElClick(context, event);
			}, this);
		},
	
		onEditWrapElClick(context, event) {
			if (!event.altKey) {
				return;
			}
			event.stopEvent();
			let config = {model: context.model, bindTo: context.bindings.value.modelItem};
			TsiColumnInfo.render(config, this.container);
			this.container.style.display = "block";
			this.handleDocumentClick();
		},

		createContainer() {
			var container = document.createElement("div");
			container.className = "column-info-box-cnt";
			container.id = "tsi-column-info-box-cnt";
			container.style.display = "none";
			document.body.appendChild(container);
			return container;
		},

		handleDocumentClick() {
			let onClick = function() {
				let clickedInsidePage = !!(event.target.closest("#tsi-column-info-box-cnt"));
				if (clickedInsidePage) {
					return;
				}
				document.removeEventListener("click", onClick);
				TsiColumnInfo.container.style.display = "none";
			};
			document.addEventListener("click", onClick);
		},

		async copyValue(value) {
			await navigator.clipboard.writeText(value);
		}
	};

	TsiColumnInfo.init();
	TsiColumnInfo.b();
} catch (err) {}
})();