import React from "react";
import {Upload, message, Button, Input} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import LayoutComp from "../components/Layout";
import ImgCrop from "antd-img-crop";
import axios from "axios";
import cogoToast from 'cogo-toast';
import { Card, Alert } from 'antd';


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

class OptionsPage extends React.Component {
    state = {
        loading: false,
        fileData: null,
        title: '',
        id: null,
        currentLogo: '',
        isImageChange: false
    };

    componentDidMount() {
        this.load();
    }

    load = async () => {
        await axios.get(`/options/get`).then(resp => {
            this.setState({
                title: resp.data.result.title,
                id: resp.data.result.id,
                currentLogo: resp.data.result.logo
            })
        }).finally(() => this.setState({loading: false}))
    }

    handleChange = info => {
        getBase64(info.file.originFileObj, imageUrl =>
            this.setState({
                imageUrl,
                loading: false,
                isImageChange: true
            }),
        );
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

     uploadFiles = async (uploadInfo) => {
         uploadInfo.file.status = 'done';
        this.setState({fileData: uploadInfo.file, isImageChange: true})
    }

    saveLogo = async () => {
        const formData = new FormData()
        formData.append('image', this.state.fileData)
        if(this.state.id){
            formData.append('id', this.state.id)
        }

        this.setState({loading: true})
        await axios.post(`/options/upload-logo`,formData).then(resp => {
            this.load()
        }).finally(() => this.setState({loading: false}))
    }
    save = async  () => {
         let data = {
             title: this.state.title
         }
         if(this.state.id){
             data.id = this.state.id
         }
        this.setState({loading: true})
        await axios.post(`/options/save`,data).then(resp => {
            this.load()
            cogoToast.success('Title is changed')
        }).finally(() => this.setState({loading: false}))
    }


    render() {
        const { loading, imageUrl } = this.state;
        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <LayoutComp>
                <h2>Options</h2>
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <Card title="Web Site Info">
                            <div className="mb-3">
                                <label>Web Site Title</label>
                                <Input value={this.state.title} onChange={(e) => this.setState({title: e.target.value}) } />
                            </div>
                            <div>
                                <Button loading={this.state.loading} type="primary" onClick={this.save}>Save</Button>
                            </div>
                        </Card>
                    </div>
                    <div className="col-lg-6 col-md-6">
                            <Card title="Logo" cover={<img alt="example" src={this.state.currentLogo} />}>
                                <div className="mb-3">
                                    <label>Upload New Logo</label>
                                    <Alert className="my-2" showIcon type="info" message="Please Upload new image and after click 'Save Logo' button" />
                                    <ImgCrop aspect={423/107}>
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            beforeUpload={beforeUpload}
                                            onChange={this.handleChange}
                                            customRequest={this.uploadFiles}

                                        >
                                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                        </Upload>
                                    </ImgCrop>
                                </div>
                                <div>
                                    <Button loading={this.state.loading} type="primary" onClick={this.saveLogo}>Save Logo</Button>
                                </div>
                            </Card>


                    </div>

                </div>

            </LayoutComp>

        );
    }
}

export default OptionsPage;