import getSchemaNames from "../../modules/sys-schema-request/sys-schema-request.js";

getSchemaNames().then((schemaNames) => {
	let baseLoadData = Terrasoft.ComboBox.prototype.loadData;
	Terrasoft.ComboBox.prototype.loadData = function(data) {
		if (this.columnName === "ParentSchemaUId") {
			data.forEach(item => item[1] = schemaNames.find(r => r.UId === item[0]).Name || item[1]);
		}
		baseLoadData.apply(this, arguments);
	};
});
