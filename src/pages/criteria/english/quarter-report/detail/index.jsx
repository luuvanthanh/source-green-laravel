import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Image, Avatar, Modal } from 'antd';
import { head } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { variables, Helper } from '@/utils';
import { useParams, history } from 'umi';
import classnames from 'classnames';
import Heading from '@/components/CommonComponent/Heading';
import Table from '@/components/CommonComponent/Table';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import { UserOutlined } from '@ant-design/icons';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import stylesModule from '../styles.module.scss';


const marginProps = { style: { paddingTop: 12, paddingBottom: 20 } };
const detailText = "Are you sure you don't want to refuse this review?";
const { confirm } = Modal;
const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    details,
    menuLeftCriteria,
  } = useSelector(({ menu, loading, EnglishQuarterReportAdd }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    details: EnglishQuarterReportAdd.details,
    skill: EnglishQuarterReportAdd.skill,
    error: EnglishQuarterReportAdd.error,
  }));


  const loadingSubmit = effects[`EnglishQuarterReportAdd/UPDATE`] || effects[`EnglishQuarterReportAdd/ADD`];

  const onFinish = () => {

  };

  useEffect(() => {
    dispatch({
      type: 'EnglishQuarterReportAdd/GET_SKILL',
      payload: {},
    });
  }, []);

  // useEffect(() => {
  //   if (params.id) {
  //     dispatch({
  //       type: 'EnglishQuarterReportAdd/GET_DATA',
  //       payload: params,
  //       callback: (response) => {
  //         if (response) {
  //           form.setFieldsValue({
  //             data: response.parsePayload.childEvaluateDetail,
  //           });
  //         }
  //       },
  //     });
  //   }
  // }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue({
        ...details,
        ...head(details.positionLevel),
      });
    }
  }, [details]);

  const header = () => [
    {
      title: 'Content',
      key: 'student',
      className: 'min-width-200',
      render: (record) => record?.name,
    },
    {
      title: 'Working Towards Expectations',
      key: 'img',
      align: 'center',
      width: 150,
      className: classnames('min-width-150', 'max-width-150'),
      render: () => (
        <div className={stylesModule['wraper-container-quarterReport']}>
          <div className={stylesModule['list-button-detail']} >
            <Button
              icon="checkmark"
              className={stylesModule.checkDetail}
            />
          </div>
        </div>
      ),
    },
  ];

  const confirmAction = () => {
    confirm({
      centered: true,
      okText: 'Đồng ý',
      cancelText: 'Đóng',
      wrapClassName: 'wrapper-modal',
      content: (
        <>
          <div className={stylesModule['wrapper-coincide-title']}>{detailText}</div>
        </>
      ),
      onOk() {
      },
      onCancel() { },
    });
  };

  const submit = () => {
    confirmAction();
  };

  return (
    <div className={stylesModule['wraper-container-quarterReport']}>
      <Breadcrumbs last={params.id ? 'Edit' : 'Create new'} menu={menuLeftCriteria} />
      <Helmet title="Subject" />
      <Pane className="pl20 pr20 pb20">
        <Pane>
          <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{
            data: [
              {},
            ],
          }}>
            {/* <Loading
              loading={loading}
              isError={error.isError}
              params={{ error, goBack: '/su-phat-trien-cua-tre/cau-hinh-kich-ban-danh-gia' }}
            > */}
            <Pane className="card p20">
              <Heading type="form-title" className="mb15">
                Đánh giá giữa HK 1
              </Heading>
              <div className="row" {...marginProps} style={{ paddingLeft: 20, paddingRight: 20 }} >
                <div className={stylesModule['quarterReport-header-img']}>
                  {Helper.isJSON(details?.fileImage) &&
                    JSON.parse(details?.fileImage)?.length > 0 ?
                    JSON.parse(details?.fileImage).map((item) => (
                      <Image
                        style={{ borderRadius: 2, marginRight: 20, objectFit: "contain", margin: 0 }}
                        width={60}
                        height={60}
                        src={`${API_UPLOAD}${item}`}
                      />
                    ))
                    :
                    < Avatar shape="square" size={60} icon={<UserOutlined />} />
                  }
                  <div className='d-block ml20'>
                    <h3 className={stylesModule['general-fullName']}>
                      Trần Zia
                    </h3>
                    <p className={stylesModule['general-age']}>31 tháng tuổi</p>
                  </div>
                </div>
              </div>
              <Pane className="row">
                <Pane className="col-lg-3">
                  <FormItem
                    name="id"
                    placeholder="Center"
                    type={variables.INPUT}
                    label="ID"
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="age"
                    placeholder="Chọn"
                    type={variables.INPUT}
                    label="Class"
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="age"
                    placeholder="Chọn"
                    type={variables.INPUT}
                    label="Subject name"
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                </Pane>
              </Pane>
            </Pane>
            <Pane>
              <Pane className="card mb20">
                <Pane className="p20">
                  <Heading type="form-title">
                    Subject
                  </Heading>
                </Pane>
                <Pane className="row p20 pt0">
                  <Pane className="col-lg-12 pt20 border-top">
                    <h3 className={stylesModule['item-text-header']}>English communication and language</h3>
                  </Pane>
                  <Pane className="col-lg-12 pb20">
                    <div className={stylesModule['wrapper-table-item']}>
                      <h3 className={stylesModule['text-item-table']}>A. Listening Skill</h3>
                      <Table
                        columns={header()}
                        dataSource={[{ id: 1, name: 'Understand and follow teacher s instruction' }, { id: 2, name: 'Lower Than Expectations' }]}
                        pagination={false}
                        bordered
                        rowKey={(record) => record.id}
                        scroll={{ x: '100%' }}
                        isEmpty
                      />
                    </div>
                  </Pane>
                  <Pane className="col-lg-12">
                    <div className={stylesModule['wrapper-table-item']}>
                      <h3 className={stylesModule['text-item-table']}>B. Interaction</h3>
                      <Table
                        columns={header()}
                        dataSource={[{ id: 1, name: 'Understand and follow teacher s instruction' }, { id: 2, name: 'Lower Than Expectations' }]}
                        pagination={false}
                        bordered
                        rowKey={(record) => record.id}
                        scroll={{ x: '100%' }}
                        isEmpty
                      />
                    </div>
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
            <Pane className="d-flex justify-content-between align-items-center mb20">
              <p
                className="btn-delete"
                role="presentation"

                onClick={() => history.goBack()}
              >
                Cancel
              </p>
              <div className='d-flex'>
                <Button
                  className="ml-auto px25"
                  color="danger"
                  htmlType="submit"
                  size="large"
                  loading={loadingSubmit}
                >
                  Refuse
                </Button>
                <Button
                  className="ml10 px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                  loading={loadingSubmit}
                >
                  Save
                </Button>
                <Button
                  className="ml10 px25"
                  color="primary"
                  size="large"
                  loading={loadingSubmit}
                  onClick={submit}
                >
                  Acpect
                </Button>
              </div>
            </Pane>
          </Form>
        </Pane>
      </Pane >
    </div >
  );
});

export default Index;