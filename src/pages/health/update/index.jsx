import { memo, useRef, useEffect } from 'react';
import { Form, List } from 'antd';
import { Helmet } from 'react-helmet';
import { connect } from 'umi';
import moment from 'moment';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import FormItem from '@/components/CommonComponent/FormItem';
import Button from '@/components/CommonComponent/Button';

import variables from '@/utils/variables';
import variablesModules from '..//utils/variables';
import styles from '@/assets/styles/Common/information.module.scss';
import { Helper } from '@/utils';

const { Item: ListItem } = List;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const lunchData = [
  { value: 0, label: 'Tốt' },
  { value: 1, label: 'Bình thường' },
  { value: 2, label: 'Ăn ít' },
  { value: 3, label: 'Khác' },
]

const napData = [
  { value: 0, label: 'Tốt' },
  { value: 1, label: 'Bình thường' },
  { value: 2, label: 'Không ngủ' },
  { value: 3, label: 'Trễ' },
  { value: 4, label: 'Khác' },
]

const mapStateToProps = ({ loading, user, healthUpdate }) => ({
  user: user.user,
  loading,
  details: healthUpdate?.details,
  error: healthUpdate?.error,
});
const Index = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const loading = effects[`healthDetail/GET_DETAILS`];
  const loadingSubmit = effects[`healthDetail/UPDATE_STATUS`];
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
        type: 'healthUpdate/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

  const onFinish = (values) => {
    dispatch({
      type: 'healthUpdate/UPDATE_STATUS',
      payload: {
        ...values,
        id: params.id,
      },
      callback: (response) => {
        if (response) {
          dispatch({
            type: 'healthUpdate/GET_DETAILS',
            payload: params,
          });
        }
      },
    });
  };

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
          <Pane className="col-lg-5">
            <Pane className="card">
              <Pane className="border-bottom" style={{ padding: 20 }}>
                <Heading type="form-title">Sức khỏe hôm nay - Ngày {moment().format(variables.DATE_FORMAT.DATE_VI)}</Heading>
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

          <Pane className="col-lg-7">
            <Pane className="card">
              <Form ref={formRef} onFinish={onFinish} {...formLayout}>

                <Pane className="border-bottom p20">
                  <Heading type="form-title">
                    Chi tiết
                  </Heading>
                </Pane>

                <Pane className="border-bottom p20">
                  <Heading type="form-block-title" className="mb10">
                    Pipi
                  </Heading>
                  <FormItem label="Số lần pipi" type={variables.INPUT_COUNT} />
                  <FormItem label="Ghi chú" type={variables.INPUT} className="mb-0"/>
                </Pane>

                <Pane className="border-bottom p20">
                  <Heading type="form-block-title" className="mb10">
                    Pupu
                  </Heading>
                  <FormItem label="Số lần pupu" type={variables.INPUT_COUNT} />
                  <FormItem label="Ghi chú" type={variables.INPUT} className="mb-0"/>
                </Pane>

                <Pane className="border-bottom p20">
                  <Heading type="form-block-title" className="mb10" >
                    Lượng nước uống
                  </Heading>
                  <FormItem label="Số bình" type={variables.INPUT_COUNT} className="mb-0" />
                </Pane>

                <Pane className="border-bottom p20">
                  <Heading type="form-block-title" className="mb10">
                    Ăn uống
                  </Heading>
                  <FormItem label="Ăn sáng" type={variables.RADIO} data={lunchData} radioInline />
                  <FormItem label="Ghi chú khác" type={variables.INPUT} />
                  <FormItem label="Ăn trưa" type={variables.RADIO} data={lunchData} radioInline />
                  <FormItem label="Ghi chú khác" type={variables.INPUT} />
                  <FormItem label="Ăn xế" type={variables.RADIO} data={lunchData} radioInline />
                  <FormItem label="Ghi chú khác" type={variables.INPUT} className="mb-0" />
                </Pane>

                <Pane className="border-bottom p20">
                  <Heading type="form-block-title" className="mb10">
                    Ngủ
                  </Heading>
                  <FormItem label="Ăn xế" type={variables.RADIO} data={napData} radioInline />
                  <FormItem label="Ghi chú khác" type={variables.INPUT} className="mb-0" />
                </Pane>

                <Pane className="border-bottom p20">
                  <Heading type="form-block-title" className="mb10">
                    Tình huống
                  </Heading>
                  <FormItem label="Nội dung" type={variables.INPUT} className="mb-0" />
                </Pane>

                <Pane className="p20">
                  <Button
                    className="ml-auto"
                    color="success"
                  >
                    Cập nhật
                  </Button>
                </Pane>
              </Form>
            </Pane>
          </Pane>
        </Pane>
      </Loading>
    </Pane>
  );
});

export default connect(mapStateToProps)(Index);
