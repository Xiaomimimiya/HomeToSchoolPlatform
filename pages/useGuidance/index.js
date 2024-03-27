// pages/useGuidance/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeNames: ['1'],
        GuidanceData:""
    },

  
    
    onShow() {
        this.getData()
    },
    getData(){
        let db = wx.cloud.database()
        let that = this
        db.collection('collapseData')
           .where({
               type:"使用指南"
           })
           
            .get({
                success(res) {
                    console.log(res);
                    that.setData({
                        GuidanceData: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    changeItem(event) {
        this.setData({
            activeNames: event.detail,
        })
    },
})