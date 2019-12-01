(function() {
	try {
		const customConfig = JSON.parse(window.localStorage.getItem("tsi-chrome-tools-bpm-package-sort-custom-config"));
		const sortPriority = eval(customConfig.sortPriority) || [
			(item = {IsChanged: false}) => item.IsChanged,
			(item = {IsContentChanged: false}) => item.IsContentChanged,
			(item = {Name: ""}) => item.Name === "TsiBase",
			(item = {Name: ""}) => item.Name.startsWith("TsiBase"),
			(item = {Name: ""}) => item.Name.startsWith("Tsi"),
			(item = {Name: ""}) => item.Name.startsWith("Ts"),
			(item = {Maintainer: ""}) => item.Maintainer !== "Terrasoft"
		];
		const itemSortPriority = item => (1 + sortPriority.findIndex(fn => fn(item))) || Number.MAX_SAFE_INTEGER;
		const baseOnLoad = Terrasoft.DataSource.prototype.onLoadResponse;
		Terrasoft.DataSource.prototype.onLoadResponse = function() {
			if (this.id === "SysPackageDataSource" && Array.isArray(arguments[0])) {
				arguments[0] = arguments[0].sort((itemA, itemB) => itemSortPriority(itemA) - itemSortPriority(itemB));
			}
			baseOnLoad.apply(this, arguments);
		};
		window.PackageTree.onRefreshPage(true)
	} catch (err) {
		console.error(err);
	}
})();
