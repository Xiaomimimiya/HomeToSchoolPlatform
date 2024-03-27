Page({

    data: {
        chatList: [],
        hotList: [],
        userInfo: "",
        active: 0,
        searchKey: '', //搜索词
        SearchList: ""
    },
    onShow() {
        this.getChattList()
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
    },
    getChattList() {
        let that = this
        let db = wx.cloud.database()
        db.collection('chatdata')
            .where({
                type: "交流论坛"
            })
            .orderBy("_createTime", "desc")
            .get({
                success(res) {

                    that.setData({
                        chatList: res.data,
                    })
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
    // 跳转到详情界面
    goDetail(e) {
        let id = e.currentTarget.dataset.id

        let that = this
        if (!that.data.userInfo) {
            wx.showToast({
                icon: "error",
                title: '您还未登录',
            })
        } else {
            wx.navigateTo({
                url: "/pages/forumDetail/index?id=" + id
            })
        }

    },
    goSend() {
        let that = this
        if (!that.data.userInfo) {
            wx.showToast({
                icon: "error",
                title: '您还未登录',
            })
        } else {
            wx.navigateTo({
                url: '/pages/forumSend/index',
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
    // 搜索功能实现
    getSearchKey(e) {
        this.setData({
            searchKey: e.detail.value //搜索词
        })
    },
    goSearch() {
        this.getForumList('search', this.data.searchKey)
        let data = this.getForumList('search', this.data.searchKey)
    },
    getForumList(action, searchKey) {
        wx.cloud.callFunction({
            name: "getForumDetail",
            data: {
                action: action,
                searchKey: searchKey
            }
        }).then(res => {
            let dataList = res.result.data;
            this.setData({
                SearchList: dataList,
            })
            if (dataList.length == 0) {
                wx.showToast({
                    icon: "error",
                    title: '没有搜索结果',
                })
            }
        }).catch(res => {

        })
    },
    deleteList(e) {
        let that = this
        let id = e.currentTarget.dataset.id
       let db = wx.cloud.database()
        wx.showModal({
            title: '确认删除',
            content: '删除您发的帖子？',
            complete: (res) => {
                if (res.cancel) {
                    wx.showToast({
                        icon: "none",
                        title: '取消删除',
                    })
                }

                if (res.confirm) {
                    db.collection("chatdata").where({
                        _id: id
                    }).remove({
                        success: res => {
                            wx.showToast({
                                icon: "success",
                                title: '删除成功',
                            })
                            that.onShow()
                        },
                        fail: err => {
                            console.error(err)
                        }
                    })


                    wx.showToast({
                        icon: "success",
                        title: '删除成功',
                    })
                }
            }
        })
    },
    CancleSearch() {
        this.setData({
            searchKey: '', //搜索词
            SearchList: ""
        })
        this.getChattList()
    },
    showUseInfo(e){
        let that = this
        let id = e.currentTarget.dataset.item
        if (!that.data.userInfo) {
            wx.showToast({
                icon: "error",
                title: '您还未登录',
            })
        } else {
            wx.navigateTo({
                url: "/pages/userInfo/index?id=" + id
            })
        }
      
       
    },
    onUnload: function () {
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 2]
        console.log(prevPage.route);
        if (prevPage.route === 'pages/forumSendindex') {
            wx.switchTab({
                url: '/pages/forumPage/index',
            })
        }
    },
    goPage(event) {
        // 获取传入的值
        let type = event.currentTarget.dataset.icon
        let that = this
        if (!that.data.userInfo) {
            wx.showToast({
                icon: "error",
                title: '您还未登录',
            })
        } else {
            wx.navigateTo({
                url: "/pages/forumType/index?type=" + type
            })
        }
    },
    

})