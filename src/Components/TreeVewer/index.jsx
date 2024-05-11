import './bootstrap.css';
import './kendo.css';
import React, { useState, useRef } from 'react';
import { TreeView, TreeViewDragClue, processTreeViewItems, moveTreeViewItem, TreeViewDragAnalyzer } from '@progress/kendo-react-treeview';
import { SvgIcon } from '@progress/kendo-react-common';
import { fileIcon, folderIcon, filePdfIcon, html5Icon, imageIcon,filePptIcon ,filePresentationIcon } from '@progress/kendo-svg-icons';
function getSiblings(itemIndex, data) {
  let result = data;
  const indices = itemIndex.split(SEPARATOR).map(index => Number(index));
  for (let i = 0; i < indices.length - 1; i++) {
    result = result[indices[i]].items || [];
  }
  return result;
}
const SEPARATOR = '_';

export const FolderTree = (props) => {
  const dragClue = useRef(0);
  const dragOverCnt = useRef(0);
  const isDragDrop = useRef(false);
  // const [tree, setTree] = useState(props.forest);
  const tree = props.forest
  const [expand, setExpand] = useState({
    ids: [],
    idField: 'text'
  });
  const [selected, setSelected] = useState({
    ids: [],
    idField: 'text'
  });
  const getClueClassName = event => {
    const eventAnalyzer = new TreeViewDragAnalyzer(event).init();
    const {
      itemHierarchicalIndex: itemIndex
    } = eventAnalyzer.destinationMeta;
    if (eventAnalyzer.isDropAllowed) {
      switch (eventAnalyzer.getDropOperation()) {
        case 'child':
          return 'k-i-plus';
        case 'before':
          return itemIndex === '0' || itemIndex.endsWith(`${SEPARATOR}0`) ? 'k-i-insert-up' : 'k-i-insert-middle';
        case 'after':
          const siblings = getSiblings(itemIndex, tree);
          const lastIndex = Number(itemIndex.split(SEPARATOR).pop());
          return lastIndex < siblings.length - 1 ? 'k-i-insert-middle' : 'k-i-insert-down';
        default:
          break;
      }
    }

    return 'k-i-cancel';
  };

  const onItemDragOver = event => {
    dragOverCnt.current++;
    dragClue.current.show(event.pageY + 10, event.pageX, event.item.text, getClueClassName(event));
  };

  const onItemDragEnd = event => {
    isDragDrop.current = dragOverCnt.current > 0;
    dragOverCnt.current = 0;
    dragClue.current.hide();
    const eventAnalyzer = new TreeViewDragAnalyzer(event).init();
    const dropedIndex=eventAnalyzer.destinationMeta.itemHierarchicalIndex;
    const pathArray=dropedIndex.split('_').map(Number);
    let targetItem=tree[pathArray[0]];
    for(let i=1;i<pathArray.length;i++) {
      targetItem=targetItem.items[pathArray[i]];
    }
    // console.log(targetItem);
    // console.log(eventAnalyzer.getDropOperation());
    let flag = 0;
    if (targetItem.items === undefined && eventAnalyzer.getDropOperation() === "child")
      flag=1;
    if (eventAnalyzer.isDropAllowed && flag === 0) {
      const updatedTree = moveTreeViewItem(event.itemHierarchicalIndex, tree, eventAnalyzer.getDropOperation() || 'child', eventAnalyzer.destinationMeta.itemHierarchicalIndex);
      props.setForest(updatedTree);
    }
  };

  const onItemClick = event => {
    if (!isDragDrop.current) {
      // let ids = selected.ids.slice();
      // const index = ids.indexOf(event.item.text);
      // index === -1 ? ids.push(event.item.text) : ids.splice(index, 1);
      let ids=[];
      ids.push(event.item.text);
      setSelected({
        ids,
        idField: 'text'
      });
    }
  };
  const onExpandChange = event => {
    let ids = expand.ids.slice();
    const index = ids.indexOf(event.item.text);
    index === -1 ? ids.push(event.item.text) : ids.splice(index, 1);
    setExpand({
      ids,
      idField: 'text'
    });
    console.log(tree);
  };
  const MyItem = props => {
    return <>
        <SvgIcon icon={svgIconName(props.item)} />
        {props.item.text}
      </>;
  };
  const is = (fileName, ext) => new RegExp(`.${ext}\$`).test(fileName);
function svgIconName({
  text,
  items
}) {
  if (items !== undefined && items.length>=0) {
    return folderIcon;
  } else if (is(text, 'pdf')) {
    return filePdfIcon;
  } else if (is(text, 'html')) {
    return html5Icon;
  } else if (is(text, 'jpg|png')) {
    return imageIcon;
  } else if (is(text, 'ppt')||is(text, 'pptx')) {
    return filePptIcon;
  } else {
    return fileIcon;
  }
}
  return <div>
        <TreeView 
        draggable={true}
        onItemDragOver={onItemDragOver}
        onItemDragEnd={onItemDragEnd}
        data={
          processTreeViewItems(tree, 
            {
              expand: expand,
              select: selected
            })
          }
          expandIcons={true}
          onExpandChange={onExpandChange}
          onItemClick={onItemClick}
          item={MyItem}
          />
        <TreeViewDragClue ref={dragClue} />
      </div>;
};