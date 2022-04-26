# tracking

##### 安装

```
yarn add @wyny/tracking
```

##### 使用

web端

```
// 初始化
window.$$Tracking = new Tracking({service, config } as ITracking);
// 页面级别上报，监听理由变化，发送上报事件
export function onRouteChange() {
  window.$$Tracking.sendEvent({ eventType: 'ONLOAD' });
}
// 按钮级别上报
window.$$Tracking.sendEvent({ name: '右侧自定义首页抽屉' });

// 卸载
window.addEventListener('beforeunload', () => {
  window.$$Tracking.clear();
  window.$$Tracking = null;
});
```

小程序端

```
// 初始化
this.$tracking = new Tracking({
config,
service: report,
getCurrentPages: Taro.getCurrentPages,
} as ITracking)

// 上报事件
$app.$tracking.sendEvent({
name: '热门文章',
})

// 卸载
componentWillUnmount() {
  this.$tracking.clear()
}
```

##### 实例化Tracking，传入属性说明

| 属性                              | 默认值    | 备注                                          |
| --------------------------------- | --------- | --------------------------------------------- |
| delay?: number                    | 60*1000ms | 埋点上报频率                                  |
| open?: boolean;                   | true      | 是否开启埋点                                  |
| service:IService                  |           | 埋点上报接口，注意接口返回的格式为{code,data} |
| config: IConfig                   |           | 埋点配置文件                                  |
| getCurrentPages?:IGetCurrentPages |           | 小程序必填，用于获取当前页面路由              |
|                                   |           |                                               |

##### config说明


```
// 结构
export type IConfig = Record<
string,
{
// 页面id, 
  pageId?: string;
  title: string;
  module?: Record<
    string,
    {
      moduleId: string;
    }
  >;
}
>;

'/home': {
    pageId: '1515942643537993728',
    title: '首页',
    module: {
      右侧自定义首页抽屉: {
        moduleId: '1515942887113809920',
      },
      点击数据卡片进入对应模块: {
        moduleId: '1515943264349511680',
      },
      卡片数据设置: {
        moduleId: '1515943377469890560',
      },
      '政策咨询“更多”': {
        moduleId: '1515943490875482112',
      },
      告警: {
        moduleId: '1515944339345432576',
      },
      评价与反馈: {
        moduleId: '1515944434480635904',
      },
    },
  },
```


  

