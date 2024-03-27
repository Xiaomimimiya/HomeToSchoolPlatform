// pages/sendLog/index.js
const app = getApp()

Page({


    data: {
        active: 0,
        userInfo: "",
        chatdata: "",
        lostdata: "",
        seconddata: "",
        homeworkdata: "",
        readingdata:"",
        lifedata: "",
        length:""
    },
    onLoad(options) {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
    },
    onShow() {
        Promise.all([
            this.getSendLog("chatdata", data => {
                this.setData({
                    chatdata: data,
                })
            }),
            this.getSendLog("studentgrowth", data => {
                this.setData({
                    readingdata: data,
                })
            }),
          
        ]).then(dataArr => {
            this.setData({
                length:dataArr.length
            })
        }).catch(err => {
            console.error(err);
        });
    },
    getSendLog(database, callback) {
        let db = wx.cloud.database()
        db.collection(database)
            .where({
                user_id: this.data.userInfo._id
            })
            .get({
                success(res) {
                    callback(res.data)
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    cancleData(e) {
        let that = this
        let db = wx.cloud.database()
        let id = e.currentTarget.dataset.id
        let database = e.currentTarget.dataset.database
        wx.showModal({
            title: '删除信息',
            content: '您确定要删除此信息吗',
            complete: (res) => {
                if (res.cancel) {
                    wx.showToast({
                        icon: "error",
                        title: '您点击了取消',
                    })
                }
                if (res.confirm) {
                    db.collection(database).where({
                        _id: id
                    }).remove({
                        success: res => {
                            wx.showToast({
                                icon: "success",
                                title: '删除成功',
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
    }

})