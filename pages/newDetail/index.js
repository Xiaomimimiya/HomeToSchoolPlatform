// pages/newDetail/index.js
Page({

   
    data: {
        userInfo: "",
        isFavorited: false,
        detail_id:"",
        detail_data:"",
        content:""
    },

    onLoad(options) {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
        this.setData({  
            detail_id: options.id
        })
    },
    onShow() {
        this.getDetail()
        this.goCollcetStatus()
    },
    getDetail() {
        let that = this
        let db = wx.cloud.database()
        db.collection('newsData')
            .doc(that.data.detail_id)
            .get({
                success(res) {
                    that.setData({
                        detail_data: res.data,
                        content: res.data.content
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    goCollcetStatus() {
        let that = this
        let db = wx.cloud.database()
        let news_id = that.data.detail_id
        let userId = that.data.userInfo._id
        db.collection('collect').where({
            user_id: userId,
            TypeID: news_id
        }).get({
            success: res => {
                console.log(res);
                if (res.data.length > 0) {
                    // 如果已经收藏，则更新前端按钮状态为已收藏
                    this.setData({
                        isFavorited: true
                    })
                }
            },
        })

    },
    goCollcet() {
        let db = wx.cloud.database()
        let that = this
        let news_id = that.data.detail_data._id
        let userId = that.data.userInfo._id
        let title = that.data.detail_data.title
        let senduser = that.data.detail_data.senduser
        let type = that.data.detail_data.type
        if (that.data.isFavorited) {
            // 如果已经收藏，则取消收藏
            db.collection('collect').where({
                user_id: userId,
                TypeID: news_id
            }).remove({
                success: res => {
                    wx.showToast({
                        icon: "success",
                        title: '取消成功',
                    })
                    that.setData({
                        isFavorited: false
                    })
                },
                fail: err => {
                    console.error(err)
                }
            })
        } else {
            // 如果未收藏，则添加收藏记录
            db.collection('collect').add({
                data: {
                    user_id: userId,
                    TypeID: news_id,
                    type: type,
                    title:title,
                    senduser:senduser,
                    time: new Date().getTime()
                },
                success: res => {
                    wx.showToast({
                        icon: "success",
                        title: '收藏成功',
                    })
                    this.setData({
                        isFavorited: true
                    }) 
                },
                fail: err => {
                    console.error(err)
                }
            })
        }
    }
    
})