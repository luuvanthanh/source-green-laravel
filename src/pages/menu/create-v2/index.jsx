import { memo, useRef, useState } from 'react'
import { Form, Checkbox } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { Helmet } from 'react-helmet'
import { Scrollbars } from 'react-custom-scrollbars';
import csx from 'classnames';

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import Button from '@/components/CommonComponent/Button'
import FormItem from '@/components/CommonComponent/FormItem'
import ImageUpload from '@/components/CommonComponent/ImageUpload'

import variables from '@/utils/variables'

const days = [
  { id: 1, name: 'Thứ hai' },
  { id: 2, name: 'Thứ ba' },
  { id: 3, name: 'Thứ tư' },
  { id: 4, name: 'Thứ năm' },
  { id: 5, name: 'Thứ sáu' },
  { id: 6, name: 'Thứ bảy' },
  { id: 7, name: 'Chủ nhật' },
]

const classes = [
  { id: 1, name: 'Lớp Preschool 1' },
  { id: 2, name: 'Lớp Preschool 2' },
]

const { List: FormList, Item: FormItemAntd } = Form

const Index = memo(() => {
  const [type, setType] = useState(1)

  const formRef = useRef()

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title="Tạo y tế" />
      <Pane className="row" style={{ marginBottom: 20 }}>
        <Pane className="col">
          <Heading type="page-title">Tạo y tế</Heading>
        </Pane>
      </Pane>

      <Form
        layout="vertical"
        ref={formRef}
        initialValues={{
          type: 1,
          menu: [{ dishes: [{}] }]
        }}
      >
        <Pane className="row">
          <Pane className="col-lg-6">
            <Pane className="card" style={{ padding: 20 }}>
              <Heading type="form-title" style={{ marginBottom: 20 }}>Thông tin chung</Heading>

              <Pane className={csx('row', 'border-bottom', 'mb20')}>
                <Pane className="col-lg-12">
                  <FormItem
                    label="Áp dụng cho thứ"
                    name="day"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.SELECT_MUTILPLE}
                    data={days}
                  />
                </Pane>
                <Pane className="col-lg-6">
                  <FormItem
                    label="Khoảng thời gian áp dụng"
                    name="range"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.RANGE_PICKER}
                  />
                </Pane>
              </Pane>

              <Pane className={csx('row', 'border-bottom', 'mb20')}>
                <Pane className="col-lg-6">
                  <FormItem
                    label="Cơ sở áp dụng"
                    name="position"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.SELECT}
                    data={[]}
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
                  {classes.map(({ id, name }) => (
                    <Pane className="col-lg-12" key={id}>
                      <Checkbox>{name}</Checkbox>
                    </Pane>
                  ))}
                </Pane>
              )}
              {+type === 2 && (
                <Pane className="row">
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Chọn trẻ"
                      name="student"
                      type={variables.SELECT}
                      data={[
                        { id: 1, name: 'Subeo' },
                      ]}
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

              <FormList name="menu">
                {(times, { add, remove }) => (
                  <>
                    <Pane className="border-bottom">
                      <Scrollbars autoHeight autoHeightMax={window.innerHeight - 355}>
                        {times.map(({ key, name }, index) => (
                          <Pane
                            key={key}
                            className={csx('position-relative', {
                              'border-bottom': index < times.length - 1
                            })}
                            style={{ padding: '20px 20px 0 20px' }}
                          >
                            <Heading type="form-block-title" style={{ marginBottom: 12 }}>Mốc thời gian {index + 1}</Heading>

                            {times.length > 1 && (
                              <DeleteOutlined
                                className="position-absolute"
                                style={{ top: 20, right: 20, zIndex: 2 }}
                                onClick={() => remove(name)}
                              />
                            )}

                            <Pane className="row border-bottom">
                              <Pane className="col-lg-6">
                                <FormItem
                                  label="Giờ bắt đầu"
                                  name={[name, "time_start"]}
                                  type={variables.TIME_PICKER}
                                />
                              </Pane>
                              <Pane className="col-lg-6">
                                <FormItem
                                  label="Giờ kết thúc"
                                  name={[name, "time_end"]}
                                  type={variables.TIME_PICKER}
                                />
                              </Pane>
                            </Pane>

                            <FormList name={[name, 'dishes']}>
                              {(dishes, { add: addDishes, remove: removeDishes }) => (
                                <>
                                  {dishes.map(({ key: dishesKey, name: dishesName }, index) => (
                                    <Pane className={csx('position-relative', 'row', 'pt20', 'border-bottom')} key={dishesKey}>
                                      {dishes.length > 1 && (
                                        <DeleteOutlined
                                          className="position-absolute"
                                          style={{ top: 20, right: 20, zIndex: 2 }}
                                          onClick={() => removeDishes(dishesName)}
                                        />
                                      )}

                                      <Pane className="col-lg-12">
                                        <FormItem
                                          label={`Tên món ${index + 1}`}
                                          name={[dishesName, "name"]}
                                          rules={[variables.RULES.EMPTY]}
                                          type={variables.INPUT}
                                        />
                                      </Pane>

                                      <Pane className="col-lg-12">
                                        <FormItemAntd label="Hình ảnh">
                                          <ImageUpload />
                                        </FormItemAntd>
                                      </Pane>
                                    </Pane>
                                  ))}

                                  <Pane className="mt20 mb20">
                                    <Button
                                      color="success"
                                      ghost
                                      icon="plus"
                                      onClick={addDishes}
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
                        onClick={add}
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
                  style={{ marginLeft: 'auto' }}
                  htmlType="submit"
                >
                  Tạo
                </Button>
              </Pane>
            </Pane>
          </Pane>
        </Pane>
      </Form>
    </Pane >
  )
})

export default Index
