// pages/classAblum/index.js
Page({
    data: {
        userInfo: "",
        detail_id: "",
        detail_data: ""
    },
    onLoad(options) {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
        this.setData({
            detail_id: options.id
        })
    },
    onShow() {
        this.getDetail()

    },
    getDetail() {
        let that = this
        let db = wx.cloud.database()
        db.collection('ablum')
            .doc(that.data.detail_id)
            .get({
                success(res) {
                    that.setData({
                        detail_data: res.data,

                    })
                    wx.setNavigationBarTitle({
                        title: that.data.detail_data.type
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    // 实现照片预览时的左右滑动效果
    imgDetail: function (event) {
        let src = event.currentTarget.dataset.src; 
        let imgList = event.currentTarget.dataset.list; 
        wx.previewImage({
            current: src, 
            urls: imgList 
        })

    }

})