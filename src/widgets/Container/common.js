export const propsKey = [
  { key: 'width', type: 'string', label: '宽度', tag: 'style' },
  { key: 'height', type: 'string', label: '高度', tag: 'style' },
  { key: 'margin', type: 'string', label: '外边距', tag: 'style' },
  { key: 'padding', type: 'string', label: '内边距', tag: 'style' },
  {
    key: 'display',
    type: 'select',
    label: 'display',
    options: [
      { key: '', value: '' },
      { key: 'block', value: 'block' },
      { key: 'inline-block', value: 'inline-block' },
      { key: 'flex', value: 'flex' },
      { key: 'inline-flex', value: 'inline-flex' }
    ],
    tag: 'style'
  },
  {
    key: 'flex-direction',
    type: 'select',
    label: 'flex-direction',
    options: [
      { key: '', value: '' },
      { key: 'row', value: 'row' },
      { key: 'column', value: 'column' }
    ],
    tag: 'style'
  },
  {
    key: 'flex-wrap',
    type: 'select',
    label: 'flex-wrap',
    options: [
      { key: '', value: '' },
      { key: 'wrap', value: 'wrap' },
      { key: 'nowrap', value: 'nowrap' }
    ],
    tag: 'style'
  },
  {
    key: 'justify-content',
    type: 'select',
    label: 'justify-content',
    options: [
      { key: '', value: '' },
      { key: 'flex-start', value: 'flex-start' },
      { key: 'flex-end', value: 'flex-end' },
      { key: 'center', value: 'center' },
      { key: 'space-between', value: 'space-between' },
      { key: 'space-around', value: 'space-around' }
    ],
    tag: 'style'
  },
  {
    key: 'align-items',
    type: 'select',
    label: 'align-items',
    options: [
      { key: '', value: '' },
      { key: 'flex-start', value: 'flex-start' },
      { key: 'flex-end', value: 'flex-end' },
      { key: 'center', value: 'center' },
      { key: 'baseline', value: 'baseline' },
      { key: 'stretch', value: 'stretch' }
    ],
    tag: 'style'
  },
  {
    key: 'align-content',
    type: 'select',
    label: 'align-content',
    options: [
      { key: '', value: '' },
      { key: 'flex-start', value: 'flex-start' },
      { key: 'flex-end', value: 'flex-end' },
      { key: 'center', value: 'center' },
      { key: 'space-between', value: 'space-between' },
      { key: 'space-around', value: 'space-around' },
      { key: 'stretch', value: 'stretch' }
    ],
    tag: 'style'
  },
  { key: 'flex-grow', type: 'string', label: 'flex-grow', tag: 'style' },
  { key: 'flex-shrink', type: 'string', label: 'flex-shrink', tag: 'style' }
]
