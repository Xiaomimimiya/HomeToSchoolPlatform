const app = getApp();
Page({
    // 页面的初始数据
    data: {
        isShowUserName: false,
        userInfo: null
    },
    onShow() {
        let user = wx.getStorageSync('user')
        if (user && user.username) {
            this.setData({
                isShowUserName: true,
                userInfo: user
            })
        } else {
            this.setData({
                isShowUserName: false,
            })
        }

    },
    tuichu() {
        wx.setStorageSync('user', null)
        let user = wx.getStorageSync('user')
        if (user && user.username) {
            this.setData({
                isShowUserName: true,
                userInfo: user
            })
        } else {
            this.setData({
                isShowUserName: false
            })
        }
    },
    goDetail(event) {
        // 获取传入的值
        let pageitem = event.currentTarget.dataset.item
        let page = "/pages/" + pageitem + "/index"
        wx.navigateTo({
            url: page
        })
    },
    signToday() {
        let that = this
        let db = wx.cloud.database()
        db.collection('signData')
            .where({
                user_id: that.data.userInfo._id,
                time: new Date().toLocaleDateString()
            }).get({
                success(res) {
                    if (res.data.length > 0) {
                        wx.showToast({
                            icon: "none",
                            title: '您今天已签到',
                        })
                    } else {
                        db.collection('signData').add({
                            data: {
                                user_id: that.data.userInfo._id,
                                time: new Date().toLocaleDateString(),
                                username: that.data.userInfo.username
                            },
                            success(){
                                let id = that.data.userInfo._id
                                db.collection("userInfo")
                                .doc(id)
                                .update({
                                    data: {
                                        money: db.command.inc(1),
                                    },
                                    success(res) {
                                        that.onShow()
                                    }
                                })
                            }
                        })
                        that.onShow()
                        wx.showToast({
                            icon: "success",
                            title: '签到成功',
                        })
                    }
                }
            })
    },
    onUnload: function () {
        let that = this
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 1]
        if (prevPage.route === 'pages/sendLog/index' || prevPage.route === 'pages/collect/index') {
            that.onShow()
        }
    },
})