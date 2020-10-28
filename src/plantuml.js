import { encode } from "plantuml-encoder";

const { dom } = window.Docsify;

const LANG = "plantuml";
const SELECTOR = `pre[data-lang="${LANG}"`;

const getElements = $ => {
  return dom.findAll($, SELECTOR);
};

const createPlant = (element, config) => {
  const PUMLserver = config.serverPath || "//www.plantuml.com/plantuml/svg/";
  const svgElement = PUMLserver + encode(element);
  if (config.renderAsObject) {
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
    pumlElements.forEach(el => {
      const planted = createPlant(el.innerText, config);
      replace(el, planted);
    });
  }

  return $.innerHTML;
};

export default (hook, vm) => {
  const config = {
    renderAsObject: false,
    ...vm.config.plantuml,
  };

  hook.afterEach((html, next) => {
    main(html, config).then(response => {
      next(response);
    });
  });
};
