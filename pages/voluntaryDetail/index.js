// pages/voluntaryDetail/index.js
Page({


    data: {
        detail_id: "",
        detail_data: "",
        userInfo: "",
        applylist: "",
        isApply: false

    },

    onLoad(options) {
        let that = this
        that.setData({
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
        db.collection('voluntary')
            .doc(that.data.detail_id)
            .get({
                success(res) {

                    that.setData({
                        detail_data: res.data,
                        applylist: res.data.apply
                    })
                    for (let i = 0; i < that.data.applylist.length; i++) {
                        if (that.data.userInfo._id === that.data.applylist[i].userid) {
                            that.setData({
                                isApply: true
                            })
                        }
                    }
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    onShareAppMessage: function () {
        return {
            title: this.data.detail_data.title,
            path: '/pages/voluntaryDetail/index?id=' + this.data.detail_data._id,
            imageUrl: this.data.detail_data.coverImage
        }
    },
    goOrder() {
        let that = this
        let db = wx.cloud.database()
        const _ = db.command
        wx.showModal({
            title: '报名确认',
            content: '确认报名此活动？',
            complete: (res) => {
                if (res.cancel) {
                    wx.showToast({
                        icon: "error",
                        title: '您点击了取消',
                    })
                }

                if (res.confirm) {

                    db.collection('voluntary').doc(that.data.detail_id).get({
                        success(res) {
                            const apply = res.data.apply || [];
                            const applylist = {
                                userid: that.data.userInfo._id,
                                username: that.data.userInfo.username,
                                classname: that.data.userInfo.classname,
                                applytime: new Date().getTime(),

                            };
                            apply.push(applylist);

                            db.collection('voluntary').doc(that.data.detail_id).update({
                                data: {
                                    apply: apply,
                                },
                                success(res) {
                                    db.collection('voluntary').doc(that.data.detail_id).update({
                                        data: {
                                            number: _.inc(1),
                                        },
                                    });
                                    let id = that.data.userInfo._id
                                    db.collection("userInfo")
                                        .doc(id)
                                        .update({
                                            data: {
                                                money: db.command.inc(1),
                                            },
                                            success(res) {
                                                wx.showToast({
                                                    icon: "success",
                                                    title: '报名成功',
                                                })
                                                that.onShow()
                                            }
                                        })

                                },
                                fail(err) {
                                    console.log(err);
                                },
                            });
                        },
                        fail(err) {
                            console.log(err);
                        },
                    });

                }
            }
        })
    }
})