// pages/feedback/index.js
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    //选择图片
    ChooseImage() {
        wx.chooseMedia({
            count: 3, //默认9,我们这里最多选择8张
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
})