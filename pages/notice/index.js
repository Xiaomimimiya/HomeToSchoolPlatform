// pages/notice/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        newsData:""
    },
    onShow(){
        this.getNewsData()
    },
    getNewsData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('newsData')
            .where({
                type: "系统通知"
            })
            .orderBy("_createTime","desc")
            .get({
                success(res) {
                    that.setData({
                        newsData: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    
})