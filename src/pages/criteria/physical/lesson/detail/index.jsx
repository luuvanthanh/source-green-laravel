import FormItem from '@/components/CommonComponent/FormItem';
import Heading from '@/components/CommonComponent/Heading';
import Pane from '@/components/CommonComponent/Pane';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { variables } from '@/utils';
import { Form } from 'antd';
import { memo } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useHistory } from 'umi';
import Button from '@/components/CommonComponent/Button';
import classnames from 'classnames';
import FormDetail from '@/components/CommonComponent/FormDetail';
import stylesModule from '../styles.module.scss';

const Index = memo(() => {
  const [form] = Form.useForm();
  const params = useParams();
  const history = useHistory();
  return (
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last={params.id ? 'Edit' : 'Create new'} />
      <Helmet title="Subject" />
      <Pane className="pl20 pr20 pb20">
        <Pane>
          <Form
            layout="vertical"
            form={form}
            initialValues={{
              data: [{}],
            }}
          >
            <Pane className="card p20">
              <Heading type="form-title" className="mb15">
                Thông tin chung
              </Heading>
              <Pane className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="id"
                    type={variables.INPUT}
                    label="Mã ID"
                    allowClear={false}
                    disabled
                  />
                </div>
                <Pane className="col-lg-3">
                  <FormItem
                    name="year"
                    placeholder="Chọn năm học"
                    data={[]}
                    type={variables.SELECT}
                    label="Năm học"
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="studyProgram"
                    placeholder="Chương trình học"
                    type={variables.INPUT}
                    label="Chương trình học"
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="percent"
                    placeholder="Tỉ lệ áp dụng"
                    type={variables.INPUT_COUNT}
                    label="Tỉ lệ áp dụng (%)"
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-12">
                  <FormItem
                    name="branchId"
                    data={[]}
                    placeholder="Chọn cơ sở"
                    type={variables.SELECT_MUTILPLE}
                    rules={[variables.RULES.EMPTY]}
                    label="Cở sở áp dụng"
                  />
                </Pane>
                <Pane className="col-lg-12">
                  <FormItem
                    name="classId"
                    data={[]}
                    placeholder="Chọn lớp có trong cơ sở"
                    type={variables.SELECT_MUTILPLE}
                    rules={[variables.RULES.EMPTY]}
                    label="Lớp áp dụng"
                  />
                </Pane>
              </Pane>
            </Pane>
          </Form>
        </Pane>
        <Pane className="card p20">
          <Heading type="form-title" className="mb20">
            Chi tiết
          </Heading>
          <Pane className="col-lg-12 p-0">
            <Form
              layout="vertical"
              form={form}
              initialValues={{
                data: [{}],
              }}
            >
              <div className={stylesModule['wrapper-table']}>
                <div className={stylesModule['card-heading']}>
                  <div className={stylesModule.cols}>
                    <p className={stylesModule.norm}>Tuần</p>
                  </div>
                  <div className={stylesModule.col}>
                    <p className={stylesModule.norm}>Tên bài học</p>
                  </div>
                  <div className={stylesModule.col}>
                    <p className={stylesModule.norm}>Nội dung</p>
                  </div>
                  <div className={stylesModule.col}>
                    <p className={stylesModule.norm}>Mục tiêu</p>
                  </div>
                </div>
                <Form.List label="Hình thức tiếp cận" name={['lessions']} fieldKey={['lessions']}>
                  {(fieldsDetail) => (
                    <>
                      {fieldsDetail.map((fieldItem, indexItem) => (
                          <>
                            <Pane key={indexItem} className="d-flex">
                              <div className={stylesModule['card-item']}>
                                <div className={classnames(stylesModule.cols)}>
                                  <FormDetail name="test" type="table" />
                                </div>
                                <div className={classnames(stylesModule.col)}>
                                <FormDetail name="test" type="table" />
                                </div>
                                <div className={classnames(stylesModule.col)}>
                                <FormDetail name="test" type="table" />
                                </div>
                                <div className={classnames(stylesModule.col)}>
                                <FormDetail name="test" type="table" />
                                </div>
                              </div>
                            </Pane>
                          </>
                        ))}
                    </>
                  )}
                </Form.List>
              </div>
            </Form>
          </Pane>
        </Pane>
        <Pane className="d-flex justify-content-between align-items-center mb20 mt20">
          <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
            Hủy
          </p>
          <Button className="ml-auto px25" color="success" htmlType="submit" size="large">
            Lưu
          </Button>
        </Pane>
      </Pane>
    </div>
  );
});

export default Index;
