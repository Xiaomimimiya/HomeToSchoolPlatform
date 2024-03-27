// pages/chatHot/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        image: [
            "https://videoclassdemo.oss-cn-hangzhou.aliyuncs.com/hometest/images/challeng_icon/first.png",
            "https://videoclassdemo.oss-cn-hangzhou.aliyuncs.com/hometest/images/challeng_icon/second.png",
            "https://videoclassdemo.oss-cn-hangzhou.aliyuncs.com/hometest/images/challeng_icon/third.png",
            "https://videoclassdemo.oss-cn-hangzhou.aliyuncs.com/hometest/images/challeng_icon/4.png",
            "https://videoclassdemo.oss-cn-hangzhou.aliyuncs.com/hometest/images/challeng_icon/5.png",
            "https://videoclassdemo.oss-cn-hangzhou.aliyuncs.com/hometest/images/challeng_icon/6.png",
            "https://videoclassdemo.oss-cn-hangzhou.aliyuncs.com/hometest/images/challeng_icon/7.png",
            "https://videoclassdemo.oss-cn-hangzhou.aliyuncs.com/hometest/images/challeng_icon/8.png",
            "https://videoclassdemo.oss-cn-hangzhou.aliyuncs.com/hometest/images/challeng_icon/9.png",
            "https://videoclassdemo.oss-cn-hangzhou.aliyuncs.com/hometest/images/challeng_icon/10.png"
        ],
        color: [
            "#FF9A9F",
            "#E89898",
            "#FBB6A0",
        ],
        hot_data: "",
        icon: "",
        title:""
    },


    onLoad(options) {
        let that = this
        let icon = options.type
        that.setData({
            icon:icon,
          
        })
    },

    onShow() {
        if (this.data.icon==="undefined") {
            this.getChattList()
            this.setData({
                title:"热门点击"
            })
        }
        if (this.data.icon==="育人经验") {
            this.getChattList(this.data.icon)
            this.setData({
                title:"育人经验"
            })
        }
        if (this.data.icon==="咨询求助") {
            this.getChattList(this.data.icon)
            this.setData({
                title:"咨询求助"
            })
        }
        if (this.data.icon==="家校点滴") {
            this.getChattList(this.data.icon)
            this.setData({
                title:"家校点滴"
            })
        }
        
       
    },
    getChattList(icon) {
        let that = this
        let db = wx.cloud.database()
        db.collection('chatdata')
            .where({
                icon,
                type:"交流论坛"
            })
            
            .orderBy("watch", "desc")
            .limit(10)
            .get({
                success(res) {
                    that.setData({
                        hot_data: res.data,
                    })
                    wx.setNavigationBarTitle({
                        title: that.data.title
                    });
                },
                fail(err) {
                    console.log(err);
                },
            })
    },


    goDetail(e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: "/pages/forumDetail/index?id=" + id
        })
    },

})