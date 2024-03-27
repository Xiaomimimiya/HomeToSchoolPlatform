// pages/parentSchool/index.js
Page({


    data: {
        activeIndex: 0,
        educationDatas: "",
        writeDatas: "",
        userInfo: "",

        swiper_data: "",
        book_recommend: "",
        newsDatas: "",
        newsContent: null,
        newstitle: null,
        content: "",
        activeNames: ['1'],
        lawData: "",
       
        popup1: {
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
        examList:[
            "家庭教育","育儿知识","学校教育","家校合作"
        ]
    },
    onShow() {
        let user = wx.getStorageSync('user')

        this.setData({
            userInfo: user
        })
        this.getSwiper()
        this.getNewsData()
        this.getWriteData()
        this.getEducationData()
        this.getLawData()
    },
    // 数据内容获取
    getSwiper() {
        let that = this
        let db = wx.cloud.database()
        db.collection('swiperdata')
            .where({
                type: "parentschool"
            })
            .get({
                success(res) {

                    that.setData({
                        swiper_data: res.data[0].imagelist
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getLawData() {
        let db = wx.cloud.database()
        let that = this
        db.collection('collapseData')
            .where({
                type: "育人法规"
            })

            .get({
                success(res) {
                    console.log(res);
                    that.setData({
                        lawData: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getNewsData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('newsData')
            .where({
                type: "育人资讯"
            })
            .get({
                success(res) {
                    that.setData({
                        newsDatas: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    goNewsDetail(e) {
        let id = e.currentTarget.dataset.id
        let that = this
        if (!that.data.userInfo) {
            wx.showToast({
                icon: "error",
                title: '您还未登录',
            })
        } else {
            wx.navigateTo({
                url: '/pages/newDetail/index?id=' + id,
            })
        }

    },
    getEducationData() {
        let db = wx.cloud.database()
        let that = this
        db.collection('education')
            .orderBy("_createTime", "desc")
            .get({
                success(res) {
                    that.setData({
                        educationDatas: res.data
                    })

                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getWriteData() {
        let db = wx.cloud.database()
        let that = this
        db.collection('write')

            .orderBy("_createTime", "desc")
            .get({
                success(res) {
                    that.setData({
                        writeDatas: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },

    // 去考试
    goExamDetail(e){
        let type = e.currentTarget.dataset.type
      
        let that = this
        if (!that.data.userInfo) {
            wx.showToast({
                icon: "error",
                title: '您还未登录',
            })
        } else {
            wx.navigateTo({
                url: '/pages/parentExam/index?type=' + type
            })
        }
    },
  
    switchTab: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            activeIndex: index
        });
    },
    goContent(event) {
        let pageitem = event.currentTarget.dataset.item
        let page = "/pages/" + pageitem + "/index"
        let that = this
        if (!that.data.userInfo) {
            wx.showToast({
                icon: "error",
                title: '您还未登录',
            })
        } else {
            wx.navigateTo({
                url: page
            })
        }
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
                url: '/pages/educationResources/index?id=' + id,
            })
        }

    },
    goBookDetail(e) {
        let id = e.currentTarget.dataset.id
        let that = this
        if (!that.data.userInfo) {
            wx.showToast({
                icon: "error",
                title: '您还未登录',
            })
        } else {
            wx.navigateTo({
                url: '/pages/educationBook/index?id=' + id,
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
            newsContent: content,
            newstitle: title,
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
})