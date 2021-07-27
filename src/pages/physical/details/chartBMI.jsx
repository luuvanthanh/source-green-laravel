import { memo } from 'react';
import C3Chart from 'react-c3js';

const Index = memo(() => {
  const dataBMI = {
    data: {
      x: 'x',
      columns: [
        ['x', 1, 5, 10],
        ['Tháng', 1, 3, 10]
      ],
      type: 'spline',
      order: 'asc',
    },
    grid: {
      y: {
        show: true
      },
    },
    legend: {
      show: false
    },
    axis: {
      x : {
        label: {
          text: 'Thời gian (tháng)',
          position: 'outer-center',
        },
        type : 'timeseries',
        tick: {
          format (x) {
            return new Date(x).getMonth() + 1;
          }
        }
      },
      y: {
        label: {
          text: 'BMI',
        }
      },
      y2: {
        show: true,
        label: {
          text: '%',
        value: 10,
        },
        value: 10,
        // tick: {
        //   format (x) {
        //     console.log(x);
        //     if (toInteger(x) < 1) {
        //       return 'Test';
        //     }
        //     return '';
        //   }
        // }
      }
    },
    color: {
      pattern: ['#FF8300'],
    },
  };

  return (
    <C3Chart {...dataBMI} />
  );
});

export default Index;
