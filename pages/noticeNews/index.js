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
        this.getTypeData("通知公告", data => {
            this.setData({
                noticeData: data
            })
        })
        this.getTypeData("学校新闻", data => {
            this.setData({
               schoolNews: data
            })
        })
        this.getTypeData("教学科研", data => {
            this.setData({
               educationData: data
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
        console.log(id);
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