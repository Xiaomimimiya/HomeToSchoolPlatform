Page({
    data: {
        examData: "",
        exam_type: "",
        currentQuestionIndex: 0,
        letters: ['A', 'B', 'C', 'D', 'E', 'F'],
        currentQuestion: {},
        selectedOptionIndex: -1,
        answer: "",
        analyze: "",
        popup1: {
            show: false
        },
    },
    onLoad: function (options) {
        let user = wx.getStorageSync('user')
        this.setData({
            userInfo: user
        })
        this.setData({
            exam_type: options.type
        })
        this.getExamData(options.type); // 加载题目数据
    },
    // 数据请求
    getExamData(type) {
        let db = wx.cloud.database()
        let that = this
        db.collection('educationExam')
            .where({
                type
            })
            .get({
                success(res) {
                    console.log(String.fromCharCode(65))
                    that.setData({
                        examData: res.data
                    });
                    that.setCurrentQuestion(); // 在成功获取数据后设置当前题目
                },
                fail(err) {
                    console.log(err);
                },
            })
    },
 
    isSelected: function (index) {

    },
    setCurrentQuestion: function () {
        let that = this
        const index = that.data.currentQuestionIndex;
        that.setData({
            currentQuestion: that.data.examData[index],
            answer: that.data.examData[index].answer
        });
    },
    selectOption: function (e) {
        let that = this
        const index = e.currentTarget.dataset.index;

        // 判断选项是否正确，并弹出答案
        if (that.data.letters[index] === that.data.answer) {
            wx.showToast({
                title: '答对了',
                icon: 'success'
            });

        } else {
            wx.showToast({
                title: '答错了',
                icon: 'error'
            });
        }
    },
    prevQuestion: function () {
        let that = this
        const index = that.data.currentQuestionIndex;
        if (index > 0) {
            that.setData({
                currentQuestionIndex: index - 1
            });
            that.setCurrentQuestion();
        }
        if (index == 0) {
            wx.showToast({
                icon: "error",
                title: '已经是第一题',
            })
        }
    },
    nextQuestion: function () {
        let that = this
        const index = that.data.currentQuestionIndex;
        if (index < that.data.examData.length - 1) {
            that.setData({
                currentQuestionIndex: index + 1
            });
            that.setCurrentQuestion();
        }
        if (index == that.data.examData.length - 1) {
            wx.showToast({
                icon: "error",
                title: '已经是最后一题',
            })
        }
    },
    // 点击弹窗事件
    showPopup(event) {
        const id = event.currentTarget.dataset.id;
        let analyze = event.currentTarget.dataset.analyze
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
        this.setData({
            analyze: analyze
        })
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
  
});