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

declare module '@editorjs/table' {
  import { BlockTool } from '@editorjs/editorjs';
  
  interface TableConfig {
    rows?: number;
    cols?: number;
    withHeadings?: boolean;
  }
  
  interface TableConstructor {
    config?: TableConfig;
  }
  
  export default class Table implements BlockTool {
    constructor({ data, api, readOnly, config }: TableConstructor & { data?: any; api?: any; readOnly?: boolean });
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
    static get toolbox(): any;
  }
}

declare module '@editorjs/header' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Header implements BlockTool {
    constructor({ data, api, readOnly }: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
    static get toolbox(): any;
  }
}

declare module '@editorjs/list' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class List implements BlockTool {
    constructor({ data, api, readOnly }: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
    static get toolbox(): any;
  }
}

declare module '@editorjs/quote' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Quote implements BlockTool {
    constructor({ data, api, readOnly }: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
    static get toolbox(): any;
  }
}

declare module '@editorjs/delimiter' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Delimiter implements BlockTool {
    constructor({ data, api, readOnly }: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
    static get toolbox(): any;
  }
}

declare module '@editorjs/image' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Image implements BlockTool {
    constructor({ data, api, readOnly }: any);
    render(): HTMLElement;
    save(blockContent: HTMLElement): any;
    static get toolbox(): any;
  }
}