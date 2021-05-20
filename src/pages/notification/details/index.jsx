import { memo, useRef, useEffect } from 'react';
import { Form, List } from 'antd';
import { Helmet } from 'react-helmet';
import { connect, useParams, history } from 'umi';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import variables from '@/utils/variables';
import styles from '@/assets/styles/Common/information.module.scss';
import { Helper } from '@/utils';
import { useSelector, useDispatch } from 'dva';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { isEmpty } from 'lodash';
import variablesModules from '../utils/variables';

const { Item: ListItem } = List;

const Index = memo(({}) => {
  const [
    menuData,
    { details, error },
    loading,
  ] = useSelector(({ menu, notificationsDetails, loading: { effects } }) => [
    menu.menuLeftNotification,
    notificationsDetails,
    effects,
  ]);
  const dispatch = useDispatch();
  const params = useParams();

  const formRef = useRef();
  const mounted = useRef(false);
  const mountedSet = (action, value) => {
    if (mounted.current) {
      action(value);
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  useEffect(() => {
    dispatch({
      type: 'notificationsDetails/GET_DATA',
      payload: { ...params },
    });
  }, []);

  return (
    <>
      <Helmet title="Chi tiết thông báo" />
      <Breadcrumbs last="Chi tiết thông báo" menu={menuData} />
      <Pane className="pr20 pl20">
        <Loading
          loading={loading['notificationsDetails/GET_DATA']}
          isError={error.isError}
          params={{ error, type: 'container' }}
        >
          <Pane className="row">
            <Pane className="col-lg-6">
              <Pane className="card">
                <Pane className="border-bottom" style={{ padding: 20 }}>
                  <Heading type="form-title">Thông tin chung</Heading>
                </Pane>

                <Pane className="border-bottom" style={{ padding: 20 }}>
                  <label className={styles.infoLabel}>Người gửi</label>
                  <Pane className={styles.userInformation} style={{ paddingBottom: 20 }}>
                    <AvatarTable fileImage={null} />
                    <Pane>
                      <h3>{details?.sender?.objectInfo?.fullName || details?.sender?.name}</h3>
                      <p>{details?.sender?.role}</p>
                    </Pane>
                  </Pane>
                  <p>
                    Thời gian gửi:{' '}
                    <strong>
                      {Helper.getDate(details?.sentDate, variables.DATE_FORMAT.DATE_TIME)}
                    </strong>
                  </p>
                  <p>
                    Đối tượng nhận:{' '}
                    <strong>{!isEmpty(details?.parentNews) ? 'Phụ Huynh' : 'Nhân viên'}</strong>
                  </p>
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
                          {details?.sender?.objectInfo?.class?.branch?.name}
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
                          {details?.sender?.objectInfo?.class?.name}
                        </span>
                      </Pane>
                    </Pane>
                  </Pane>
                </Pane>

                <Pane className="border-bottom" style={{ padding: 20 }}>
                  <label className={styles.infoLabel}>Người nhận thông báo</label>
                  {!isEmpty(details?.parentNews) &&
                    details?.parentNews?.map((item, index) => (
                      <Pane
                        key={index}
                        className={styles.userInformation}
                        style={{ paddingTop: 20, paddingBottom: 20 }}
                      >
                        <AvatarTable
                          fileImage={Helper.getPathAvatarJson(item?.parent?.fileImage)}
                        />
                        <Pane>
                          <h3>{item?.parent?.fullName}</h3>
                          <p>{'Phụ Huynh'}</p>
                        </Pane>
                      </Pane>
                    ))}
                  {!isEmpty(details?.employeeNews) &&
                    details?.employeeNews?.map((item, index) => (
                      <Pane
                        key={index}
                        className={styles.userInformation}
                        style={{ paddingTop: 20, paddingBottom: 20 }}
                      >
                        <AvatarTable
                          fileImage={Helper.getPathAvatarJson(item?.employee?.fileImage)}
                        />
                        <Pane>
                          <h3>{item?.employee?.fullName}</h3>
                          <p>{'Nhân viên'}</p>
                        </Pane>
                      </Pane>
                    ))}
                </Pane>
              </Pane>

              <Pane className="card">
                <Pane className="border-bottom" style={{ padding: 20 }}>
                  <Heading type="form-title">Lịch sử</Heading>
                </Pane>
                <List
                  dataSource={Helper.onSortDates(details?.history, 'logtime') || []}
                  renderItem={(item) => (
                    <ListItem key={item.id} className={styles.listItem}>
                      <Pane style={{ width: '100%' }} className="row pr20 pl20">
                        <Pane className="col-md-5">
                          <Heading type="form-sub-title" style={{ marginBottom: 10 }}>
                            {Helper.getDate(item.logtime, variables.DATE_FORMAT.DATE_TIME)}
                          </Heading>
                        </Pane>
                        <Pane className="col-md-7">
                          <Pane>
                            {item?.editor?.objectInfo?.fullName || item?.editor?.name}{' '}
                            {variablesModules?.ACTION_TYPE[item.httpMethod]}
                          </Pane>
                        </Pane>
                      </Pane>
                    </ListItem>
                  )}
                />
              </Pane>
            </Pane>

            <Pane className="col-lg-6">
              <Pane className="card">
                <Pane className="border-bottom" style={{ padding: 20 }}>
                  <Heading type="form-title" style={{ marginBottom: 20 }}>
                    Chi tiết
                  </Heading>

                  <Pane>
                    <label className={styles.infoLabel}>Tiêu đề</label>
                    <p className={styles.infoText}>{details?.title}</p>
                  </Pane>

                  <Pane className="mt10">
                    <label className={styles.infoLabel}>Nội dung</label>
                    <div dangerouslySetInnerHTML={{ __html: details?.content }}></div>
                  </Pane>
                </Pane>
                <Pane className="p20">
                  <Button
                    color="success"
                    size="large"
                    style={{ marginLeft: 'auto' }}
                    onClick={() => history.push(`/thong-bao/${params.id}/chinh-sua`)}
                  >
                    Sửa
                  </Button>
                </Pane>
              </Pane>
            </Pane>
          </Pane>
        </Loading>
      </Pane>
    </>
  );
});

export default Index;
