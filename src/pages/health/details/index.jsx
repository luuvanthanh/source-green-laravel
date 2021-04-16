import { memo, useEffect } from 'react';
import { List } from 'antd';
import { Helmet } from 'react-helmet';
import { connect } from 'umi';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import variables from '@/utils/variables';
import variablesModules from '..//utils/variables';
import styles from '@/assets/styles/Common/information.module.scss';
import { Helper } from '@/utils';

const { Item: ListItem } = List;

const mapStateToProps = ({ loading, user, medicalItemsDetails }) => ({
  user: user.user,
  loading,
  details: medicalItemsDetails.details,
  error: medicalItemsDetails.error,
});
const Index = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const loading = effects[`healthDetail/GET_DETAILS`];

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'healthDetail/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Loading loading={loading} isError={error.isError} params={{ error, type: 'container' }}>
        <Helmet title="Chi tiết" />
        <Pane className="row" style={{ marginBottom: 20 }}>
          <Pane className="col">
            <Heading type="page-title">Chi tiết</Heading>
          </Pane>
        </Pane>

        <Pane className="row">
          <Pane className="col-lg-6">
            <Pane className="card">
              <Pane className="border-bottom" style={{ padding: 20 }}>
                <Heading type="form-title"></Heading>
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
                  <AvatarTable fileImage={details?.student?.fileImage} />
                  <Pane>
                    <h3>{details?.student?.fullName || 'Subeo'}</h3>
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
                        {details?.position?.name || 'Lake view'}
                      </span>
                    </Pane>
                  </Pane>

                  <Pane className="col-lg-6">
                    <label className={styles.infoLabel}>Lớp</label>
                    <Pane className="d-flex align-items-center">
                      <span className={styles.circleIcon}>
                        <span className={'icon-open-book'} />
                      </span>
                      <span className={styles.infoText}>{details?.class?.name || 'Preschool'}</span>
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
              <Pane className="border-bottom p20">
                <Heading type="form-title">
                  Chi tiết
                  </Heading>
              </Pane>

              <Pane className="border-bottom p20">
                <Heading type="form-block-title" className="mb10">
                  Pipi
                  </Heading>
                <Pane className="mb10">
                  <Pane className="d-inline-block min-width-120">
                    <label className={styles.infoLabel}>Số lần pipi</label>
                  </Pane>
                  <span className={styles.infoText}>2</span>
                </Pane>
                <Pane>
                  <Pane className="d-inline-block min-width-120">
                    <label className={styles.infoLabel}>Ghi chú</label>
                  </Pane>
                  <span className={styles.infoText}>Bé uống rất ít nước hôm nay</span>
                </Pane>
              </Pane>

              <Pane className="border-bottom p20">
                <Heading type="form-block-title" className="mb10">
                  Pupu
                  </Heading>
                <Pane className="mb10">
                  <Pane className="d-inline-block min-width-120">
                    <label className={styles.infoLabel}>Số lần Pupu</label>
                  </Pane>
                  <span className={styles.infoText}>1</span>
                </Pane>
                <Pane>
                  <Pane className="d-inline-block min-width-120">
                    <label className={styles.infoLabel}>Ghi chú</label>
                  </Pane>
                  <span className={styles.infoText}></span>
                </Pane>
              </Pane>

              <Pane className="border-bottom p20">
                <Heading type="form-block-title" className="mb10">
                  Lượng nước uống
                  </Heading>
                <Pane>
                  <Pane className="d-inline-block min-width-120">
                    <label className={styles.infoLabel}>Số bình</label>
                  </Pane>
                  <span className={styles.infoText}>2</span>
                </Pane>
              </Pane>

              <Pane className="border-bottom p20">
                <Heading type="form-block-title" className="mb10">
                  Ăn uống
                  </Heading>
                <Pane className="mb10">
                  <Pane className="d-inline-block min-width-120">
                    <label className={styles.infoLabel}>Ăn sáng</label>
                  </Pane>
                  <span className={styles.infoText}>Tốt</span>
                </Pane>
                <Pane className="mb10">
                  <Pane className="d-inline-block min-width-120">
                    <label className={styles.infoLabel}>Ăn trưa</label>
                  </Pane>
                  <span className={styles.infoText}>Bình thường</span>
                </Pane>
                <Pane className="d-flex align-items-start">
                  <Pane className="d-inline-block min-width-120">
                    <label className={styles.infoLabel}>Ăn xế</label>
                  </Pane>
                  <Pane className="d-inline-block">
                    <Pane>
                      <span className={styles.infoText}>Khác</span>
                    </Pane>
                    <Pane>Bé không muốn ăn</Pane>
                  </Pane>
                </Pane>
              </Pane>

              <Pane className="border-bottom p20">
                <Heading type="form-block-title" className="mb10">
                  Ngủ
                  </Heading>
                <Pane>
                  <Pane className="d-inline-block min-width-120">
                    <label className={styles.infoLabel}>Ngủ trưa</label>
                  </Pane>
                  <span className={styles.infoText}>Tốt</span>
                </Pane>
              </Pane>

              <Pane className="border-bottom p20">
                <Heading type="form-block-title" className="mb10">
                  Tình huống
                  </Heading>
                <Pane>
                  <Pane className="d-inline-block min-width-120">
                    <label className={styles.infoLabel}>Nội dung</label>
                  </Pane>
                  <span className={styles.infoText}>Bé ăn lâu hơn bình thường</span>
                </Pane>
              </Pane>
            </Pane>
          </Pane>
        </Pane>
      </Loading>
    </Pane>
  );
});

export default connect(mapStateToProps)(Index);
