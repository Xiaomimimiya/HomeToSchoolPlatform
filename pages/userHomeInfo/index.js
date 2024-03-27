// pages/userInfo/index.js
Page({

    data: {
        userInfo: ""

    },
    onLoad(options) {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })

    },
    publish(e) {
        let that = this
        let password = e.detail.value.password

        let db = wx.cloud.database()
        wx.showModal({
            title: '更改确认',
            content: '确认更改为此密码？',
            complete: (res) => {
                if (res.cancel) {
                    wx.showToast({
                        icon: "error",
                        title: '您取消了更改',
                    })
                }

                if (res.confirm) {
                    db.collection('userinfo')
                        .where({
                            _id: that.data.userInfo._id,
                            className: that.data.className
                        })
                        .update({
                            data: {
                                password: password
                            },
                            success() {
                                wx.showToast({
                                    title: '更改成功',
                                    success: () => {
                                        wx.clearStorageSync() // clears local storage
                                        wx.redirectTo({ // redirects to login page
                                            url: '/pages/login/index'
                                        })
                                    }
                                })
                            }
                        })
                }
            }
        })

    }

})