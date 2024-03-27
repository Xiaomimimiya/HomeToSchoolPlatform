Page({
    data: {
        BestAcc: "",
        accnotices: "",
        weekrecipes:"",
        userInfo:"",
        recipeimage:"",
        active: 1,
        show: false,
        colors: ['#5DB8B3', '#63B25F', '#5DB8B3', '#63B25F', '#5DB8B3'],
        activeNames: ['1'],
        popup1: {
            show: false
        },
        popup2: {
            show: false
        },
        popup3: {
            show: false
        },
        popup4: {
            show: false
        },
        popup5: {
            show: false
        },
        popup6: {
            show: false
        },
       
        popup10: {
            show: false
        },
        content: "一、学校建立领导班子轮流陪同学生就餐制度，陪餐费自理，杜绝免费陪餐，不得以陪餐等理由挤占学生营养餐。二、学校要有陪餐人员安排表，以确保当餐所提供的食品都有领导陪餐。"
    },
    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
        this.getNewsData()
        this.getBestAcc()
        this.getWeekRecipe()
        this.getlogisticsData()
    },
    getNewsData() {
        let db = wx.cloud.database()
        let that = this
        db.collection('newsData')
            .where({
                type:"宿舍通知"
            })
            .orderBy("_createTime", "desc")
            .get({
                success(res) {
                    that.setData({
                        accnotices: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getBestAcc() {
        let that = this
        let db = wx.cloud.database()
        db.collection('best_acc')
            .get({
                success(res) {
                    that.setData({
                        BestAcc: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getWeekRecipe() {
        let that = this
        let db = wx.cloud.database()
        db.collection('weekrecipe')
            .orderBy("sendtime","desc")
            .get({
                success(res) {
                    that.setData({
                        weekrecipes: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getlogisticsData(){
        let db = wx.cloud.database()
        let that = this
        db.collection('collapseData')
           .where({
               type:"后勤服务"
           })
           
            .get({
                success(res) {
                    console.log(res);
                    that.setData({
                        logisticsData: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    goNewsDetail(e){
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
    // 点击事件
    previewImage(e) {
        let current = e.target.dataset.item
        wx.previewImage({
            current: current,
            urls: [current]
        })
    },
    showPopup(event) {
    
        let image = event.currentTarget.dataset.image;
       
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
        this.setData({
          
            recipeimage:image
        })
        // 打开当前点击的 <van-popup> 组件
        popupData[id] = {
            show: true
        };

        this.setData(popupData);
    },
    goSend(){
        wx.navigateTo({
          url: '/pages/suggestionsSend/index',
        })
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

});