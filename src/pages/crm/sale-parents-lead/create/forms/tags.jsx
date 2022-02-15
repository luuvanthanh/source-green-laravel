import { memo, useRef, useEffect, useState } from 'react';
import { Form, Select, Tag } from 'antd';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import Heading from '@/components/CommonComponent/Heading';
import { isEmpty, get } from 'lodash';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import stylesModule from '../../styles.module.scss';

const { Option } = Select;
const General = memo(() => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const params = useParams();

  const mounted = useRef(false);
  const {
    detailsTags,
    loading: { effects },
    tags,
    details,
    error,
  } = useSelector(({ loading, crmSaleLeadAdd }) => ({
    loading,
    details: crmSaleLeadAdd.details,
    tags: crmSaleLeadAdd.tags,
    error: crmSaleLeadAdd.error,
    detailsTags: crmSaleLeadAdd.detailsTags,
    data: crmSaleLeadAdd.data,
  }));
  const loading = effects[`crmSaleLeadAdd/GET_DETAILS`];
  const loadingSubmit = effects[`crmSaleLeadAdd/ADD_TAGS`];
  const [dataTags, setDataTags] = useState([]);

  // useEffect(() => {
  //   dispatch({
  //     type: 'crmSaleLeadAdd/GET_CUSTOMER_TAGS',
  //     payload: {
  //       customer_lead_id: params.id,
  //     },
  //     callback: (response) => {
  //       if (response) {
  //         formRef.current.setFieldsValue({
  //           data: response.parsePayload.map((item) => ({
  //             ...item,
  //           })),
  //         });
  //       }
  //     },
  //   });
  // }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'crmSaleLeadAdd/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

  const onSelectColor = (e) => {
    setDataTags(e);
  };

  useEffect(() => {
    formRef.current.setFieldsValue({
      tag_id: detailsTags?.map((item) => item.tag_id),
    });
  }, [detailsTags]);

  useEffect(() => {
    dispatch({
      type: 'crmSaleLeadAdd/GET_TAGS',
      payload: {},
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onFinish = () => {
    dispatch({
      type: 'crmSaleLeadAdd/ADD_TAGS',
      payload: {
        customer_lead_id: params.id,
        customer_tag: dataTags.map((item) => ({ tag_id: item })),
      },
      callback: (response, error) => {
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              formRef.current.setFields([
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
  };
  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <Form
      layout="vertical"
      ref={formRef}
      onFinish={onFinish}
      initialValues={{
        data: [{}],
      }}
    >
      <Loading loading={loading} isError={error.isError} params={{ error }}>
        <div className="card">
          <div style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Tags
            </Heading>
            <div className="row">
              <div className="col-lg-12">
                <Select
                  showArrow
                  // value={details?.customerTag?.map((item) => item?.tag_id)}
                  defaultValue={details?.customerTag?.map((item) => item?.tag.id)}
                  mode="multiple"
                  className={stylesModule['details-tags']}
                  onChange={(e) => onSelectColor(e)}
                  tagRender={({ label, value, color_code, closable, onClose }) => {
                    const itemTag = tags.find(item => item.id === value);
                    return (
                      <Tag
                        color={itemTag?.color_code || color_code}
                        closable={closable}
                        onClose={onClose}
                        className={stylesModule['tags-content']}
                      >
                        {label}
                      </Tag>
                    );
                  }}
                >
                  {tags.map((item, index) => (
                    <Option
                      value={item?.id}
                      key={index}
                      style={{ backgroundColor: `${item.color_code}` }}
                    >
                      {item?.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-row-reverse">
          <Button color="success" htmlType="submit" loading={loadingSubmit || loading}>
            Lưu
          </Button>
        </div>
      </Loading>
    </Form>
  );
});

export default General;
