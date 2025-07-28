/**
 * 检测是否为移动设备
 * @param {string} userAgent - User-Agent字符串
 * @returns {boolean} 是否为移动设备
 */
export function isMobileDevice(userAgent) {
    if (!userAgent) return false;
    
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
}

/**
 * 检测是否为平板设备
 * @param {string} userAgent - User-Agent字符串
 * @returns {boolean} 是否为平板设备
 */
export function isTabletDevice(userAgent) {
    if (!userAgent) return false;
    
    const tabletRegex = /iPad|Android(?!.*Mobile)|Tablet/i;
    return tabletRegex.test(userAgent);
}

/**
 * 检测设备类型
 * @param {string} userAgent - User-Agent字符串
 * @returns {'mobile' | 'tablet' | 'desktop'} 设备类型
 */
export function getDeviceType(userAgent) {
    if (isMobileDevice(userAgent)) {
        return 'mobile';
    }
    if (isTabletDevice(userAgent)) {
        return 'tablet';
    }
    return 'desktop';
}