// pages/classRoom/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

        ablumData: "",
        noticeData: "",
        MoneyData: "",
        classData: "",
        userInfo: "",
        randomColor: '',
        classnoticeData: null,
        classnoticetitle: null,
        classPeople: "",
        show: false,
        chatList: [],
        popup1: {
            show: false
        },
        popup2: {
            show: false
        },
        popup3: {
            show: false
        },
        popup4: {
            show: false
        },
        popup5: {
            show: false
        },
        // 颜色
        colors: ['#1A8DFF', '#0FCA90', '#547886', '#F88B15', '#4AA080'],
        class_color: ["#C3D9DB", "#CFD9EF", "#CDE6E4", "#DBF1CC", "#DBE8E8", "#F1E1FB", "#E4EDFF", "#C8C6C0", ],

    },
    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
        this.getAblumData()
        this.getNoticeData()
        this.getClassInfo()
        this.getClassData()
        this.getChattList()
        this.getMoney()
        this.getMyClass()
    },

    getClassInfo() {
        let that = this
        let db = wx.cloud.database()
        db.collection('classinfo')
            .where({
                classname: that.data.userInfo.classname
            })
            .get({
                success(res) {
                    that.setData({
                        classData: res.data,
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getChattList() {
        let that = this
        let db = wx.cloud.database()
        db.collection('chatdata')
            .where({
                type: "班级圈子"
            })
            .orderBy("_createTime", "desc")
            .get({
                success(res) {

                    that.setData({
                        chatList: res.data,
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    // 数据请求
    getAblumData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('ablum')
            .where({
                classname: that.data.userInfo.classname
            })
            .get({
                success(res) {
                    that.setData({
                        ablumData: res.data,
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getNoticeData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('classnotices')
            .where({
                classname: that.data.userInfo.className
            })
            .orderBy("_createTime", "acs")
            .get({
                success(res) {
                    that.setData({
                        noticeData: res.data,
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    goDetail(e) {
        let id = e.currentTarget.dataset.id
        let that = this
        if (!that.data.userInfo) {
            wx.showToast({
                icon: "error",
                title: '您还未登录',
            })
        } else {
            wx.navigateTo({
                url: "/pages/forumDetail/index?id=" + id
            })
        }

    },
    getMoney() {
        let that = this
        let db = wx.cloud.database()
        db.collection('classMoney')
            .where({
                classname: that.data.userInfo.classname
            })
            .get({
                success(res) {
                    that.setData({
                        MoneyData: res.data,
                    })
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
    getClassData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('classRange')
            .where({
                classname: that.data.userInfo.className
            })
            .get({
                success(res) {
                    that.setData({
                        classdata: res.data[0].classrange,
                    })
                    let today = new Date();
                    let dayOfWeekNumber = Number(today.getDay() - 1);
                    let toDay_Class = that.data.classdata[dayOfWeekNumber]
                    that.setData({
                        toDay_Class: toDay_Class,
                        dayOfWeekNumber: dayOfWeekNumber + 1
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getMyClass() {
        let that = this
        let db = wx.cloud.database()
        db.collection('userInfo')
            .where({
                classname: that.data.userInfo.className
            })
            .get({
                success(res) {

                    that.setData({
                        classPeople: res.data
                    })

                },
                fail(err) {
                    console.log(err);
                },
            })
    },

    // 页面跳转
    goAblum(e) {
        let id = e.currentTarget.dataset.id

        wx.navigateTo({
            url: '/pages/classRoomAblum/index?id=' + id,
        })
    },
    sendablum() {
        wx.navigateTo({
            url: '/pages/sendAblum/index'
        })
    },
    sendMoney() {
        wx.navigateTo({
            url: '/pages/sendMoney/index'
        })
    },
    goSend() {
        wx.navigateTo({
            url: '/pages/sendClassForum/index',
        })
    },
    // 去聊天界面
    startChat(e) {

        let recever_info = e.currentTarget.dataset.item
        console.log(recever_info);
        let that = this
        let db = wx.cloud.database()

        // 无法与自己联系

        if (recever_info._id == that.data.userInfo._id) {
            wx.showToast({
                icon: "error",
                title: '无法与自己联系',
            })
            return
        }

        // 判断是否有聊天记录
        const DB = wx.cloud.database().command;
        db.collection("chatlist")
            .where(
                DB.or([{

                        send_user_id: that.data.userInfo._id,

                        recever_user_id: recever_info._id
                    },
                    {
                        send_user_id: recever_info.send_id,
                        recever_user_id: that.data.userInfo._id
                    }
                ])
            )
            .get({
                success(res) {
                    console.log(res);
                    if (res.data.length > 0) {
                        let id = res.data[0]._id
                        wx.navigateTo({
                            url: '/pages/messageDetail/index?id=' + id
                        })
                    } else {

                        db.collection('chatlist').add({
                            data: {
                                send_user_name: that.data.userInfo.username,
                                send_user_id: that.data.userInfo._id,
                                send_user_avatar: that.data.userInfo.useravatar,

                                recever_user_name: recever_info.username,
                                recever_user_id: recever_info._id,
                                recever_user_avatar: recever_info.useravatar,

                                message: [
                                    {
                                        send_user_id: that.data.userInfo._id,
                                        content: "您好",
                                        time: new Date().getTime()
                                    }
                                ],
                                _createTime: new Date().getTime()
                            }
                        }).then(res => {
                            db.collection('chatlist')
                                .where(
                                    DB.or([{
                                            send_user_id: that.data.userInfo._id,
                                            recever_user_id: recever_info._id
                                        },
                                        {
                                            send_user_id: recever_info.send_id,
                                            recever_user_id: that.data.userInfo._id
                                        }
                                    ])
                                )
                                .get({
                                    success(res) {
                                        let id = res.data[0]._id
                                        wx.navigateTo({
                                            url: '/pages/messageDetail/index?id=' + id
                                        })
                                    }
                                })

                        })

                    }
                }
            })
    },

    onUnload: function () {
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 2]
        console.log(prevPage.route);
        if (prevPage.route === 'pages/sendClassForum/index') {
            wx.switchTab({
                url: '/pages/index/index',
            })
        }
        if (prevPage.route === 'pages/messageDetail/index') {
            wx.switchTab({
                url: '/pages/messageDetail/index',
            })
        }
    },

    // 点击事件
    showPopup(event) {

        let content = event.currentTarget.dataset.content;
        let title = event.currentTarget.dataset.title;
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
        this.setData({
            classnoticeData: content,
            classnoticetitle: title
        })
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
    onChange(event) {
        this.setData({
            activeNames: event.detail,
        });
    },
    changeItem(event) {
        this.setData({
            activeNames: event.detail,
        })
    },

})