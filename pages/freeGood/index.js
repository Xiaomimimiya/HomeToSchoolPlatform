// pages/freeGood/index.js
Page({


    data: {
        good_data: "",
        userInfo: "",
        money: ""
    },
    onLoad() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
    },
    onShow() {
        this.getdata()
        this.getMoney()
    },
    getdata() {
        let that = this
        let db = wx.cloud.database()
        db.collection('freegood')
            .get({
                success(res) {
                    that.setData({
                        good_data: res.data,
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getMoney() {
        let that = this
        let db = wx.cloud.database()
        let id = that.data.userInfo._id
        db.collection('userInfo')
            .doc(id)
            .get({
                success(res) {
                    that.setData({
                        money: res.data.money,
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getThing(e) {
        let that = this
        let db = wx.cloud.database()
        let id = that.data.userInfo._id
        let price = Number(e.currentTarget.dataset.price)
        let name = e.currentTarget.dataset.name
        if (that.data.money < price) {
            wx.showToast({
                icon: "error",
                title: '您的积分不足',
            })
        } else if (that.data.money >= price) {
            wx.showModal({
                title: '确认兑换',
                content: `您确认要兑换${name}吗？`,
                complete: (res) => {
                    if (res.cancel) {
                        wx.showToast({
                            icon: "error",
                            title: '您点击了取消',
                        })
                    }
                    if (res.confirm) {
                        db.collection("userinfo")
                            .doc(id)
                            .update({
                                data: {
                                    money: db.command.inc(-price),
                                },
                                success(res) {
                                    that.onShow()
                                }
                            })
                        wx.showToast({
                            icon: "success",
                            title: '兑换成功',
                        })
                    }
                }
            })
        }


    },
    previewImage(e) {
        let current = e.target.dataset.item
        wx.previewImage({
            current: current,
            urls: [current]
        })
    },
})