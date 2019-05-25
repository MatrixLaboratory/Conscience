import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'

import EditorIndex from '../page/EditorIndex'

Vue.use(Router);
Vue.use(ElementUI);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'EditorIndex',
      component: EditorIndex
    }
  ]
})
