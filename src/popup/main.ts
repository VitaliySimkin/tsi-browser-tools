import Vue from 'vue';
import App from './components/app.vue';
import store from './script/store';

Vue.config.productionTip = false;

new Vue({
	store,
	render: (h) => h(App),
	mounted() {
		this.$store.commit('initSettingsValue');
	},
}).$mount('#app');
