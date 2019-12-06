/**
 * Выполняет запрос в SysSchema, чтобы получить Id,
 * UId и Name всех незамещающих схем в конфигурации.
 */
function getData() {
	/** Get request body */
	function getRequestBody() {
		return {
			"rootSchemaName": "SysSchema",
			"operationType": 0,
			"filters": {
				"items": {
					"ExtendParentFilter": {
						"filterType": 1,
						"comparisonType": 3,
						"isEnabled": true,
						"trimDateTimeParameterToDate": false,
						"leftExpression": {
							"expressionType": 0,
							"columnPath": "ExtendParent"
						},
						"rightExpression": {
							"expressionType": 2,
							"parameter": {
								"dataValueType": 1,
								"value": false
							}
						}
					}
				},
				"logicalOperation": 0,
				"isEnabled": true,
				"filterType": 6
			},
			"columns": {
				"items": {
					"Id": {
						"caption": "",
						"orderDirection": 0,
						"orderPosition": -1,
						"isVisible": true,
						"expression": {
							"expressionType": 0,
							"columnPath": "Id"
						}
					},
					"UId": {
						"caption": "",
						"orderDirection": 0,
						"orderPosition": -1,
						"isVisible": true,
						"expression": {
							"expressionType": 0,
							"columnPath": "UId"
						}
					},
					"Name": {
						"caption": "",
						"orderDirection": 0,
						"orderPosition": -1,
						"isVisible": true,
						"expression": {
							"expressionType": 0,
							"columnPath": "Name"
						}
					}
				}
			},
			"isDistinct": false,
			"rowCount": -1,
			"rowsOffset": -1,
			"isPageable": false,
			"allColumns": false,
			"useLocalization": true,
			"useRecordDeactivation": false,
			"serverESQCacheParameters": {
				"cacheLevel": 0,
				"cacheGroup": "",
				"cacheItemName": ""
			},
			"queryOptimize": false,
			"useMetrics": false,
			"querySource": 0,
			"ignoreDisplayValues": false,
			"isHierarchical": false
		};
	}

	/** Get request params
	 * @param {Object} body body
	 */
	function getRequestParams(body) {
		const coockie = (document.cookie.match(new RegExp("(^| )BPMCSRF=([^;]+)")) || [])[2];
		if (typeof body !== "string") {
			body = JSON.stringify(body);
		}
		return {
			"method": "POST",
			"headers": {
				"Content-Type": "application/json",
				"BPMCSRF": coockie,
				"Timestamp": new Date().toISOString(),
				"X-Request-Source": "ajax-provider"
			},
			body
		};
	}

	const body = getRequestBody();
	const requestParams = getRequestParams(body);
	const requestChecker = r => r.ok ? r.json() : Promise.resolve(null);
	return Promise.all([
		fetch("./DataService/json/SyncReply/SelectQuery", requestParams).then(requestChecker),
		fetch("../DataService/json/SyncReply/SelectQuery", requestParams).then(requestChecker)
	]).then(r => {
		const result = r.find(Boolean);
		return result && result.rows || [];
	});
}

let _data = null;
/** Get schema names */
function getSchemaNames() {
	if (!_data) {
		_data = getData();
	}
	return _data;
}

export default getSchemaNames;