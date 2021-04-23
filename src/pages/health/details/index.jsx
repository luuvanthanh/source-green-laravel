import { memo, useEffect, useRef } from 'react';
import { List } from 'antd';
import { Helmet } from 'react-helmet';
import { connect } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { history, useParams, useLocation } from 'umi';
import classnames from 'classnames';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import variables from '@/utils/variables';
import moment from 'moment';
import variablesModules from '..//utils/variables';
import styles from '@/assets/styles/Common/information.module.scss';
import { Helper } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { isEmpty, get, head } from 'lodash';

const { Item: ListItem } = List;

const Index = memo(({}) => {
  const mounted = useRef(false);
  const {
    loading: { effects },
    error,
    details,
    menuData,
  } = useSelector(({ loading, user, healthDetails, menu }) => ({
    loading,
    user: user.user,
    details: healthDetails.details,
    error: healthDetails.error,
    menuData: menu.menuLeftHealth,
  }));
  const loading = effects[`healthDetails/GET_DETAILS`];
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const mountedSet = (setFunction, value) => !!mounted?.current && setFunction(value);

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'healthDetails/GET_DETAILS',
        payload: {
          ...params,
          ...location.query,
        },
      });
    }
  }, [params.id]);

  return (
    <>
      <Helmet title="Chi tiết" />
      <Breadcrumbs last="Chi tiết" menu={menuData} />
      <Pane style={{ padding: '0 20px' }}>
        <Loading loading={loading} isError={error.isError} params={{ error, type: 'container' }}>
          {!isEmpty(details) && (
            <Pane className="row">
              <Pane className="col-lg-5">
                <Pane className="card">
                  <Pane className="border-bottom" style={{ padding: 20 }}>
                    <Heading type="form-title">
                      Sức khỏe hôm nay - Ngày{' '}
                      {moment(get(head(details.studentCriterias), 'creationTime')).format(
                        variables.DATE_FORMAT.DATE_VI,
                      )}
                    </Heading>
                  </Pane>

                  <Pane className="border-bottom" style={{ padding: 20 }}>
                    <label className={styles.infoLabel}>Phụ huynh</label>
                    <Pane className={styles.userInformation}>
                      <AvatarTable fileImage={details?.parent?.fileImage} />
                      <Pane>
                        <h3>{details?.parent?.fullName || 'Nguyễn Anh'}</h3>
                      </Pane>
                    </Pane>
                  </Pane>

                  <Pane className="border-bottom" style={{ padding: 20 }}>
                    <label className={styles.infoLabel}>Trẻ</label>
                    <Pane className={styles.userInformation}>
                      <AvatarTable
                        fileImage={
                          Helper.isJSON(get(head(details.studentCriterias), 'student.fileImage')) &&
                          head(JSON.parse(get(head(details.studentCriterias), 'student.fileImage')))
                        }
                      />
                      <Pane>
                        <h3>
                          {get(head(details.studentCriterias), 'student.fullName') || 'Subeo'}
                        </h3>
                      </Pane>
                    </Pane>
                  </Pane>

                  <Pane className="border-bottom" style={{ padding: 20 }}>
                    <Pane className="row">
                      <Pane className="col-lg-6">
                        <label className={styles.infoLabel}>Cơ sở</label>
                        <Pane className="d-flex align-items-center">
                          <span className={styles.circleIcon}>
                            <span className={'icon-school'} />
                          </span>
                          <span className={styles.infoText}>
                            {get(head(details.studentCriterias), 'student.class.branch.name')}
                          </span>
                        </Pane>
                      </Pane>

                      <Pane className="col-lg-6">
                        <label className={styles.infoLabel}>Lớp</label>
                        <Pane className="d-flex align-items-center">
                          <span className={styles.circleIcon}>
                            <span className={'icon-open-book'} />
                          </span>
                          <span className={styles.infoText}>
                            {get(head(details.studentCriterias), 'student.class.name')}
                          </span>
                        </Pane>
                      </Pane>
                    </Pane>
                  </Pane>
                </Pane>

                <Pane className="card">
                  <List
                    dataSource={details?.changeLogs || []}
                    renderItem={(item) => (
                      <ListItem
                        key={item.id}
                        className={classnames(styles.listItem, 'flex-column')}
                      >
                        {item.studentCritetiaEntityChanges.map((itemChange, indexChange) => (
                          <Pane
                            style={{ padding: 20, width: '100%' }}
                            className="row"
                            key={indexChange}
                          >
                            <Pane className="col-md-5">
                              <Heading type="form-sub-title" style={{ marginBottom: 10 }}>
                                {Helper.getDate(
                                  itemChange.changeTime,
                                  variables.DATE_FORMAT.DATE_TIME,
                                )}
                              </Heading>
                            </Pane>
                            <Pane className="col-md-7">
                              <Pane>
                                {item.editor.userName}{' '}
                                {variablesModules?.HEALTH_ACTION_TYPE[`${item.httpMethod}`]}
                              </Pane>
                            </Pane>
                          </Pane>
                        ))}
                      </ListItem>
                    )}
                  />
                </Pane>
              </Pane>

              <Pane className="col-lg-7">
                <Pane className="card">
                  <Pane className="border-bottom p20">
                    <Heading type="form-title">Chi tiết</Heading>
                  </Pane>

                  {details.studentCriterias.map((item) => (
                    <Pane className="border-bottom p20" key={item.id}>
                      <Heading type="form-block-title" className="mb10">
                        {item?.criteriaGroupProperty?.property}
                      </Heading>
                      <Pane className="mb10">
                        <Pane className="d-inline-block min-width-120">
                          <label className={styles.infoLabel}>
                            {item?.criteriaGroupProperty?.property}
                          </label>
                        </Pane>
                        <span className={styles.infoText}>{item?.value}</span>
                      </Pane>
                      {item.note && (
                        <Pane>
                          <Pane className="d-inline-block min-width-120">
                            <label className={styles.infoLabel}>Ghi chú</label>
                          </Pane>
                          <span className={styles.infoText}>{item.note}</span>
                        </Pane>
                      )}
                    </Pane>
                  ))}
                </Pane>
              </Pane>
            </Pane>
          )}
        </Loading>
      </Pane>
    </>
  );
});

export default Index;
