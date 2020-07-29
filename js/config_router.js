export function configRouter (router) {
  router.map({
    '/login': {
      name: 'login',
      title: 'µÇÂ¼',
      // es6¼ýÍ·º¯Êý
      component: (resolve) => require(['./components/login/login.vue'], resolve)
    }
  })

}