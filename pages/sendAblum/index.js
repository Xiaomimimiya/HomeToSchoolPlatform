// pages/chatSend/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: "",
        imgList: [],
        fileIDs: [],
        index:0,
     
    },
    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
    },
    //选择图片
    ChooseImage() {
        wx.chooseMedia({
            count: 6, //默认9,我们这里最多选择8张
            sizeType: ['compressed'], //可以指定是原图还是压缩图，这里用压缩
            sourceType: ['album', 'camera'], //从相册选择,
            camera: ["back"],
            success: (res) => {
                
                const tempFilePaths = res.tempFiles.map(file => file.tempFilePath);
                if (this.data.imgList.length != 0) {
                    this.setData({
                        imgList: this.data.imgList.concat(tempFilePaths)
                    })
                } else {
                    this.setData({
                        imgList: tempFilePaths
                    })
                }
               
            }
        });
    },
    //删除图片
    DeleteImg(e) {
        wx.showModal({
            title: '要删除这张照片吗？',
            content: '',
            cancelText: '取消',
            confirmText: '确定',
            success: res => {
                if (res.confirm) {
                    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
                    this.setData({
                        imgList: this.data.imgList
                    })
                }
            }
        })


    },
    bindPickerChange(e) {
        this.setData({
            index: e.detail.value
        })

    },
    //    内容发布
    publish(e) {
        let sendData = e.detail.value
        let db = wx.cloud.database()
       
        wx.showLoading({
            title: '发布中...',
        })

        const promiseArr = []
        //一张张上传 遍历临时的图片数组
        for (let i = 0; i < this.data.imgList.length; i++) {
            let filePath = this.data.imgList[i]
            // 正则表达式，获取文件扩展名
            let suffix = /\.[^\.]+$/.exec(filePath)[0];

            promiseArr.push(new Promise((reslove, reject) => {
                wx.cloud.uploadFile({
                    cloudPath: "classAblum/" + new Date().getTime() + suffix,
                    filePath: filePath, // 上传文件路径
                }).then(res => {
                   
                    this.setData({
                        fileIDs: this.data.fileIDs.concat(res.fileID)
                    })
                    reslove()
                }).catch(error => {
                    console.log("上传失败", error)
                })
            }))
        }
        //所有图片都上传成功后

        Promise.all(promiseArr).then(res => {
            db.collection('ablum').add({
                data: {
                    _createTime: new Date().getTime(),
                  
                    classname: this.data.userInfo.classname,
                    type:sendData.type,
                   
                  

                    imagelist: this.data.fileIDs,
                   
                },
                success: res => {

                    wx.hideLoading()
                    wx.showToast({
                        title: '发布成功',
                    })
                    //清空数据
                    this.setData({
                        imgList: [],
                        fileIDs: [],
                    })
                  
                    wx.navigateTo({
                        url: '/pages/classRoom/index',
                    })

                },
                fail: err => {
                    wx.hideLoading()
                    wx.showToast({
                        icon: 'none',
                        title: '网络不给力....'
                    })
                    console.error('发布失败', err)
                }
            })
        })
    },
})