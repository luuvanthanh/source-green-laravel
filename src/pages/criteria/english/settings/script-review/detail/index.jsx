import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { head } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { variables } from '@/utils';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import stylesModule from '../styles.module.scss';


const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    details,
    menuLeftCriteria,
  } = useSelector(({ menu, loading, englishSettingScriptReviewAdd }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    details: englishSettingScriptReviewAdd.details,
    skill: englishSettingScriptReviewAdd.skill,
    error: englishSettingScriptReviewAdd.error,
  }));

  const onFinish = () => {

  };

  useEffect(() => {
    dispatch({
      type: 'englishSettingScriptReviewAdd/GET_SKILL',
      payload: {},
    });
  }, []);

  // useEffect(() => {
  //   if (params.id) {
  //     dispatch({
  //       type: 'englishSettingScriptReviewAdd/GET_DATA',
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
      title: 'Trẻ',
      key: 'student',
      width: 200,
      className: 'min-width-200',
      render: () => (
        <FormItem
          valuePropName="checked"
          label="Example 1"
          name='use'
          className="checkbox-row checkbox-small"
          type={variables.CHECKBOX_FORM}
        />
      ),
    },
  ];

  return (
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last={params.id ? 'Edit' : 'Create new'} menu={menuLeftCriteria} />
      <Helmet title="General info" />
      <Pane className="pl20 pr20 pb20">
        <Pane >
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
                General info
              </Heading>
              <Pane className="row">
                <Pane className="col-lg-3">
                  <FormItem
                    name="id"
                    placeholder="Chọn"
                    type={variables.SELECT}
                    label="Type report"
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-12">
                  <FormItem
                    name="age"
                    placeholder="Chọn"
                    type={variables.SELECT_TAGS}
                    label="Subject name"
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-12">
                  <FormItem
                    name="age"
                    placeholder="Chọn"
                    type={variables.SELECT_TAGS}
                    label="Subject name"
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                </Pane>
              </Pane>
            </Pane>
            <Pane className="card mb20">
              <Pane className="p20">
                <Heading type="form-title" className="mb15">
                  Subject
                </Heading>
                <Pane className="row">
                  <Pane className="col-lg-4">
                    <FormItem
                      valuePropName="checked"
                      label="Don't use"
                      name='use'
                      className="checkbox-row-form no-label m0"
                      type={variables.SWITCH}
                    />
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-12">
                  <FormItem
                    valuePropName="checked"
                    label="Teacher's Observation"
                    name='use'
                    className="checkbox-row checkbox-small border-top p20 m0"
                    type={variables.CHECKBOX_FORM}
                  />
                  <div className={stylesModule['wrapper-table-details']}>
                    <Table
                      columns={header()}
                      dataSource={[{ id: 1 }, { id: 2 }]}
                      pagination={false}
                      className="pl20 pr20 pb20"
                      rowKey={(record) => record.id}
                      scroll={{ x: '100%' }}
                      isEmpty
                    />
                  </div>
                </Pane>
                <Pane className="col-lg-12">
                  <FormItem
                    valuePropName="checked"
                    label="Teacher's Observation"
                    name='use'
                    className="checkbox-row checkbox-small border-top p20 m0"
                    type={variables.CHECKBOX_FORM}
                  />
                </Pane>
              </Pane>
            </Pane>

            <Pane className="card mb20">
              <Pane className="p20">
                <Heading type="form-title" className="mb15">
                  Comment information
                </Heading>
                <Pane className="row">
                  <Pane className="col-lg-4">
                    <FormItem
                      valuePropName="checked"
                      label="Don't use"
                      name='use'
                      className="checkbox-row-form no-label m0"
                      type={variables.SWITCH}
                    />
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-12">
                  <FormItem
                    valuePropName="checked"
                    label="Teacher's Observation"
                    name='use'
                    className="checkbox-row checkbox-small border-top p20 m0"
                    type={variables.CHECKBOX_FORM}
                  />
                  <div className={stylesModule['wrapper-table-details']}>
                    <Table
                      columns={header()}
                      dataSource={[{ id: 1 }, { id: 2 }]}
                      pagination={false}
                      className="pl20 pr20 pb20"
                      rowKey={(record) => record.id}
                      scroll={{ x: '100%' }}
                      isEmpty
                    />
                  </div>
                </Pane>
                <Pane className="col-lg-12">
                  <FormItem
                    valuePropName="checked"
                    label="Teacher's Observation"
                    name='use'
                    className="checkbox-row checkbox-small border-top p20 m0"
                    type={variables.CHECKBOX_FORM}
                  />
                </Pane>
              </Pane>
            </Pane>
            <Pane className="d-flex justify-content-between align-items-center mb20 mt20">
              <p
                className="btn-delete"
                role="presentation"

                onClick={() => history.goBack()}
              >
                Cancel
              </p>
              <Button
                className="ml-auto px25"
                color="success"
                htmlType="submit"
                size="large"
              >
                Save
              </Button>
            </Pane>
          </Form>
        </Pane>
      </Pane>
    </div>
  );
});

export default Index;