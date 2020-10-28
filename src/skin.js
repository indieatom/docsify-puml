import defaultSkin from "./skins/default.pu";

const SKIN_DEFAULT_KEY = "classic";
const VALID_EXTENSIONS = ["pu", "puml"];
const SKINS = {
  default: defaultSkin,
  classic: "",
};

const isExternalSkin = url => {
  try {
    new URL(url);
  } catch (_) {
    return false;
  }
  return true;
};

const isValidExtension = name => {
  const extension = name.split(".").pop();
  if (VALID_EXTENSIONS.includes(extension)) {
    return true;
  }
  console.warn(`[Docsify-PUML] '.${extension}' is a invalid extension!`);
  return false;
};

const loadExternalSkin = async url => {
  const resp = await fetch(url);
  return resp.text();
};

export default skin => {
  if (skin in SKINS) {
    return SKINS[skin];
  }
  if (isExternalSkin(skin) || isValidExtension(skin)) {
    return loadExternalSkin(skin);
  }

  console.warn(`[Docsify-PUML] Couldn't load skin "${skin}"`);
  return SKINS[SKIN_DEFAULT_KEY];
};
