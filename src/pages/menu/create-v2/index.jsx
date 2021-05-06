import { memo, useRef, useState, useEffect, useCallback } from 'react';
import { Form, Checkbox } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import { isEmpty } from 'lodash';
import { useHistory, useLocation, useDispatch, useSelector } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import csx from 'classnames';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import ImageUpload from '@/components/CommonComponent/ImageUpload';
import variablesModules from '../utils/variables';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatar';

import variables from '@/utils/variables';
import { Helper } from '@/utils';

const { List: FormList, Item: FormItemAntd } = Form;

const Index = memo(() => {
  const [
    loadingReducer,
    { branches, classes, students },
    { menuLeftChildren },
  ] = useSelector(({ loading, menuKidCreate, menu }) => [loading, menuKidCreate, menu]);
  const loadingSubmit = loadingReducer?.effects['menuKidCreate/ADD'];
  const dispatch = useDispatch();
  const history = useHistory();
  const mounted = useRef(false);
  const mountedSet = (action, value) => mounted?.current && action(value);

  const [type, setType] = useState(1);
  const [files, setFiles] = useState([]);

  const formRef = useRef();

  const onFinish = (values) => {
    const payload = {
      fromDate: values.range[0],
      toDate: values.range[1],
      menuWeeks: values.menuWeeks.map((item) => ({
        menuId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        dayOfWeek: item,
      })),
      menuDetails: values.menuDetails.map((item, index) => {
        return {
          ...item,
          foods: item.foods.map((itemFood, indexDishes) => ({
            ...itemFood,
            imageUrl: JSON.stringify(
              files?.find((item) => item.index === index && item.indexDishes === indexDishes)?.file,
            ),
          })),
          menuId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        };
      }),
      classMenus: values.classMenus
        ? values.classMenus.map((item) => ({
            classId: item,
          }))
        : [],
      studentMenus: values.studentMenus
        ? values.studentMenus.map((item) => ({
            studentId: item,
          }))
        : [],
    };
    dispatch({
      type: 'menuKidCreate/ADD',
      payload,
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'menuKidCreate/GET_BRANCHES',
      payload: {},
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  const onChangeBranch = (branch) => {
    dispatch({
      type: 'menuKidCreate/GET_CLASSES',
      payload: {
        branch,
      },
    });
  };

  const onChangeClass = (classId) => {
    dispatch({
      type: 'menuKidCreate/GET_STUDENTS',
      payload: {
        classStatus: 'HAS_CLASS',
        class: classId,
      },
    });
  };

  const uploadFiles = useCallback((filesList, index, indexDishes) => {
    setFiles((prev) => {
      const fileItem = prev.find(
        (item) => item.index === index && item.indexDishes === indexDishes,
      );
      if (!fileItem) {
        return [...prev, { index: index, file: [filesList], indexDishes: indexDishes }];
      } else {
        return prev.map((item) => {
          if (item.index === index && item.indexDishes === indexDishes) {
            return {
              ...item,
              file: [...item.file, filesList],
            };
          }
          return item;
        });
      }
    });
  });

  const removeFiles = (listFiles, index, indexDishes) => {
    setFiles((prev) => {
      const fileItem = prev.find(
        (item) => item.index === index && item.indexDishes === indexDishes,
      );
      if (fileItem) {
        return prev.map((item) => {
          if (item.index === index && item.indexDishes === indexDishes) {
            return {
              ...item,
              file: listFiles,
            };
          }
          return item;
        });
      }
    });
  };

  const removeFilesFoods = (index, indexDishes) => {
    setFiles((prev) => {
      return prev
        .filter(
          (item) =>
            (item.index === index && item.indexDishes !== indexDishes) || item.index !== index,
        )
        .map((item) => {
          if (item.index === index) {
            return {
              ...item,
              indexDishes:
                item.indexDishes >= indexDishes ? item.indexDishes - 1 : item.indexDishes,
            };
          }
          return item;
        });
    });
  };

  const removeFilesMenuDetails = (index) => {
    setFiles((prev) => {
      return prev
        .filter((item) => item.index !== index)
        .map((item) => {
          return {
            ...item,
            index: item.index >= index ? item.index - 1 : item.index,
          };
        });
    });
  };

  const getFiles = (listFiles, index, indexDishes) => {
    const itemFile = listFiles.find(
      (item) => item.index === index && item.indexDishes === indexDishes,
    );
    if (itemFile) {
      return itemFile.file;
    }
    return [];
  };

  return (
    <>
      <Breadcrumbs last={'Tạo thực đơn'} menu={menuLeftChildren} />
      <Pane style={{ padding: '10px 20px', paddingBottom: 0 }}>
        <Form
          layout="vertical"
          ref={formRef}
          onFinish={onFinish}
          initialValues={{
            type: 1,
            menuDetails: [{ foods: [{}] }],
          }}
        >
          <Pane className="row">
            <Pane className="col-lg-6">
              <Pane className="card" style={{ padding: 20 }}>
                <Heading type="form-title" style={{ marginBottom: 20 }}>
                  Thông tin chung
                </Heading>

                <Pane className={csx('row', 'border-bottom', 'mb20')}>
                  <Pane className="col-lg-12">
                    <FormItem
                      label="Áp dụng cho thứ"
                      name="menuWeeks"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT_MUTILPLE}
                      data={variablesModules.DAYS}
                    />
                  </Pane>
                  <Pane className="col-lg-8">
                    <FormItem
                      label="Khoảng thời gian áp dụng"
                      name="range"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.RANGE_PICKER}
                    />
                  </Pane>
                </Pane>

                <Pane className={csx('row', 'border-bottom', 'mb20')}>
                  <Pane className="col-lg-8">
                    <FormItem
                      label="Cơ sở áp dụng"
                      name="branchId"
                      type={variables.SELECT}
                      data={branches}
                      onChange={onChangeBranch}
                    />
                  </Pane>
                </Pane>

                <Pane className={csx('row', 'border-bottom', 'mb20')}>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Loại áp dụng"
                      name="type"
                      type={variables.RADIO}
                      data={[
                        { value: 1, label: 'Nhóm lớp' },
                        { value: 2, label: 'Cá nhân trẻ' },
                      ]}
                      onClick={({ target: { value } }) => value && setType(value)}
                      radioInline
                    />
                  </Pane>
                </Pane>

                {/* check type radio để hiện */}
                {+type === 1 && (
                  <Pane className="row">
                    {!isEmpty(classes) && (
                      <Pane className="col-lg-12">
                        <FormItem
                          label="Chọn lớp"
                          name="classMenus"
                          type={variables.CHECKBOX}
                          className="checkbox-group"
                          data={classes.map((item) => ({
                            value: item.id,
                            label: item.name,
                          }))}
                        />
                      </Pane>
                    )}
                  </Pane>
                )}
                {+type === 2 && (
                  <Pane className="row">
                    <Pane className="col-lg-12">
                      <FormItem
                        label="Chọn lớp"
                        name="classId"
                        type={variables.SELECT}
                        data={classes}
                        onChange={onChangeClass}
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <FormItem
                        label="Chọn trẻ"
                        name="studentMenus"
                        mode="multiple"
                        type={variables.SELECT_MUTILPLE}
                        data={Helper.convertSelectUsers(students)}
                      />
                    </Pane>
                  </Pane>
                )}
              </Pane>
            </Pane>

            <Pane className="col-lg-6">
              <Pane className="card">
                <Pane style={{ padding: '20px 20px 0 20px' }}>
                  <Heading type="form-title">Chi tiết</Heading>
                </Pane>

                <FormList name="menuDetails">
                  {(times, { add, remove }) => (
                    <>
                      <Pane className="border-bottom">
                        <Scrollbars autoHeight autoHeightMax={window.innerHeight - 355}>
                          {times.map(({ key, name }, index) => (
                            <Pane
                              key={key}
                              className={csx('position-relative', {
                                'border-bottom': index < times.length - 1,
                              })}
                              style={{ padding: '20px 20px 0 20px' }}
                            >
                              <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                Mốc thời gian {index + 1}
                              </Heading>

                              {times.length > 1 && (
                                <DeleteOutlined
                                  className="position-absolute"
                                  style={{ top: 20, right: 20, zIndex: 2 }}
                                  onClick={() => {
                                    remove(name);
                                    removeFilesMenuDetails(index);
                                  }}
                                />
                              )}

                              <Pane className="row border-bottom">
                                <Pane className="col-lg-6">
                                  <FormItem
                                    label="Giờ bắt đầu"
                                    name={[name, 'fromTime']}
                                    rules={[variables.RULES.EMPTY]}
                                    type={variables.TIME_PICKER}
                                  />
                                </Pane>
                                <Pane className="col-lg-6">
                                  <FormItem
                                    label="Giờ kết thúc"
                                    name={[name, 'toTime']}
                                    rules={[variables.RULES.EMPTY]}
                                    type={variables.TIME_PICKER}
                                  />
                                </Pane>
                              </Pane>

                              <FormList name={[name, 'foods']}>
                                {(dishes, { add: addDishes, remove: removeDishes }) => (
                                  <>
                                    {dishes.map(
                                      ({ key: dishesKey, name: dishesName }, indexDishes) => (
                                        <Pane
                                          className={csx(
                                            'position-relative',
                                            'row',
                                            'pt20',
                                            'border-bottom',
                                          )}
                                          key={dishesKey}
                                        >
                                          {dishes.length > 1 && (
                                            <DeleteOutlined
                                              className="position-absolute"
                                              style={{ top: 20, right: 20, zIndex: 2 }}
                                              onClick={() => {
                                                removeFilesFoods(index, indexDishes);
                                                removeDishes(dishesName);
                                              }}
                                            />
                                          )}

                                          <Pane className="col-lg-12">
                                            <FormItem
                                              label={`Tên món ${indexDishes + 1}`}
                                              name={[dishesName, 'name']}
                                              rules={[variables.RULES.EMPTY]}
                                              type={variables.INPUT}
                                            />
                                          </Pane>

                                          <Pane className="col-lg-12">
                                            <FormItemAntd label="Hình ảnh">
                                              <MultipleImageUpload
                                                files={getFiles(files, index, indexDishes)}
                                                callback={(filesList) =>
                                                  uploadFiles(filesList, index, indexDishes)
                                                }
                                                removeFiles={(filesList) =>
                                                  removeFiles(filesList, index, indexDishes)
                                                }
                                              />
                                            </FormItemAntd>
                                          </Pane>
                                        </Pane>
                                      ),
                                    )}

                                    <Pane className="mt20 mb20">
                                      <Button
                                        color="success"
                                        ghost
                                        icon="plus"
                                        onClick={() => addDishes()}
                                      >
                                        Thêm món
                                      </Button>
                                    </Pane>
                                  </>
                                )}
                              </FormList>
                            </Pane>
                          ))}
                        </Scrollbars>
                      </Pane>

                      <Pane style={{ padding: 20 }} className="border-bottom">
                        <Button
                          className="text-uppercase"
                          color="success"
                          ghost
                          icon="plus"
                          onClick={() => add()}
                        >
                          Thêm mốc thời gian
                        </Button>
                      </Pane>
                    </>
                  )}
                </FormList>

                <Pane className="p20">
                  <Button
                    color="success"
                    size="large"
                    style={{ marginLeft: 'auto' }}
                    htmlType="submit"
                    loading={loadingSubmit}
                  >
                    Tạo
                  </Button>
                </Pane>
              </Pane>
            </Pane>
          </Pane>
        </Form>
      </Pane>
    </>
  );
});

export default Index;
