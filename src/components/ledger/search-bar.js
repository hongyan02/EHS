"use client";
import { Input, Button, Space, DatePicker, Select } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useState } from "react";

const { RangePicker } = DatePicker;

/**
 * 搜索栏组件
 * @param {Object} props - 组件属性
 * @param {Function} props.onSearch - 搜索回调函数
 * @param {Function} props.onReset - 重置回调函数
 * @param {string} props.placeholder - 输入框占位符
 * @returns {JSX.Element} 搜索栏组件
 */
export default function SearchBar({
    onSearch = () => {},
    onReset = () => {},
    placeholder = "请输入搜索关键词...",
}) {
    /**
     * 搜索关键词状态
     */
    const [searchValue, setSearchValue] = useState("");

    /**
     * 日期范围状态
     */
    const [dateRange, setDateRange] = useState(null);

    /**
     * 处理搜索操作
     */
    const _handleSearch = () => {
        const searchParams = {
            keyword: searchValue.trim(),
            dateRange: dateRange,
        };
        onSearch(searchParams);
    };

    /**
     * 处理重置操作
     */
    const _handleReset = () => {
        setSearchValue("");
        setDateRange(null);
        onReset();
    };

    /**
     * 处理输入框变化
     * @param {Object} e - 事件对象
     */
    const _handleInputChange = (e) => {
        setSearchValue(e.target.value);
    };

    /**
     * 处理日期范围变化
     * @param {Array} dates - 日期范围数组
     */
    const _handleDateChange = (dates) => {
        setDateRange(dates);
    };

    /**
     * 处理按键事件
     * @param {Object} e - 键盘事件对象
     */
    const _handleKeyPress = (e) => {
        if (e.key === "Enter") {
            _handleSearch();
        }
    };

    return (
        <div className="w-full">
            {/* 桌面端布局 */}
            <div className="hidden lg:flex items-center gap-4 w-full">
                {/* 搜索输入框 - 占据剩余空间 */}
                <div className="flex-1 max-w-sm">
                    <Input
                        placeholder={placeholder}
                        value={searchValue}
                        onChange={_handleInputChange}
                        onPressEnter={_handleKeyPress}
                        size="large"
                        allowClear
                    />
                </div>

                {/* 日期选择器 - 固定宽度 */}
                <RangePicker
                    size="large"
                    value={dateRange}
                    onChange={_handleDateChange}
                    placeholder={["开始时间", "结束时间"]}
                />

                {/* 按钮组 - 固定宽度 */}
                <Space>
                    <Button
                        icon={<SearchOutlined />}
                        size="large"
                        onClick={_handleSearch}
                        variant="outlined"
                        color="default"
                    >
                        搜索
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        size="large"
                        onClick={_handleReset}
                        variant="outlined"
                        color="default"
                    >
                        重置
                    </Button>
                </Space>
            </div>

            {/* 平板端布局 */}
            <div className="hidden sm:flex lg:hidden flex-col gap-3">
                {/* 第一行：搜索框 */}
                <Input
                    placeholder={placeholder}
                    value={searchValue}
                    onChange={_handleInputChange}
                    onPressEnter={_handleKeyPress}
                    size="large"
                    allowClear
                />
                {/* 第二行：日期选择器和按钮 */}
                <div className="flex items-center gap-3">
                    <RangePicker
                        size="large"
                        value={dateRange}
                        onChange={_handleDateChange}
                        placeholder={["开始时间", "结束时间"]}
                        className="flex-1"
                    />
                    <Space>
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            size="large"
                            onClick={_handleSearch}
                        >
                            搜索
                        </Button>
                        <Button icon={<ReloadOutlined />} size="large" onClick={_handleReset}>
                            重置
                        </Button>
                    </Space>
                </div>
            </div>

            {/* 移动端布局 */}
            <div className="flex sm:hidden flex-col gap-3">
                {/* 搜索输入框 */}
                <Input
                    placeholder={placeholder}
                    value={searchValue}
                    onChange={_handleInputChange}
                    onPressEnter={_handleKeyPress}
                    size="large"
                    allowClear
                />

                {/* 日期选择器 */}
                <RangePicker
                    size="large"
                    value={dateRange}
                    onChange={_handleDateChange}
                    placeholder={["开始时间", "结束时间"]}
                />

                {/* 按钮组 */}
                <div className="flex gap-3">
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        size="large"
                        onClick={_handleSearch}
                        className="flex-1"
                    >
                        搜索
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        size="large"
                        onClick={_handleReset}
                        className="flex-1"
                    >
                        重置
                    </Button>
                </div>
            </div>
        </div>
    );
}
