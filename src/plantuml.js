import { encode } from "plantuml-encoder";
import getSkin from "./skin";

const { dom } = window.Docsify;

const LANG = "plantuml";
const SELECTOR = `pre[data-lang="${LANG}"`;

const getElements = $ => {
  return dom.findAll($, SELECTOR);
};

const createPlant = (element, skin, { renderAsObject, serverPath }) => {
  const PUMLserver = serverPath || "//www.plantuml.com/plantuml/svg/";
  const svgElement = PUMLserver + encode(skin + element);
  if (renderAsObject) {
    return `<object type="image/svg+xml" data="${svgElement}" />`;
  }
  return `<img src="${svgElement}" />`;
};

const replace = (element, planted) => {
  const parent = element.parentNode;
  const newContent = dom.create("p", planted);

  newContent.dataset.lang = LANG;
  parent.replaceChild(newContent, element);

  return parent.innerHTML;
};

const main = async (html, config) => {
  const $ = dom.create("div", html);
  if (!$.querySelectorAll) {
    return html;
  }

  const pumlElements = getElements($);

  if (pumlElements) {
    for (const el of pumlElements) {
      const skin = await getSkin(config.skin);
      const planted = createPlant(el.innerText, skin, config);
      replace(el, planted);
    }
  }

  return $.innerHTML;
};

export default (hook, vm) => {
  const config = {
    skin: "default",
    renderAsObject: false,
    ...vm.config.plantuml,
  };

  hook.afterEach((html, next) => {
    main(html, config).then(response => {
      next(response);
    });
  });
};
