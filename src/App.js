import './App.css';
import {jsonToTree} from './utils';
import { Basic ,FolderTree} from './Components';
import React, { useState, useRef } from 'react';
function App() {
  const [filePaths,setFilePaths]=useState([]);
  const [folderStructure,setFolderStructure]=useState({});
  const [treeData,setTreeData]=useState([]);
  const buildFolderStructure=(paths)=>{
    //console.log("parentComponenet", paths);
    const root = {};
  
    paths.forEach((path) => {
      const parts = path.split('/').filter(Boolean); // Split by '/' and remove any empty strings
      let currentLevel = root;
  
      parts.forEach((part, index) => {
        // If we're at the last part, it's a file, not a folder
        if (index === parts.length - 1) {
          currentLevel[part] = currentLevel[part] || { type: 'file', path: path };
        } else {
          // If it's not the last part, it's a folder
          currentLevel[part] = currentLevel[part] || { type: 'folder', children: {} };
          currentLevel = currentLevel[part].children; // Dive into the next level
        }
      });
    });
    
    // console.log(JSON.stringify(root, null, 2));
    const newTreeData = jsonToTree(root)
    setTreeData([...newTreeData]);
  };
  // console.log('app',treeData);
  return (
    <div className="App">
      <h4>
        This is Folder Analyzer For Michael!
      </h4>
      <Basic handleFunction={buildFolderStructure}/>
      <FolderTree setForest={setTreeData} forest={treeData} />
    </div>
  );
}
export default App;