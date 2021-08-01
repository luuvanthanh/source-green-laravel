import { memo, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { history, useLocation } from 'umi';
import { useSelector, useParams, useDispatch } from 'dva';
import C3Chart from 'react-c3js';
import { isEmpty, map, get } from 'lodash';
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
import ChartBMI from './chartBMI';

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
  const dispatch = useDispatch();

  const mounted = useRef(false);

  const convertData = (data, name, columnName) => {
    const result = [`${columnName}`];
    if (!isEmpty(data)) {
      if (name === 'date') {
        return result.concat(data.map(item => item.date ? moment(item.date, 'MM/YYYY').format(variables.DATE_FORMAT.DATE_AFTER) : ''));
      }
      return result.concat(map(data, name));
    }
    return [];
  };

  const dataHeight = {
    data: {
      x: 'x',
      columns: [
        convertData(details?.heightReport, 'date', 'x'),
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
        convertData(details?.weightReport, 'date', 'x'),
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
              <Text size="normal" className="mb20 font-size-14">Biểu đồ báo cáo Tháng {Helper.getDate(details?.fromDate, variables.DATE_FORMAT.MONTH_YEAR)} - Tháng {Helper.getDate(details?.toDate, variables.DATE_FORMAT.MONTH_YEAR)}</Text>
              <C3Chart {...dataHeight} />
            </div>
          </div>
          <div className="col-lg-6">
            <div className={styles.block}>
              <Heading className="text-success mb10" type="page-title">BÁO CÁO CÂN NẶNG</Heading>
              <Text>{weight?.value || 0} kg - Nhập ngày {Helper.getDate((weight?.reportDate || moment()), variables.DATE_FORMAT.DATE_MONTH)}</Text>
              <Text size="normal" className="mb20 font-size-14">Biểu đồ báo cáo Tháng {Helper.getDate(details?.fromDate, variables.DATE_FORMAT.MONTH_YEAR)} - Tháng {Helper.getDate(details?.toDate, variables.DATE_FORMAT.MONTH_YEAR)}</Text>
              <C3Chart {...dataWeight} />
            </div>
          </div>
          <div className="col-lg-6">
            <div className={styles.block}>
              <Heading className="text-success mb10" type="page-title">Báo cáo BMI</Heading>
              <Text>Chỉ số BMI: {get(details, 'bmiConclusion.bmi', 0).toFixed(2)}</Text>
              <p className="mb20 font-size-16 font-weight-bold">Biểu đồ BMI</p>
              <ChartBMI details={details}/>
              <div className={styles['result-bmi']}>
                <p className="font-weight-bold font-size-15 mb0">Kết Luận: {getStatus(details?.bmiConclusion?.status, 'Học sinh')}</p>
                {details?.bmiConclusion?.status && details?.bmiConclusion?.status !== 'NORMAL' ? (
                  <p className="font-size-15 mb0">Cân nặng cần đạt được: <span className="text-danger mx5">{details?.bmiConclusion?.ideaWeight.toFixed(1) || 0}</span>kg</p>
                ) : (
                  <p className="font-size-15 mb0">Cần giữ chế độ ăn uống hiện tại của trẻ</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Pane>
    </Loading>
  );
});

export default Index;
