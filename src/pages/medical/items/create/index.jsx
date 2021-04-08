import { memo, useRef, useState } from 'react'
import { Form, List, Radio, Avatar } from 'antd'
import { UserOutlined, DeleteOutlined } from '@ant-design/icons'
import { Helmet } from 'react-helmet'
import { Scrollbars } from 'react-custom-scrollbars';
import csx from 'classnames';
import { find } from 'lodash';

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import Button from '@/components/CommonComponent/Button'
import FormItem from '@/components/CommonComponent/FormItem'
import MultipleImageUpload from '@/components/CommonComponent/MultipleImageUpload'

import variables from '@/utils/variables'
import styles from '@/assets/styles/Common/information.module.scss'

const mockStudents = [
  { id: 1, name: 'An Ngọc', monthAge: 31 },
  { id: 2, name: 'Vân Khánh', monthAge: 32 },
  { id: 3, name: 'Su Beo', monthAge: 32 },
  { id: 4, name: 'Tuyết Nhung', monthAge: 30 },
  { id: 5, name: 'Ngọc Bảo', monthAge: 30 },
]

const takePillTimes = [
  { value: 1, label: 'Trước ăn sáng' },
  { value: 2, label: 'Sau ăn sáng' },
  { value: 3, label: 'Trước ăn trưa' },
  { value: 4, label: 'Sau ăn trưa' },
]

const { Item: ListItem } = List
const { List: FormList, Item: FormItemAntd } = Form

const Index = memo(() => {
  const [pillTimes, setPillTimes] = useState({})

  const filterRef = useRef()
  const formRef = useRef()

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title="Tạo y tế" />
      <Pane className="row" style={{ marginBottom: 20 }}>
        <Pane className="col">
          <Heading type="page-title">Tạo y tế</Heading>
        </Pane>
      </Pane>
      <Pane className="row">
        <Pane className="col-lg-6">
          <Pane className="card" style={{ padding: 20 }}>
            <Heading type="form-title" style={{ marginBottom: 20 }}>Danh sách học sinh</Heading>

            <Form
              layout="vertical"
              ref={filterRef}
            >
              <Pane className={csx('row', 'border-bottom')}>
                <Pane className="col-lg-6">
                  <FormItem
                    label="Cơ sở"
                    name="position"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.SELECT}
                  />
                </Pane>
                <Pane className="col-lg-6">
                  <FormItem
                    label="Lớp"
                    name="class"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.SELECT}
                  />
                </Pane>
              </Pane>

              <Scrollbars autoHeight autoHeightMax={window.innerHeight - 333}>
                <List
                  dataSource={mockStudents}
                  renderItem={({ id, name, monthAge }) => (
                    <ListItem key={id} className={styles.listItem}>
                      <Radio />
                      <Pane className={styles.userInformation}>
                        <Avatar shape="square" size={40} icon={<UserOutlined />} />
                        <Pane>
                          <h3>{name}</h3>
                          <p>{monthAge} tháng tuổi</p>
                        </Pane>
                      </Pane>
                    </ListItem>
                  )}
                />
              </Scrollbars>
            </Form>
          </Pane>
        </Pane>

        <Pane className="col-lg-6">
          <Pane className="card">
            <Form
              layout="vertical"
              ref={formRef}
              initialValues={{
                medicines: [{}]
              }}
            >
              <Pane style={{ padding: 20, paddingBottom: 0 }}>
                <Heading type="form-title" style={{ marginBottom: 20 }}>Thông tin y tế</Heading>

                <Pane className={csx('row', 'border-bottom')}>
                  <Pane className="col-lg-12">
                    <FormItem
                      label="Tên bệnh"
                      name="illnesses"
                      type={variables.INPUT}
                    />
                  </Pane>

                  <Pane className="col-lg-6">
                    <FormItem
                      label="Thời gian dặn thuốc"
                      name="time"
                      type={variables.RANGE_PICKER}
                    />
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Vị trí đặt thuốc"
                      name="location"
                      type={variables.INPUT}
                    />
                  </Pane>
                </Pane>
              </Pane>

              {/* <Pane style={{ padding: 20 }}> */}
              <FormList name="medicines">
                {(fields, { add, remove }) => (
                  <>
                    <Scrollbars autoHeight autoHeightMax={window.innerHeight - 545}>
                      {fields.map(({ key, name }, index) => (
                        <Pane
                          key={key}
                          className={csx('position-relative"', 'pb-0', {
                            'border-bottom': index < fields.length - 1
                          })}
                          style={{ padding: 20 }}
                        >
                          <Heading type="form-block-title" style={{ marginBottom: 12 }}>Thuốc {index + 1}</Heading>

                          {fields.length > 1 && (
                            <DeleteOutlined
                              className="position-absolute"
                              style={{ top: 20, right: 20 }}
                              onClick={() => remove(name)}
                            />
                          )}

                          <Pane className="row">
                            <Pane className="col-lg-6">
                              <FormItem
                                label="Tên thuốc"
                                name={[name, "medicine"]}
                                type={variables.INPUT}
                              />
                            </Pane>
                            <Pane className="col-lg-6">
                              <FormItem
                                label="Đơn vị"
                                name={[name, "unit"]}
                                type={variables.INPUT}
                              />
                            </Pane>

                            <Pane className="col-lg-12">
                              <FormItem
                                label="Thời gian uống"
                                name={[name, "pillTimes"]}
                                type={variables.CHECKBOX}
                                data={takePillTimes}
                                onChange={(values) => setPillTimes(prev => ({ ...prev, [name]: values.sort() }))}
                              />
                            </Pane>

                            {(pillTimes[name] || []).map((value) => (
                              <Pane className="col-lg-6" key={value}>
                                <FormItem
                                  label={find(takePillTimes, { value }).label}
                                  name={[name, "pillTimeNote", value]}
                                  type={variables.INPUT}
                                />
                              </Pane>
                            ))}

                            <Pane className="col-lg-12">
                              <FormItem
                                label="Ghi chú"
                                name={[name, "note"]}
                                type={variables.INPUT}
                              />
                            </Pane>

                            <Pane className="col-lg-12">
                              <FormItemAntd
                                label="Đính kèm hình ảnh"
                                name={[name, "images"]}
                              >
                                <MultipleImageUpload />
                              </FormItemAntd>
                            </Pane>
                          </Pane>
                        </Pane>
                      ))}
                    </Scrollbars>
                    <Pane style={{ padding: 20 }} className="border-bottom border-top">
                      <Button
                        color="success"
                        ghost
                        icon="plus"
                        onClick={add}
                      >
                        Thêm thuốc
                    </Button>
                    </Pane>
                  </>
                )}
              </FormList>
              {/* </Pane> */}

              <Pane style={{ padding: 20 }}>
                <Button
                  color="success"
                  style={{ marginLeft: 'auto' }}
                  htmlType="submit"
                >
                  Lưu
                </Button>
              </Pane>
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </Pane >
  )
})

export default Index
