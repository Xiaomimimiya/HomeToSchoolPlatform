// pages/capmusStyle/index.js

Page({

    data: {

        show: false,
        active: 0,
        activeNames: ['1'],
        item_list:[
            "诞生历史",
            "成长历史",
            "发展历史",
            "未来展望"
        ],
        userInfo:"",
        popup1: {
            show: false
        },
        popup2: {
            show: false
        },
        popup3: {
            show: false
        },
        newsData: ""

    },
    onShow() {
        this.getNewsData()
        this.getablumData()
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
       
    },
    getNewsData() {
        let that = this
        let db = wx.cloud.database()
        db.collection('newsData')
            .where({
                type: "办学成绩"
            })
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
    goNewsDetail(e) {
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
    getablumData(){
        let that = this
        let db = wx.cloud.database()
        db.collection('schoolStyle')
          
            .get({
                success(res) {
                    that.setData({
                        ablumData: res.data
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
    // 预览图片
    previewImage(e) {
        let current = e.target.dataset.item
        wx.previewImage({
            current: current,
            urls: [current]
        })
    },
})