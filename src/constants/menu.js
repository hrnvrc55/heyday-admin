import {PicLeftOutlined, RadarChartOutlined, BoxPlotOutlined, FileImageOutlined} from "@ant-design/icons";

export const adminMenu = [
    {
        name: 'About',
        url: '/about',
        icon: <PicLeftOutlined />
    },
    {
        name: 'Works',
        url: '/works',
        icon: <RadarChartOutlined />
    },
    {
        name: 'Sliders',
        url: '/sliders',
        icon: <FileImageOutlined />
    },
    {
        name: 'Options',
        url: '/options',
        icon: <BoxPlotOutlined />
    }
]