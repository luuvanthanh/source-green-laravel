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

const marginProps = {  style: { marginBottom: 12 }}

const General = memo(() => {
  const formRef = useRef()

  return (
    <Form
      layout="vertical"
      ref={formRef}
      initialValues={{
        name: 'Nguyễn Văn Phước',
        birthday: moment('1986/12/15'),
      }}
    >
      <Pane className="card">
        <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-title" style={{ marginBottom: 20 }}>Thông tin cơ bản</Heading>
          <Pane className="row">
            <Pane className="col">
              <FormItem name="avatar" label="Hình ảnh phụ huynh">
                <ImageUpload />
              </FormItem>
            </Pane>
          </Pane>

          <Pane className="row border-bottom" {...marginProps}>
            <Pane className="col-lg-4">
              <FormItem name="name" label="Tên khách hàng">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="birthday" label="Ngày sinh">
                <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} disabledDate={current => current > moment()} />
              </FormItem>
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
              <FormItem name="email" label="Email">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="phoneNumber" label="Số điện thoại">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="otherPhoneNumber" label="Số điện thoại khác">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
          </Pane>

          <Heading type="form-block-title" {...marginProps}>Địa chỉ</Heading>

          <Pane className="row border-bottom" {...marginProps}>
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
              <FormItem name="city" label="Thành phố">
                <Select
                  placeholder="Chọn"
                  dataSet={[]}
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
              <FormItem name="commune" label="Xã/Phường">
                <Select
                  placeholder="Chọn"
                  dataSet={genders}
                />
              </FormItem>
            </Pane>
          </Pane>

          <Pane className="row">
            <Pane className="col-lg-4">
              <FormItem name="job" label="Nghề nghiệp">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="facebook" label="Địa chỉ facebook">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="zalo" label="Địa chỉ zalo">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>

            <Pane className="col-lg-4">
              <FormItem name="instagram" label="Địa chỉ Instagram">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="involve" label="Khách hàng liên quan">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>

            <Pane className="col-lg-12">
              <FormItem name="note" label="Ghi chú">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>

            <Pane className="col-lg-12">
              <FormItem name="interesting" label="Quan tâm">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>

            <Pane className="col-lg-12">
              <FormItem name="favorites" label="Sở thích">
                <Input placeholder="Nhập" />
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
