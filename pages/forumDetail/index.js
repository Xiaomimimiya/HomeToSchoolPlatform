// pages/chatDetail/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detail_id: "",
        detail_data: "",
        good: "",
        show: false,
        inputValue: "",
        time: 0,
        userInfo: "",
        comment: "",
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
        this.getWatch()
    },
    getDetail() {
        let that = this
        let db = wx.cloud.database()
        db.collection('chatdata')
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
                            good: res.data.good
                        });
                    } else {
                        that.setData({
                            detail_data: res.data,
                            good: res.data.good,
                            comment: []
                        });
                    }

                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    
    previewImage(e) {
        let current = e.target.dataset.item
        wx.previewImage({
            current: current,
            urls: [current]
        })
    },
    click() {
        let that = this
        let db = wx.cloud.database()
        db.collection('chatdata')
            .doc(that.data.detail_id)
            .update({
                data: {
                    good: db.command.inc(1),
                },
                success(res) {
                    that.getDetail()
                }
            })

    },
    commentShow() {
        this.setData({
            show: !this.data.show
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
    sendComment() {
        if (this.data.inputValue.trim() == "") {
            wx.showToast({
                icon: "none",
                title: '不能发送空评论',
            })
            return;
        }

        const that = this;
        const db = wx.cloud.database();
        db.collection('chatdata').doc(that.data.detail_id).get({
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

                db.collection('chatdata').doc(that.data.detail_id).update({
                    data: {
                        comment: comment,
                    },
                    success(res) {
                        wx.showToast({
                            icon: "success",
                            title: '评论成功',
                        })
                        that.getDetail();
                        that.setData({
                            inputValue: '',
                            show: !that.data.show,
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
    // 观看量自增
    getWatch() {
        let that = this
        let db = wx.cloud.database()
        db.collection('chatdata')
            .doc(that.data.detail_id)
            .update({
                data: {
                    watch: db.command.inc(1),
                },
                success(res) {
                    that.getDetail()
                }
            })
    },

    showPopup(event) {
        const id = event.currentTarget.dataset.id;
        const popupData = {};

        // 关闭所有的 <van-popup> 组件
        for (let key in this.data) {
            if (key.startsWith("popup")) {
                popupData[key] = {
                    show: false
                };
            }
        }

        // 打开当前点击的 <van-popup> 组件
        popupData[id] = {
            show: true
        };

        this.setData(popupData);
    },

    onClose(event) {
        const id = event.currentTarget.dataset.id;
        const popupData = this.data[id];
        popupData.show = false;
        this.setData({
            [id]: popupData
        });
    },
})
