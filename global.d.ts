type CSSModule = { [key: string]: string };

declare module "*.module.css" {
  const classes: CSSModule;
  export default classes;
}

declare module "*.module.scss" {
  const classes: CSSModule;
  export default classes;
}
