export function configRouter (router) {
  router.map({
    '/login': {
      name: 'login',
      title: '��¼',
      // es6��ͷ����
      component: (resolve) => require(['./components/login/login.vue'], resolve)
    }
  })

}