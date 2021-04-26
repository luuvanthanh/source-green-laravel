import { memo, useRef, useEffect } from 'react';
import { Form, List } from 'antd';
import { Helmet } from 'react-helmet';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import variables from '@/utils/variables';
import styles from '@/assets/styles/Common/information.module.scss';
import { Helper } from '@/utils';
import variablesModules from '../../utils/variables';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { history, useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

const { Item: ListItem } = List;

const Index = memo(({}) => {
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
  const formRef = useRef();
  const loading = effects[`medicalItemsDetails/GET_DETAILS`];
  const loadingSubmit = effects[`medicalItemsDetails/UPDATE_STATUS`];
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
    if (params.id) {
      dispatch({
        type: 'medicalItemsDetails/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

  const onFinish = (values) => {
    dispatch({
      type: 'medicalItemsDetails/UPDATE_STATUS',
      payload: {
        ...values,
        id: params.id,
      },
      callback: (response) => {
        if (response) {
          dispatch({
            type: 'medicalItemsDetails/GET_DETAILS',
            payload: params,
          });
        }
      },
    });
  };

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
                    {Helper.getDate(details, variables.DATE_FORMAT.DATE_TIME)}
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
                    fileImage={Helper.getPathAvatarJson(details?.student?.fileImage)}
                    fullName={details?.student?.fullName}
                    description={`${details?.student?.age} tháng tuổi`}
                  />
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
                          {details?.studentMaster?.student?.class?.branch?.name || 'Preschool'}
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
                          {details?.studentMaster?.student?.class?.name || 'Preschool'}
                        </span>
                      </Pane>
                    </Pane>
                  </Pane>
                </Pane>

                <Pane style={{ padding: 20 }}>
                  <Form layout="vertical" ref={formRef} onFinish={onFinish}>
                    <Pane className="row">
                      <Pane className="col-lg-6">
                        <FormItem
                          label="Trạng thái nhận thuốc"
                          type={variables.SELECT}
                          name="receivingStatus"
                          data={variablesModules.STATUS_MEDICAL_RECEIVING}
                        />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem
                          label="Trạng thái cho uống"
                          type={variables.SELECT}
                          name="drinkingStatus"
                          data={variablesModules.STATUS_MEDICAL_DRINKING}
                        />
                      </Pane>

                      <Pane className="col-lg-12">
                        <FormItem label="Ghi chú" name="note" type={variables.INPUT} />
                      </Pane>

                      <Pane className="col-lg-12">
                        <Button
                          color="success"
                          htmlType="submit"
                          style={{ marginLeft: 'auto' }}
                          loading={loadingSubmit}
                        >
                          Cập nhật
                        </Button>
                      </Pane>
                    </Pane>
                  </Form>
                </Pane>
              </Pane>

              <Pane className="card">
                <List
                  dataSource={details?.medicalLogs || []}
                  renderItem={(item) => (
                    <ListItem key={item.id} className={styles.listItem}>
                      <Pane style={{ padding: 20, width: '100%' }} className="row">
                        <Pane className="col-md-5">
                          <Heading type="form-sub-title" style={{ marginBottom: 10 }}>
                            {Helper.getDate(item, variables.DATE_FORMAT.DATE_TIME)}
                          </Heading>
                        </Pane>
                        <Pane className="col-md-7">
                          <Pane>{variablesModules?.MEDICAL_ACTION_TYPE[`${item.actionType}`]}</Pane>
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
                              {JSON.parse(files).map((item) => (
                                <Pane className="col-lg-3" key={item}>
                                  <img
                                    className={styles.thumb}
                                    src={`${API_UPLOAD}${item}`}
                                    className="d-block w-100"
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
