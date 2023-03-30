import { memo, useRef, useEffect } from 'react';
import csx from 'classnames';
import { connect, withRouter, history } from 'umi';
import PropTypes from 'prop-types';
import { useDispatch } from 'dva';
import { isEmpty, head } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import { Helmet } from 'react-helmet';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import styles from '@/assets/styles/Common/information.module.scss';
import { Helper, variables } from '@/utils';
import stylesModule from './styles.module.scss';

import variablesModules from '../variables';

const mapStateToProps = ({ timeTablesScheduleDetails, loading, menu }) => ({
  loading,
  details: timeTablesScheduleDetails.details,
  menuLeft: menu.menuLeftTimeTable,
});

const Index = memo(
  ({ loading: { effects }, match: { params }, error, menuLeft, details }) => {
    const mounted = useRef(false);
    const dispatch = useDispatch();
    const file = details?.fileAttach ? JSON.parse(details?.fileAttach) : [];

    const loading = effects[`timeTablesScheduleDetails/GET_DETAILS`];

    useEffect(() => {
      dispatch({
        type: 'timeTablesScheduleDetails/GET_DETAILS',
        payload: {
          id: params?.id
        },
        callback: () => { }
      });
    }, []);

    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    return (
      <>
        <Helmet title="Thời khóa biểu làm việc / sự kiện" />
        <Breadcrumbs last="Chi tiết" menu={menuLeft} />
        <Pane style={{ padding: '10px 20px', paddingBottom: 0 }}>
          <Loading loading={loading} isError={error.isError} params={{ error }}>
            <Pane className="row">
              <Pane className="col-lg-6">
                <Pane className="card" style={{ padding: 20 }}>
                  <Heading type="form-title" style={{ marginBottom: 20 }}>
                    Thông tin chung
                  </Heading>

                  <Pane className={csx('row', 'border-bottom', 'pb20', 'pt20')}>
                    <Pane className="col-lg-6">
                      <Pane className="ant-col ant-form-item-label">
                        <label>
                          <span>Loại lịch</span>
                        </label>
                      </Pane>
                      <p className="font-weight-bold">{details?.eventType ? variablesModules.TYPE_CALENDAR.find(item => item.id === details?.eventType)?.name : ''}</p>
                    </Pane>
                  </Pane>
                  <Pane className={csx('row', 'border-bottom', 'pb20', 'pt20')}>
                    <Pane className="col-lg-6">
                      <Pane className="ant-col ant-form-item-label">
                        <label>
                          <span>Thời gian diễn ra</span>
                        </label>
                      </Pane>
                      <p className="font-weight-bold">
                        {`${Helper.getDate(details.startTime, variables.DATE_FORMAT.DATE_TIME)} - ${Helper.getDate(details.endTime, variables.DATE_FORMAT.HOUR)}`}
                      </p>
                    </Pane>
                    {
                      details?.isReminded && (
                        <>
                          <Pane className="col-lg-6">
                            <Pane className="ant-col ant-form-item-label">
                              <label>
                                <span>Nhắc trước</span>
                              </label>
                            </Pane>
                            <p className="font-weight-bold">{details?.remindBefore || 0} giờ</p>
                          </Pane>
                          <Pane className="col-lg-12">
                            <Pane className="ant-col ant-form-item-label">
                              <label>
                                <span>Nội dung nhắc nhở</span>
                              </label>
                            </Pane>
                            <p className="font-weight-bold">{details?.note || ''}</p>
                          </Pane>
                        </>
                      )
                    }
                  </Pane>
                  <Pane className={csx('row', 'border-bottom', 'pb20', 'pt20')}>
                    <Pane className="col-lg-6">
                      <Pane className="ant-col ant-form-item-label">
                        <span>Cơ sở</span>
                      </Pane>
                      <p className="font-weight-bold">{details?.branch?.name || ''}</p>
                    </Pane>
                    <Pane className="col-lg-6">
                      <Pane className="ant-col ant-form-item-label">
                        <span>Lớp</span>
                      </Pane>
                      <p className="font-weight-bold">{details?.class?.name || 'Tất cả các lớp'}</p>
                    </Pane>
                  </Pane>
                  <Pane className={csx('row', 'border-bottom', 'pb20', 'pt20')}>
                    <Pane className="col-lg-12">
                      <Pane className="ant-col ant-form-item-label">
                        <label>
                          <span className="mb0">Người nhận thông báo</span>
                        </label>
                      </Pane>
                      {!isEmpty(details?.parentTimetables) && details?.parentTimetables?.map((item, index) => (
                        <div key={index}>
                          <Pane
                            key={index}
                            className={styles.userInformation}
                            style={{ paddingTop: 10, paddingBottom: 10 }}
                          >
                            <AvatarTable
                              fileImage={Helper.getPathAvatarJson(item?.student?.fileImage)}
                            />
                            <Pane>
                              <h3>{item?.student?.fullName}</h3>
                              <p>{item?.student?.age} Tháng tuổi</p>
                            </Pane>
                          </Pane>
                        </div>
                      ))}
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
                          fullName={details?.sender?.name || ''}
                          description={details?.sender?.role || ''}
                          fileImage={Helper.getPathAvatarJson(details?.sender?.fileImage)}
                          size={50}
                        />
                        <p className="mt10 mb0">
                          Thời gian gửi: <span className="font-weight-bold">{Helper.getDate(details.creationTime, variables.DATE_FORMAT.TIME_DATE_VI)}</span>
                        </p>
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
                        <p className="mb0">{details?.title || ''}</p>
                      </Pane>
                    </Pane>
                    <Pane className={csx('row', 'border-bottom', 'py15')}>
                      <Pane className="col-lg-12">
                        <Pane className="ant-col ant-form-item-label">
                          <label>
                            <span className="font-weight-bold">Địa điểm</span>
                          </label>
                        </Pane>
                        <p className="mb0">{details?.location || ''}</p>
                      </Pane>
                    </Pane>
                    <Pane className={csx('row', 'border-bottom', 'py15')}>
                      <Pane className="col-lg-12">
                        <Pane className="ant-col ant-form-item-label">
                          <label>
                            <span className="font-weight-bold">Nội dung</span>
                          </label>
                        </Pane>
                        <div className={stylesModule['wrapper-content']} dangerouslySetInnerHTML={{ __html: details?.content }} />
                      </Pane>
                    </Pane>
                    <Pane className={csx('row', 'py15')}>
                      <Pane className="col-lg-12">
                        <Pane className="ant-col ant-form-item-label">
                          <label>
                            <span className="font-weight-bold">Tài liệu đính kèm</span>
                          </label>
                        </Pane>
                        <p className="mb0">
                          <a href={`${API_UPLOAD}${head(file)?.url}`} target="_blank" rel="noreferrer">
                            {head(file)?.name}
                          </a>
                        </p>
                      </Pane>
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="d-flex justify-content-end align-items-center mb20">
                  <p
                    className="btn-delete"
                    role="presentation"

                    onClick={() => history.goBack()}
                  >
                    Đóng
                  </p>
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
  details: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  menuLeft: [],
  error: {},
  details: {}
};

export default withRouter(connect(mapStateToProps)(Index));
