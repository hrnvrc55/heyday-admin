import React, {useEffect, useState} from "react";
import LayoutComp from "../components/Layout";
import { Collapse, Form, Button, Input, Upload, Tooltip, DatePicker } from 'antd';
import {PlusCircleOutlined, DeleteOutlined} from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';
import TextEditor from "../components/TextEditor";
import axios from 'axios';
import moment from 'moment';
const { Panel } = Collapse;

export default function AboutPage(){
    const [awards, setAwards] = useState([]);
    const [general, setGeneral] = useState(null);
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        load();
        loadAwards()
    },[])

    async function load(){
        setLoading(true);
        await Promise.all([
            axios.get('/about/general'),
            axios.get('/about/owner')
        ]).then(resp => {
            setGeneral(resp[0].data.result);
            setOwner(resp[1].data.result);
        }).finally(() => {
            setLoading(false);
        })
    }

     function loadAwards(){
         axios.get('/about/awards').then(resp => {
            setAwards(resp.data.result);
        })
    }

    function addNewAwards(){
        setAwards([...awards,{id: null, date: '', description: ''}]);
    }

    function deleteAward(index){
        let tmpAwards = awards;
        tmpAwards.splice(index, 1);
        setAwards([...tmpAwards]);
    }
    function callback(key) {
        console.log(key);
    }

    async function onGeneralFinish(values){
        if(general) values.id = general.id;
        setLoading(true);
        await axios.post('/about/general/save',values).then(resp => {
            setLoading(false);
            reloadPage()
        }).finally(() => setLoading(false));
    }

    function onGeneralFinishFailed(){

    }

    async function onOwnerFinish(values){
        setLoading(true);
        if(owner) values.id =  owner.id;
        await axios.post('/about/owner/save',values).then(resp => {
            reloadPage()
        }).finally(() => setLoading(false));
    }

    function reloadPage(){
        window.location.reload();
    }

    function onOwnerFinishFinishFailed(){

    }




    return (
        <LayoutComp>
            <h2>About</h2>
            <Collapse onChange={callback}>
                <Panel header="General" key="1">
                    {!loading && (
                        <Form
                            name="basic"
                            onFinish={onGeneralFinish}
                            onFinishFailed={onGeneralFinishFailed}
                            autoComplete="off"
                            initialValues={{
                                title: general?.title || '',
                                description: general?.description || '',
                                descriptionTr: general?.descriptionTr || '',
                                companyName: general?.companyName || '',
                                address: general?.address || '',
                                locationLink: general?.locationLink || '',
                                contactEmail: general?.contactEmail || '',
                                workTogetherEmail: general?.workTogetherEmail || '',
                                phoneNumber: general?.phoneNumber || '',
                                faxNumber: general?.faxNumber ||'',
                                established: general?.established || '',
                                principal: general?.principal || ''
                            }}
                        >
                            <Form.Item
                                label="Title"
                                labelCol={{span: 24}}
                                name="title"
                                rules={[{ required: true, message: 'Please input title!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Description"
                                labelCol={{span: 24}}
                                rules={[{ required: true, message: 'Please input description!' }]}
                            >
                                <TextEditor />
                            </Form.Item>
                            <Form.Item
                                name="descriptionTr"
                                label="Description(Turkish)"
                                labelCol={{span: 24}}
                                rules={[{ required: true, message: 'Please input tr description!' }]}
                            >
                                <TextEditor />
                            </Form.Item>
                            <Form.Item
                                label="Company Name"
                                labelCol={{span: 24}}
                                name="companyName"
                                rules={[{ required: true, message: 'Please input company name!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Address"
                                labelCol={{span: 24}}
                                name="address"
                                rules={[{ required: true, message: 'Please input company address!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Location Link"
                                labelCol={{span: 24}}
                                name="locationLink"
                                rules={[{ required: true, message: 'Please input company location link!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Contact Email"
                                labelCol={{span: 24}}
                                name="contactEmail"
                                rules={[{ required: true, message: 'Please input company Contact Email!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Work Together Email"
                                labelCol={{span: 24}}
                                name="workTogetherEmail"
                                rules={[{ required: true, message: 'Please input company work contact email!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Tel"
                                labelCol={{span: 24}}
                                name="phoneNumber"
                                rules={[{ required: true, message: 'Please input company tel number!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Fax"
                                labelCol={{span: 24}}
                                name="faxNumber"
                                rules={[{ required: true, message: 'Please input company fax number!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Established"
                                labelCol={{span: 24}}
                                name="established"
                                rules={[{ required: true, message: 'Please input established!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Principal"
                                labelCol={{span: 24}}
                                name="principal"
                                rules={[{ required: true, message: 'Please input principal!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item>
                                <div className="d-flex justify-content-end">
                                    <Button loading={loading} type="primary" htmlType="submit">
                                        Save
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    )}

                </Panel>
                <Panel header="Owner" key="2">
                    {!loading && (
                        <Form
                            name="basic"
                            initialValues={{
                                name: owner?.name || '',
                                descriptionTr: owner?.descriptionTr || '',
                                description: owner?.description || '',
                                image: ' '
                            }}
                            onFinish={onOwnerFinish}
                            onFinishFailed={onOwnerFinishFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Image"
                                labelCol={{span: 24}}
                                name="image"
                                style={{display: 'none'}}
                                // rules={[{ required: true, message: 'Please upload owner image!' }]}
                            >
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                >
                                    <div>
                                        Upload
                                    </div>
                                </Upload>
                            </Form.Item>

                            <Form.Item
                                label="Name"
                                labelCol={{span: 24}}
                                name="name"
                                rules={[{ required: true, message: 'Please input title!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Description"
                                labelCol={{span: 24}}
                                rules={[{ required: true, message: 'Please input description!' }]}
                            >
                                <TextEditor />
                            </Form.Item>
                            <Form.Item
                                name="descriptionTr"
                                label="Description(Turkish)"
                                labelCol={{span: 24}}
                                rules={[{ required: true, message: 'Please input tr description!' }]}
                            >
                                <TextEditor />
                            </Form.Item>
                            <Form.Item>
                                <div className="d-flex justify-content-end">
                                    <Button loading={loading} type="primary" htmlType="submit">
                                        Save
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    )}

                </Panel>
                <Panel header="Awards" key="3">
                    <div className="d-flex justify-content-end mb-2">
                        <Tooltip placement="top" title="Add New Award">
                        <Button onClick={() => addNewAwards()} icon={<PlusCircleOutlined/>}/>
                        </Tooltip>
                    </div>
                    <div className="mb-2">
                        {awards.length > 0 && (
                            <>
                                {awards.map((item, idx) => (
                                    <AwardsComp key={"award-list-" + idx} idx={idx} item={item} reload={() =>loadAwards()} deleteAward={deleteAward} />
                                ))}
                            </>
                        )}
                    </div>
                </Panel>

            </Collapse>,
        </LayoutComp>
    )
}

function AwardsComp({idx, item, deleteAward, reload}){
    const [dateText, setDateText] = useState('');
    const [description, setDescription] = useState('');
    const [dateError, setDateError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [compItem, setCompItem] = useState(null);

    useEffect(() => {
        setDescription(item.description);
        setDateText(item.dateText);
        setCompItem(item);
        console.log('renderrr');
    },[item])
    const onChangeDate = (date,dateString) => {
        if(dateString) setDateError(false);
        setDateText(dateString);
    }

    const onChangeInput = (e) => {
        if(e.target.value) setDescriptionError(false);
        setDescription(e.target.value);
    }

    const save = async() => {
        if(!dateText){
            setDateError(true);
            return;
        }

        if(!description){
            setDescriptionError(true);
            return;
        }

        let bodyData = {
            dateText,
            description
        }

        if(item.id){
            bodyData.id = item.id
        }

        setLoading(true);
        await axios.post('/about/award/save',bodyData).then(resp => {
            setCompItem(null);
            setTimeout(() => {
                reload();
            },100)
        }).finally(() => setLoading(false))
    }

    const deleteRow = async () => {
        if(item.id){
            setLoading(true);
            await axios.delete(`/about/award/delete/${item.id}`).then(resp => {
                setTimeout(() => {
                    reload();
                },100)
            }).finally(() => {
                setLoading(false);
            })
        }else{
            deleteAward(idx)
        }
    }

    return (
        <div className="d-flex mb-2">
            {compItem && (
                <>
                    <DatePicker defaultValue={compItem?.dateText ? moment(item.dateText) : ''} status={dateError ? "error" : ""} onChange={onChangeDate} />
                    <Input defaultValue={compItem?.description} placeholder="Description" status={descriptionError ? "error" : ""} onChange={onChangeInput}/>
                    <Button loading={loading} type={compItem?.id ? "ghost" : "primary"} onClick={save}>{compItem?.id ? 'Update' : 'Save'}</Button>
                    <Tooltip placement="right" title="Remove">
                        <Button type="danger" onClick={() => deleteRow()} icon={<DeleteOutlined />}/>
                    </Tooltip>
                </>
            )}

        </div>
    )
}