// pages/growthProfile/index.js
Page({


    data: {
        class_data: "",
        reward_data: "",
        home_data: "",
        eval_data: "",
        userInfo: "",
        active: 1,
    },
    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })

        // 数据请求
        this.getTypeData("学校表现")
            .then(data => {
                this.setData({
                    class_data: data
                });
                return this.getTypeData("家庭表现");
            })
            .then(data => {
                this.setData({
                    home_data: data
                });
                return this.getTypeData("奖励表彰");
            })
            .then(data => {
                this.setData({
                    reward_data: data
                });
                return this.getTypeData("教师评价");
            })
            .then(data => {
                this.setData({
                    eval_data: data
                });
            })
            .catch(err => {
                console.log(err);
            });
    },

    getTypeData(type) {
        return new Promise((resolve, reject) => {
            let db = wx.cloud.database()
            let usernumber = parseInt(this.data.userInfo.usernumber)
            db.collection('studentgrowth')
                .where({
                    type: type,
                    usernumber: usernumber
                })
                .orderBy("_createTime", "desc")
                .get({
                    success(res) {
                        console.log(res);
                        resolve(res.data);
                    },
                    fail(err) {
                        reject(err);
                    },
                });
        });
    },
    onUnload: function () {
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 2]
        console.log(prevPage.route);
        if (prevPage.route === 'pages/growthFileSend/index') {
            wx.switchTab({
                url: '/pages/index/index',
            })
        }
    },
    previewImage(e) {
        let current = e.target.dataset.item
        wx.previewImage({
            current: current,
            urls: [current]
        })
    },
    // 页面跳转
    goSend() {
        wx.navigateTo({
            url: '/pages/growthFileSend/index',
        })
    }
})