declare module '@editorjs/checklist' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Checklist implements BlockTool {
    constructor({ data, api, readOnly }: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
    static get toolbox(): any;
  }
}

declare module '@editorjs/attaches' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Attaches implements BlockTool {
    constructor({ data, api, readOnly }: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
    static get toolbox(): any;
  }
}
