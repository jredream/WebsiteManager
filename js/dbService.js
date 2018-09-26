// 数据库工具类

const db = new Dexie('MyWebSiteDB');
db.version(1)
  .stores({ ws_group: "++id, title, listType" })
  .stores({ ws_list: "++id, title, url, groupId" });

db.version(2)
  .stores({ ws_group: "++id, title, listType, orderNum" })
  .upgrade(trans => {
    return trans.ws_group.toCollection().modify(group => {
      group.orderNum = 0;
    });
  });

db.version(2)
  .stores({ ws_list: "++id, title, url, groupId, orderNum" })
  .upgrade(trans => {
    return trans.ws_list.toCollection().modify(item => {
      item.orderNum = 0;
    });
  });
  

DBService = {
  // 初始化数据库
  initDB: function() {
    
  },

  // 网站分组管理
  createGroup: function(record) {
    return db.ws_group
      .add({ title: record.title, listType: record.listType, orderNum: new Date().getTime() });
  },
  updateGroup: function(record) {
    return db.ws_group
      .update(record.id, { title: record.title, listType: record.listType })      
      .then(updated => {
        console.log("updateGroup success=" + updated);
      });
  },
  deleteGroup: function(record) {
    return db.ws_group.delete(record.id).then(updated => {
      console.log("deleteGroup id=" + record.id + "; success=" + updated);
    });
  },
  findAllGroup() {
    return db.ws_group.orderBy('orderNum').toArray();
  },

  // 网站地址列表
  createWebSite: function(record) {
    return db.ws_list.add({
      title: record.title,
      url: record.url,
      groupId: record.groupId,
      orderNum: new Date().getTime()
    }).then(updated => {
      console.log("createWebSite success=" + updated);
      return updated;
    });
  },
  updateWebsite: function(record) {
    return db.ws_list
      .update(record.id, {
        title: record.title,
        url: record.url,
        groupId: record.groupId
      }).then(updated => {
        console.log("updateWebSite success=" + updated);
      });
  },
  deleteWebsite: function(record) {
    let id = record.id;
    return db.ws_list.delete(id).then(updated => {
      console.log("deleteWebSite id=" + id + "; success=" + updated);
    });
  },
  findGroupItemList(groupId) {
    return db.ws_list
      .orderBy("orderNum")
      .filter(function (website) {
        return website.groupId == groupId;
      })
      .toArray();
  },
  findWebsiteList() {
    return db.ws_list.orderBy("orderNum").toArray();
  },

  // 排序
  sortGroup(groupList) {
    for (let index = 0; index < groupList.length; index++) {
      const group = groupList[index];
      db.ws_group.update(group.id, { orderNum: index }).then(updated => {
        console.log("updateGroup success=" + updated);
      }); 
    } 
  },
  sortWebsite(websiteList) {
    for (let index = 0; index < websiteList.length; index++) {
      const wensite = websiteList[index];
      db.ws_list
        .update(wensite.id, { orderNum: index })
        .then(updated => {
          console.log("updateGroup success=" + updated);
        });
    }
  }

};