import { memo, useEffect, useState } from 'react';
import C3Chart from 'react-c3js';
import PropTypes from 'prop-types';

import bmiJson from './bmi.json';

const Index = memo(({ details }) => {
  const [dataBMI, setDataBMIs] = useState({
    data: {
      x: 'x',
      columns: [
        ['x'],
        ['Tháng',]
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
      show: true
    },
    axis: {
      x : {
        label: {
          text: 'Tuổi (tháng)',
          position: 'outer-center',
        },
      },
      y: {
        label: {
          text: 'BMI',
        }
      },
    },
    color: {
      pattern: ['#0019F8', '#FC696A', '#E2E22B', '#71E47D', "#fff"]
    },
  });

  const handleDataJson = () => {
    const lsBmi = bmiJson[`${(details?.student?.sex || 'male').toLowerCase()}`];
    const lsBmiConvert = lsBmi.map((val) => ({
      a: {
        label: '5th',
        value: parseFloat(val.P5, 10),
        month: parseInt(val.Month, 10)
      },
      b: {
        label: '85th',
        value: parseFloat(val.P85, 10),
        month: parseInt(val.Month, 10)
      },
      c: {
        label: '95th',
        value: parseFloat(val.P95, 10),
        month: parseInt(val.Month, 10)
      },
      d: {
        label: '99th',
        value: parseFloat(val.P99, 10),
        month: parseInt(val.Month, 10)
      }
    }));

    const lsDataX = lsBmiConvert.map((val) => val.a.month);
    const lsDataY = lsBmiConvert.map((val) => val.a.value + (val.b.value - val.a.value) / 2);

    setDataBMIs((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        columns: [
          ['x', ...lsDataX],
          ['BMI', ...lsDataY],
          ['Béo phì', ...[...lsBmi].map((val) => val.P99)],
          ['Gần Béo phì', ...[...lsBmi].map((val) => val.P95)],
          ['Sức khỏe tốt', ...[...lsBmi].map((val) => val.P85)],
          ['Thiếu Cân', ...[...lsBmi].map((val) => val.P5)],
        ],
        types: {
          'Béo phì': 'area-spline',
          'Gần Béo phì': 'area-spline',
          'Sức khỏe tốt': 'area-spline',
          'Thiếu Cân': 'area-spline'
        },
        // groups: [['Béo phì', 'Gần Béo phì', 'Sức khỏe tốt', 'Thiếu Cân']]
      }
    }));
  };


  useEffect(() => {
    if (details?.student) {
      handleDataJson();
    }
  }, [details]);

  return (
    <C3Chart {...dataBMI} />
  );
});

Index.propTypes = {
  details: PropTypes.objectOf(PropTypes.any)
};

Index.defaultProps = {
  details: {},
};


export default Index;
