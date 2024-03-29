/**
 * Wux Weapp 3.8.5
 * 一套组件化、可复用、易扩展的微信小程序 UI 组件库
 * https://github.com/wux-weapp/wux-weapp#readme
 *
 * Copyright 2017-2020 skyvow
 *
 * Released under the MIT License
 *
 * Released on: 2020-2-05
 */



/**
 * 使用选择器选择组件实例节点，返回匹配到的第一个组件实例对象
 * @param {String} selector 节点选择器
 * @param {Object} ctx 页面栈或组件的实例，默认为当前页面栈实例
 */
export const getCtx = (selector, ctx = getCurrentPages()[getCurrentPages().length - 1]) => {
    const componentCtx = ctx.selectComponent(selector)

    if (!componentCtx) {
        throw new Error('无法找到对应的组件，请按文档说明使用组件')
    }

    return componentCtx
}

const version = '3.8.5'
const $wuxNotification = (selector = '#wux-notification', ctx) => getCtx(selector, ctx)
const $wuxToptips = (selector = '#wux-toptips', ctx) => getCtx(selector, ctx)
const $wuxKeyBoard = (selector = '#wux-keyboard', ctx) => getCtx(selector, ctx)
const $wuxBackdrop = (selector = '#wux-backdrop', ctx) => getCtx(selector, ctx)
const $startWuxRefresher = (selector = '#wux-refresher', ctx) => getCtx(selector, ctx).triggerRefresh()
const $stopWuxRefresher = (selector = '#wux-refresher', ctx) => getCtx(selector, ctx).finishPullToRefresh()
const $stopWuxLoader = (selector = '#wux-refresher', ctx, isEnd) => getCtx(selector, ctx).finishLoadmore(isEnd)

export {
    version,
	$wuxNotification,
	$wuxToptips,
	$wuxKeyBoard,
	$wuxBackdrop,
	$startWuxRefresher,
	$stopWuxRefresher,
	$stopWuxLoader
}
