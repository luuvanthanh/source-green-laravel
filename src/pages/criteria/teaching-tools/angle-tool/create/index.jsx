import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Checkbox } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import csx from 'classnames';
import { head, isEmpty, size } from 'lodash';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Scrollbars } from 'react-custom-scrollbars';
import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';

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
        toolDetailGroups: itemsSelected.map((item) => ({
          toolDetailId: item,
        })),
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
    if (value) {
      mountedSet(
        setItems,
        toolDetails.filter(
          (item) => Helper.slugify(item.name)?.indexOf(Helper.slugify(value)) >= 0,
        ),
      );
    } else {
      mountedSet(setItems, toolDetails);
    }
  };

  const onChangeCheckbox = (event, record) => {
    const itemSelected = itemsSelected.find((item) => record.id === item);
    if (event.target.checked) {
      if (!itemSelected) {
        setItemsSelected((prev) => [...prev, record.id]);
      }
    } else {
      setItemsSelected((prev) => prev.filter((item) => item !== record.id));
    }
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
              toolDetails: response.toolDetailGroups.map((item) => item?.toolDetail?.id),
            });
            mountedSet(
              setItemsSelected,
              response.toolDetailGroups.map((item) => item?.toolDetail?.id),
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
    <Pane style={{ paddingTop: 20 }}>
      <Helmet title={params.id ? 'Chỉnh sửa góc giáo cụ' : 'Tạo góc giáo cụ'} />
      <Breadcrumbs
        className="pb30 pt0"
        last={params.id ? 'Chỉnh sửa góc giáo cụ' : 'Tạo góc giáo cụ'}
        menu={menuData}
      />
      <Pane style={{ padding: 20, paddingBottom: 0 }}>
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
                <FormItem
                  className="mt20"
                  label="Ý nghĩa trong cuộc sống"
                  name="meanOfLife"
                  type={variables.TEXTAREA}
                />
              </Pane>

              <Pane className="mt20 mb0 card">
                <Heading type="form-title" className="p20">
                  Danh sách giáo cụ ({size(itemsSelected)}/{size(toolDetails)})
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
                    <Scrollbars autoHeight autoHeightMax="calc(50vh)">
                      {items.map((item) => {
                        const record = itemsSelected.find((itemSelect) => itemSelect === item.id);
                        return (
                          <div key={item.id} className={styles['checkbox-container']}>
                            <Checkbox
                              checked={!!record}
                              onChange={(event) => onChangeCheckbox(event, item)}
                            >
                              {item.name}
                            </Checkbox>
                          </div>
                        );
                      })}
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
    </Pane>
  );
});

export default Index;
