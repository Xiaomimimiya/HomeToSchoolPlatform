// pages/chatDetail/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detail_id: "",
        userInfo: "",
        userDetail: ""
    },


    onLoad(options) {
        this.setData({
            detail_id: options.id
        })
    },
    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
        this.getDetail()

    },
    getDetail() {
        let that = this
        let db = wx.cloud.database()
        db.collection('userInfo')
            .doc(that.data.detail_id)
            .get({
                success(res) {
                    that.setData({
                        userDetail: res.data
                    })
                    console.log(res.data.username);
                    wx.setNavigationBarTitle({
                        title: res.data.username
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
      // 去聊天界面
      startChat(e) {

        let recever_info = e.currentTarget.dataset.item
        console.log(recever_info);
        let that = this
        let db = wx.cloud.database()

        // 无法与自己联系

        if (recever_info._id == that.data.userInfo._id) {
            wx.showToast({
                icon: "error",
                title: '无法与自己联系',
            })
            return
        }

        // 判断是否有聊天记录
        const DB = wx.cloud.database().command;
        db.collection("chatlist")
            .where(
                DB.or([{

                        send_user_id: that.data.userInfo._id,

                        recever_user_id: recever_info._id
                    },
                    {
                        send_user_id: recever_info.send_id,
                        recever_user_id: that.data.userInfo._id
                    }
                ])
            )
            .get({
                success(res) {
                    console.log(res);
                    if (res.data.length > 0) {
                        let id = res.data[0]._id
                        wx.navigateTo({
                            url: '/pages/messageDetail/index?id=' + id
                        })
                    } else {

                        db.collection('chatlist').add({
                            data: {
                                send_user_name: that.data.userInfo.username,
                                send_user_id: that.data.userInfo._id,
                                send_user_avatar: that.data.userInfo.useravatar,

                                recever_user_name: recever_info.username,
                                recever_user_id: recever_info._id,
                                recever_user_avatar: recever_info.useravatar,

                                message: [
                                    {
                                        send_user_id: that.data.userInfo._id,
                                        content: "您好",
                                        time: new Date().getTime()
                                    }
                                ],
                                _createTime: new Date().getTime()
                            }
                        }).then(res => {
                            db.collection('chatlist')
                                .where(
                                    DB.or([{
                                            send_user_id: that.data.userInfo._id,
                                            recever_user_id: recever_info._id
                                        },
                                        {
                                            send_user_id: recever_info.send_id,
                                            recever_user_id: that.data.userInfo._id
                                        }
                                    ])
                                )
                                .get({
                                    success(res) {
                                        let id = res.data[0]._id
                                        wx.navigateTo({
                                            url: '/pages/messageDetail/index?id=' + id
                                        })
                                    }
                                })

                        })

                    }
                }
            })
    },

})