import { getModuleId, check } from "./check";

type IEventType = "ONCLICK" | "ONLOAD" | "ONUNLOAD";
type IService = (p: IQueue[]) => Promise<any>;

export type IConfig = Record<
  string,
  {
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

type IGetCurrentPages = () => any[];
export interface ITracking {
  delay?: number;
  open?: boolean;
  service: IService;
  config: IConfig;
  // 小程序必传
  getCurrentPages?: IGetCurrentPages;
}

export interface IQueue {
  eventType: IEventType;
  moduleId: string;
}
interface IEventProps {
  eventType?: IEventType;
  // 按钮级别埋点，传入功能模块名字
  name?: string;
  // 正常不需要传
  url?: string;
}

function parseUrl({ item, getCurrentPages }) {
  if (item.url) {
    return;
  }
  if (getCurrentPages) {
    const pages = getCurrentPages();
    item.url =
      pages && pages.length ? pages[pages.length - 1].route : undefined;
    return;
  }
  item.url = window.location.pathname;
  window.location.pathname;
}
export default class Tracking {
  queue: IQueue[];

  timer: ReturnType<typeof setTimeout>;

  delay: number;

  open: boolean;

  service: IService;

  getCurrentPages;

  config: any;

  constructor(options: ITracking) {
    const { delay, open, service, config, getCurrentPages } = options;
    this.queue = [];
    this.timer = null;
    this.delay = typeof delay === "undefined" ? 60 * 1000 : delay;
    this.open = typeof open === "undefined" ? true : open;
    this.service = service;
    this.config = config || {};
    this.getCurrentPages = getCurrentPages;
  }

  sendEvent = (item: IEventProps) => {
    if (!this.open) {
      return;
    }
    const { config, getCurrentPages } = this;
    parseUrl({ item, getCurrentPages });
    if (!check({ item, config })) {
      return;
    }
    this.queueAction(item);
    this.runTimer();
  };

  queueAction = (item) => {
    if (!this.open) {
      return;
    }
    const { config } = this;
    const moduleId = getModuleId({ item, config });
    const { eventType = "ONCLICK" } = item;
    const p = { moduleId, eventType };
    this.queue.push(p);
  };

  runTimer = () => {
    if (!this.timer && this.open) {
      this.timer = setTimeout(() => {
        this.reportAction().then(() => {
          this.timer = null;
          this.queue.length && this.runTimer();
        });
      }, this.delay);
    }
  };

  reportAction = () => {
    if (!this.open || !this.queue.length) {
      return;
    }
    const endIndex = this.queue.length - 1;
    return this.service([...this.queue]).then((res = {}) => {
      const { code } = res;
      if (code === 1001) {
        this.queue = [...this.queue.splice(endIndex + 1)];
      }
    });
  };

  clear = () => {
    if (!this.open) {
      return;
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.reportAction().then(() => {
      this.timer = null;
    });
  };
}
