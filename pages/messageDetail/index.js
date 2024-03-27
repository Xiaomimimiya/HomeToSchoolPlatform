const app = getApp()


Page({
    data: {
        userInfo: "",
        record_id: "",
        chat_detail: "",
        inputValue:"",
     
    
    },
    onLoad: function (options) {
        this.setData({
            record_id: options.id
        })
        this.getChatList()
      
    },
    
    onShow() {
        let user = wx.getStorageSync('user')
        this.setData({
            user_id: user._id,
            userInfo: user
        })
        this.getChatList()

    },
    //获取聊天数据 

    getChatList() {
        let that = this
        let db = wx.cloud.database()
        db.collection('chatlist').doc(that.data.record_id)
        .get({
            success(res) {
                let data = res.data
                that.setData({
                    chat_detail: data
                })
               
                if (data.send_user_name===that.data.userInfo.username) {
                    wx.setNavigationBarTitle({
                        title: data.recever_user_name
                    })
                } else {
                    wx.setNavigationBarTitle({
                        title: data.send_user_name
                    })
                }
                that.handleSortedMessageList(data.message);
            },
        })
    },
   
    handleInput(e) {
        clearTimeout(this.data.time)
        var that = this;
        this.data.time = setTimeout(() => {
            that.getInputValue(e.detail.value)
        }, 200)
    },
    getInputValue(value) {
        console.log(value);
        this.setData({
            inputValue: value
        })
    },
    publishMessage() {
        let that = this
        if (that.data.inputValue.trim() == "") {
            wx.showToast({
                icon: "none",
                title: '不能发送空消息',
            })
            return;
        }
        let db = wx.cloud.database()
        db.collection('chatlist').doc(that.data.record_id)
            .get({
                success(res) {
                    let chat_message = res.data.message;
                    var message = {}
                    message.send_user_id = that.data.userInfo._id
                    message.content = that.data.inputValue
                    message.time = new Date().getTime()
                    chat_message.push(message)
                    db.collection('chatlist').doc(that.data.record_id).update({
                        data: {
                            message: chat_message,   
                        },
                        success(res) {
                            that.getChatList(),
                                that.setData({
                                    inputValue: ''
                                })
                        },
                        fail(err) {
                            console.log(err);
                        }
                    })
                }
               
            })

    },
    // sendImage() {
    //     let  that= this
    //     wx.chooseMedia({
    //         count: 1,
    //         mediaType: ["image"],
    //         sourceType: ['album', 'camera'],
    //         camera: 'back',
    //         success(res) {
    //             let tempFiles = res.tempFiles[0].tempFilePath
    //             console.log(tempFiles);
    //             that.setData({
    //                 inputValue: tempFiles
    //             })
    //             let db = wx.cloud.database()
    //             db.collection('chat_list').doc(that.data.record_id)
    //                 .get({
    //                     success(res) {
    //                         console.log("数据请求成功");
    //                         let chat_record = res.data.chat_record;
    //                         console.log(chat_record);
    //                         var message = {}
    //                         message.id = that.data.userInfo._id
    //                         message.text = that.data.inputValue
    //                         message.time = new Date().getTime()

    //                         console.log(message);
    //                         chat_record.push(message)
    //                         console.log(chat_record);

    //                         db.collection('chat_list').doc(that.data.record_id).update({
    //                             data: {
    //                                 chat_record: chat_record,
    //                                 time: new Date().getTime()
    //                             },
    //                             success(res) {
    //                                 that.getChatList(),
    //                                     that.setData({
    //                                         inputValue: ''
    //                                     })
    //                             },
    //                             fail(err) {
    //                                 console.log(err);
    //                             }

    //                         })
    //                     },
    //                     fail(err) {
    //                         console.log(err);
    //                     }
    //                 })
    //         }
    //     })
    // },
    // previewImage(e) {
    //     let url = e.currentTarget.dataset.url.text;
    //     console.log(url);
    //     wx.previewImage({
    //         current: url,
    //         urls: [url]
    //     })
    // },
})