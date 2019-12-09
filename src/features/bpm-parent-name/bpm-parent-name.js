import getSchemaNames from "../../modules/sys-schema-request/sys-schema-request.js";

getSchemaNames().then((schemaNames) => {
	let baseLoadData = Terrasoft.ComboBox.prototype.loadData;
	Terrasoft.ComboBox.prototype.loadData = function(data) {
		if (this.columnName === "ParentSchemaUId") {
			data.forEach(item => {
				const schema = schemaNames.find(r => r.UId === item[0]);
				item[1] = schema ? `${schema.Name} (${item[1]})` : item[1];
			});
		}
		baseLoadData.apply(this, arguments);
	};
});
