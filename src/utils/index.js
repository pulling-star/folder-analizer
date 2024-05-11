export const jsonToTree = (jsonObject) => {
    const result = [];
  
    function processObject(obj, title) {
      const node = { text: title, items: [] };
      for (const key in obj.children) {
        if (obj.children[key].type === 'file') {
          node.items.push({ text: key });
          console.log(JSON.stringify(node));
        } else if (obj.children[key].type === 'folder') {
          node.items.push(processObject(obj.children[key], key));
        }
      }
      return node;
    }
  
    for (const key in jsonObject) {
      if (jsonObject[key].type === 'folder') {
        result.push(processObject(jsonObject[key], key));
        result[0].expanded=true;
      }
    }
    
    console.log(result);
    return result;
  }