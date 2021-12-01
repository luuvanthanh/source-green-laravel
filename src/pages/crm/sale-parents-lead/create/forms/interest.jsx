import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { head, isEmpty, get } from 'lodash';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';

const marginProps = { style: { marginBottom: 12 } };

const mapStateToProps = ({ loading, crmSaleLeadAdd }) => ({
    loading,
    details: crmSaleLeadAdd.details,
    error: crmSaleLeadAdd.error,
    interest: crmSaleLeadAdd.interest,
});
const General = memo(
    ({ dispatch, loading: { effects }, match: { params }, details, error, interest }) => {
        const formRef = useRef();
        const mounted = useRef(false);

        useEffect(() => {
            dispatch({
                type: 'crmSaleLeadAdd/GET_DETAILS',
                payload: params,
            });
        }, [params.id]);


        const loadingSubmit =
            effects[`crmSaleLeadAdd/ADD_INTEREST`];
        const loading = effects[`crmSaleLeadAdd/GET_DETAILS`];
        useEffect(() => {
            dispatch({
                type: 'crmSaleLeadAdd/GET_PROGRAM_INTEREST',
                payload: {},
            });
        }, [params.id]);


        const onFinish = (values) => {
            dispatch({
                type: 'crmSaleLeadAdd/ADD_INTEREST',
                payload: {
                    customer_lead_id: params.id,
                    marketing_program: values.marketing_program_id.map((item) => ({ marketing_program_id: item })),
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

        useEffect(() => {
            if (params.id && details.marketingProgram) {
                formRef.current.setFieldsValue({
                    ...details,
                    ...head(details.positionLevel),
                    marketing_program_id: details.marketingProgram.map((i) => i.id),
                });
            }
        }, [details]);

        return (
            <Form layout="vertical" ref={formRef} onFinish={onFinish}>
                <Pane className="card">
                    <Loading loading={loading} isError={error.isError} params={{ error }}>
                        <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
                            <Heading type="form-title" style={{ marginBottom: 20 }}>
                                Chương trình phụ huynh quan tâm
                            </Heading>

                            <Pane {...marginProps}>
                                <Pane className="col-lg-12">
                                    <FormItem
                                        data={interest}
                                        options={['id', 'name']}
                                        name='marketing_program_id'
                                        defaultValue={[details.marketingProgram]}
                                        placeholder="Chọn"
                                        type={variables.SELECT_MUTILPLE}
                                    />
                                </Pane>
                            </Pane>
                        </Pane>

                        <Pane className="p20 d-flex flex-row-reverse ">
                            <Button color="success" size="large" htmlType="submit" loading={loadingSubmit}>
                                Lưu
                            </Button>
                        </Pane>
                    </Loading>
                </Pane>
            </Form>
        );
    },
);

General.propTypes = {
    dispatch: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any),
    details: PropTypes.objectOf(PropTypes.any),
    loading: PropTypes.objectOf(PropTypes.any),
    error: PropTypes.objectOf(PropTypes.any),
    branches: PropTypes.arrayOf(PropTypes.any),
    classes: PropTypes.arrayOf(PropTypes.any),
    city: PropTypes.arrayOf(PropTypes.any),
    district: PropTypes.arrayOf(PropTypes.any),
    search: PropTypes.arrayOf(PropTypes.any),
    interest: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
    match: {},
    details: {},
    dispatch: () => { },
    loading: {},
    error: {},
    branches: [],
    classes: [],
    city: [],
    district: [],
    search: [],
    interest: [],
};

export default withRouter(connect(mapStateToProps)(General));
