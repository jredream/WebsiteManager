MyContent = Vue.component("my-content", {
  template: `
    <div>
        <van-tabs v-model="active">

          <van-tab :title="group.title" v-for="(group,index) in groupList" :key="index">  
          
            <van-button v-if="group.listType == 'button'" size="small" style="margin:10px;" 
              v-for="(item,index) in group.itemList" :key="index" @click="openWin(item)">
              {{item.title}}
            </van-button>

            <van-cell-group v-if="group.listType == 'list'">
              <van-cell v-for="(item,index) in group.itemList" :key="index" @click="openWin(item)">
                <a class="weui-cell weui-cell_access" href="javascript:;">
                  <div>
                    {{item.title}}
                  </div>
                </a>
              </van-cell>
            </van-cell-group>

          </van-tab>
        </van-tabs>          
      </div>
  `,
  data: function() {
    return {
      title: "内容管理",
      active: 0,     
      groupList: []
    };
  },
  created() {
    EventBus.$on("refreshList", () => {
      this.initList();
    });
  },
  mounted() {
    this.initList();
  },
  methods: {
    openWin: function(item) {
      chrome.tabs.create({ url: item.url });
    },
    initList() {
      var _this = this;
      DBService.findAllGroup().then(list => {
        _this.groupList = [];

        for (var i = 0; i < list.length; i++) {
          const group = list[i];
          DBService.findGroupItemList(group.id).then(itemList => {
            group.itemList = itemList;
            Vue.set(group, "itemList", itemList);
            _this.groupList.push(group)
          });
        }
      });
    }
  },
  computed: {
    getItemList(groupId) {
      var result = [];
      DBService.findGroupItemList(groupId, list => {
        result = list;
      });
      return result;
    }
  }
});