import React, {useEffect, useState} from "react";
import LayoutComp from "../components/Layout";
import {
    Table,
    Tag,
    Space,
    Spin,
    Button,
    Modal,
    Form,
    Input,
    Drawer,
    Upload,
    DatePicker,
    Popconfirm,
    Badge,
    Alert
} from 'antd';
import {PlusCircleOutlined, InboxOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import axios from "axios";
import ImgCrop from 'antd-img-crop';

import { v4 as uuidv4 } from 'uuid';
import TextEditor from "../components/TextEditor";

const { Dragger } = Upload;



export default function WorksPage(){
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'SubTitle',
            dataIndex: 'subTitle',
            key: 'subTitle',
        },
        {
            title: 'Meta Description',
            dataIndex: 'metaDescription',
            key: 'metaDescription',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button onClick={() => {
                        setIsDrawerVisible(true)
                        setSelectedWorkForDrawer(record);
                    }}>Images</Button>
                    <Button className="m-lg-2 btn-success" type="default" onClick={() => {
                        setIsModalVisible(true);
                        setSelectedWork(record);
                        form.setFieldsValue({
                            title: record.title,
                            subTitle: record.subTitle,
                            titleTr: record.titleTr,
                            subTitleTr: record.subTitleTr,
                            description: record.description,
                            descriptionTr: record.descriptionTr,
                            metaDescription: record.metaDescription
                        })
                    }}  icon={<EditOutlined />} />

                    <Popconfirm
                        title="Are you sure to delete this row?"
                        onConfirm={() => deleteRow(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                    <Button  type="danger" icon={<DeleteOutlined />} />
                    </Popconfirm>

                </>
            ),
        },
    ];

    const [works, setWorks] = useState([]);
    const [loading,setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [selectedWorkForDrawer, setSelectedWorkForDrawer] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [selectedImage, setSelectedImage] = useState({id: null, src: ""});
    const [selectedWork, setSelectedWork] = useState({});

    useEffect(() => {
        load()
    },[]);

    useEffect(() => {
        if(selectedWorkForDrawer){
            getWorkImages(selectedWorkForDrawer.id)
            setSelectedImage("")
        }
    },[selectedWorkForDrawer])

    async function getWorkImages(id){
        setLoading(true);
        await axios.get(`/work/get-images/${id}`).then(resp => {
            if(resp.data.result.length > 0){
                const newFileList = resp.data.result.map(item => {
                    return {
                        uid: uuidv4(),
                        id: item.id,
                        name: item.id,
                        status: 'done',
                        url: item.imageLink,
                        isCover: item.isCover
                    }
                })
                setFileList(newFileList);
            }else{
                setFileList([])
            }
        }).finally(() => setLoading(false));
    }

    async function load(){
        setLoading(true);
        await axios.get('/work/all').then(resp => {
            setWorks(resp.data.result);
        }).finally(() => {
            setLoading(false);
        })
    }

    const deleteRow = async (id) => {
        setLoading(true);
        await axios.delete(`/work/delete/${id}`).then(resp => {
            load()
        }).finally(() => {
            setLoading(false);
        })
    }



    const onPreview = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        // const imgWindow = window.open(src);
        // imgWindow.document.write(image.outerHTML);
        setSelectedImage({id: file.id, src: src, isCover: file.isCover});
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    }

    const onFinish = async (values) => {
        if(selectedWork && selectedWork.id){
            setLoading(true);
            values.id = selectedWork.id
            await axios.put('/work/update',values).then(resp => {
                load()
                setIsModalVisible(false);
            }).finally(() => {
                setLoading(false);
            })
        }else{
            setLoading(true);
            await axios.post('/work/save',values).then(resp => {
                load()
                setIsModalVisible(false);
            }).finally(() => {
                setLoading(false);
            })
        }

    }
    const onFinishFailed = () => {

    }

    const uploadFiles = async (uploadInfo) => {
        const formData = new FormData()
        formData.append('image', uploadInfo.file)
        setLoading(true);
        await axios.post(`/work/upload-image?workId=${selectedWorkForDrawer.id}`,formData).then(resp => {
           getWorkImages(selectedWorkForDrawer.id);
        }).finally(() => setLoading(false))
    }

    const onRemove = async (file) => {
        const {confirm} = Modal
        return new Promise((resolve, reject) => {
            confirm({
                title: 'Are you sure you want to Delete ?',
                onOk: () => {
                    resolve(true)
                    setLoading(true);
                    axios.delete(`/work/delete-image/${file.id}`).then(resp => {
                        getWorkImages(selectedWorkForDrawer.id);
                    }).finally(() => setLoading(false))
                },
                onCancel: () =>{
                    reject(false)
                }
            })
        })


    }

    const onSelectCoverImage = async (id, workId) => {
        setLoading(true);
        await axios.post(`/work/select-cover-image`,{id: id, workId: workId}).then(resp => {
            getWorkImages(selectedWorkForDrawer.id);
            let newSelectedImage = selectedImage;
            newSelectedImage.isCover = true;
            setSelectedImage(newSelectedImage)
        }).finally(() => setLoading(false))
    }

    return (
        <LayoutComp>
            <div className="d-flex justify-content-between">
                <h2>Works</h2>
                <Button onClick={() => {
                    setIsModalVisible(true)
                    form.setFieldsValue({
                        title: '',
                        subTitle: '',
                        titleTr: '',
                        subTitleTr: '',
                        description: '',
                        descriptionTr: ''
                    })
                }} icon={<PlusCircleOutlined />}>Add Work</Button>
            </div>
            <Table rowKey="id" loading={loading} columns={columns} dataSource={works} />
            <Modal title="New Work" width={700} visible={isModalVisible} footer={false} onCancel={() => {
                handleCancel();
                setSelectedWork({});
            }}>
                {isModalVisible && (
                    <Form
                        name="basic"
                        form={form}
                        initialValues={{
                            title: selectedWork ? selectedWork.title : '',
                            subTitle: selectedWork ? selectedWork.subTitle: ''
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
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
                            label="Title(German)"
                            labelCol={{span: 24}}
                            name="titleTr"
                            rules={[{ required: true, message: 'Please input title!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Sub Title"
                            labelCol={{span: 24}}
                            name="subTitle"
                            rules={[{ required: true, message: 'Please input subTitle!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Sub Title(German)"
                            labelCol={{span: 24}}
                            name="subTitleTr"
                            rules={[{ required: true, message: 'Please input subTitle!' }]}
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
                            label="Description(German)"
                            labelCol={{span: 24}}
                            rules={[{ required: true, message: 'Please input tr description!' }]}
                        >
                            <TextEditor />
                        </Form.Item>
                        <Form.Item
                            label="Meta Description"
                            labelCol={{span: 24}}
                            name="metaDescription"
                            rules={[{ required: true, message: 'Please input subTitle!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <div className="d-flex justify-content-end">
                            <Button type="ghost" role="button" onClick={() => handleCancel()}>
                                Cancel
                            </Button>
                            <Button loading={loading} type="ghost" style={{marginLeft: '10px'}} htmlType="submit">
                                Save
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal>
            <Drawer title="Images" size="large" placement="right" onClose={() => setIsDrawerVisible(false)} visible={isDrawerVisible}>
                <div>
                    {selectedWorkForDrawer && (
                        <>
                            <div className="mb-2">
                                <Alert showIcon type="info" message="Please select main image after uploaded work images." />
                            </div>
                            <div>
                                <h3>{selectedWorkForDrawer.title} Images</h3>
                            </div>
                            <Spin spinning={loading}>
                                <ImgCrop
                                    rotate
                                    modalWidth={960}
                                    aspect={1600/1130}
                                >
                                    <Upload
                                        customRequest={uploadFiles}
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={onPreview}
                                        onRemove={onRemove}
                                    >
                                        Upload
                                    </Upload>
                                </ImgCrop>
                            </Spin>
                        </>
                    )}

                </div>
                {selectedImage.src && (
                    <div>
                        <div>
                            <img src={selectedImage.src} width="100%" />
                            {selectedImage.isCover && (
                                <Badge.Ribbon text="Main Image" color="green" />
                            )}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <Button loading={loading} onClick={() => {onSelectCoverImage(selectedImage.id,selectedWorkForDrawer.id)}} type="primary">Select For Main Image</Button>

                        </div>
                    </div>
                )}

            </Drawer>
        </LayoutComp>
    )
}