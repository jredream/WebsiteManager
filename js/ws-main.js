const routes = [
  { path: "/", component: MyContent },
  { path: "/group", component: MyGroup }
];
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
});

EventBus = new Vue();

var app = new Vue({
  el: "#app",
  router: router,
  data: {
    title: "常用网址管理工具",
    msg: "",
    groupList: [],
    routePath: "/"
  },
  mounted() {
    var _this = this;
    DBService.findAllGroup().then(list => {
      if (!list || list.length == 0) {
        _this.initData();
      }
    });
  },
  methods: {
    goto: function(path) {
      this.$router.push({ path: path });
    },
    initData() {
      // 初始化分组
      DBService.createGroup({
        title: "工具箱",
        listType: "list"
      }).then(id => {
        console.log("id=", id);
        let arr = [
          {
            title: "Google",
            url: "https://www.google.com",
            groupId: id
          },
          {
            title: "Baidu",
            url: "https://www.baidu.com",
            groupId: id
          }
        ];
        for (var i = 0; i < arr.length; i++) {
          var record = arr[i];
          console.log(record);
          DBService.createWebSite(record);
        }
      });     
      
    }
  },
  watch: {
    $route(to, from) {
      this.routePath = this.$route.path;
    }
  }
});
