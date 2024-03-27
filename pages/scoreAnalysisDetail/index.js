Page({
    data: {
        details: "",
        scoreArray: "",
        title: "",
        total_Score:""
    },
    onLoad(options) {
        let that = this
        let item = JSON.parse(options.item)
        let scoreArray = Object.entries(item.score);
        that.setData({
            details: item,
            scoreArray: scoreArray,
            title: options.title
        })
       
        const context = wx.createCanvasContext('barChart');
        // 学科和成绩数据
        const data = that.data.details.score
        const scores = Object.values(data);
        const total_Score = scores.reduce((total, score) => total + score, 0)
        
        that.setData({
            total_Score:total_Score
        })
        const averageScore = scores.reduce((total, score) => total + score, 0) / scores.length;
        const chartWidth = 250; // 图表宽度
        const chartHeight = 150; // 图表高度
        const margin = 20; // 边距
        const barSpacing = 20; // 柱状图之间的间距
        const maxDataValue = 100; // 数据中的最大值

        const barWidth = (chartWidth - (Object.keys(data).length - 1) * barSpacing) / Object.keys(data).length; // 柱状图宽度

        // 绘制柱状图
        let i = 0;
        for (const subject in data) {
            const score = data[subject];
            const barHeight = (score / maxDataValue) * chartHeight;
            const x = margin + i * (barWidth + barSpacing);
            const y = chartHeight - barHeight + margin;

            context.setFillStyle('#00f');
            context.fillRect(x, y, barWidth, barHeight);

            // 绘制数据标签
            context.setFillStyle('#000');
            context.setFontSize(12);
            const labelX = x + barWidth / 2 - context.measureText(score.toString()).width / 2; // 计算标签居中位置
            const labelY = y - 5;
            context.fillText(score.toString(), labelX, labelY);

            // 绘制横坐标标签
            context.setFillStyle('#000');
            context.setFontSize(12);
            const categoryX = x + barWidth / 2 - context.measureText(subject).width / 2; // 计算标签居中位置
            const categoryY = chartHeight + margin + 15;
            context.fillText(subject, categoryX, categoryY);

            i++;
        }

        // 绘制纵坐标标签
        context.setFillStyle('#000');
        context.setFontSize(12);
        // 绘制平均数横线
        const averageLineY = chartHeight - (averageScore / maxDataValue) * chartHeight + margin;
        context.setLineWidth(2);
        context.setStrokeStyle('#f00');
        context.beginPath();
        context.moveTo(margin, averageLineY);
        context.lineTo(margin + chartWidth, averageLineY);
        context.stroke();

        context.setFillStyle('#f00');
        context.setFontSize(12);
        const averageLabelX = margin + chartWidth + 5;
        const averageLabelY = averageLineY + 4;
        context.fillText(averageScore, averageLabelX, averageLabelY);

        context.draw();
    },
    onShow() {

    }
})