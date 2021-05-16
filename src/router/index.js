import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  {
    path: '/',
    // 下面的children中要有/demo才能跳转成功，否则404
    // 路由表从前往后匹配，命中截止
    redirect: '/demo',
    component: () => import('@/views/demo/index'),
    children: [{
      path: 'demo',
      component: () => import('@/views/demo/index')
    }],
    hidden: true
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/project',
    component: Layout,
    children: [{
      path: '',
      name: 'Dashboard',
      component: () => import('@/views/project/index'),
      meta: { title: 'Project', icon: 'oss' }
    }]
  },

  {
    path: '/version',
    component: Layout,
    children: [{
      path: '',
      // 父级路由不能有name。因为不会主动渲染子级路由，所以跳子级的name就可以。
      name: 'Version',
      component: () => import('@/views/version/index'),
      meta: { title: 'Version', icon: 'version' }
    }]
  },

  {
    path: '/visualize',
    component: Layout,
    redirect: '/visualize/table',
    name: 'CQVisualize',
    meta: { title: 'CQ可视化', icon: 'eye-open' },
    children: [
      {
        path: 'treemap',
        name: 'Treemap',
        component: () => import('@/views/treemap/index'),
        meta: { title: 'Treemap', icon: 'treemap' }
      },
      {
        path: 'linechart',
        name: 'Linechart',
        component: () => import('@/views/linechart/index'),
        meta: { title: 'Linechart', icon: 'linechart' }
      }
    ]
  },

  {
    path: '/addproject',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Addproject',
        component: () => import('@/views/form/index'),
        meta: { title: '添加项目', icon: 'form' }
      }
    ]
  },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/mqlabc/',
        meta: { title: 'My Github', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // 后端支持可开
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
