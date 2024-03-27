// pages/messagePage/index.js
Page({
    data: {
        userInfo: "",
        send_chatdata: "",
        recever_chatdata: "",
        newsData: "",
    },

    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
        this.getChatList()
        this.getNewsData()
    },
    getChatList() {
        let that = this;
        let db = wx.cloud.database();
        let user_id = that.data.userInfo._id;
      
        db.collection("chatlist").where({
          send_user_id: user_id
        }).get({
          success(res) {
            let chatList = res.data;
      
            chatList.forEach(chat => {
              let messages = chat.message;
              // 根据 time 属性进行排序
              let sorted = messages.sort((a, b) => {
                return new Date(a.time) - new Date(b.time);
              });
              chat.message = sorted;
            });
      
            // 根据最新一条消息的 time 属性进行排序
            let sortedChatList = chatList.sort((a, b) => {
              let aLastMessageTime = a.message.length > 0 ? new Date(a.message[a.message.length - 1].time) : new Date(0);
              let bLastMessageTime = b.message.length > 0 ? new Date(b.message[b.message.length - 1].time) : new Date(0);
              return bLastMessageTime - aLastMessageTime;
            });
      
            // 更新排序后的消息列表
            that.setData({
              send_chatdata: sortedChatList
            });
          },
          fail(err) {
            console.log(err);
          },
        });
      
        db.collection("chatlist").where({
          recever_user_id: user_id
        }).get({
          success(res) {
            let chatList = res.data;
      
            chatList.forEach(chat => {
              let messages = chat.message;
              // 根据 time 属性进行排序
              let sorted = messages.sort((a, b) => {
                return new Date(a.time) - new Date(b.time);
              });
              chat.message = sorted;
            });
      
            // 根据最新一条消息的 time 属性进行排序
            let sortedChatList = chatList.sort((a, b) => {
              let aLastMessageTime = a.message.length > 0 ? new Date(a.message[a.message.length - 1].time) : new Date(0);
              let bLastMessageTime = b.message.length > 0 ? new Date(b.message[b.message.length - 1].time) : new Date(0);
              return bLastMessageTime - aLastMessageTime;
            });
      
            // 更新排序后的消息列表
            that.setData({
              recever_chatdata: sortedChatList
            });
          },
          fail(err) {
            console.log(err);
          },
        });
      },

    goDetail(e) {
        let id = e.currentTarget.dataset.item
        wx.navigateTo({
            url: '/pages/messageDetail/index?id=' + id,
        })
    },
    getNewsData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('newsData')
            .where({
                type: "系统通知"
            })
            .orderBy("_createTime", "desc")
            .get({
                success(res) {
                    that.setData({
                        newsData: res.data[0]
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    goPage() {
        wx.navigateTo({
            url: '/pages/notice/index',
        })
    }

})