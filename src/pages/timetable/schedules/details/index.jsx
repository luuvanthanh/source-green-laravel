import { memo, useRef, useEffect } from 'react';
import csx from 'classnames';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';
import { useDispatch } from 'dva';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import styles from '@/assets/styles/Common/information.module.scss';

const mapStateToProps = ({ timeTablesScheduleAdd, loading, menu }) => ({
  loading,
  branches: timeTablesScheduleAdd.branches,
  classes: timeTablesScheduleAdd.classes,
  error: timeTablesScheduleAdd.error,
  menuLeft: menu.menuLeftTimeTable,
});

const Index = memo(
  ({ loading: { effects }, match: { params }, error, menuLeft }) => {
    const mounted = useRef(false);
    const dispatch = useDispatch();

    const loading = effects[`timeTablesScheduleAdd/GET_DETAILS`] || effects[`timeTablesScheduleAdd/GET_BRANCHES`];

    useEffect(() => {
      dispatch({
        type: 'timeTablesScheduleAdd/GET_BRANCHES',
        payload: params,
      });
    }, []);

    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    return (
      <>
        <Breadcrumbs last="Chi tiết" menu={menuLeft} />
        <Pane style={{ padding: '10px 20px', paddingBottom: 0 }}>
          <Loading loading={loading} isError={error.isError} params={{ error }}>
            <Pane className="row">
              <Pane className="col-lg-6">
                <Pane className="card" style={{ padding: 20 }}>
                  <Heading type="form-title" style={{ marginBottom: 20 }}>
                    Thông tin chung
                  </Heading>

                  <Pane className={csx('row', 'border-bottom', 'mb20')}>
                    <Pane className="col-lg-6">
                      <Pane className="ant-col ant-form-item-label">
                        <label>
                          <span>Loại lịch</span>
                        </label>
                      </Pane>
                      <p className="font-weight-bold">Sự kiện cho trẻ</p>
                    </Pane>
                  </Pane>
                  <Pane className={csx('row', 'border-bottom', 'mb20')}>
                    <Pane className="col-lg-6">
                      <Pane className="ant-col ant-form-item-label">
                        <label>
                          <span>Thời gian diễn ra</span>
                        </label>
                      </Pane>
                      <p className="font-weight-bold">02/03/2021, 08:00 - 10:00</p>
                    </Pane>
                    <Pane className="col-lg-6">
                      <Pane className="ant-col ant-form-item-label">
                        <label>
                          <span>Nhắc trước</span>
                        </label>
                      </Pane>
                      <p className="font-weight-bold">24 giờ</p>
                    </Pane>
                    <Pane className="col-lg-12">
                      <Pane className="ant-col ant-form-item-label">
                        <label>
                          <span>Nội dung</span>
                        </label>
                      </Pane>
                      <p className="font-weight-bold">Ba mẹ nhớ chuẩn bị cho trẻ tham gia sự kiện nhé</p>
                    </Pane>
                  </Pane>
                  <Pane className={csx('row', 'border-bottom', 'mb20')}>
                    <Pane className="col-lg-12">
                      <Pane className="ant-col ant-form-item-label">
                        <label>
                          <span>Đối tượng</span>
                        </label>
                      </Pane>
                      <p className="font-weight-bold">Lớp</p>
                    </Pane>
                    <Pane className="col-lg-12">
                      <Pane className="ant-col ant-form-item-label">
                        <label>
                          <span>Cơ sở</span>
                        </label>
                      </Pane>
                      <p className="font-weight-bold">Lake view</p>
                    </Pane>
                  </Pane>
                  <Pane className={csx('row', 'border-bottom', 'mb20')}>
                    <Pane className="col-lg-12">
                      <Pane className="ant-col ant-form-item-label">
                        <label>
                          <span className="mb0">Gửi đến phụ huynh</span>
                        </label>
                      </Pane>
                      <div className="mb20">
                        <div className="d-flex align-items-center mt15">
                          <span className={styles.circleIcon}>
                            <span className="icon-open-book" />
                          </span>
                          <div className="ml10">
                            <p className="font-weight-bold font-size-14 mb0">Preschool 1</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center mt15">
                          <span className={styles.circleIcon}>
                            <span className="icon-open-book" />
                          </span>
                          <div className="ml10">
                            <p className="font-weight-bold font-size-14 mb0">Preschool 2</p>
                          </div>
                        </div>
                      </div>
                    </Pane>
                  </Pane>
                  <Pane className={csx('row')}>
                    <Pane className="col-lg-12">
                      <Pane className="ant-col ant-form-item-label">
                        <label>
                          <span className="mb0">Người gửi</span>
                        </label>
                      </Pane>
                      <div className="mb20 mt15">
                        <AvatarTable
                          fullName="Nguyễn Ngọc Bích"
                          description="Admin"
                          size={50}
                        />
                        <p className="mt10 mb0">Thời gian gửi: <span className="font-weight-bold">10:30, 15/3/2021</span></p>
                      </div>
                    </Pane>
                  </Pane>
                </Pane>
              </Pane>

              <Pane className="col-lg-6">
                <Pane className="card">
                  <Pane style={{ padding: '20px 20px 0 20px' }}>
                    <Heading type="form-title">Chi tiết</Heading>
                  </Pane>
                  <Pane className="px20">
                    <Pane className={csx('row', 'border-bottom', 'py15')}>
                      <Pane className="col-lg-12">
                        <Pane className="ant-col ant-form-item-label">
                          <label>
                            <span className="font-weight-bold">Tiêu đề</span>
                          </label>
                        </Pane>
                        <p className="mb0">Họp phụ huynh cuối kỳ năm học 2020 - 2021</p>
                      </Pane>
                    </Pane>
                    <Pane className={csx('row', 'border-bottom', 'py15')}>
                      <Pane className="col-lg-12">
                        <Pane className="ant-col ant-form-item-label">
                          <label>
                            <span className="font-weight-bold">Địa điểm</span>
                          </label>
                        </Pane>
                        <p className="mb0">Họp phụ huynh cuối kỳ năm học 2020 - 2021</p>
                      </Pane>
                    </Pane>
                    <Pane className={csx('row', 'py15')}>
                      <Pane className="col-lg-12">
                        <Pane className="ant-col ant-form-item-label">
                          <label>
                            <span className="font-weight-bold">Nội dung</span>
                          </label>
                        </Pane>
                        <p className="mb0">
                          Kính gửi Qúy phụ huynh trường mầm non
                          Trước tiên, Ban Giám hiệu trường mầm non xin được gửi lời cảm ơn sâu sắc nhất tới Quý phụ huynh vì đã dành trọn niềm tin yêu khi gửi gắm con em mình vào trường và sự phối hợp đồng hành của Quý vị trong thời gian vừa qua. Để giúp Quý vị nắm được các hoạt động giáo dục trong năm học và phối hợp cùng nhà trường một cách hiệu quả, chúng tôi trân trọng kính mời Quý vị tới tham dự buổi Họp phụ huynh đầu năm học.
                        </p>
                      </Pane>
                    </Pane>
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
          </Loading>
        </Pane>
      </>
    );
  },
);

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  menuLeft: PropTypes.arrayOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  menuLeft: [],
  error: {},
};

export default withRouter(connect(mapStateToProps)(Index));
