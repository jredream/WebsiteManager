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
        title: "正式环境",
        listType: "list"
      }).then(id => {
        console.log("id=", id);
        let arr = [
          {
            title: "Boss后台",
            url: "https://admin.hh-medic.com/admin/index",
            groupId: id
          },
          {
            title: "家庭医生",
            url: "https://fadmin.hh-medic.com/dashboard",
            groupId: id
          },
          { title: "和缓天地", url: "http://bd.hh-medic.com", groupId: id }
        ];
        console.log(arr);
        for (var i = 0; i < arr.length; i++) {
          var record = arr[i];
          console.log(record);
          DBService.createWebSite(record);
        }
      });

      DBService.createGroup({
        title: "测试环境",
        listType: "list"
      }).then(id => {
        let arr = [
          {
            title: "Boss后台",
            url: "http://test.hh-medic.com/admin",
            groupId: id
          },
          {
            title: "家庭医生",
            url: "https://fadmin-test-temp.hh-medic.com/dashboard",
            groupId: id
          },
          { title: "和缓天地", url: "http://test.hh-medic.com/bd", groupId: id }
        ];
        for (var i = 0; i < arr.length; i++) {
          var record = arr[i];
          DBService.createWebSite(record);
        }
      });

      DBService.createGroup({
        title: "研发后台",
        listType: "button"
      }).then(id => {
        let arr = [
          { title: "CI", url: "https://ci.hh-medic.com/", groupId: id },
          { title: "Code", url: "https://code.hh-medic.com", groupId: id },
          { title: "API", url: "http://api.hh-medic.com", groupId: id },
          { title: "Log", url: "https://log.hh-medic.com", groupId: id },
          { title: "Docker", url: "http://docker.hh-medic.com", groupId: id }
        ];
        for (var i = 0; i < arr.length; i++) {
          var record = arr[i];
          DBService.createWebSite(record);
        }
        console.log(EventBus);
        console.log("refreshList - emit");
        EventBus.$emit("refreshList");
      });
    }
  },
  watch: {
    $route(to, from) {
      this.routePath = this.$route.path;
    }
  }
});