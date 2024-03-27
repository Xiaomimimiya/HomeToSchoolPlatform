// pages/afterClassdetail/index.js
Page({
    data: {
        activeNames: ['1'],
        value: 0,
        detail_id: "",
        detail_data: "",
        content: "",
        userInfo: ""
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
        db.collection('afterCourse')
            .doc(that.data.detail_id)
            .get({
                success(res) {
                    that.setData({
                        detail_data: res.data,
                        content: res.data.desc
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },


    // 报名申请

    goApply(event) {
        let that = this
        let db = wx.cloud.database()
        const _ = db.command
        wx.showModal({
            title: '报名',
            content: '确认报名？',
            complete: (res) => {
                if (res.confirm) {
                    let info = event.currentTarget.dataset.info
                    let coursename = info.coursename
                    let course_id = info._id
                    let time = info.time
                    let id = that.data.userInfo._id
                    let username = that.data.userInfo.username

                    db.collection('courseApply').where({
                        course_id: course_id,
                        username: username
                    }).get().then(res => {
                        if (res.data.length > 0) {
                            wx.showToast({
                                icon: "error",
                                title: '您已报名！！！',
                            })
                        } else {
                            db.collection('courseApply').add({
                                data: {
                                    _createTime: new Date().getTime(),
                                    applycourse: coursename,
                                    course_id: course_id,
                                    time: time,
                                    username: username,
                                    user_id: id
                                },
                                success: res => {
                                    db.collection('afterCourse').
                                    where({
                                        _id: course_id
                                    }).update({
                                        data: {
                                            applynumber: _.inc(1)
                                        }
                                    }).then(() => {
                                        wx.showToast({
                                            title: '报名成功',
                                        })
                                        wx.onShow()
                                    })

                                },
                                fail: res => {
                                    console.log(res);
                                }

                            })
                        }
                    }).catch(err => {
                        console.log('Error:', err);
                    })
                }
                if (res.cancel) {
                    wx.showToast({
                        icon: "none",
                        title: '取消报名',
                    })
                }


            }
        })
    },
    // 点击事件
    changeItem(event) {
        this.setData({
            activeNames: event.detail,
        })
    },
    onChange(event) {
        const newValue = event.detail;
        this.setData({
            value: newValue
        });
        console.log('用户选择的评分值:', newValue);
    },


})