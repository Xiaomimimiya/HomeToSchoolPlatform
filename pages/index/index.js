Page({

    data: {
        userInfo: "",
        newsData: "",
        navItems: [
            {
                title: '最新通知',
                active: true
            }
        ],
        swiper_data: "",
        notice_data: ""
    },
    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
        this.getNotice()
        this.getSwiper()
        this.getNewsData()
    },
    // 获取轮播图
    getSwiper() {
        let that = this
        let db = wx.cloud.database()
        db.collection('swiper')
            .where({
                type: "home_index"
            })
            .get({
                success(res) {
                    console.log(res.data);
                    that.setData({
                        swiper_data: res.data[0].images
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getNotice() {
        let that = this
        let db = wx.cloud.database()
        db.collection('notice')
            .get({
                success(res) {
                    that.setData({
                        notice_data: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    // 底部tabBar点击切换事件
  
    goPage(e) {
        let page = e.currentTarget.dataset.item
        let urls = "/pages/" + page + "/index"
        wx.navigateTo({
            url: urls,
        })
    },
    // 获取新闻的信息
    getNewsData() {
        let db = wx.cloud.database()
        let that = this
        db.collection('newsData')
            .orderBy("_createTime", "desc")
            .limit(3)
            .get({
                success(res) {
                    that.setData({
                        newsData:res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    //跳转新闻详情
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

    }
})