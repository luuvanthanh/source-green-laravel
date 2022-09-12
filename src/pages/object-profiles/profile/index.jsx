import { memo, useEffect, useState } from 'react';
import { Form, notification } from 'antd';
import { useLocation } from 'umi';
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
import variablesModule from './variables';
import styles from './styles.modules.scss';

const General = memo(() => {
  const [
    branches,
    classes,
    students,
    dataPipiPupu,
    groupProperty,
    detailsStudent,
    defaultBranch,
  ] = useSelector(({ OPProfile, user }) => [
    OPProfile.branches,
    OPProfile.classes,
    OPProfile.students,
    OPProfile.dataPipiPupu,
    OPProfile.groupProperty,
    OPProfile.detailsStudent,
    user.defaultBranch,
  ]);
  const dispatch = useDispatch();
  const [loadData, setLoadData] = useState(false);
  const [formCheck, setFormCheck] = useState(false);
  const [checkStudent, setCheckStudent] = useState(false);
  const [pipi, setPipi] = useState();
  const [pupu, setPupu] = useState([]);
  const [water, setWater] = useState([]);
  const { query } = useLocation();
  const [dataHeight, setDataHeight] = useState({});

  const [defaultBranchs,] = useState(defaultBranch?.id ? [defaultBranch] : []);
  const [search, setSearch] = useState({
    id: query?.id,
    SearchDate: query.SearchDate ? moment(query.SearchDate) : '',
    branchId: query?.branchId || defaultBranch?.id,
  });

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
          water?.length > 0 ? water[0]?.criteriaReportGroupByMonths.map((i) => i?.totalAmount) : '',
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
        show: true,
        label: 'Bình nước',
      },
    },
    color: {
      pattern: ['#27A600', '#3B36DD', '#FF8300'],
    },
  };

  const data = {
    x: 'x',
    groups: [['Pipi', 'Pupu']],
    columns: [
    ],

    types: {
      Pipi: 'area',
      Pupu: 'area',
    },
    colors: {
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

  useEffect(() => {
    if (search?.branchId) {
      dispatch({
        type: 'OPProfile/GET_CLASSES',
        payload: {
          branch: search?.branchId,
        },
      });
    }
  }, [search?.branchId]);

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
    const dataPipi = groupProperty.filter((i) => i.code === 'PIPI' || i.code === 'PUPU' || i.code === 'WATERBOTTLE');
    dispatch({
      type: 'OPProfile/GET_DATA',
      payload: { ...search, CriteriaPropertyIds: dataPipi.map((i) => i.id) },
      callback(res) {
        if (res) {
          setFormCheck(true);
          setPipi(res?.filter((i) => i?.criteriaGroupProperty?.code === 'PIPI'));
          setPupu(res?.filter((i) => i?.criteriaGroupProperty?.code === 'PUPU'));
          setWater(res?.filter((i) => i?.criteriaGroupProperty?.code === 'WATERBOTTLE'));
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
      callback(res) {
        if (res) {
          setDataHeight(res);
        }
      },
    });
    setDataHeight({});
  };

  const onchangeMedical = () => {
    if (detailsStudent?.student?.studentCrmId) {
      dispatch({
        type: 'OPProfile/GET_MEDICAL',
        payload: { student_info_id: detailsStudent?.student?.studentCrmId },
        callback(res) {
          if (res?.parsePayload[0]?.medicalInfo?.medicalDeclareInfo?.length > 0) {
            const win = window.open(`/crm/sale/dang-ky-nhap-hoc/${res?.parsePayload[0]?.id}/chi-tiet?type=medical`, "_blank");
            win.focus();
          } if (!res?.parsePayload[0]?.medicalInfo?.medicalDeclareInfo?.length > 0) {
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
        type: 'OPProfile/GET_MEDICAL',
        payload: { student_info_id: detailsStudent?.student?.studentCrmId },
        callback(res) {
          if (res?.parsePayload[0]?.childEvaluateInfo?.length > 0) {
            const win = window.open(`/crm/sale/dang-ky-nhap-hoc/${res?.parsePayload[0]?.id}/chi-tiet?type=childEvaluation`, "_blank");
            win.focus();
          } if (!res?.parsePayload[0]?.childEvaluateInfo?.length > 0) {
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
    const win = window.open(`/chuong-trinh-hoc/bao-cao-quan-tri-hs/hoc-thuat-theo-tung-goc-giao-cu?FromDate=${search?.FromDate}&ToDate=${search?.ToDate}&branchId=${detailsStudent?.student?.class?.branchId}&ClassId=${detailsStudent?.student?.class?.id}&page=1&limit=10&studentName=${detailsStudent?.student?.fullName}`, "_blank");
    win.focus();
  };

  const onchangechilDevelop = () => {
    const win = window.open(`/su-phat-trien-cua-tre/theo-doi-su-phat-trien-cua-tre?key=${detailsStudent?.student?.fullName}`, "_blank");
    win.focus();
  };

  const onchangePhysical = () => {
    const win = window.open(`/chuong-trinh-hoc/the-chat?&BranchId=${detailsStudent?.student?.class?.branchId}&ClassId=${detailsStudent?.student?.class?.id}&FromDate=${search?.FromDate}&ToDate=${search?.ToDate}&StudentId=${detailsStudent?.student?.id}`, "_blank");
    win.focus();
  };

  const onchangeEnglish = () => {
    const win = window.open(`/chuong-trinh-hoc/tieng-anh?&BranchId=${detailsStudent?.student?.class?.branchId}&ClassId=${detailsStudent?.student?.class?.id}&FromDate=${search?.FromDate}&ToDate=${search?.ToDate}&StudentId=${detailsStudent?.student?.id}`, "_blank");
    win.focus();
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
    <>
      <div className={classnames(common['content-form'], common['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark">Profile học sinh</Text>
        </div>

        <div className="card p20">
          <Form layout="vertical" initialValues={{
            ...search,
          }}>
            <div className="row">
              <div className="col-lg-10 d-flex">
                {
                  !defaultBranch?.id && (
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
                  )
                }
                {
                  defaultBranch?.id && (
                    <div className="col-lg-3">
                      <FormItem
                        label="Cơ sở"
                        data={defaultBranchs}
                        name="branchId"
                        onChange={(event) => onChangeSelectBranch(event, 'branchId')}
                        type={variables.SELECT}
                        placeholder="Chọn cơ sở"
                        allowClear={false}
                      />
                    </div>
                  )
                }

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
                        {dataHeight?.studentCriterias?.length > 0 && (dataHeight?.studentCriterias[0]?.lastModificationTime ?
                          Helper.getDate(
                            dataHeight?.studentCriterias[0]?.lastModificationTime,
                            variables.DATE_FORMAT.DATE_TIME,
                          ) : Helper.getDate(
                            dataHeight?.studentCriterias[0]?.creationTime,
                            variables.DATE_FORMAT.DATE_TIME,
                          ))}
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
                            ? dataHeight?.studentCriterias[0]?.value
                            : 0}
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
                            ? dataHeight?.studentCriterias[1]?.value
                            : 0}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <C3Chart className="multi-chart" data={data} axis={axis} />
                  <div className={styles['title-table']}>Điểm BMI hiện tại:  {JSON.stringify(dataHeight) !== '{}' ? (dataHeight?.bmiConclusion?.bmi)?.toFixed(2)?.replace(/\d(?=(\d{3})+\.)/g, '$&,') : 0}</div>
                  <div className={styles['conclude-table']}>
                    <h3 className={styles.title}>Kết luận: {JSON.stringify(dataHeight) !== '{}' ? (getStatus(dataHeight?.bmiConclusion?.status, 'Học sinh')) : ""}</h3>
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
                          dataPipiPupu[0]?.lasTModificationTime,
                          variables.DATE_FORMAT.DATE_TIME,
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between pl10 pr10">
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
                          {pupu?.length > 0 ? pupu[0]?.totalAmount : 0}
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
                          {water?.length > 0 ? water[0]?.totalAmount : 0}
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className={classnames(styles['wraper-table'])}>
                    <C3Chart {...BAR} />
                    <div className="mb15 mt15 d-flex  justify-content-center">
                      <h3 className={styles.title}>Biểu đồ tình hình Pipi, Pupu, Uống nước</h3>
                    </div>
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
                    onClick={onchangechilDevelop}
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
                  <Button className={styles.btn} onClick={onchangePhysical}>Chi tiết</Button>
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
                  <Button className={styles.btn} onClick={onchangeEnglish}>Chi tiết</Button>
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
