import React, { useEffect, useRef } from 'react';
var echarts = require('echarts');

const Charts = () => {
  const chartsRef = useRef();
  useEffect(() => {
    const myChart = echarts.init(chartsRef.current);
    myChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
          var tar = params[0]
          return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
        }
      },
      legend: {
        data: ['支出', '收入']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        splitLine: { show: false },
        data: function () {
          var list = [];
          for (var i = 1; i <= 2; i++) {
            list.push('11月' + i + '日');
          }
          return list;
        }()
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '收入',
          type: 'bar',
          stack: '总量',
          label: {
            show: true,
            position: 'top'
          },
          data: [[0, 90]]
        },
        {
          name: '支出',
          type: 'bar',
          stack: '总量',
          label: {
            show: true,
            position: 'bottom'
          },
          data: [[1, 10]]
        }
      ]
    });
  }, []);
  return (
    <div ref={chartsRef} style={{ height: 600, width: 1000 }}></div>
  )
};

export default Charts;