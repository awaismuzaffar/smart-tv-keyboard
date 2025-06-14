export const UpButton = (props) => (
  <button class="btn up" onClick={() => props.onClick()}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M7 14l5-5 5 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
);

export const LeftButton = (props) => (
  <button class="btn left" onClick={() => props.onClick()}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M14 7l-5 5 5 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
);

export const RightButton = (props) => (
  <button class="btn right" onClick={() => props.onClick()}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M10 7l5 5-5 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
);

export const DownButton = (props) => (
  <button class="btn down" onClick={() => props.onClick()}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
);

export const SelectButton = (props) => (
  <button class="btn ok" onClick={() => props.onClick()}>OK</button>
);