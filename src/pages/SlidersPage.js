import React, {useEffect, useState} from "react";
import LayoutComp from "../components/Layout";
import {Badge, Button, Drawer, Input, message, Popconfirm, Spin, Table, Upload} from "antd";
import {DeleteOutlined, EditOutlined, PlusCircleOutlined} from "@ant-design/icons";
import axios from "axios";
import ImgCrop from "antd-img-crop";
import cogoToast from 'cogo-toast';
import { Select } from 'antd';

const { Option } = Select;
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}
export default function SlidersPage(){
    const columns = [
        {
            title: 'Image',
            render: (record) => (<img key={record.id} src={record.image} width={150} />)
        },
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
            title: 'Redirect Work Page',
            render: (record) => (<span key={record.id}>{record.Work?.title}</span>)

        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>

                    {/*<Button className="m-lg-2 btn-success" type="default"  icon={<EditOutlined />} />*/}

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

    const [loading, setLoading] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState({id: null, show: false});
    const [imageUrl, setImageUrl] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [form, setForm] = useState({});
    const [workList, setWorkList] = useState([]);
    const [sliders, setSliders] = useState([]);

    useEffect(() => {
        getWorkList()
        getSliders();
    },[])

    useEffect(() => {
        setForm({});
    },[isDrawerVisible])

    const getSliders = async () => {
        setLoading(true);
        await axios.get('/slider/all').then(resp => {
            setSliders(resp.data.result);
        }).finally(() => setLoading(false))
    }

    const getWorkList = async() => {
        setLoading(true);
        await axios.get('/work/all').then(resp => {
            setWorkList(resp.data.result);
        }).finally(() => setLoading(false))
    }

    const deleteRow = async (id) => {
        setLoading(true);
        await axios.delete(`/slider/delete/${id}`).then(resp => {
            getSliders();
        }).finally(() => setLoading(false))
    }

    const handleChange = info => {
        getBase64(info.file.originFileObj, imageUrl => {
            setImageUrl(imageUrl)
            setLoading(false)
        });
        // if (info.file.status === 'uploading') {
        //     this.setState({ loading: true });
        //     return;
        // }
        // if (info.file.status === 'done') {
        //     // Get this url from response in real world.
        //     getBase64(info.file.originFileObj, imageUrl =>
        //         this.setState({
        //             imageUrl,
        //             loading: false,
        //         }),
        //     );
        // }
    };

    const uploadFiles = async (uploadInfo) => {
        uploadInfo.file.status = 'done';
        setFileData(uploadInfo.file);
    }

    const onChangeDrawerVisible = (id) => {
        if(id){
            setIsDrawerVisible({id: id, show: true});
        }else{
            setIsDrawerVisible({id: null, show: true});
        }
    }

    const onChangeInput = (key,value) =>{
        setForm({
            ...form,
            [key]: value
        })

    }

    const save = async () => {

        if(!fileData){
            cogoToast.error('Image is required');
            return;
        }
        if(!form.title){
            cogoToast.error('Title is required');
            return;
        }
        if(!form.subTitle){
            cogoToast.error('Subtitle is required');
            return;
        }
        setLoading(true);
        let formData = new FormData();
        formData.append('blob',fileData, "new-image");
        await axios.post('/slider/upload-image', formData).then(resp => {
            console.log(resp.data.result);
            let newForm = form;
            newForm.image = resp.data.result;
            setLoading(true);
            axios.post('/slider/save',newForm).then(resp => {
                cogoToast.success('Slider is saved')
                setIsDrawerVisible({show:false, id:null});
                getSliders();
            }).finally(() => {setLoading(false)})

        }).finally(() => setLoading(false));
    }

    function onChangeSelect(value) {
        console.log(`selected ${value}`);
        setForm({
            ...form,
            workId: value
        })
    }

    function onSearchSelect(val) {
        console.log('search:', val);
    }

    return (
        <LayoutComp>
            <div className="d-flex justify-content-between">
                <h2>Sliders</h2>
                <Button onClick={() => {onChangeDrawerVisible(null)}} icon={<PlusCircleOutlined />}>Add Slider</Button>
            </div>
            <Table rowKey="id" loading={loading} columns={columns} dataSource={sliders} />
            <Drawer title="Images" size="large" placement="right" onClose={() => setIsDrawerVisible({id: null, show: false})} visible={isDrawerVisible.show}>
                {isDrawerVisible.id ? (
                  <div>düzenlenecek</div>
                ) : (
                 <div>
                     <ImgCrop quality={1} aspect={1600/1130}>
                         <Upload
                             name="avatar"
                             listType="picture-card"
                             className="avatar-uploader"
                             showUploadList={false}
                             beforeUpload={beforeUpload}
                             onChange={handleChange}
                             customRequest={uploadFiles}

                         >
                             {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : 'Upload'}
                         </Upload>
                     </ImgCrop>
                     <div className="mb-3">
                         <label>Title</label>
                         <Input value={form.title} name="title" onChange={(e) => {onChangeInput(e.target.name, e.target.value)}} />
                     </div>
                     <div className="mb-3">
                         <label>Title(Turkish)</label>
                         <Input value={form.titleTr} name="titleTr" onChange={(e) => {onChangeInput(e.target.name, e.target.value)}} />
                     </div>
                     <div className="mb-3">
                         <label>Subtitle</label>
                         <Input value={form.subTitle} name="subTitle" onChange={(e) => {onChangeInput(e.target.name, e.target.value)}} />
                     </div>
                     <div className="mb-3">
                         <label>Subtitle(Turkish)</label>
                         <Input value={form.subTitleTr} name="subTitleTr" onChange={(e) => {onChangeInput(e.target.name, e.target.value)}} />
                     </div>
                     <div className="mb-3">
                         <div>
                             <label>Redirect Url(Work)</label>
                         </div>

                         <Select
                             showSearch
                             placeholder="Select a work"
                             optionFilterProp="children"
                             onChange={onChangeSelect}
                             onSearch={onSearchSelect}
                             style={{width: '100%'}}
                             filterOption={(input, option) =>
                                 option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                             }
                         >
                             {workList.length > 0 && workList.map((item, idx) => (
                                 <Option value={item.id}>{item.title}</Option>
                             ))}
                         </Select>
                     </div>
                     <div>
                         <Button loading={loading} type="primary" onClick={save}>Kaydet</Button>
                     </div>

                 </div>
                )}
            </Drawer>

        </LayoutComp>
    )
}