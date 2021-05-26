import { memo, useRef, useEffect } from 'react';
import { List } from 'antd';
import { Helmet } from 'react-helmet';
import Pane from '@/components/CommonComponent/Pane';
import { isArray } from 'lodash';
import classnames from 'classnames';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import variables from '@/utils/variables';
import styles from '@/assets/styles/Common/information.module.scss';
import { Helper } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import variablesModules from '../../utils/variables';

const { Item: ListItem } = List;

const Index = memo(() => {
  const dispatch = useDispatch();
  const {
    loading: { effects },
    menuData,
    details,
    error,
  } = useSelector(({ loading, menu, medicalItemsDetails }) => ({
    loading,
    details: medicalItemsDetails.details,
    error: medicalItemsDetails.error,
    menuData: menu.menuLeftMedical,
  }));
  const params = useParams();
  const loading = effects[`medicalItemsDetails/GET_DETAILS`];
  const mounted = useRef(false);
  // const mountedSet = (action, value) => {
  //   if (mounted.current) {
  //     action(value);
  //   }
  // };

  useEffect(() => {
    mounted.current = true;
    return mounted?.current;
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'medicalItemsDetails/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

  return (
    <>
      <Breadcrumbs last="Chi tiết y tế" menu={menuData} />
      <Helmet title="Chi tiết y tế" />
      <Pane style={{ padding: '10px 20px', paddingBottom: 0 }}>
        <Loading loading={loading} isError={error.isError} params={{ error, type: 'container' }}>
          <Pane className="row">
            <Pane className="col-lg-6">
              <Pane className="card">
                <Pane className="border-bottom" style={{ padding: 20 }}>
                  <Heading type="form-sub-title" style={{ marginBottom: 10 }}>
                    {Helper.getDate(details.creationTime, variables.DATE_FORMAT.DATE_TIME)}
                  </Heading>
                  <Heading type="form-title">{details?.diseaseName}</Heading>
                </Pane>

                <Pane className="border-bottom" style={{ padding: 20 }}>
                  <label className={styles.infoLabel}>Phụ huynh</label>
                  <AvatarTable
                    fileImage={Helper.getPathAvatarJson(
                      details?.studentMaster?.farther?.fileImage ||
                        details?.studentMaster?.mother?.fileImage,
                    )}
                    fullName={
                      details?.studentMaster?.farther?.fullName ||
                      details?.studentMaster?.mother?.fullName
                    }
                    description={` `}
                  />
                </Pane>

                <Pane className="border-bottom" style={{ padding: 20 }}>
                  <label className={styles.infoLabel}>Học sinh</label>
                  <AvatarTable
                    fileImage={Helper.getPathAvatarJson(details?.studentMaster?.student?.fileImage)}
                    fullName={details?.studentMaster?.student?.fullName}
                    description={`${details?.studentMaster?.student?.age || ''} tháng tuổi`}
                  />
                </Pane>

                <Pane className="border-bottom" style={{ padding: 20 }}>
                  <Pane className="row">
                    <Pane className="col-lg-6">
                      <label className={styles.infoLabel}>Cơ sở</label>
                      <Pane className="d-flex align-items-center">
                        <span className={styles.circleIcon}>
                          <span className="icon-school" />
                        </span>
                        <span className={styles.infoText}>
                          {details?.studentMaster?.student?.class?.branch?.name || 'Preschool'}
                        </span>
                      </Pane>
                    </Pane>

                    <Pane className="col-lg-6">
                      <label className={styles.infoLabel}>Lớp</label>
                      <Pane className="d-flex align-items-center">
                        <span className={styles.circleIcon}>
                          <span className="icon-open-book" />
                        </span>
                        <span className={styles.infoText}>
                          {details?.studentMaster?.student?.class?.name || 'Preschool'}
                        </span>
                      </Pane>
                    </Pane>
                  </Pane>
                </Pane>
              </Pane>

              <Pane className="card">
                <List
                  dataSource={details?.medicalLogs || []}
                  renderItem={(item) => (
                    <ListItem key={item.id} className={styles.listItem}>
                      <Pane style={{ padding: '0px 20px', width: '100%' }} className="row">
                        <Pane className="col-md-5">
                          <Heading type="form-sub-title">
                            {Helper.getDate(item.creationTime, variables.DATE_FORMAT.DATE_TIME)}
                          </Heading>
                        </Pane>
                        <Pane className="col-md-7">
                          <Pane>{variablesModules?.MEDICAL_ACTION_TYPE[item.actionType]}</Pane>
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
                    Thông tin y tế
                  </Heading>

                  <Pane>
                    <label className={styles.infoLabel}>Tên bệnh:</label>
                    <span className={styles.infoText}>{details?.diseaseName}</span>
                  </Pane>

                  <Pane className="row">
                    <Pane className="col-lg-6">
                      <label className={styles.infoLabel}>Thời gian dặn thuốc:</label>
                      <span className={styles.infoText}>
                        {Helper.getDate(details.appliedDate, variables.DATE_FORMAT.DATE)}
                      </span>
                    </Pane>
                    <Pane className="col-lg-6">
                      <label className={styles.infoLabel}>Vị trí đặt thuốc:</label>
                      <span className={styles.infoText}>{details?.medicineLocation}</span>
                    </Pane>
                  </Pane>
                </Pane>

                <List
                  dataSource={details?.medicines || []}
                  renderItem={({ name, unit, medicineTimes, note, files, id }, index) => (
                    <ListItem key={id} className={styles.listItem}>
                      <Pane className="w-100" style={{ padding: 20 }}>
                        <Heading type="form-block-title" style={{ marginBottom: 10 }}>
                          Thuốc {index + 1}
                        </Heading>

                        <Pane>
                          <label className={styles.infoLabel}>Tên thuốc:</label>
                          <span className={styles.infoText}>{name}</span>
                        </Pane>

                        <Pane className="row">
                          <Pane className="col-lg-6">
                            <label className={styles.infoLabel}>Đơn vị:</label>
                            <span className={styles.infoText}>{unit}</span>
                          </Pane>
                          <Pane className="col-lg-6">
                            <label className={styles.infoLabel}>Thời gian uống:</label>
                            <span className={styles.infoText}>
                              {medicineTimes
                                .map(
                                  (pill) => variablesModules.STATUS_TIME_CODE_NAME[pill.timeCode],
                                )
                                .join(', ')}
                            </span>
                          </Pane>
                        </Pane>

                        <Pane className="row mt-3">
                          {(medicineTimes || []).map(({ timeCode, medicineAmount, id }) => (
                            <Pane className="col-lg-6" key={id}>
                              <label className={styles.infoLabel}>
                                {variablesModules.STATUS_TIME_CODE_NAME[timeCode]}:
                              </label>
                              <span className={styles.infoText}>{medicineAmount}</span>
                            </Pane>
                          ))}
                        </Pane>

                        <Pane>
                          <label className={styles.infoLabel}>Ghi chú:</label>
                          <span className={styles.infoText}>{note}</span>
                        </Pane>

                        {Helper.isJSON(files) && (
                          <Pane>
                            <label className={styles.infoLabel}>Hình ảnh:</label>
                            <Pane className="row">
                              {isArray(JSON.parse(files)) &&
                                JSON.parse(files).map((item) => (
                                  <Pane className="col-lg-3" key={item}>
                                    <img
                                      className={classnames(styles.thumb, 'd-block w-100')}
                                      src={`${API_UPLOAD}${item}`}
                                      alt={item}
                                    />
                                  </Pane>
                                ))}
                            </Pane>
                          </Pane>
                        )}
                      </Pane>
                    </ListItem>
                  )}
                />
              </Pane>
            </Pane>
          </Pane>
        </Loading>
      </Pane>
    </>
  );
});

export default Index;
