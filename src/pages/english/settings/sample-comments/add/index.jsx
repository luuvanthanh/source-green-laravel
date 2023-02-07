import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { useParams, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { Helmet } from 'react-helmet';
import { isEmpty, get } from 'lodash';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import classnames from 'classnames';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import styles from '@/assets/styles/Common/common.scss';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import stylesModule from '../styles.module.scss';

const General = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [{ menuLeftEnglish }, effects] = useSelector(({ menu, loading: { effects } }) => [menu, effects]);
  const mounted = useRef(false);
  const loadingSubmit = effects['englishSettingSampleCommentsAdd/ADD'] || effects['englishSettingSampleCommentsAdd/UPDATE'];

  // const loading = effects['englishSettingSampleCommentsAdd/GET_DATA'];
  const params = useParams();

  const [removeId, setRemoveId] = useState([]);

  const history = useHistory();

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'englishSettingSampleCommentsAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              name: response?.parsePayload?.name,
              code: response?.parsePayload?.code,
              data: response?.parsePayload?.sampleCommentDetail?.map(i => ({
                ...i,
              }))
            });
          }
        },
      });
    }
  }, [params.id]);

  const onFinish = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: params.id ? 'englishSettingSampleCommentsAdd/UPDATE' : 'englishSettingSampleCommentsAdd/ADD',
        payload: {
          id: params.id,
          name: values?.name,
          detail: {
            createRows: values?.data?.filter((i) => !i?.id).map(item => ({
              name: item.name,
              id: item.id,
            })),
            updateRows: values?.data?.filter((i) => i?.id).map(item => ({
              name: item.name,
              id: item.id,
            })),
            deleteRows: removeId,
          }
        },
        callback: (response, error) => {
          if (response) {
            if (response) {
              history.push(`/chuong-trinh-hoc/settings/sampleComments`);
            }
          }
          if (error) {
            if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
              error.data.errors.forEach((item) => {
                form.current.setFields([
                  {
                    name: get(item, 'source.pointer'),
                    errors: [get(item, 'detail')],
                  },
                ]);
              });
            }
          }
        },
      });
    });
  };

  return (
    <>
      <Breadcrumbs last={params.id ? 'Edit' : 'Create new'} menu={menuLeftEnglish} />
      <Helmet title="Sample comments" />
      <Pane className="p20">
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            data: [
              {},
            ],
          }}
          onFinish={onFinish}
        >
          <Pane>
            <Loading
              // loading={loading}
              params={{ type: 'container' }}
            >
              <Pane className="card">
                <Pane className="p20">
                  <Heading type="form-title" className="mb20">
                    General info
                  </Heading>
                  <Pane className="row mt20">
                    <Pane className="col-lg-6">
                      <FormItem label="ID" name="code" type={variables.INPUT} disabled placeholder={" "} />
                    </Pane>
                    <Pane className="col-lg-6">
                      <FormItem label="Type" name="name" type={variables.INPUT} rules={[variables.RULES.EMPTY_INPUT_ENGLISH]} placeholder="Input text" />
                    </Pane>
                    <Pane className="col-lg-12">
                      <Heading type="form-title" className="mb20">
                        Sample comments
                      </Heading>

                      <Pane >
                        <div className={stylesModule['wrapper-table']}>
                          <div className={stylesModule['card-heading']}>
                            <div className="d-flex flex-row w-100">
                              <p className={classnames(stylesModule.norm, stylesModule['wrapper-lable'])}>Content</p>
                            </div>
                            <div className={stylesModule.cols}>
                              <p className={stylesModule.norm} />
                            </div>
                          </div>
                          <Form.List name="data">
                            {(fields, { add, remove }) => (
                              <>
                                {fields.map((fieldItem, index) => {
                                  const data = form?.getFieldsValue();
                                  const itemData = data?.data?.find((item, indexWater) => indexWater === index);
                                  return (
                                    <Pane
                                      key={index}
                                      className="d-flex"
                                    >
                                      <div className={stylesModule['card-item']}>
                                        <div className={classnames(stylesModule.col)}>
                                          <FormItem
                                            className={stylesModule.item}
                                            fieldKey={[fieldItem.fieldKey, 'name']}
                                            name={[fieldItem.name, 'name']}
                                            type={variables.INPUT}
                                            rules={[variables.RULES.EMPTY_INPUT_ENGLISH]}
                                            placeholder="Input text"
                                          />
                                        </div>
                                        <div className={classnames(stylesModule.cols)}>
                                          {fields.length > 1 && (
                                            <div className={styles['list-button']}>
                                              <button
                                                className={styles['button-circle']}
                                                onClick={() => {
                                                  remove(index);
                                                  setRemoveId([...removeId, itemData?.id]);
                                                }}
                                                type="button"
                                              >
                                                <span className="icon-remove" />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </Pane>
                                  );
                                })}
                                <Pane className="mt10 ml10 mb10 d-flex align-items-center color-success pointer " >
                                  <span
                                    onClick={() => add()}
                                    role="presentation"
                                    className={stylesModule.add}
                                  >
                                    <span className="icon-plus-circle mr5" />
                                    Add
                                  </span>
                                </Pane>
                              </>
                            )}
                          </Form.List>
                        </div>
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
                      loading={loadingSubmit}
                    // permission={"WEB_TIENGANH_QUANLYCOMMENT_UPDATE" || "WEB_TIENGANH_QUANLYCOMMENT_DELETE"}
                    >
                      Save
                    </Button>
                  </Pane>
                </Pane>
              </Pane>
            </Loading>
          </Pane>
        </Form>
      </Pane>
    </>
  );
},
);

export default General;
