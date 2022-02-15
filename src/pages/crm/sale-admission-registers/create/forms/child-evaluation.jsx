import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { useParams } from 'umi';
import { Helper, variables } from '@/utils';
import { useSelector, useDispatch } from 'dva';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import stylesModule from '../../styles.module.scss';


const General = memo(() => {
    const [
        details,
        childEvaluation
    ] = useSelector(({ crmSaleAdmissionAdd }) => [
        crmSaleAdmissionAdd.details,
        crmSaleAdmissionAdd.childEvaluation
    ]);
    const formRef = useRef();
    const params = useParams();
    const dispatch = useDispatch();
    const [check, setCheck] = useState(false);

    useEffect(() => {
        if (params.id) {
            dispatch({
                type: 'crmSaleAdmissionAdd/GET_DETAILS',
                payload: params,
            });
        }
    }, [params.id]);

    useEffect(() => {
        if (details?.childEvaluateInfo?.length > 0) {
            setCheck(true);
            dispatch({
                type: 'crmSaleAdmissionAdd/GET_CHILD_EVALUATION',
                payload: details?.childEvaluateInfo,
            });
        }
    }, [details?.childEvaluateInfo]);


    return (
        <>
            {
                check ?
                    <>
                        < Pane className={stylesModule['wrapper-child']} >
                            <Form layout="vertical" ref={formRef}>
                                <Pane className="card">
                                    <Pane className="pb-0 border-bottom">
                                        <Pane className={stylesModule['child-title']}>
                                            <h3 className={stylesModule.name}>Thông tin đánh giá trẻ</h3>
                                            <div className={stylesModule.date}>Thời gian đánh giá: <h3 className={stylesModule.time}>{Helper.getDate(childEvaluation?.created_at, variables.DATE_FORMAT.DATE_TIME)} </h3></div>
                                        </Pane>
                                        <Heading type="form-block-title" style={{ paddingTop: 15, paddingLeft: 20 }}>
                                            Mô tả chung
                                        </Heading>
                                        {
                                            childEvaluation?.childDescription?.map((item, index) =>
                                                <Pane className={stylesModule['child-content']} key={index}>
                                                    <h3 className={stylesModule.title}>{item.question}</h3>
                                                    <h3 className={stylesModule.description}>{item.answer}</h3>
                                                </Pane>
                                            )

                                        }
                                        <Heading type="form-block-title" style={{ paddingTop: 15, paddingLeft: 20, borderTop: "1px solid #EAEAEA" }}>
                                            Vấn đề khó khăn
                                        </Heading>
                                        {
                                            childEvaluation?.childIssue?.map((item, index) =>

                                                <Pane className={stylesModule['child-main']} key={index}>
                                                    <h3 className={stylesModule.title}>{item?.question}</h3>
                                                </Pane>
                                            )
                                        }
                                        <Heading type="form-block-title" style={{ paddingTop: 15, paddingLeft: 20 }}>
                                            Thông tin khác
                                        </Heading>
                                        <Pane className={stylesModule['child-content']}>
                                            <h3 className={stylesModule.title}>Những vấn đề khác</h3>
                                            <h3 className={stylesModule.description}>{childEvaluation?.other_issue}</h3>
                                        </Pane>
                                        <Pane className={stylesModule['child-content']}>
                                            <h3 className={stylesModule.title}>Những kỳ vọng của cha mẹ khi cho bé theo học tại Clover ở như bậc mầm non</h3>
                                            <h3 className={stylesModule.description}>{childEvaluation?.parent_hope}</h3>
                                        </Pane>
                                    </Pane>
                                    <Pane className="d-flex justify-content-end p20 ">
                                        <Button color="primary" icon="export" className="ml-2">
                                            Xuất file đánh giá
                                        </Button>
                                    </Pane>

                                </Pane>
                            </Form>
                        </Pane >
                    </> :
                    < Pane className={stylesModule['wrapper-child']} >
                        <Pane className="card">
                            <Pane className={stylesModule['child-title']}>
                                <h3 className={stylesModule.name}>Thông tin đánh giá trẻ</h3>
                            </Pane>
                            <p className={stylesModule['child-not-tilte']}>Phụ huynh chưa đánh giá trẻ</p>
                        </Pane>
                    </Pane>
            }
        </>
    );
},
);

export default General;