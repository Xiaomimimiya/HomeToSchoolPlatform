// pages/wiriteDetail/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detail_id: "",
        detail_data: "",
        content: "",
        userInfo: "",
        isFavorited: false
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
        db.collection('write')
            .doc(that.data.detail_id)
            .get({
                success(res) {
                    let commentArr = res.data.comment || []
                    commentArr.sort((a, b) => b.sendTime - a.sendTime)
                    if (commentArr.length > 0) {
                        commentArr.sort((a, b) => b.sendTime - a.sendTime);
                        that.setData({
                            detail_data: res.data,
                            comment: commentArr,
                            content: res.data.content
                        });
                    } else {
                        that.setData({
                            detail_data: res.data,
                            content: res.data.content,
                            comment: []
                        });
                    }
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    goCollcetStatus() {
        let that = this
        let db = wx.cloud.database()
        let wirte_id = that.data.detail_id
        let userId = that.data.userInfo._id
        db.collection('collect').where({
            user_id: userId,
            TypeID: wirte_id
        }).get({
            success: res => {
                console.log(res);
                if (res.data.length > 0) {
                    // 如果已经收藏，则更新前端按钮状态为已收藏
                    that.setData({
                        isFavorited: true
                    })
                }
            },
        })

    },
    goCollcet() {
        let that = this
        let db = wx.cloud.database()
        let wirte_id = that.data.detail_data._id
        let userId = that.data.userInfo._id
        let title = that.data.detail_data.title
        let send_name = that.data.detail_data.send_name
        if (this.data.isFavorited) {
            // 如果已经收藏，则取消收藏
            db.collection('collect').where({
                user_id: userId,
                TypeID: wirte_id
            }).remove({
                success: res => {
                    wx.showToast({
                        icon: "success",
                        title: '取消成功',
                    })
                    this.setData({
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
                    TypeID: wirte_id,
                    type: "优秀作文",
                    title: title,
                    send_name: send_name,
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
    },
    imgDetail: function (event) {
        let src = event.currentTarget.dataset.src;
        let imgList = event.currentTarget.dataset.list;
        wx.previewImage({
            current: src,
            urls: imgList
        })

    },
    publish() {
        if (this.data.inputValue.trim() == "") {
            wx.showToast({
                icon: "none",
                title: '不能发送空评论',
            })
            return;
        }

        const that = this;
        const db = wx.cloud.database();
        db.collection('write').doc(that.data.detail_id).get({
            success(res) {
                const comment = res.data.comment || [];
                const commentlist = {
                    avatar: that.data.userInfo.useravatar,
                    username: that.data.userInfo.username,
                    userid: that.data.userInfo._id,
                    sendTime: new Date().getTime(),
                    content: that.data.inputValue,
                };
                comment.push(commentlist);

                db.collection('write').doc(that.data.detail_id).update({
                    data: {
                        comment: comment,
                    },
                    success(res) {
                        wx.showToast({
                            icon: "success",
                            title: '评论发布成功',
                        })
                        that.getDetail();
                        that.setData({
                            inputValue: '',

                        });
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

    },
    handleInput(e) {
        clearTimeout(this.data.time)
        var that = this;
        this.data.time = setTimeout(() => {
            that.getInputValue(e.detail.value)
        }, 200)
    },
    getInputValue(value) {
        this.setData({
            inputValue: value
        })
    },

})