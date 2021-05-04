import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Text from '@/components/CommonComponent/Text';
import { variables } from '@/utils';

const levelsDefault = [
  {
    name: '1',
    childs: [
      {
        id: uuidv4(),
        value: ''
      },
      {
        id: uuidv4(),
        value: ''
      }
    ],

  },
  {
    name: '2',
    childs: [
      {
        id: uuidv4(),
        value: ''
      },
    ],

  },
  {
    name: '3',
    childs: [
      {
        id: uuidv4(),
        value: ''
      },
    ],
  },
  {
    name: '4',
    childs: [
      {
        id: uuidv4(),
        value: '123213'
      },
    ]
  },
]

const Index = memo(({ }) => {
  const [levels, setLevels] = useState(levelsDefault);

  const { loading } = useSelector(({ loading }) => ({ loading }));
  const [{ menuLeftCriteria }] = useSelector(({ menu }) => [menu]);
  const dispatch = useDispatch();

  const history = useHistory();
  const formRef = useRef();
  const mounted = useRef(false);
  const mountedSet = (action, value) => mounted?.current && action(value);

  const onFinish = (values) => {
    history.goBack()
  };

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  const handleCreateCriteria = (index) => {
    const newLevels = [...levels];
    newLevels[index]['childs'].push({
      id: uuidv4(),
      value: ''
    })
    setLevels(newLevels);
  }

  const handleDelete = (index) => {
    const newLevels = [...levels];
    newLevels.splice(index, 1);
    setLevels(newLevels);
  }

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title="Tạo giáo cụ" />
      <Breadcrumbs className="pb30 pt0" last="Tạo giáo cụ" menu={menuLeftCriteria} />
      <Pane className="row justify-content-center">
        <Pane className="col-lg-6">
          <Form
            layout="vertical"
            ref={formRef}
            onFinish={onFinish}
            initialValues={{}}
          >
            <Pane className="my20 mb0 card">
              <Pane className="border-bottom p20">
                <Heading type="form-title" className="mb20">
                  Thông tin chung
                </Heading>
                <FormItem
                  className="mb0"
                  label="Tên giáo cụ"
                  name="tenGiaoCu"
                  type={variables.INPUT}
                  // rules={[variables.RULES.EMPTY]}
                />
              </Pane>
              <Pane className="border-bottom p20">
                <Heading type="form-title" className="mb10">
                  Cấp độ
                </Heading>
                {
                  levels.map((item, index) => (
                    <Pane className={index === 0 ? 'mt10' : 'mt20'} key={index}>
                      <Pane className="d-flex">
                        <Text size="medium" className="fw-bold mr5 fs-13">{item.name}.</Text>
                        {index !== 0 && (
                          <p
                            onClick={() => handleDelete(index)}
                            className="btn-delete fs-13 fw-normal"
                          >
                            Xóa
                          </p>
                        )}
                      </Pane>
                      <Text size="normal" >Chương trình học</Text>
                      {
                        item?.childs.map((itemChild, indexChild) => (
                          <Pane key={indexChild} className="mt10 d-flex justify-content-between align-items-center groups-input">
                            <FormItem
                              className="mb0"
                              value={itemChild?.value}
                              // name={`huongDan${item.name}${indexChild}`}
                              name={[`test${item.name}`, `value${indexChild}`]}
                              fieldKey={[`test${item.name}`, `value${indexChild}`]}
                              type={variables.INPUT}
                            />
                            {indexChild !== 0 && (<span className="icon icon-remove" />)}
                          </Pane>
                        ))
                      }
                      <Pane className="mt10 d-flex align-items-center color-success pointer">
                        <span className="icon-plus-circle mr5" />
                        <span onClick={() => handleCreateCriteria(index)} className="text-uppercase fs-13">Thêm tiêu chí</span>
                      </Pane>
                    </Pane>
                  ))
                }
              </Pane>
              <Pane className="border-bottom p20 d-flex align-items-center">
                <FormItem
                  className="mb0 mr10"
                  name="isHasNote"
                  type={variables.SWITCH}
                  valuePropName="checked"
                />
                <Text size="normal">Nhận xét</Text>
              </Pane>
              <Pane className="p20 d-flex justify-content-between align-items-center">
                <p className="btn-delete">Hủy</p>
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                >
                  Lưu
                </Button>
              </Pane>
            </Pane>
          </Form>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
