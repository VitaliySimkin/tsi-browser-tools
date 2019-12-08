/**
 * Выполняет запрос в SysSchema, чтобы получить Id,
 * UId и Name всех незамещающих схем в конфигурации.
 */
async function getData() {
	/** Get request body */
	function getRequestBody() {
		return {
			'rootSchemaName': 'SysSchema',
			'operationType': 0,
			'filters': {
				'items': {
					'ExtendParentFilter': {
						'filterType': 1,
						'comparisonType': 3,
						'isEnabled': true,
						'trimDateTimeParameterToDate': false,
						'leftExpression': {
							'expressionType': 0,
							'columnPath': 'ExtendParent'
						},
						'rightExpression': {
							'expressionType': 2,
							'parameter': {
								'dataValueType': 1,
								'value': false
							}
						}
					}
				},
				'logicalOperation': 0,
				'isEnabled': true,
				'filterType': 6
			},
			'columns': {
				'items': {
					'Id': {
						'caption': '',
						'orderDirection': 0,
						'orderPosition': -1,
						'isVisible': true,
						'expression': {
							'expressionType': 0,
							'columnPath': 'Id'
						}
					},
					'UId': {
						'caption': '',
						'orderDirection': 0,
						'orderPosition': -1,
						'isVisible': true,
						'expression': {
							'expressionType': 0,
							'columnPath': 'UId'
						}
					},
					'Name': {
						'caption': '',
						'orderDirection': 0,
						'orderPosition': -1,
						'isVisible': true,
						'expression': {
							'expressionType': 0,
							'columnPath': 'Name'
						}
					}
				}
			},
			'isDistinct': false,
			'rowCount': -1,
			'rowsOffset': -1,
			'isPageable': false,
			'allColumns': false,
			'useLocalization': true,
			'useRecordDeactivation': false,
			'serverESQCacheParameters': {
				'cacheLevel': 0,
				'cacheGroup': '',
				'cacheItemName': ''
			},
			'queryOptimize': false,
			'useMetrics': false,
			'querySource': 0,
			'ignoreDisplayValues': false,
			'isHierarchical': false
		};
	}

	/** Get request params
	 * @param {Object} body body
	 */
	function getRequestParams(body) {
		const coockie = (document.cookie.match(new RegExp('(^| )BPMCSRF=([^;]+)')) || [])[2];
		if (typeof body !== 'string') {
			body = JSON.stringify(body);
		}
		return {
			'method': 'POST',
			'headers': {
				'Content-Type': 'application/json',
				'BPMCSRF': coockie,
				'Timestamp': new Date().toISOString(),
				'X-Request-Source': 'ajax-provider'
			},
			body
		};
	}

	const body = getRequestBody();
	const requestParams = getRequestParams(body);
	let currentHref = window.location.href.toString();
	let confHref = currentHref.replace(/(?<=\/0\/).*/, "");
	const serviceUrl = confHref + "DataService/json/SyncReply/SelectQuery";
	let response = await(await fetch(serviceUrl, requestParams)).json();
	return response && response.rows || [];
}

let _data = null;
/** Get schema names */
async function getSchemaNames() {
	return _data = _data || await getData();
}

export default getSchemaNames;
