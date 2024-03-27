// pages/suggestions/index.js
Page({

    data: {
        active: 0,
        suggData:"",
        teacherData:"",
        title:"",
        reply:"",
        content:"",
        popup1: {
            show: false
        },
    },
    onShow(){
        this.getSuggData()
        this.getTeacherata()
    },
    getSuggData() {
        let db = wx.cloud.database()
        let that = this
        db.collection('suggestion')
            .orderBy("_createTime", "desc")
            .where({
                type:"建议内容"
            })
            .get({
                success(res) {
                    that.setData({
                        suggData: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    getTeacherata() {
        let db = wx.cloud.database()
        let that = this
        db.collection('suggestion')
            .orderBy("_createTime", "desc")
            .where({
                type:"校长信箱"
            })
            .get({
                success(res) {
                    that.setData({
                        teacherData: res.data
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    goSend() {
        wx.navigateTo({
            url: '/pages/suggestionsSend/index',
        })
    },
    showPopup(event) {
        const id = event.currentTarget.dataset.id;
        let title = event.currentTarget.dataset.title;
        let content = event.currentTarget.dataset.content;
        let reply = event.currentTarget.dataset.reply;
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
            title: title,
            content:content,
            reply:reply
        })
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
    onUnload: function () {
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 2]
        console.log(prevPage.route);
        if (prevPage.route === 'pages/suggestionsSend/index') {
            wx.switchTab({
                url: '/pages/index/index',
            })
        }
    },
})