// pages/review/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 0,
        examData: "",
        userInfo: "",
        studentData: ""
    },
    onLoad(options) {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })

    },
    onShow() {
        this.getScoreData()
    },

    getScoreData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('scoreAnalysis')
            .where({
                username: that.data.userInfo.username
            })
            .get({
                success(res) {
                    that.setData({
                        examData: res.data
                    })
                  
                    let studentData = []
                    for (let item of that.data.examData) {
                        console.log(that.data.examData);
                        if (item.usernumber == that.data.userInfo.usernumber) {
                            for (let items of item.score) {
                                    studentData.push(items);
                                    that.setData({
                                        studentData: studentData
                                    })
                            }
                        }
                    }
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    goDetail(e) {
        let data = e.currentTarget.dataset.item
        let examname =  e.currentTarget.dataset.title
        wx.navigateTo({
            url: '/pages/scoreAnalysisDetail/index?item=' + JSON.stringify(data)+'&title=' + examname,
        })
    }



})