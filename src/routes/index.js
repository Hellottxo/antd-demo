import DragAndDrop from '../views/DragAndDrop';
import FlexTable from '../views/Table';

const menu = [
  {
    title: '跨树拖拽',
    path: '/dragTree',
    component: DragAndDrop
  },
  {
    title: '自适应表格',
    path: '/flexTable',
    component: FlexTable
  }
];

export default menu;
