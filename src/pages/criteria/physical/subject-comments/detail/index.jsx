import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import classnames from 'classnames';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Text from '@/components/CommonComponent/Text';
import { Helper } from '@/utils';
import stylesModule from '../styles.module.scss';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const [details, setDetails] = useState(undefined);
  const {
    loading: { effects },
    menuLeftCriteria,
  } = useSelector(({ menu, loading }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria
  }));

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'subjectCommentAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            setDetails(response);
          }
        },
      });
    }
  }, [params.id]);

  const onRemove = (id) => {
    const text = "Bạn có chắc chắn muốn xóa Môn đánh giá này không?";
    Helper.confirmDelete({
      callback: () => {
        dispatch({
          type: 'subjectCommentAdd/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) {
              history.goBack();
            }
          },
        });
      },
    }, text);
  };

  return (
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last={details?.code} menu={menuLeftCriteria} />
      <Helmet title="Môn đánh giá" />
      <Pane className="pl20 pr20">
        <Pane className="col-lg-6 offset-lg-3">
          <Form layout="vertical" form={form}>
            <Loading
              loading={effects['subjectCommentAdd/GET_DATA']}
            >
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  Thông tin chung
                </Heading>
                <Pane className="row">
                  <Pane className="col-lg-12">
                    <FormDetail name={details?.code} label="ID" />
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormDetail name={details?.name} label="Môn đánh giá" />
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  Tiêu chí đánh giá
                </Heading>
                <Text color='dark' size='normal' className="mb15">{details?.content?.type === 'INFORMATION' ? "Nhập thông tin" : "Chọn tiêu chí"}</Text>
                {
                  details?.content?.type === 'INFORMATION' ? (
                    <></>
                  ) : (
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
                  )
                }
              </Pane>
              <Pane className="d-flex justify-content-between align-items-center mb20">
                <p
                  className="btn-delete"
                  role="presentation"

                  onClick={() => history.goBack()}
                >
                  Đóng
                </p>
                <p className="btn-delete ml-4" role="presentation" onClick={() => onRemove(details?.id)}>
                  Xóa
                </p>
                <Button
                  className="ml-auto px25"
                  color="success"
                  size="large"
                  onClick={() => {
                    history.push(`/chuong-trinh-hoc/the-chat/mon-danh-gia/${details?.id}/edit`);
                  }}
                >
                  Sửa
                </Button>
              </Pane>
            </Loading>
          </Form>
        </Pane>
      </Pane>
    </div>
  );
});

export default Index;