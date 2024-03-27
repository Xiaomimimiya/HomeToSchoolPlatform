// pages/educationQuestion/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: "",
        teacherData: "",
        resverData:"",
        onLineteacherData: "",
        teacherName: "",
        teacherDesc: "",
        teacherTime:"",
        activeNames: ['1'],
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
        adviceText: [
            "在本平台中，主要提供哪些了育人咨询服务？",
            "该怎样选择合适的专家，来帮助您进行及时解决问题？",
        ],
        noticeText: [
            "关于寒假期间开放线上心理咨询服务的公告！",
            "学校成功开展了线下咨询服务活动剪影。",
        ],
        minHour: 10,
        maxHour: 20,
        minDate: new Date().getTime(),
        maxDate: new Date(2025, 10, 1).getTime(),
        currentDate: new Date().getTime(),
    },
    onShow() {
        this.getTeacherData()
        this.getOnlineTeacherData()
        this.getMyRese()
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
    },
    onInput(event) {
        this.setData({
            currentDate: event.detail,
        });

    },
    // 提交预约
    submit(event) {
        let that = this
        let db = wx.cloud.database()
        wx.showModal({
            title: '预约',
            content: '确认预约？',
            complete: (res) => {
                if (res.confirm) {
                    let time = that.formatTimestamp(event.detail);
                    let teacherName = event.currentTarget.dataset.name
                    let id = that.data.userInfo._id
                    let username = that.data.userInfo.username
                    db.collection('reservation').add({
                        data: {
                            _createTime: new Date().getTime(),
                            sendreserve:username,
                            user_id:id,
                            time:time,
                            reserveteacher:teacherName
                        },
                        success: res => {
                            wx.showToast({
                                title: '预约成功',
                            })
                            that.setData({
                                popup4: false
                            })
        
                        },
                        fail:res=>{
                            console.log(res);
                        } 
                    })
                }
                if (res.cancel) {
                    wx.showToast({
                        icon: "none",
                        title: '取消预约',
                    })
                }


            }
        })
    },
    getMyRese(){
        let that = this
        let db = wx.cloud.database()
        let id = that.data.userInfo._id
        db.collection('reservation')
            .where(
                {
                    user_id:id
                }
            )
            .get({
                success(res) {
                    that.setData({
                        resverData:res.data
                    })
                 
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    delete(e){
        let that = this
        let db = wx.cloud.database()
        let id =e.currentTarget.dataset.id
        wx.showModal({
            title: '确认删除',
            content: '删除您发的帖子？',
            complete: (res) => {
                if (res.cancel) {
                    wx.showToast({
                        icon: "none",
                        title: '取消删除',
                    })
                }

                if (res.confirm) {
                    db.collection("reservation").where({
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


                    wx.showToast({
                        icon: "success",
                        title: '删除成功',
                    })
                }
            }
        })
    },
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
                                        content: "您好,心理老师",
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
    // 数据请求

    getTeacherData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('userInfo')
            .orderBy("_createTime", "desc")
            .where({
                usertype:"心理老师"
            })
            .get({
                success(res) {
                    that.setData({
                        teacherData: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getOnlineTeacherData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('userInfo')
            .where({
                online: true
            })
            .get({
                success(res) {
                    that.setData({
                        onLineteacherData: res.data[0]
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    showPopup(event) {
        const id = event.currentTarget.dataset.id;
        let name = event.currentTarget.dataset.name;
        let desc = event.currentTarget.dataset.desc;
        let time = event.currentTarget.dataset.time
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
            teacherName: name,
            teacherDesc: desc,
            teacherTime:time
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
    changeItem(event) {
        this.setData({
            activeNames: event.detail,
        })
    },
     // 时间格式化
     formatTimestamp(timestamp) {
        const date = new Date(timestamp);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}`;
    },
})