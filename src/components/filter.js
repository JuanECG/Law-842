import React from 'react';
import { useState } from "react";
import { Menu, Dropdown, Button, Input  } from 'antd';
import { DownOutlined, UserOutlined, SearchOutlined, RetweetOutlined, RightOutlined } from '@ant-design/icons';
import '../styles/Filter.css'

const Filter = (props) => {

    const [option, setOption] = useState('Categoría');
    const items = [
        { key: 1, value: "Título", icon: <RightOutlined /> },
        { key: 2, value: "Capítulo", icon: <RightOutlined /> },
        { key: 3, value: "Artículo", icon: <RightOutlined /> }
    ];
    const menu = (
        <Menu onClick={(e) => { setOption(e.key) }}>
            {items.map(item => (
                <Menu.Item
                    key={item.value}
                    icon={item.icon}
                >
                    {item.value}
                </Menu.Item>
            ))}
        </Menu>
    );

    if (!props.visible) {
        return null;
    }

    return (
        <div className="bar">
            <Dropdown overlay={menu} className="dropdown">
                <Button>
                    {option} <DownOutlined />
                </Button>
            </Dropdown>

            <Input className="input" placeholder="Palabra..." />

            <Button
                type="primary"
                shape="round"
                className="buttonSearch"
                size="middle"
                icon={<SearchOutlined />} >
                Buscar
            </Button>

            <Button
                type="primary"
                shape="round"
                className="buttonSearch"
                size="middle"
                icon={<RetweetOutlined />} >
                Refrescar
            </Button>

        </div>

    )
}

export default Filter;