// pages/collect/index.js
Page({


    data: {
        collectData: "",
        userInfo: ""
    },


    onLoad(options) {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
    },


    onShow() {
        this.getCollectData()
    },

    getCollectData() {
        let that = this
        let db = wx.cloud.database()
        let userId = that.data.userInfo._id
        db.collection('collect')
            .where({
                user_id: userId
            })
            .orderBy("time", "desc")
            .get({
                success(res) {

                    that.setData({
                        collectData: res.data,
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    cancleCollect(e) {
        let that = this
        let db = wx.cloud.database()
        let id = e.currentTarget.dataset.id
        wx.showModal({
            title: '取消收藏',
            content: '您确定要取消收藏吗',
            complete: (res) => {
                if (res.cancel) {
                    wx.showToast({
                        icon: "error",
                        title: '您点击了取消',
                    })
                }

                if (res.confirm) {
                    db.collection("collect").where({
                        _id: id
                    }).remove({
                        success: res => {
                            wx.showToast({
                                icon: "success",
                                title: '取消成功',
                            })
                            that.onShow()
                        },
                        fail: err => {
                            console.error(err)
                        }
                    })
                }
            }
        })
    },

    onBtnClick(e) {
        // 获取按钮上的 data-id 和 data-type 值
        let id = e.currentTarget.dataset.id;
    
        wx.navigateTo({
            url: '/pages/newDetail/index?id=' + id,
        })
    }


})