// pages/sendMoney/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: ""
    },


    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
    },
    publish(e) {
        
        let that = this
        let moneyData = e.detail.value
        console.log(moneyData);
        let db = wx.cloud.database();
        db.collection('classMoney')
            .where({
                classname: that.data.userInfo.classname
            })
            .get({
                success(res) {
                    const money = res.data[0].useinfo;
                    console.log(money);
                    const Moneylist = {
                        desc:moneyData.desc,
                        money:moneyData.money,
                        time:moneyData.time,
                        title:moneyData.title
                    };
                    money.push(Moneylist);
                    console.log(money);
                    db.collection('classMoney')
                    .where({
                        classname: that.data.userInfo.classname
                    })
                    .update({
                        data: {
                            useinfo:money,
                        },
                        success(res) {
                            wx.hideLoading()
                            setTimeout(() => {
                                wx.showToast({
                                    icon: "success",
                                    title: '发布成功',
                                }) 
                            }, 1000);
                           setTimeout(() => {
                           
                            wx.navigateTo({
                                url: '/pages/classRoom/index',
                              })
                           }, 2000);
                         
                        
                        },
                        fail(err) {
                            console.log(err);
                        },
                    });
                },
                fail(err) {
                    console.log(err);
                },
            });

    }

})