MyGroup = Vue.component("my-group", {
  template: `
    <div style="min-height:360px;">      
      <div style="margin: 5px auto 5px;padding-left:10px;">
        <van-button size="small" @click="showContentDialog=true">添加网址</van-button>
        <van-button size="small" @click="showGroupDialog=true">添加分组</van-button>
      </div>

      <van-tabs v-model="active">
        <van-tab title="列表数据">
          <van-cell-group >
           <draggable :list="websiteList" @sort="sortWebsite"> 
              <van-cell v-for="(item, index) in websiteList" :key="item.id">
                <template slot="title">
                  <span class="van-cell-text">{{item.title}}</span>
                  <van-tag v-if="item.groupId" mark :style="randomRgb(item.groupId)">{{getTag(item.groupId)}}</van-tag>
                </template>
                <van-button size="small" plain type="small" @click="updateWebsite(item, item.id)">修改</van-button>
                <van-button size="small" plain type="danger" @click="deleteWebsite(item, item.id)">删除</van-button>
              </van-cell>
            </draggable>
          </van-cell-group>
        </van-tab>

        <van-tab title="分组管理">
          <van-cell-group >
            <draggable :list="groupList" @sort="sortGroup">
              <van-cell v-for="(item, index) in groupList" :key="index">
                <template slot="title">
                  <span class="van-cell-text">{{item.title}}</span>
                </template>
                <van-button size="small" plain type="small" @click="updateGroup(item)">修改</van-button>
                <van-button size="small" plain type="danger" @click="deleteGroup(item)">删除</van-button>
              </van-cell>
            </draggable>
          </van-cell-group>
        </van-tab>
      </van-tabs>    

      <van-dialog
        v-model="showGroupDialog"
        show-cancel-button
        :before-close="beforeCloseGroup"
      >
        <van-field
          style="display:none"
          v-model="groupContent.id"
          label="id"
          placeholder="id"
        />
        <van-field
          v-model="groupContent.title"
          label="标题"
          placeholder="请输入网址标题"
        />
        <div class="van-cell van-hairline van-field">
          <div class="van-cell__title">
            <span>内容样式</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <van-radio-group v-model="groupContent.listType">
                <van-radio name="list">列表显示</van-radio>
                <van-radio name="button">标签显示</van-radio>
              </van-radio-group>
          </div>
        </div>       
      </van-dialog>

      <van-dialog
        v-model="showContentDialog"
        show-cancel-button
        :before-close="beforeCloseWebsite"
      >
        <van-field
          style="display:none"
          v-model="websiteContent.id"
          label="id"
          placeholder="id"
        />
        <van-field
          v-model="websiteContent.title"
          label="标题"
          placeholder="请输入网址标题"
        />
        <van-field
          v-model="websiteContent.url"
          label="URL"
          placeholder="请输入网址URL"
        />      
        <div class="van-cell van-hairline van-field">
          <div class="van-cell__title">
            <span>所属分组</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <van-radio-group v-model="websiteContent.groupId" style="text-align:left;">
                <van-radio v-for="(group, index) in groupList" :key="index" :name="group.id">
                  {{group.title}}
                </van-radio>
              </van-radio-group>
          </div>
        </div>  
      </van-dialog>
    </div>
  `,
  data: function() {
    return {
      active: 0,
      title: "分组管理",
      showGroupDialog: false,
      showContentDialog: false,
      groupContent: { title: "", listType: "list", id: null },
      websiteContent: { title: "", url: "", groupId: null, id: null },
      groupList: [],
      updateGroupId: null,
      websiteList: [],
      updateWebsiteId: null,
      groupBgColor: []
    };
  },
  mounted() {
    this.loadGroupList();
    console.log("===========");
    this.loadWebsiteList();
  },
  methods: {
    beforeCloseGroup(action, done) {
      if (action === "confirm") {
        var _this = this;
        if (this.updateGroupId) {
          DBService.updateGroup(_this.groupContent).then(() => {
            _this.loadGroupList();
            done();
          });
        } else {
          DBService.createGroup(_this.groupContent).then(() => {
            _this.loadGroupList();
            done();
          });
        }
      } else {
        done();
      }
      this.updateGroupId = false;
    },
    beforeCloseWebsite(action, done) {
      if (action === "confirm") {
        var _this = this;
        if (_this.updateWebsiteId) {
          DBService.updateWebsite(_this.websiteContent).then(() => {
            _this.loadWebsiteList();
            done();
          });
        } else {
          DBService.createWebSite(_this.websiteContent).then(() => {
            _this.loadWebsiteList();
            done();
          });
        }
      } else {
        done();
      }
      this.updateWebsiteId = false;
    },
    loadGroupList() {
      var _this = this;
      DBService.findAllGroup().then(list => {
        if (list && list.length > 0) {
          _this.groupContent.groupId = list[0].id;
        }
        _this.groupList = list;
        console.log(_this.groupList);
      });
    },
    loadWebsiteList() {
      var _this = this;
      DBService.findWebsiteList().then(list => {
        _this.websiteList = list;
        console.log(_this.websiteList);
      });
    },
    updateGroup(group) {
      this.updateGroupId = group.id;
      this.groupContent = group;
      console.log(group);
      this.showGroupDialog = true;
    },
    deleteGroup(group) {
      var _this = this;
      this.$dialog
        .confirm({
          title: "确定要删除吗？",
          message: "删除后将无法恢复：" + group.title
        })
        .then(() => {
          DBService.deleteGroup(group).then(() => {
            _this.loadGroupList();
          });
        })
        .catch(ex => {
          console.log(ex);
        });
    },
    updateWebsite(website, id) {
      website.id = id;
      console.log(website);
      this.updateWebsiteId = id;
      this.websiteContent = website;
      this.showContentDialog = true;
    },
    deleteWebsite(website, id) {
      website.id = id;
      console.log(website);
      var _this = this;
      this.$dialog
        .confirm({
          title: "确定要删除吗？",
          message: "删除后将无法恢复：" + website.title
        })
        .then(() => {
          DBService.deleteWebsite(website).then(() => {
            _this.loadWebsiteList();
          });
        })
        .catch(ex => {
          console.log(ex);
        });
    },
    getTag(groupId) {
      for (var i = 0; i < this.groupList.length; i++) {
        const group = this.groupList[i];
        if (group.id == groupId) {
          return group.title;
        }
      }
      return groupId;
    },
    goto(path) {
      this.$router.push({ path: path });
    },
    sortGroup() {
      DBService.sortGroup(this.groupList);
    },
    sortWebsite() {
      DBService.sortWebsite(this.websiteList);
    },
    randomRgb: function(groupId) {
      // var R = Math.floor(Math.random() * 255);
      // var G = Math.floor(Math.random() * 255);
      // var B = Math.floor(Math.random() * 255);
      // return { background: "rgb(" + R + "," + G + "," + B + ")" };
      let bgColor = this.groupBgColor[groupId];
      if (bgColor) {
        return bgColor;
      }
      bgColor = this.getColor_rgba(1, 1, 1, 0.5);
      console.log(bgColor);
      bgColor = { background: bgColor };
      this.groupBgColor[groupId] = bgColor;
      return bgColor;
    },
    /**
     * getColor_rgba(1, 0, 0, 0.8)  颜色为红色类别的随机颜色，不透明度0.8
     * getColor_rgba(1, 0, 1,1)  颜色为紫色类别的随机颜色，不透明度1 。
     * getColor_rgba(1, 1, 1,0.5)  颜色为全部类别的随机颜色（全彩），不透明度0.5
     * getColor_rgba(0, 0, 0,1)  颜色为黑白颜色类别的随机颜色（黑白灰），不透明度1 。
     */
    getColor_rgba: function(r, g, b, a) {
      //输出rgba颜色格式
      var rgb = 155;
      var c = Math.floor(Math.random() * (255 - rgb) + rgb);
      if (r * g * b == 1) {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        b = Math.floor(Math.random() * 255);
      } else if (r + g + b == 0) {
        var t = Math.floor(Math.random() * 255);
        r = t;
        g = t;
        b = t;
      } else {
        r =
          r == 1
            ? Math.floor(Math.random() * (255 - rgb) + rgb)
            : Math.floor(Math.random() * (c / 2));
        g =
          g == 1
            ? Math.floor(Math.random() * (255 - rgb) + rgb)
            : Math.floor(Math.random() * (c / 2));
        b =
          b == 1
            ? Math.floor(Math.random() * (255 - rgb) + rgb)
            : Math.floor(Math.random() * (c / 2));
      }
      return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }
  },
  watch: {
    showGroupDialog: function(nValue) {
      if (nValue) {
        this.loadGroupList();
      }
    },
    showContentDialog: function(n, o) {
      if (n) {
        this.loadWebsiteList();
      }
    }
  }
});
