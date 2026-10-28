import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        'camera-controls'?: string | boolean;
        'auto-rotate'?: boolean | string;
        'rotation-per-second'?: string;
        'disable-zoom'?: boolean | string;
        'disable-pan'?: boolean | string;
        'camera-orbit'?: string;
        'shadow-intensity'?: string;
        'environment-image'?: string;
        exposure?: string;
      };
    }
  }
}
