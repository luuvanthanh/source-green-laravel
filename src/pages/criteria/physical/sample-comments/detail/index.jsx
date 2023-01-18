import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { Helmet } from 'react-helmet';

import { useParams, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import classnames from 'classnames';
import Button from '@/components/CommonComponent/Button';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import stylesModule from '../styles.module.scss';

const General = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { menuLeftCriteria, loading: { effects } } = useSelector(({ menu, loading }) =>
  ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
  }));
  const mounted = useRef(false);

  const params = useParams();

  const history = useHistory();

  const [details, setDetails] = useState(undefined);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      data: [""]
    });
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'sampleCommentAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            setDetails(response);
          }
        },
      });
    }
  }, [params.id]);

  return (
    <>
      <Breadcrumbs last={details?.code} menu={menuLeftCriteria} />
      <Helmet title="Sample comments" />
      <Pane className="p20">
        <Form
          layout="vertical"
          form={form}
          initialValues={{}}
        >          <Loading
          loading={effects['sampleCommentAdd/GET_DATA']}
        >
            <Pane>
              <Pane className="card">
                <Pane className="p20">
                  <Heading type="form-title" className="mb20">
                    Thông tin chung
                  </Heading>
                  <Pane className="row mt20">
                    <Pane className="col-lg-6">
                      <FormDetail name={details?.code} label="ID" />
                    </Pane>
                    <Pane className="col-lg-6">
                      <FormDetail name={details?.name} label="Loại nhận xét" />
                    </Pane>
                    <Pane className="col-lg-12">
                      <Heading type="form-title" className="mb20">
                        Nhận xét mẫu
                      </Heading>

                      <Pane >
                        <div className={stylesModule['wrapper-table']}>
                          <div className={stylesModule['card-heading']}>
                            <div className={stylesModule.col}>
                              <p className={stylesModule.norm}>Nội dung</p>
                            </div>
                            <div className={stylesModule.cols}>
                              <p className={stylesModule.norm} />
                            </div>
                          </div>
                          <>
                            {details?.content?.items?.map((fieldItem, index) => (
                                <Pane
                                  key={index}
                                  className="d-flex"
                                >
                                  <div className={stylesModule['card-item']}>
                                    <div className={classnames(stylesModule.colDetail)}>
                                      <FormDetail name={fieldItem} type="table" />
                                    </div>
                                  </div>
                                </Pane>
                              ))}
                          </>
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
                      Đóng
                    </p>
                    <Button
                      className="ml-auto px25"
                      color="success"
                      size="large"
                      onClick={() => {
                        history.push(`/chuong-trinh-hoc/the-chat/nhan-xet-mau/${details?.id}/edit`);
                      }}
                    >
                      Sửa
                    </Button>
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
          </Loading>
        </Form>
      </Pane>
    </>
  );
},
);

General.propTypes = {
};

General.defaultProps = {
};

export default General;
