import { memo, useRef } from 'react'
import { Form, Input, DatePicker } from 'antd'
import moment from 'moment'

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import Button from '@/components/CommonComponent/Button'
import Select from '@/components/CommonComponent/Select'
import ImageUpload from '@/components/CommonComponent/ImageUpload'

import { variables } from '@/utils/variables'

const { Item: FormItem } = Form

const genders = [
  { id: 0, name: 'Nam' },
  { id: 1, name: 'Nữ' },
]

const General = memo(() => {
  const formRef = useRef()

  return (
    <Form
      layout="vertical"
      ref={formRef}
      initialValues={{
        name: 'Trần Thu Hà',
        id: '01',
        admissionDate: moment(),
        birthday: moment('2018/08/12'),
        gender: 1
      }}
    >
      <Pane className="card">
        <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-title" style={{ marginBottom: 20 }}>Thông tin cơ bản</Heading>
          <Pane className="row">
            <Pane className="col">
              <FormItem name="avatar" label="Hình ảnh học sinh">
                <ImageUpload />
              </FormItem>
            </Pane>
          </Pane>

          <Pane className="row">
            <Pane className="col-lg-4">
              <FormItem name="name" label="Họ và tên">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="id" label="Mã học sinh">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="admissionDate" label="Ngày nhập học">
                <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
              </FormItem>
            </Pane>

            <Pane className="col-lg-4">
              <Pane className="row">
                <Pane className="col-lg-8">
                  <FormItem name="birthday" label="Ngày nhập học">
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} disabledDate={current => current > moment()} />
                  </FormItem>
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem label="Tuổi(tháng)">
                    32
                  </FormItem>
                </Pane>
              </Pane>
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="gender" label="Giới tính">
                  <Select
                    placeholder="Chọn"
                    dataSet={genders}
                  />
                </FormItem>
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="classId" label="Mã lớp">
                <Select
                  placeholder="Chọn"
                  dataSet={[]}
                />
              </FormItem>
            </Pane>

            <Pane className="col-lg-4">
              <FormItem name="premisesId" label="Mã cơ sở">
                <Select
                  placeholder="Chọn"
                  dataSet={[]}
                />
              </FormItem>
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="yearId" label="Mã năm">
                <Select
                  placeholder="Chọn"
                  dataSet={[]}
                />
              </FormItem>
            </Pane>
          </Pane>

          <Heading type="form-block-title" style={{ marginBottom: 12 }}>Địa chỉ</Heading>

          <Pane className="row">
            <Pane className="col-lg-4">
              <FormItem name="streetNumber" label="Số nhà">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="street" label="Tên đường">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="commune" label="Xã/Phường">
                  <Select
                    placeholder="Chọn"
                    dataSet={genders}
                  />
                </FormItem>
            </Pane>

            <Pane className="col-lg-4">
              <FormItem name="district" label="Quận/Huyện">
                <Select
                  placeholder="Chọn"
                  dataSet={[]}
                />
              </FormItem>
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="city" label="Thành phố">
                <Select
                  placeholder="Chọn"
                  dataSet={[]}
                />
              </FormItem>
            </Pane>
          </Pane>
        </Pane>

        <Pane style={{ padding: 20 }}>
          <Button color="success" style={{ marginLeft: 'auto' }}>
            Lưu
          </Button>
        </Pane>
      </Pane>
    </Form>
  )
})

export default General
