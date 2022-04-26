function checkPageConfig({ item, config }) {
  const { url } = item;
  if (!config[url] || !config[url].pageId) {
    console.warn(
      `埋点上报：配置文件中找不到${url}对应的pageId，请检查是否需要上报此页面，或者是否配置此页面的pageId`
    );
    return false;
  }
  return true;
}

function checkModuleConfig({ item, config }) {
  const { name, url } = item;
  if (!config[url]) {
    console.warn(
      `埋点上报：配置文件中找不到${url}，请检查是否需要上报此页面的${name}功能`
    );
    return false;
  }
  const moduleItem = config[url].module || {};
  if (!moduleItem[name] || !moduleItem[name].moduleId) {
    console.warn(
      `埋点上报：请检查埋点配置文件是否配置了${url}下的${name}功能的moduleId`
    );
    return false;
  }
  return true;
}

export function check({ item, config }) {
  const { eventType } = item;
  if (eventType === "ONLOAD") {
    return checkPageConfig({ item, config });
  } else {
    return checkModuleConfig({ item, config });
  }
}

export function getModuleId({ item, config }) {
  const { eventType, url, name } = item;
  return eventType === "ONLOAD"
    ? config[url].pageId
    : config[url].module[name].moduleId;
}
