import Vue from 'vue';
import App from './App.vue';
import router from './router';
import request from './utils/request'; // 确保路径正确
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

// 挂载axios实例到Vue原型
Vue.prototype.$request = request;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
