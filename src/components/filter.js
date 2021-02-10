import React from 'react';
import { useState } from "react";
import { Menu, Dropdown, Button, Input } from 'antd';
import { DownOutlined, UserOutlined, SearchOutlined, RetweetOutlined, RightOutlined } from '@ant-design/icons';
import '../styles/Filter.css'

const Filter = (props) => {

    const [option, setOption] = useState('Toda la ley');
    const [filter, setFilter] = useState('');

    const items = [
        { key: 1, value: "Toda la ley", icon: <RightOutlined /> },
        { key: 2, value: "Título", icon: <RightOutlined /> },
        { key: 3, value: "Capítulo", icon: <RightOutlined /> },
        { key: 4, value: "Artículo", icon: <RightOutlined /> }
    ];
    const menu = (     
            <Menu onClick={(e) => { setOption(e.key); setUrl(e.key) }}>
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

    const setDefaultUrl = () => {
        props.triggerFilter(`elements/`);            
        setOption('Toda la ley');
        setFilter('');
    }

    const setUrl = () => {
        switch (option) {
            case 'Toda la ley':
                props.triggerFilter(`elements/${filter}`);
                break;
            case 'Título':
                props.triggerFilter(`title/${filter}`);
                break;
            case 'Capítulo':
                props.triggerFilter(`chapter/${filter}`);
                break;
            case 'Artículo':
                props.triggerFilter(`artile/${filter}`);
                break;
            default:                
                break;
        }
        setFilter('');
    }

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

            <Input
                className="input"
                placeholder="Palabra..."
                value= {filter}                
                onChange={(e) => setFilter(e.target.value)}
                 />

            <Button
                type="primary"
                shape="round"
                className="buttonSearch"
                size="middle"
                onClick={setUrl}
                icon={<SearchOutlined />} >
                Buscar
            </Button>

            <Button
                type="primary"
                shape="round"
                className="buttonSearch"
                size="middle"
                onClick={setDefaultUrl}
                icon={<RetweetOutlined />} >
                Refrescar
            </Button>

        </div>

    )
}

export default Filter;