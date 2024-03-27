// pages/afterClass/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeNames: ['1'],
        afterCourseData: "",
        afterReccomData:"",
        applyData:"",
        userInfo: "",
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
        popup6: {
            show: false
        },
    },
    onShow() {
        this.getHotClass()
        this.getRecommClass()
        this.getMyApply()
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
    },
    getHotClass() {
        let that = this
        let db = wx.cloud.database()
        db.collection('afterCourse')
            .orderBy("applynumber", "desc")
            .limit(4)
            .get({
                success(res) {
                    that.setData({
                        afterCourseData: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getRecommClass() {
        let that = this
        let db = wx.cloud.database()
        db.collection('afterCourse')
        .orderBy("reccom", "acs")
            .limit(4)
            .get({
                success(res) {
                    that.setData({
                        afterReccomData: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    goDetail(e) {
        let id = e.currentTarget.dataset.id;
        let that = this
        if (!that.data.userInfo) {
            wx.showToast({
                icon: "error",
                title: '您还未登录',
            })
        } else {
            wx.navigateTo({
                url: "/pages/afterClassdetail/index?id=" + id
            })
        }
    },
    goPage(e) {
        console.log(e.currentTarget.dataset);
        wx.navigateTo({
            url: '/pages/afterClassList/index',
        })
    },
    getMyApply(){
        let that = this
        let db = wx.cloud.database()
        let id = that.data.userInfo._id
        db.collection('courseApply')
            .where({
                    user_id:id
                }
            )
            .get({
                success(res) {
                    console.log(res);
                    that.setData({
                        applyData:res.data
                    })

                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    deleteApply(e){
        let that = this
        let id = e.currentTarget.dataset.item.course_id;
        let name = e.currentTarget.dataset.item.username;
        let db = wx.cloud.database()
        db.collection('courseApply').where({
            course_id: id,
            username: name
        }).get().then(res => {
            wx.showModal({
                title: '取消报名',
                content: '您确定要取消报名吗',
                complete: (res) => {
                    if (res.cancel) {
                        wx.showToast({
                            icon: "error",
                            title: '您点击了取消',
                        })
                    }
                    if (res.confirm) {
                        db.collection('courseApply').where({
                            course_id: id,
                            username: name
                        }).remove({
                            success: res => {
                                wx.showToast({
                                    icon: "success",
                                    title: '取消成功',
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
        }).catch(err => {
            
        })
    },
    // 点击弹窗事件
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