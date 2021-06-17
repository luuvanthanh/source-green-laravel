import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import csx from 'classnames';
import { head, isEmpty } from 'lodash';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Scrollbars } from 'react-custom-scrollbars';
import { variables, Helper } from '@/utils';

const Index = memo(() => {
  const [
    menuData,
    loading,
    { toolDetails },
  ] = useSelector(
    ({ menu: { menuLeftCriteria }, loading: { effects }, criteriaAngleToolCreate }) => [
      menuLeftCriteria,
      effects,
      criteriaAngleToolCreate,
    ],
  );
  const dispatch = useDispatch();
  const params = useParams();

  const history = useHistory();
  const formRef = useRef();
  const mounted = useRef(false);
  const [itemsSelected, setItemsSelected] = useState([]);
  const [items, setItems] = useState([]);
  const mountedSet = (action, value) => mounted?.current && action(value);

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'criteriaAngleToolCreate/UPDATE' : 'criteriaAngleToolCreate/ADD',
      payload: {
        ...values,
        ...params,
      },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              formRef.current.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
                },
              ]);
            });
          }
        }
      },
    });
  };

  const remove = () => {
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'criteriaAngleToolCreate/REMOVE',
          payload: {
            ...params,
          },
          callback: (response) => {
            if (response) {
              history.goBack();
            }
          },
        });
      },
    });
  };

  const onChange = ({ target: { value } }) => {
    mountedSet(
      setItems,
      toolDetails.filter((item) => Helper.slugify(item.name)?.indexOf(value) >= 0),
    );
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'criteriaAngleToolCreate/GET_DATA',
        payload: {
          ...params,
        },
        callback: (response) => {
          if (response) {
            formRef.current.setFieldsValue({
              ...response,
              toolDetails: response.toolDetails.map((item) => item.id),
            });
            mountedSet(
              setItemsSelected,
              response.toolDetails.map((item) => item.id),
            );
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    dispatch({
      type: 'criteriaAngleToolCreate/GET_TOOL_DETAILS',
      payload: {},
      callback: (response) => {
        if (response) {
          mountedSet(setItems, response.items);
        }
      },
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title="Tạo góc giáo cụ" />
      <Breadcrumbs className="pb30 pt0" last="Tạo góc giáo cụ" menu={menuData} />
      <Pane className="row justify-content-center">
        <Pane className="col-lg-6">
          <Form layout="vertical" ref={formRef} onFinish={onFinish} initialValues={{}}>
            <Pane className="p20 pt20 card">
              <Heading type="form-title" className="mb20">
                Thông tin chung
              </Heading>
              <FormItem
                className="mb0"
                label="Tên góc giáo cụ"
                name="name"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>

            <Pane className="mt20 mb0 card">
              <Heading type="form-title" className="p20">
                Danh sách giáo cụ ({toolDetails.length}/{itemsSelected.length})
              </Heading>

              <Pane className={csx('row')}>
                <Pane className="col-12">
                  <FormItem
                    className="search-form mb0"
                    type={variables.INPUT_SEARCH}
                    name="search"
                    placeholder="Tìm kiếm"
                    onChange={onChange}
                  />
                  <Scrollbars autoHeight autoHeightMax={window.innerHeight - 600}>
                    <FormItem
                      className="checkbox-column mb0"
                      name="toolDetails"
                      type={variables.CHECKBOX}
                      data={items.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      onChange={(values) => setItemsSelected(values)}
                    />
                  </Scrollbars>
                </Pane>
              </Pane>
            </Pane>

            <Pane className="py20 d-flex justify-content-between align-items-center">
              {params.id && (
                <p className="btn-delete" role="presentation" onClick={remove}>
                  Xóa
                </p>
              )}
              <Button
                className="ml-auto px25"
                color="success"
                htmlType="submit"
                size="large"
                loading={
                  loading['criteriaAngleToolCreate/ADD'] ||
                  loading['criteriaAngleToolCreate/UPDATE'] ||
                  loading['criteriaAngleToolCreate/GET_TOOL_DETAILS'] ||
                  loading['criteriaAngleToolCreate/GET_DATA']
                }
              >
                Lưu
              </Button>
            </Pane>
          </Form>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
