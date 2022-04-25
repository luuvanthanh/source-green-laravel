import { memo, useRef, useEffect, useState } from 'react';
import { Collapse } from 'antd';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { head } from 'lodash';
import styles from '@/assets/styles/Common/common.scss';
import Pane from '@/components/CommonComponent/Pane';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import variablesModules from './variables';
import stylesModule from '../styles.module.scss';

const { Panel } = Collapse;
const Index = memo(() => {
    const dispatch = useDispatch();


    const [dataDetails, setDataDetails] = useState([]);

    const [{ menuLeftChildDevelop }, effects] = useSelector(({ loading: { effects }, menu, childDevelopReportAdd }) => [
        menu,
        effects,
        childDevelopReportAdd,
    ]);
    const mounted = useRef(false);

    const params = useParams();

    const loadings = effects['childDevelopReportAdd/GET_DETAILS'];


    useEffect(() => {
        mounted.current = true;
        return mounted.current;
    }, []);


    const s = (arr) => {
        const result = arr?.map(i => (
            {
                ...i,
                testSemesterDetailChildren: _(i?.testSemesterDetailChildren)
                    .groupBy('childEvaluateId')
                    .map((items) => ({ items })).value(),
            }
        ));
        return result;
    };

    const merge = (arr) => {
        const result = _(arr)
            .groupBy('categorySkillId')
            .map((items) => ({ ...items[0], testSemesterDetailChildren: s(items) })).value();
        return setDataDetails(result);
    };

    const flattenArr = (arr) => {
        let sum = [];
        _.forEachRight(arr, (value) => {
            sum = sum?.concat(value?.testSemesterDetail);
            sum = sum?.map(i => ({ ...value, ...i, types: value?.type }));
        });

        return merge(sum);
    };


    useEffect(() => {
        if (params.id) {
            dispatch({
                type: 'childDevelopReportAdd/GET_DETAILS',
                payload: { studentId: params?.id },
                callback: (res) => {
                    const a = head(res);
                    flattenArr(a?.testSemester);
                }
            });
        }
    }, [params.id]);

    return (
        <Pane className="card">
            <div className={styles['content-form']}>
                <Breadcrumbs last='Chi tiết' menu={menuLeftChildDevelop} />
                <Loading loading={loadings} >
                    <div className={stylesModule['wrapper-container']}>
                        {
                            dataDetails?.map((i, index) =>
                                <Collapse defaultActiveKey={[0]} ghost expandIconPosition='right' key={index}>
                                    <Panel header={i?.categorySkill?.name} key={index} className={stylesModule['wrapper-title']}>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col" style={{ width: 250 }}>Kì đánh giá</th>
                                                    <th scope="col" style={{ width: 250 }}>Tuổi bé (lúc đánh giá)</th>
                                                    <th scope="col" style={{ width: 250 }}>Cấp độ đạt được</th>
                                                    <th scope="col">Tiêu chí đạt được</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    i?.testSemesterDetailChildren?.map((k, b) =>
                                                    (
                                                        <tr key={b}>
                                                            {
                                                                k?.types === "TEST_INPUT" ?
                                                                    <th scope="row">Test đầu vào</th>
                                                                    :
                                                                    <th scope="row">{k?.assessmentPeriod?.nameAssessmentPeriod?.name} - ({k?.assessmentPeriod?.schoolYear?.yearFrom} - {k?.assessmentPeriod?.schoolYear?.yearTo})</th>
                                                            }
                                                            <td>{k?.timeAgeTestSemester}</td>
                                                            <td>{variablesModules?.AGE[k?.testSemesterDetailChildren[0]?.items?.[0]?.childEvaluate?.age]} </td>
                                                            <td>
                                                                <ul>
                                                                    {k?.testSemesterDetailChildren?.map((item, f) =>
                                                                    (
                                                                        <li key={f}>{item?.items?.[0]?.childEvaluateDetail?.nameCriteria}</li>
                                                                    )
                                                                    )}
                                                                </ul>

                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </Panel>
                                </Collapse>
                            )
                        }
                    </div>
                </Loading>
            </div>
        </Pane>
    );
});


export default Index;