const app = getApp()
Page({
    data: {
        username: '',
        password: '',
        activeNames: ['1'],
        popup1: {
            show: false
        },
    },
    //获取输入的账号
    getUserName(event) {
        //console.log('账号', event.detail.value)
        this.setData({
            username: event.detail.value
        })
    },
    //获取输入的密码
    getPassword(event) {
        // console.log('密码', event.detail.value)
        this.setData({
            password: event.detail.value
        })
    },
    //点击登陆
    login() {
        let usernumber = this.data.username
        let password = this.data.password
        console.log(usernumber, password);
        //登陆
        wx.cloud.database().collection('userInfo').where({
            usernumber: usernumber
        }).get({
            success(res) {
                let user = res.data[0]
                if (password == user.password) {
                    console.log('登录成功')
                    wx.showToast({
                        title: '登录成功',
                    })
                    wx.switchTab({
                        url: '/pages/userHome/index',
                    })
                    //保存用户登陆状态
                    wx.setStorageSync('user', user)
                } else {
                    console.log('登录失败')
                    wx.showToast({
                        icon: 'none',
                        title: '账号或密码不正确',
                    })
                }
            },
            fail(res) {
                console.log("获取数据失败", res)
            }
        })

    },
    tapHelp: function (e) {
        if (e.target.id == 'help') {
            this.hideHelp();
        }
    },
    showHelp: function (e) {
        this.setData({
            'help_status': true
        });
    },
    hideHelp: function (e) {
        this.setData({
            'help_status': false
        });
    },
    showToast() {
        wx.showToast({
            icon: "none",
            title: '请首页联系客服',
        })
    },
   

    getUserData(){
        let that = this
        // 获取用户信息表
        wx.cloud.database().collection('userInfo')
            .get({
                success(res) {
                    that.setData({
                       userinfo: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    showPopup(event) {
    
        const id = event.currentTarget.dataset.id;
        const popupData = {};

        // 关闭所有的 <van-popup> 组件
        for (let key in this.data) {
            if (key.startsWith("popup")) {
                popupData[key] = {
                    show: false
                };
            }
        }
       
        // 打开当前点击的 <van-popup> 组件
        popupData[id] = {
            show: true
        };

        this.setData(popupData);
    },

    onClose(event) {
        const id = event.currentTarget.dataset.id;
        const popupData = this.data[id];
        popupData.show = false;
        this.setData({
            [id]: popupData
        });
    },
    changeItem(event) {
        this.setData({
            activeNames: event.detail,
        })
    },
   
})
