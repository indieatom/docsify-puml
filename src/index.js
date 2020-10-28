import plantuml from "./plantuml";

if (!window.$docsify) {
  window.$docsify = {};
}

window.$docsify.plugins = (window.$docsify.plugins || []).concat(plantuml);
