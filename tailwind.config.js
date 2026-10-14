const c = (v) => `rgb(var(--${v}) / <alpha-value>)`;
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { bg: c('bg'), bg2: c('bg2'), card: c('card'), elev: c('elev'), accent: c('accent'), accent2: c('accent2'), hi: c('hi'), ink: c('ink'), muted: c('muted'), line: c('line'), onaccent: c('onaccent') },
    fontFamily: { heading: ['Fredoka', 'ui-rounded', 'system-ui', 'sans-serif'], body: ['"Nunito Sans"', 'system-ui', 'sans-serif'] },
  } },
};
