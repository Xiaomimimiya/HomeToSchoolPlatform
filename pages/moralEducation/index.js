// pages/moralEducation/index.js
Page({

    data: {
      
        moraldata: "",
        userInfo: "",
        avtice:0,
        patriotic:""
    },
    onShow() {
        
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
        this.getmoralData()
        this.getvoluntaryData()
        this.getpatrioticData()
    },
    
    getmoralData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('newsData')
            .orderBy("_createTime","desc")
            .where({
                type:"德育活动"
            })
            .get({
                success(res) {

                    that.setData({
                        moraldata: res.data
                    })

                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getpatrioticData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('newsData')
        .orderBy("_createTime","desc")
            .where({
                type:"爱国教育"
            })
            .get({
                success(res) {

                    that.setData({
                        patriotic: res.data
                    })

                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    goDetail(e) {
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
    goVoluntaryDetail(e){
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
                url: '/pages/voluntaryDetail/index?id=' + id,
            })
        }
    },
    getvoluntaryData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('voluntary')
            .orderBy("_createTime", "desc")
            .get({
                success(res) {
                    that.setData({
                        allData: res.data
                    })

                },
                fail(err) {
                    console.log(err);
                },
            })
    },
})