import { encode } from "plantuml-encoder";
import getSkin from "./skin";

const { dom } = window.Docsify;

const LANG = "plantuml";
const SELECTOR = `pre[data-lang='${LANG}'`;

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

const createURLs = element => {
  const location = window.location.toString();
  const currentURL = location.substring(0, location.lastIndexOf("/") + 1);

  const resolvePath = (_, path) => {
    const segments = (currentURL + path).split("/");
    const resolved = [];
    for (const seg of segments) {
      if (seg === "..") {
        resolved.pop();
      } else if (seg !== ".") {
        resolved.push(seg);
      }
    }

    return `[[${resolved.join("/")}`;
  };

  return element.replace(/\[\[\$((?:\.?\.\/)*)/g, resolvePath);
};

const replace = (element, planted) => {
  const parent = element.parentNode;
  const newContent = dom.create("p", planted);

  newContent.dataset.lang = LANG;
  parent.replaceChild(newContent, element);

  return parent.innerHTML;
};

const main = async (html, config) => {
  const $ = dom.create("span", html);
  if (!$.querySelectorAll) {
    return html;
  }

  const pumlElements = getElements($);

  if (pumlElements) {
    for (const el of pumlElements) {
      let puml = el.innerText;
      const skin = await getSkin(config.skin);
      puml = createURLs(puml);
      const planted = createPlant(puml, skin, config);
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

  hook.afterEach(async (html, next) => {
    next(await main(html, config));
  });
};
