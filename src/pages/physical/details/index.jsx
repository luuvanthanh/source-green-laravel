import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { history, useLocation } from 'umi';
import { useSelector, useParams, useDispatch } from 'dva';
import C3Chart from 'react-c3js';
import d3 from 'd3';

import { isEmpty, map, get, head, last } from 'lodash';
import Table from '@/components/CommonComponent/Table';
import moment from 'moment';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Text from '@/components/CommonComponent/Text';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Loading from '@/components/CommonComponent/Loading';
import { Helper, variables } from '@/utils';

import styles from './index.scss';
import variablesModule from './variables';

const Index = memo(() => {
  const [
    menuData,
    { details, error },
    loading
  ] = useSelector(({ menu, physicalDetails, loading: { effects } }) => [
    menu.menuLeftPhysical,
    physicalDetails,
    effects,
  ]);
  const weight = !isEmpty(details?.studentCriterias) ? details?.studentCriterias.find(item => item?.criteriaGroupProperty?.property === "Cân nặng") : {};
  const height = !isEmpty(details?.studentCriterias) ? details?.studentCriterias.find(item => item?.criteriaGroupProperty?.property === "Chiều cao") : {};

  const location = useLocation();
  const params = useParams();

  const [dataConfiguration, setDataConfiguration] = useState([]);
  const [dataHistory, setDataHistory] = useState([]);


  const dispatch = useDispatch();
  const mounted = useRef(false);

  const convertData = (data, name, columnName) => {
    const result = [`${columnName}`];
    if (!isEmpty(data)) {
      if (name === 'monthAge') {
        return result.concat(data.map(item => item.monthAge ? item?.monthAge : ''));
      }
      return result.concat(map(data, name));
    }
    return [];
  };

  const header = () => {
    const columns = [
      {
        title: 'Thời gian ',
        key: 'index',
        width: 80,
        render: (record) => record?.date
      },
      {
        title: 'Chiều cao (cm)',
        key: 'index',
        width: 80,
        render: (record) => record?.value
      },
      {
        title: 'Cân nặng (kg)',
        key: 'index',
        width: 80,
        render: (record) => record?.weightReport
      },
    ];
    return columns;
  };
  const dataHeight = {
    data: {
      x: 'x',
      columns: [
        convertData(details?.heightReport, 'monthAge', 'x'),
        convertData(details?.heightReport, 'value', 'Chiều cao'),
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
          text: 'cm',
        }
      },
    },
    color: {
      pattern: ['#27A600'],
    },
  };

  const dataWeight = {
    ...dataHeight,
    data: {
      ...dataHeight.data,
      columns: [
        convertData(details?.weightReport, 'monthAge', 'x'),
        convertData(details?.weightReport, 'value', 'Cân nặng'),
      ],
    },
    axis: {
      ...dataHeight.axis,
      y: {
        label: {
          text: 'kg',
        }
      },
    },
    color: {
      pattern: ['#FF8300'],
    },
  };

  const convertDataBmi = (data, columnName) => {
    const result = [`${columnName}`];
    if (!isEmpty(data)) {
      if (columnName === 'Thiếu cân') {
        return result.concat(data.map(item => item?.value?.medianSmallerFirstSD));
      }
      if (columnName === 'Sức khỏe dinh dưỡng tốt') {
        return result.concat(data.map(item => item?.value?.medianLargerThirdSD - item?.value?.medianSmallerFirstSD));
      }
      if (columnName === 'Nguy cơ béo phì') {
        return result.concat(data.map(item => item?.value?.medianLargerSecondSD - item?.value?.medianLargerThirdSD));
      }
      if (columnName === 'Béo phì') {
        return result.concat(data.map(item => item?.value?.medianLargerFirstSD - item?.value?.medianLargerSecondSD));
      }
      if (columnName === 'BMI') {
        return result.concat(data.map(item => head(item?.dataDetail)?.bmi));
      }
      if (columnName === 'x') {
        return result.concat(data.map(item => item?.monthNumber));
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
        convertDataBmi(dataConfiguration, 'x'),
      ],
      type: 'spline',
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
        value: 'spline'
      },
      groups: [
        ['Thiếu cân', 'Sức khỏe dinh dưỡng tốt', 'Nguy cơ béo phì', 'Béo phì']
      ]
    },
    point: {
      show: false
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

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (params?.id) {
      dispatch({
        type: 'physicalDetails/GET_DETAILS',
        payload: {
          id: params?.id
        },
      });
    }
  }, [params?.id]);

  useEffect(() => {
    if (details) {
      setDataHistory(details?.heightReport?.map(i => ({ ...i, weightReport: head(details?.weightReport?.filter(k => k?.monthAge === i?.monthAge))?.value })).reverse());
    }
    if (details?.student?.sex) {
      dispatch({
        type: 'physicalDetails/GET_CONFIRMATION',
        payload: { type: details?.student?.sex === 'MALE' ? 'BMIMALE' : 'BMIFEMALE' },
        callback: (response) => {
          if (response) {
            setDataConfiguration((response?.items?.map(i => ({ ...i, dataDetail: details?.bmiReport?.filter(k => k?.monthAge === i?.monthNumber) })))?.filter(i => !isEmpty(i?.dataDetail)));
          }
        }
      });
    }
  }, [details]);

  const getAvatar = (images) => {
    const avatar = images ? JSON.parse(images) : [];
    if (!isEmpty(avatar)) {
      return avatar[0];
    }
    return '';
  };

  const getStatus = (status, text = '') => {
    const nameStatus = variablesModule.STATUS_NAME[status];
    if (status && status !== 'NORMAL') {
      return (
        <span className="text-danger ml5">
          {`${text ? `${text} ` : ''} ${text ? String(nameStatus).toLowerCase() : nameStatus}`}
        </span>
      );
    }
    return (
      <span className="text-success ml5">
        {nameStatus || variablesModule.STATUS_NAME.NORMAL}
      </span>
    );
  };

  return (
    <Loading loading={loading['physicalDetails/GET_DETAILS']} isError={error.isError} params={{ error, goBack: '/phat-trien-the-chat/tat-ca-hoc-sinh' }}>
      <Helmet title="Chi tiết phát triển thể chất học sinh" />
      <Breadcrumbs last={details?.student?.fullName || ''} menu={menuData} />
      <Pane className="p20">
        <div className={styles['container-information-student']}>
          <div
            className={styles['avatar-student']}
            style={{ backgroundImage: `url(${API_UPLOAD}${getAvatar(details?.student?.fileImage)})` }}
          />
          <div className={styles['information-student']}>
            <div className="d-flex justify-content-between align-items-center flex-wrap mb20">
              <Heading className={styles.title} type="page-title">{details?.student?.fullName || ''}</Heading>
              <Button
                color="success"
                icon="plus"
                onClick={() => history.push(`${location?.pathname}/nhap-the-chat`)}
              >
                Nhập thể chất
              </Button>
            </div>
            <div className={styles['detail-information-student']}>
              <div className={styles['group-attribute']}>
                <p className={styles['name-attribute']}>Tuổi (tháng)</p>
                <p className={styles['value-attribute']}>{details?.student?.age || 0}</p>
              </div>
              <div className={styles['group-attribute']}>
                <p className={styles['name-attribute']}>Cơ sở</p>
                <p className={styles['value-attribute']}>{details?.student?.class?.branch?.name || ''}</p>
              </div>
              <div className={styles['group-attribute']}>
                <p className={styles['name-attribute']}>Lớp</p>
                <p className={styles['value-attribute']}>{details?.student?.class?.name || ''}</p>
              </div>
              <div className={styles['group-attribute']}>
                <p className={styles['name-attribute']}>Chiều cao (cm)</p>
                <p className={styles['value-attribute']}>{height?.value || 0}</p>
              </div>
              <div className={styles['group-attribute']}>
                <p className={styles['name-attribute']}>Cân nặng (kg)</p>
                <p className={styles['value-attribute']}>
                  {weight?.value || 0} {getStatus(details?.bmiConclusion?.status)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className={styles.block}>
              <Heading className="text-success mb10" type="page-title">BÁO CÁO CHIỀU CAO</Heading>
              <Text>{height?.value || 0} cm - Nhập ngày {Helper.getDate((height?.reportDate || moment()), variables.DATE_FORMAT.DATE_MONTH)}</Text>
              <Text size="normal" className="mb20 font-size-14">Biểu đồ báo cáo {head(details?.heightReport)?.monthAge} Tháng Tuổi - {last(details?.heightReport)?.monthAge} Tháng Tuổi</Text>
              <C3Chart {...dataHeight} />
            </div>
          </div>
          <div className="col-lg-6">
            <div className={styles.block}>
              <Heading className="text-success mb10" type="page-title">BÁO CÁO CÂN NẶNG</Heading>
              <Text>{weight?.value || 0} kg - Nhập ngày {Helper.getDate((weight?.reportDate || moment()), variables.DATE_FORMAT.DATE_MONTH)}</Text>
              <Text size="normal" className="mb20 font-size-14">Biểu đồ báo cáo {head(details?.weightReport)?.monthAge} Tháng Tuổi - {last(details?.weightReport)?.monthAge} Tháng Tuổi</Text>
              <C3Chart {...dataWeight} />
            </div>
          </div>
          <div className="col-lg-6">
            <div className={styles.block}>
              <Heading className="text-success mb10" type="page-title">Báo cáo BMI</Heading>
              <Text>Chỉ số BMI: {get(details, 'bmiConclusion.bmi', 0).toFixed(2)}</Text>
              <Text size="normal" className="mb20 font-size-14">Biểu đồ báo cáo BMI  {head(details?.bmiReport)?.monthAge} Tháng Tuổi - {last(details?.bmiReport)?.monthAge} Tháng Tuổi</Text>
              <C3Chart {...dataBmi} />
              <div className={styles['wrapper-conclude']}> 
              <div className="d-flex align-items-center">
                <h3 className={styles.title}>Kết luận </h3>
                <p className={styles.conclude} style={{color :  variablesModule.STATUS_COLOR.[details?.bmiConclusion?.status] }}>Trẻ đang ở trạng thái { variablesModule.STATUS.[details?.bmiConclusion?.status]} </p>
              </div>
              <p className={styles.content}>{details?.bmiConclusion?.statusText}</p>
            </div>
              </div>
          </div>
          <div className="col-lg-6">
            <div className={styles.block}>
              <Heading className="text-success mb10" type="page-title">Lịch sử phát triển</Heading>
              <Table
                columns={header()}
                dataSource={dataHistory}
                pagination={false}
                params={{
                  header: header(),
                  type: 'table',
                }}
                rowKey={(record) => record.id}
                scroll={{ x: '100%' }}
              />
            </div>
          </div>
        </div>
      </Pane>
    </Loading>
  );
});

export default Index;
