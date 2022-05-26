import {Button, Card, Form, Input} from "antd";
import React, {useEffect, useState} from "react";
import axios from "axios";
import cogoToast from "cogo-toast";

export default function MetaOptionsCard(){
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false);
    const [metaOptions, setMetaOptions] = useState(null);

    useEffect(() => {
        load();
    },[]);

    const load = async () => {
        setLoading(true);
        await axios.get(`/meta-options/get`).then(resp => {
            setMetaOptions(resp.data.result)
            form.setFieldsValue(resp.data.result);
        }).finally(() => setLoading(false))
    }

    const save = async (values) => {
        if(metaOptions && metaOptions.id){
            values.id = metaOptions.id;
        }
        setLoading(true);
        await axios.post(`/meta-options/save`,values).then(resp => {
            load();
            cogoToast.success('Meta Options Changed')
        }).finally(() => setLoading(false))
    }
    return (
        <Card title="Meta Descriptions">
            <Form
                form={form}
                name="basic"
                initialValues={{
                    mainMetaDescription: metaOptions ? metaOptions.mainMetaDescription : '',
                    aboutMetaDescription: metaOptions ? metaOptions.aboutMetaDescription : '',
                    worksMetaDescription: metaOptions ? metaOptions.worksMetaDescription : ''
                }}
                onFinish={save}
                onFinishFailed={() => {}}
                autoComplete="off"
            >
                <Form.Item
                    label="Main Meta Description"
                    labelCol={{span: 24}}
                    name="mainMetaDescription"
                    rules={[{ required: true, message: 'Please input title!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="About Meta Description"
                    labelCol={{span: 24}}
                    name="aboutMetaDescription"
                    rules={[{ required: true, message: 'Please input title!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Works Meta Description"
                    labelCol={{span: 24}}
                    name="worksMetaDescription"
                    rules={[{ required: true, message: 'Please input title!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <div>
                        <Button loading={loading} type="primary" htmlType="submit">
                            Save
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Card>
    )
}