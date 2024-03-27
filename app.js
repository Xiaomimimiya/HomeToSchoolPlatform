App({
   
  //创建towxml对象，供小程序页面使用
  globalData: {
    userInfo: [],
},
    onLaunch: function () {
        //云开发初始化
        wx.cloud.init({
            env: 'home-platform-0gpmrg4uda95ceae',
            traceUser: true,
        })
        this.getUserInfo()
    },
    getUserInfo() {
        let app = this
        let userinfo = wx.getStorageSync('user')
        app.globalData.userInfo = userinfo
    },
  

})