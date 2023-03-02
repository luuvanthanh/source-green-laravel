import { memo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, head } from 'lodash';
import d3 from 'd3';
import C3Chart from 'react-c3js';
import { useDispatch } from 'dva';
import Table from '@/components/CommonComponent/Table';
import variablesModules from '../utils/variables';


import stylesModule from '../styles.module.scss';

import '@/assets/styles/Modules/TimeTables/styles.module.scss';

const Index = memo(({
  dataDetailItem,
}) => {
  const dispatch = useDispatch();
  const mounted = useRef(false);

  const [dataConfiguration, setDataConfiguration] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [checkLoad, setCheckLoad] = useState(false);
  const [dataDetailBmi, setDataDetailBmi] = useState({});

  useEffect(() => {
    if (!isEmpty(dataDetailItem?.student?.sex) && !checkLoad) {
      setCheckLoad(true);
      dispatch({
        type: 'physicalPeriodicMeasurementConfirmed/GET_BMI_STUDENT',
        payload: { fromDate: dataDetailItem?.assessmentPeriod?.startDate, ToDate: dataDetailItem?.assessmentPeriod?.endDate, studentId: dataDetailItem?.student?.id },
        callback: (response) => {
          if (!isEmpty(response)) {
            setDataDetailBmi(response);
            setDataTable([
              {
                name: 'Chiều cao',
                index: response?.studentCriterias.find(item => item?.criteriaGroupProperty?.property === "Chiều cao")?.value,
              },
              {
                name: 'Cân nặng',
                index: response?.studentCriterias.find(item => item?.criteriaGroupProperty?.property === "Cân nặng")?.value,
              },
              {
                name: 'BMI',
                index: response?.bmiConclusion?.bmi.toFixed(1),
              },
            ]);
            dispatch({
              type: 'physicalPeriodicMeasurementConfirmed/GET_CONFIRMATION',
              payload: { type: dataDetailItem?.student?.sex === 'MALE' ? 'BMIMALE' : 'BMIFEMALE' },
              callback: (responseItem) => {
                if (responseItem) {
                  setDataConfiguration((responseItem?.items?.map(i => ({ ...i, dataDetail: response?.bmiReport?.filter(k => k?.monthAge === i?.monthNumber) })))?.filter(i => !isEmpty(i?.dataDetail)));
                }
              }
            });
          }
        }
      });
    }
  }, [dataDetailItem]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const convertDataBmi = (data, columnName) => {
    const result = [`${columnName}`];
    const maxBmi = Math.max(...data.map(i => head(i?.dataDetail)?.bmi));
    const maxMedianLargerThirdSD = Math.max(...data.map(i => i?.value?.medianLargerThirdSD));
    if (!isEmpty(data)) {
      if (columnName === 'Thiếu cân') {
        return result.concat(data.map(item => item?.value?.medianSmallerFirstSD));
      }
      if (columnName === 'Sức khỏe dinh dưỡng tốt') {
        return result.concat(data.map(item => item?.value?.medianLargerFirstSD - item?.value?.medianSmallerFirstSD));
      }
      if (columnName === 'Nguy cơ béo phì') {
        return result.concat(data.map(item => item?.value?.medianLargerSecondSD - item?.value?.medianLargerFirstSD));
      }
      if (columnName === 'Béo phì') {
        if (maxBmi > maxMedianLargerThirdSD) {
          return result.concat(data.map(item => maxBmi - item?.value?.medianLargerSecondSD));
        }
        return result.concat(data.map(item => item?.value?.medianLargerThirdSD - item?.value?.medianLargerSecondSD));
      }
      if (columnName === 'BMI') {
        return result.concat(data.map(item => head(item?.dataDetail)?.bmi));
      }
      if (columnName === 'x') {
        return result.concat(data.map(item => item?.monthNumber));
      }
      if (columnName === 'Chỉ số BMI') {
        return result.concat(data.map(item => head(item?.dataDetail)?.bmi));
      }
    }
    return [];
  };

  const dataBmi = {
    data: {
      x: 'x',
      columns: [
        convertDataBmi(dataConfiguration, 'Thiếu cân'),
        convertDataBmi(dataConfiguration, 'Sức khỏe dinh dưỡng tốt'),
        convertDataBmi(dataConfiguration, 'Nguy cơ béo phì'),
        convertDataBmi(dataConfiguration, 'Béo phì'),
        convertDataBmi(dataConfiguration, 'BMI'),
        convertDataBmi(dataConfiguration, 'Chỉ số BMI'),
        convertDataBmi(dataConfiguration, 'x'),
      ],
      type: 'scatter',
      order: false,
      colors: {
        'Thiếu cân': d3.rgb('#FFFFFF').darker(0),
        'Sức khỏe dinh dưỡng tốt': d3.rgb('#71E47D').darker(0),
        'Nguy cơ béo phì': d3.rgb('#E2E22B').darker(0),
        'Béo phì': d3.rgb('#FC696A').darker(0),
      },
      types: {
        'Thiếu cân': 'area-spline',
        'Sức khỏe dinh dưỡng tốt': 'area-spline',
        'Nguy cơ béo phì': 'area-spline',
        'Béo phì': 'area-spline',
        'Chỉ số BMI': 'spline',
        value: 'spline',
      },
      groups: [
        ['Thiếu cân', 'Sức khỏe dinh dưỡng tốt', 'Nguy cơ béo phì', 'Béo phì']
      ],
    },
    note: false,
    point: {
      show: false
    },
    tooltip: {
      grouped: false,
      format: {
        title() { return ""; },
        value(value, ratio, id) {
          return id === 'BMI' ? value.toFixed(1) : "";
        }
      }
    },
    axis: {
      x: {
        label: {
          text: 'Tuổi (tháng)',
          position: 'outer-center',
        },
        type: '',
        tick: {
          format(x) {
            return x;
          }
        }
      },
      y: {
        label: {
          text: 'BMI',
        },
        min: 11,
      },
    },
    color: {
      pattern: ['#0019F8'],
    },
  };

  const header = () => [
    {
      title: 'Chỉ số',
      key: 'name',
      className: 'min-width-200',
      render: (record) => (record?.name),
    },
    {
      title: 'Đo lường',
      key: 'name',
      className: 'min-width-200',
      render: (record) => record?.index,
    },
  ];

  return (
    <div className='row'>
      <div className='col-lg-6'>
        <C3Chart {...dataBmi} />
      </div>
      <div className='col-lg-6'>
        <div className={stylesModule['wrapper-table']}>
          <Table
            columns={header()}
            dataSource={dataTable}
            pagination={false}
            rowKey={(record) => record?.name}
            scroll={{ x: '100%' }}
            isEmpty
          />
          <div className={stylesModule['wrapper-conclude']}>
            <div className="d-flex align-items-center">
              <h3 className={stylesModule.title}>Kết luận </h3>
              <p className={stylesModule.conclude} style={{ color: variablesModules.STATUS_COLOR?.[dataDetailBmi?.bmiConclusion?.status] }}>Trẻ đang ở trạng thái {variablesModules.STATUS_BMI?.[dataDetailBmi?.bmiConclusion?.status]} </p>
            </div>
            <p className={stylesModule.content}>{dataDetailBmi?.bmiConclusion?.statusText}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

Index.propTypes = {
  dataDetailItem: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  dataDetailItem: {},
};

export default Index;