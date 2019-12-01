(function() {
	/** fsd */
	function replace() {
		let baseLoadData = Terrasoft.ComboBox.prototype.loadData;
		Terrasoft.ComboBox.prototype.loadData = function(data) {
			if (this.columnName === "ParentSchemaUId") {
				data.forEach(item => item[1] = window.simkData.find(r => r.UId === item[0]).Name || item[1]);
			}
			baseLoadData.apply(this, arguments);
		};
	}


	let getCoockie = (name) => {
		var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match && match[2];
	};

	let request = `{"rootSchemaName":"SysSchema","operationType":0,"filters":{"items":{"ExtendParentFilter":{"filterType":1,"comparisonType":3,"isEnabled":true,"trimDateTimeParameterToDate":false,"leftExpression":{"expressionType":0,"columnPath":"ExtendParent"},"rightExpression":{"expressionType":2,"parameter":{"dataValueType":1,"value":false}}}},"logicalOperation":0,"isEnabled":true,"filterType":6},"columns":{"items":{"Id":{"caption":"","orderDirection":0,"orderPosition":-1,"isVisible":true,"expression":{"expressionType":0,"columnPath":"Id"}},"UId":{"caption":"","orderDirection":0,"orderPosition":-1,"isVisible":true,"expression":{"expressionType":0,"columnPath":"UId"}},"Name":{"caption":"","orderDirection":0,"orderPosition":-1,"isVisible":true,"expression":{"expressionType":0,"columnPath":"Name"}}}},"isDistinct":false,"rowCount":-1,"rowsOffset":-1,"isPageable":false,"allColumns":false,"useLocalization":true,"useRecordDeactivation":false,"serverESQCacheParameters":{"cacheLevel":0,"cacheGroup":"","cacheItemName":""},"queryOptimize":false,"useMetrics":false,"querySource":0,"ignoreDisplayValues":false,"isHierarchical":false}${""}`;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "../DataService/json/SyncReply/SelectQuery", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("BPMCSRF", getCoockie("BPMCSRF"));
	xhr.setRequestHeader("Timestamp", new Date(Date.now()).toISOString());
	xhr.setRequestHeader("X-Request-Source", "ajax-provider");
	xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	xhr.onreadystatechange = function(params) {
		if (this.readyState === 4) {
			var statusCode = params.status;
			try {
				let resp = JSON.parse(this.responseText);
				let rows = resp.rows;
				window.simkData = rows;
				replace();
			} catch (err) {
				console.warn(err);
			}
		}
	};
	xhr.send(request);
})();