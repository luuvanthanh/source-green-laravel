import { memo, useRef, useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { useParams, useHistory, useLocation } from 'umi';
import TableCus from '@/components/CommonComponent/Table';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'dva';

import common from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';

import moment from 'moment';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import C3Chart from 'react-c3js';
import "c3/c3.css";
import styles from './styles.modules.scss';

const General = memo(() => {
  const [
    branches,
    classes,
    students,
    groupProperty,
  ] = useSelector(({ OPProfile }) => [
    OPProfile.branches,
    OPProfile.classes,
    OPProfile.students,
    OPProfile.groupProperty,
  ]);
  const dispatch = useDispatch();
  const [loadData, setLoadData] = useState(false);
  const [formCheck, setFormCheck] = useState(true);
  const { query } = useLocation();

  const [search, setSearch] = useState({
    id: query?.id,
    SearchDate: query.SearchDate ? moment(query.SearchDate) : "",
  });

  const history = useHistory();
  const chart = {
    x: "timeSeries",
    groups: [["Resident", "Guest"]],
    data: {
      json: {
        Resident: [136, 124, 117, 102, 124, 108, 114, 144, 184],
        Guest: [134, 95, 105, 67, 31, 88, 94, 95, 92]
      },

      types: {
        Resident: "area",
        Guest: "area"
      },
      colors: {
        Resident: "#8A3FFC",
        Guest: "#005D5D"
      }
    }
  };



  const BAR = {
    data: {
      x: 'x',
      columns: [
        ['x', 'Tháng 1/2021', 'Tháng 2/2021', 'Tháng 3/2021', 'Tháng 4/2021', 'Tháng 5/2021'],
        ['Đã học', 10, 20, 30, 40, 50],
        ['Đã vắng', 0, 2, 0, 10, 0],
      ],
      type: 'bar',
      order: 'desc',
    },
    axis: {
      x: {
        type: 'category', // this needed to load string x value
      },
      y: {
        label: 'Buổi học',
      },
    },
    color: {
      pattern: ['#3B5CAD', '#FF8300'],
    },
    legend: {
      show: true,
      position: 'inset',
      inset: {
        anchor: 'top-right',
        x: undefined,
        y: undefined,
        step: undefined,
      },
    },
  };

  const data = {
    x: "timeSeries",
    groups: [["Resident", "Guest"]],
    json: {
      timeSeries: [
        "2020-02-01",
        "2020-02-02",
        "2020-02-03",
        "2020-02-04",
        "2020-02-05",
        "2020-02-06",
        "2020-02-07",
        "2020-02-08",
        "2020-02-09"
      ],

      Resident: [136, 124, 117, 102, 124, 108, 114, 144, 184],
      // LowerBand: [190, 224, 255, 240, 264, 290, 275, 283, 255]
      Guest: [134, 95, 105, 67, 31, 88, 94, 95, 92],
      Guests: [134, 95, 105, 67, 31, 88, 4, 5, 92]
    },

    types: {

      Resident: "area",
      Guest: "area",
    },
    colors: {

      // UpperBand: "#8A3FFC",
      // LowerBand: "#005D5D"
      Resident: "#8A3FFC",
      Guest: "#005D5D"
    }
  };

  const axis = {
    x: {
      type: "timeseries",
      localtime: true,
      tick: {
        format: "%d/%m/%Y"
      },
      padding: {
        left: 0,
        right: 0
      },
      label: {
        text: "Selected timeframe",
        position: "outer-center"
      }
    },
    y: {
      padding: {
        bottom: 0
      },
      label: {
        position: "outer-middle"
      }
    },
    y2: {
      show: true,
      label: {
        position: "outer-middle"
      }
    }
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
      },
    });
  };

  const onChangeStudents = (e) => {
    setSearch({ ...search, StudentId: e });
  };

  const onChangeDate = (e) => {
    setLoadData(true);
    setSearch({
      ...search, FromDate: moment(e[0]).format(variables.DATE_FORMAT.DATE_AFTER),
      ToDate: moment(e[1]).format(variables.DATE_FORMAT.DATE_AFTER)
    });
  };

  const onChangeData = () => {
    const dataPipi = groupProperty.filter(i => i.code === 'PIPI' || i.code === 'PUPU');

    dispatch({
      type: 'OPProfile/GET_DATA',
      payload: { ...search, CriteriaPropertyIds: dataPipi.map((i) => (i.id)).join(',') },
      callback(res) {
        if (res.length > 0) {
          setFormCheck(true);
        }
      }
    });
  };


  return (
    <>
      <div className={classnames(common['content-form'], common['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark">Profile học sinh</Text>
        </div>

        <div className='card p20'>
          <Form
            layout="vertical"
          >
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
                    data={[
                      ...students
                    ]}
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
                {
                  loadData ?
                    <Button color="success" icon="report" className="ml-4" onClick={onChangeData} style={{width: 'auto'}}>
                      Tải dữ liệu
                    </Button> :
                    <Button color="success" icon="report" className="ml-4" disabled style={{width: 'auto'}}>
                      Tải dữ liệu
                    </Button>
                }
              </div>
            </div>
          </Form>
        </div>
        {
          formCheck ?
            <>
              <div className={styles['card-container']}>
                <div className={classnames(styles['profiles-container'], 'd-flex', 'mb30')}>
                  <div className={styles['image-container']}>
                    <img src="/images/image-default.png" alt="default" className={styles.image} />
                  </div>
                  <div className={styles['profiles-content']}>
                    <h3 className={styles.title}>Nguyễn Thị Linh</h3>
                    <div className={styles['profiles-info']}>
                      <div className={styles['info-item']}>
                        <p className={styles.label}>Năm sinh</p>
                        <h4 className={styles.name}>22/04/2019 (32 tháng tuổi)</h4>
                      </div>
                      <div className={styles['info-item']}>
                        <p className={styles.label}>Cơ sở</p>
                        <h4 className={styles.name}>Lake View</h4>
                      </div>
                      <div className={styles['info-item']}>
                        <p className={styles.label}>Lớp</p>
                        <h4 className={styles.name}>Presschool</h4>
                      </div>
                      <div className={styles['info-item']}>
                        <p className={styles.label}>Ngày vào học</p>
                        <h4 className={styles.name}>15/02/2020</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-lg-6'>
                  <div className={classnames(styles['table-left'], 'card', 'p20')}>
                    <div className={styles['title-top']}>
                      <div>
                        <Text color="success" size="large-medium">
                          Sức khỏe y tế
                        </Text>
                        <p className={styles.content}>Cập nhật 15/12/2021 - 10:15</p>
                      </div>
                      <Button className={styles.btn}>
                        Chi tiết
                      </Button>
                    </div>
                    <div className='d-flex justify-content-between mb15'>
                      <div className={classnames(styles['table-content'])}>
                        <img src="/images/objectProfile/heigth.svg" alt="heigth" className={styles.image} />
                        <div className='pl15'>
                          <p className={styles.title}>Chiều cao</p>
                          <h2 className={styles.number}>8</h2>
                        </div>
                      </div>
                      <div className={classnames(styles['table-content'])}>
                        <img src="/images/objectProfile/weight.svg" alt="weight" className={styles.image} />
                        <div className='pl15'>
                          <p className={styles.title}>Cân nặng (kg)</p>
                          <h2 className={styles.number}>40</h2>
                        </div>
                      </div>
                    </div>


                    <C3Chart
                      className="multi-chart"
                      data={data}
                      axis={axis}
                    />
                    <div className={styles['title-table']}>
                      Điểm BMI hiện tại: 22.22
                    </div>
                    <div className={styles['conclude-table']}>
                      <h3 className={styles.title}>Kết luận:</h3>
                      <p className={styles.content}>Bé có chỉ số hoàn toàn bình thường</p>
                    </div>
                  </div>
                </div>
                <div className='col-lg-6'>
                  <div className={classnames(styles['table-rigth'], 'card')}>
                    <div className={classnames(styles['title-top'], 'pl20 pr20 pt20')}>
                      <div>
                        <Text color="success" size="large-medium">
                          Pipi - pupu - uống nước
                        </Text>
                        <p className={styles.content}>Cập nhật 15/12/2021 - 10:15</p>
                      </div>
                      <Button className={styles.btn}>
                        Chi tiết
                      </Button>
                    </div>
                    <div className='d-flex justify-content-between mb15 pl10 pr10'>
                      <div className={classnames(styles['table-content'])}>
                        <img src="/images/objectProfile/pipi.svg" alt="pipi" className={styles.image} />
                        <div className='pl15'>
                          <p className={styles.title}>Số lần pipi</p>
                          <h2 className={styles.number}>140</h2>
                        </div>
                      </div>
                      <div className={classnames(styles['table-content'])}>
                        <img src="/images/objectProfile/pupu.svg" alt="pupu" className={styles.image} />
                        <div className='pl15'>
                          <p className={styles.title}>Số lần pupu</p>
                          <h2 className={styles.number}>40</h2>
                        </div>
                      </div>
                      <div className={classnames(styles['table-content'])}>
                        <img src="/images/objectProfile/water.svg" alt="water" className={styles.image} />
                        <div className='pl15'>
                          <p className={styles.title}>Bình nước</p>
                          <h2 className={styles.number}>40</h2>
                        </div>
                      </div>
                    </div>
                    <div className={classnames(styles['wraper-table'])}>
                      <div className='mb15'>
                        <h3 className={styles.title}>Biểu đồ tình hình Pipi, Pupu, Uống nước</h3>
                      </div>
                      <C3Chart {...BAR} />
                    </div>
                  </div>
                </div>
              </div>
              <div className='pl10 pr10'>
                <div className='d-flex justify-content-between'>
                  <div className={classnames(styles['wraper-row'])}>
                    <div className='d-flex w-100 align-items-center'>
                      <img src="/images/objectProfile/developChilldern.svg" alt="developChilldern" className={styles.image} />
                      <p className={styles.title}>Sự phát triển của trẻ</p>
                    </div>
                    <Button className={styles.btn} onClick={() => history.push('/su-phat-trien-cua-tre/theo-doi-su-phat-trien-cua-tre')}>Chi tiết</Button>
                  </div>
                  <div className={classnames(styles['wraper-row'])}>
                    <div className='d-flex w-100 align-items-center'>
                      <img src="/images/objectProfile/healthDeclaration.svg" alt="healthDeclaration" className={styles.image} />
                      <p className={styles.title}>Khai báo y tế</p>
                    </div>
                    <Button className={styles.btn}>Chi tiết</Button>
                  </div>
                  <div className={classnames(styles['wraper-row'])}>
                    <div className='d-flex w-100 align-items-center'>
                      <img src="/images/objectProfile/reportParent.svg" alt="reportParent" className={styles.image} />
                      <p className={styles.title}>Đánh giá của phụ huynh</p>
                    </div>
                    <Button className={styles.btn}>Chi tiết</Button>
                  </div>
                </div>

                <div className='d-flex justify-content-between'>
                  <div className={classnames(styles['wraper-row'])}>
                    <div className='d-flex w-100 align-items-center'>
                      <img src="/images/objectProfile/study.svg" alt="study" className={styles.image} />
                      <p className={styles.title}>Học tập giáo cụ</p>
                    </div>
                    <Button className={styles.btn}>Chi tiết</Button>
                  </div>
                  <div className={classnames(styles['wraper-row'])}>
                    <div className='d-flex w-100 align-items-center'>
                      <img src="/images/objectProfile/physical.svg" alt="physical" className={styles.image} />
                      <p className={styles.title}>Học tập thể chất</p>
                    </div>
                    <Button className={styles.btn}>Chi tiết</Button>
                  </div>
                  <div className={classnames(styles['wraper-row'])}>
                    <div className='d-flex w-100 align-items-center'>
                      <img src="/images/objectProfile/english.svg" alt="english" className={styles.image} />
                      <p className={styles.title}>Học tập tiếng Anh</p>
                    </div>
                    <Button className={styles.btn}>Chi tiết</Button>
                  </div>
                </div>

              </div>
            </>

            : ""
        }
      </div>

    </>
  );
},
);

export default General;
