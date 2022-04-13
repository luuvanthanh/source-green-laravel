import { memo, useEffect, useState } from 'react';
import { Form, notification } from 'antd';
import { useHistory, useLocation } from 'umi';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'dva';

import common from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import moment from 'moment';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import styles from './styles.modules.scss';

const General = memo(() => {
  const [
    branches,
    classes,
    students,
    dataPipiPupu,
    groupProperty,
    detailsStudent,
    dataWater,
    dataHeight,
  ] = useSelector(({ OPProfile }) => [
    OPProfile.branches,
    OPProfile.classes,
    OPProfile.students,
    OPProfile.dataPipiPupu,
    OPProfile.groupProperty,
    OPProfile.detailsStudent,
    OPProfile.dataWater,
    OPProfile.dataHeight,
  ]);
  const dispatch = useDispatch();
  const [loadData, setLoadData] = useState(false);
  const [formCheck, setFormCheck] = useState(false);
  const [checkStudent, setCheckStudent] = useState(false);
  const [pipi, setPipi] = useState();
  const [pupu, setPupu] = useState([]);
  const { query } = useLocation();

  const [search, setSearch] = useState({
    id: query?.id,
    SearchDate: query.SearchDate ? moment(query.SearchDate) : '',
  });

  const history = useHistory();

  const BAR = {
    data: {
      x: 'x',
      y2: 'Bình nước',
      columns: [
        [
          'x',
          pipi?.length > 0
            ? pipi[0]?.criteriaReportGroupByMonths.map((i) => `${i?.month}/${i.year}`)
            : '',
        ].flat(),
        [
          'Pipi',
          pipi?.length > 0 ? pipi[0]?.criteriaReportGroupByMonths.map((i) => i?.totalAmount) : '',
        ].flat(),
        [
          'Pupu',
          pupu?.length > 0 ? pupu[0]?.criteriaReportGroupByMonths.map((i) => i?.totalAmount) : '',
        ].flat(),
        [
          'Bình nước',
          dataWater?.length > 0
            ? dataWater.map((i) => (i?.waterBottle?.type ? i?.waterBottle?.type : ''))
            : '',
        ].flat(),
      ],
      type: 'bar',
      types: {
        'Bình nước': 'spline',
      },
      order: 'desc',
      axes: {
        'Bình nước': 'y2',
      },
    },
    axis: {
      x: {
        type: 'category',
      },
      y: {
        label: 'Số lần đi',
      },
      y2: {
        padding: {
          bottom: 0,
        },
        show: true,
        label: 'Bình nước',
      },
    },
    color: {
      pattern: ['#27A600', '#3B36DD', '#FF8300'],
    },
    // legend: {
    //   show: true,
    //   position: 'inset',
    //   inset: {
    //     anchor: 'top-right',
    //     x: undefined,
    //     y: undefined,
    //     step: undefined,
    //   },
    // },
  };

  const data = {
    x: 'x',
    groups: [['Pipi', 'Pupu']],
    columns: [
      // ['x', pipi?.length > 0 ?  pipi[0]?.criteriaReportGroupByMonths.map( i => `${i?.month}/${i.year}` ) : ""].flat(),
      // ['Pipi',pipi?.length > 0 ?  pipi[0]?.criteriaReportGroupByMonths.map( i => i?.totalAmount) : ""].flat(),
      // ['Pupu',pupu?.length > 0 ?  pupu[0]?.criteriaReportGroupByMonths.map( i => i?.totalAmount) : ""].flat(),
      // ['Bình nước',dataWater?.length > 0 ?  dataWater.map( i => i?.waterBottle?.type ? i?.waterBottle?.type : "") : ""].flat(),
    ],

    types: {
      Pipi: 'area',
      Pupu: 'area',
    },
    colors: {
      // UpperBand: "#8A3FFC",
      // LowerBand: "#005D5D"
      Pipi: '#8A3FFC',
      Pupu: '#005D5D',
    },
  };

  const axis = {
    x: {
      type: 'category',
    },
    y: {
      padding: {
        bottom: 0,
      },
      label: {
        position: 'outer-middle',
      },
    },
    y2: {
      show: true,
      label: {
        position: 'outer-middle',
      },
    },
  };

  useEffect(() => {
    dispatch({
      type: 'OPProfile/GET_BRANCHES',
      payload: {},
    });
    dispatch({
      type: 'OPProfile/GET_GROUP_PROPERTY',
      payload: {},
    });
  }, []);

  const onChangeSelectBranch = (e) => {
    dispatch({
      type: 'OPProfile/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
  };

  const onChangeSelect = (e) => {
    dispatch({
      type: 'OPProfile/GET_STUDENTS',
      payload: {
        class: e,
        classStatus: 'HAS_CLASS',
      },
    });
  };

  const onChangeStudents = (e) => {
    setSearch({ ...search, StudentId: e });
  };

  const onChangeDate = (e) => {
    setLoadData(true);
    setSearch({
      ...search,
      FromDate: moment(e[0]).format(variables.DATE_FORMAT.DATE_AFTER),
      ToDate: moment(e[1]).format(variables.DATE_FORMAT.DATE_AFTER),
    });
  };

  const onChangeData = () => {
    const dataPipi = groupProperty.filter((i) => i.code === 'PIPI' || i.code === 'PUPU');
    dispatch({
      type: 'OPProfile/GET_DATA',
      payload: { ...search, CriteriaPropertyIds: dataPipi.map((i) => i.id) },
      callback(res) {
        if (res) {
          setFormCheck(true);
          setPipi(res?.filter((i) => i?.criteriaGroupProperty?.code === 'PIPI'));
          setPupu(res?.filter((i) => i?.criteriaGroupProperty?.code === 'PUPU'));
        }
      },
    });
    dispatch({
      type: 'OPProfile/GET_DETAIL_STUDENT',
      payload: search.StudentId,
      callback(res) {
        if (res) {
          setCheckStudent(true);
        }
      },
    });
    dispatch({
      type: 'OPProfile/GET_WATER',
      payload: search,
    });
    dispatch({
      type: 'OPProfile/GET_HEIGHT',
      payload: search,
    });
  };

  const onchangeMedical = () => {
    if (detailsStudent?.student?.studentCrmId) {
      dispatch({
        type: 'OPProfile/GET_MEDICAL',
        payload: { admission_register_id: detailsStudent?.student?.studentCrmId },
        callback(res) {
          if (res?.parsePayload?.length > 0) {
            history.push(`/crm/sale/dang-ky-nhap-hoc/${detailsStudent?.student?.studentCrmId}/chi-tiet?type=medical`);
          } if (res?.parsePayload?.length === 0) {
            notification.error({
              message: 'THÔNG BÁO',
              description: `Học sinh ${detailsStudent?.student?.fullName} chưa được khai báo y tế.`,
            });
          }
        },
      });
    } else {
      notification.error({
        message: 'THÔNG BÁO',
        description: `Học sinh ${detailsStudent?.student?.fullName} chưa được khai báo y tế.`,
      });
    }
  };

  const onchangeEvaluate = () => {
    if (detailsStudent?.student?.studentCrmId) {
      dispatch({
        type: 'OPProfile/GET_EVALUATE',
        payload: { admission_register_id: detailsStudent?.student?.studentCrmId },
        callback(res) {
          if (res?.parsePayload?.length > 0) {
            history.push(`/crm/sale/dang-ky-nhap-hoc/${detailsStudent?.student?.studentCrmId}/chi-tiet?type=childEvaluation`);
          } if (res?.parsePayload?.length === 0) {
            notification.error({
              message: 'THÔNG BÁO',
              description: `Học sinh ${detailsStudent?.student?.fullName} chưa được đánh giá.`,
            });
          }
        },
      });
    } else {
      notification.error({
        message: 'THÔNG BÁO',
        description: `Học sinh ${detailsStudent?.student?.fullName} chưa được đánh giá.`,
      });
    }
  };

  const onchangeCurriculum = () => {
    history.push('/chuong-trinh-hoc/bao-cao-quan-tri-hs/hoc-thuat-theo-tung-goc-giao-cu');
  };

  return (
    <>
      <div className={classnames(common['content-form'], common['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark">Profile học sinh</Text>
        </div>

        <div className="card p20">
          <Form layout="vertical">
            <div className="row">
              <div className="col-lg-10 d-flex">
                <div className="col-lg-3">
                  <FormItem
                    label="Cơ sở"
                    data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                    name="branchId"
                    onChange={(event) => onChangeSelectBranch(event, 'branchId')}
                    type={variables.SELECT}
                    placeholder="Chọn cơ sở"
                    allowClear={false}
                  />
                </div>

                <div className="col-lg-3">
                  <FormItem
                    label="Lớp"
                    data={[{ id: null, name: 'Chọn tất cả lớp' }, ...classes]}
                    name="classId"
                    onChange={(event) => onChangeSelect(event, 'classId')}
                    type={variables.SELECT}
                    placeholder="Chọn lớp"
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[...students]}
                    options={['id', 'fullName']}
                    label="Học sinh"
                    name="StudentId"
                    onChange={(event) => onChangeStudents(event, 'StudentId')}
                    allowClear={false}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="date"
                    label="Thời gian truy xuất"
                    type={variables.RANGE_PICKER}
                    onChange={(event) => onChangeDate(event, 'date')}
                    allowClear={false}
                  />
                </div>
              </div>
              <div className="col-lg-2 d-flex justify-content-end" style={{ marginTop: '30px' }}>
                {loadData ? (
                  <Button
                    color="success"
                    icon="report"
                    className="ml-4"
                    onClick={onChangeData}
                    style={{ width: 'auto' }}
                  >
                    Tải dữ liệu
                  </Button>
                ) : (
                  <Button
                    color="success"
                    icon="report"
                    className="ml-4"
                    disabled
                    style={{ width: 'auto' }}
                  >
                    Tải dữ liệu
                  </Button>
                )}
              </div>
            </div>
          </Form>
        </div>
        {formCheck ? (
          <>
            {checkStudent ? (
              <div className={styles['card-container']}>
                <div className={classnames(styles['profiles-container'], 'd-flex', 'mb30')}>
                  <div className={styles['image-container']}>
                    <AvatarTable
                      fileImage={Helper.getPathAvatarJson(detailsStudent?.student?.fileImage)}
                      className={styles.image}
                      size={150}
                    />
                  </div>
                  <div className={styles['profiles-content']}>
                    <h3 className={styles.title}>{detailsStudent?.student?.fullName}</h3>
                    <div className={styles['profiles-info']}>
                      <div className={styles['info-item']}>
                        <p className={styles.label}>Năm sinh</p>
                        <h4 className={styles.name}>
                          {Helper.getDate(detailsStudent?.student?.dayOfBirth)} (
                          {detailsStudent?.student?.age} tháng tuổi)
                        </h4>
                      </div>
                      <div className={styles['info-item']}>
                        <p className={styles.label}>Cơ sở</p>
                        <h4 className={styles.name}>
                          {detailsStudent?.student?.class?.branch?.name}
                        </h4>
                      </div>
                      <div className={styles['info-item']}>
                        <p className={styles.label}>Lớp</p>
                        <h4 className={styles.name}>{detailsStudent?.student?.class?.name}</h4>
                      </div>
                      <div className={styles['info-item']}>
                        <p className={styles.label}>Ngày vào học</p>
                        <h4 className={styles.name}>
                          {Helper.getDate(detailsStudent?.student?.registerDate)}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
            <div className="row">
              <div className="col-lg-6">
                <div className={classnames(styles['table-left'], 'card', 'p20')}>
                  <div className={styles['title-top']}>
                    <div>
                      <Text color="success" size="large-medium">
                        Sức khỏe y tế
                      </Text>
                      <p className={styles.content}>
                        Cập nhật{' '}
                        {Helper.getDate(
                          dataPipiPupu[0]?.criteriaGroupProperty?.lastModificationTime,
                          variables.DATE_FORMAT.DATE_TIME,
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mb15">
                    <div className={classnames(styles['table-content'])}>
                      <img
                        src="/images/objectProfile/heigth.svg"
                        alt="heigth"
                        className={styles.image}
                      />
                      <div className="pl15">
                        <p className={styles.title}>Chiều cao</p>
                        <h2 className={styles.number}>
                          {JSON.stringify(dataHeight) !== '{}'
                            ? dataHeight?.studentCriterias[0]?.criteriaGroupProperty?.orderIndex
                            : 0}{' '}
                        </h2>
                      </div>
                    </div>
                    <div className={classnames(styles['table-content'])}>
                      <img
                        src="/images/objectProfile/weight.svg"
                        alt="weight"
                        className={styles.image}
                      />
                      <div className="pl15">
                        <p className={styles.title}>Cân nặng (kg)</p>
                        <h2 className={styles.number}>
                          {JSON.stringify(dataHeight) !== '{}'
                            ? dataHeight?.studentCriterias[1]?.criteriaGroupProperty?.orderIndex
                            : 0}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <C3Chart className="multi-chart" data={data} axis={axis} />
                  <div className={styles['title-table']}>Điểm BMI hiện tại: 22.22</div>
                  <div className={styles['conclude-table']}>
                    <h3 className={styles.title}>Kết luận:</h3>
                    <p className={styles.content}>Bé có chỉ số hoàn toàn bình thường</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className={classnames(styles['table-rigth'], 'card')}>
                  <div className={classnames(styles['title-top'], 'pl20 pr20 pt20')}>
                    <div>
                      <Text color="success" size="large-medium">
                        Pipi - pupu - uống nước
                      </Text>
                      <p className={styles.content}>
                        Cập nhập{' '}
                        {Helper.getDate(
                          dataPipiPupu[0]?.criteriaGroupProperty?.lastModificationTime,
                          variables.DATE_FORMAT.DATE_TIME,
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mb15 pl10 pr10">
                    <div className={classnames(styles['table-content'])}>
                      <img
                        src="/images/objectProfile/pipi.svg"
                        alt="pipi"
                        className={styles.image}
                      />
                      <div className="pl15">
                        <p className={styles.title}>Số lần pipi</p>
                        <h2 className={styles.number}>
                          {pipi?.length > 0 ? pipi[0]?.totalAmount : 0}
                        </h2>
                      </div>
                    </div>
                    <div className={classnames(styles['table-content'])}>
                      <img
                        src="/images/objectProfile/pupu.svg"
                        alt="pupu"
                        className={styles.image}
                      />
                      <div className="pl15">
                        <p className={styles.title}>Số lần pupu</p>
                        <h2 className={styles.number}>
                          {pupu?.length > 0 ? pipi[0]?.totalAmount : 0}
                        </h2>
                      </div>
                    </div>
                    <div className={classnames(styles['table-content'])}>
                      <img
                        src="/images/objectProfile/water.svg"
                        alt="water"
                        className={styles.image}
                      />
                      <div className="pl15">
                        <p className={styles.title}>Bình nước</p>
                        <h2 className={styles.number}>
                          {dataWater[dataWater?.length - 1]?.waterBottle?.type
                            ? dataWater[dataWater?.length - 1]?.waterBottle?.type
                            : '0'}
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className={classnames(styles['wraper-table'])}>
                    <div className="mb15">
                      <h3 className={styles.title}>Biểu đồ tình hình Pipi, Pupu, Uống nước</h3>
                    </div>
                    <C3Chart {...BAR} />
                  </div>
                </div>
              </div>
            </div>
            <div className="pl10 pr10">
              <div className="d-flex justify-content-between">
                <div className={classnames(styles['wraper-row'])}>
                  <div className="d-flex w-100 align-items-center">
                    <img
                      src="/images/objectProfile/developChilldern.svg"
                      alt="developChilldern"
                      className={styles.image}
                    />
                    <p className={styles.title}>Sự phát triển của trẻ</p>
                  </div>
                  <Button
                    className={styles.btn}
                    onClick={() =>
                      history.push('/su-phat-trien-cua-tre/theo-doi-su-phat-trien-cua-tre')
                    }
                  >
                    Chi tiết
                  </Button>
                </div>
                <div className={classnames(styles['wraper-row'])}>
                  <div className="d-flex w-100 align-items-center">
                    <img
                      src="/images/objectProfile/healthDeclaration.svg"
                      alt="healthDeclaration"
                      className={styles.image}
                    />
                    <p className={styles.title}>Khai báo y tế</p>
                  </div>
                  <Button className={styles.btn} onClick={onchangeMedical}>Chi tiết</Button>
                </div>
                <div className={classnames(styles['wraper-row'])}>
                  <div className="d-flex w-100 align-items-center">
                    <img
                      src="/images/objectProfile/reportParent.svg"
                      alt="reportParent"
                      className={styles.image}
                    />
                    <p className={styles.title}>Đánh giá của phụ huynh</p>
                  </div>
                  <Button className={styles.btn} onClick={onchangeEvaluate}>Chi tiết</Button>
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <div className={classnames(styles['wraper-row'])}>
                  <div className="d-flex w-100 align-items-center">
                    <img
                      src="/images/objectProfile/study.svg"
                      alt="study"
                      className={styles.image}
                    />
                    <p className={styles.title}>Học tập giáo cụ</p>
                  </div>
                  <Button className={styles.btn}
                    onClick={onchangeCurriculum}
                  >Chi tiết</Button>
                </div>
                <div className={classnames(styles['wraper-row'])}>
                  <div className="d-flex w-100 align-items-center">
                    <img
                      src="/images/objectProfile/physical.svg"
                      alt="physical"
                      className={styles.image}
                    />
                    <p className={styles.title}>Học tập thể chất</p>
                  </div>
                  <Button className={styles.btn}>Chi tiết</Button>
                </div>
                <div className={classnames(styles['wraper-row'])}>
                  <div className="d-flex w-100 align-items-center">
                    <img
                      src="/images/objectProfile/english.svg"
                      alt="english"
                      className={styles.image}
                    />
                    <p className={styles.title}>Học tập tiếng Anh</p>
                  </div>
                  <Button className={styles.btn}>Chi tiết</Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          ''
        )}
      </div>
    </>
  );
});

export default General;
