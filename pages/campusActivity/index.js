// pages/campusLife/index.js
Page({


    data: {
        activeIndex: 0,
        alldata: "",
        schooldata: "",
        clubdata: "",
        userInfo: "",
    },
    onShow() {
        this.getTypeData("校园活动", data => {
            this.setData({
                schooldata: data
            })
        })
        this.getTypeData("社团活动", data => {
            this.setData({
                clubdata: data
            })
        })
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
    },
    getTypeData(type, callback) {
        let db = wx.cloud.database()
        db.collection('newsData')
            .where({
                type
            })
            .orderBy("_createTime", "desc")
            .get({
                success(res) {
                    callback(res.data)
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
    switchTab: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            activeIndex: index
        });
    },
})