//上传文件 /v1/excel/upload-analyze

export const uploadExcel = async (fileList) => {
    const formData = new FormData();

    // 添加文件到FormData
    fileList.forEach((file) => {
        // 使用originFileObj或file对象
        const fileObj = file.originFileObj || file;
        formData.append("file", fileObj);
    });

    const response = await fetch("http://10.22.161.69:3260/v1/excel/upload-analyze", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }

    const result = await response.json();
    return result;
};
