import * as csstree from 'css-tree';

const testCSS = `
.test {
  background: var(--canvas-base);
  color: var(--text-primary);
}
`;

const ast = csstree.parse(testCSS);

csstree.walk(ast, {
  visit: 'Declaration',
  enter(node: any) {
    console.log('\n=== Declaration ===');
    console.log('Property:', node.property);
    
    csstree.walk(node.value, {
      visit: 'Function',
      enter(funcNode: any) {
        if (funcNode.name === 'var') {
          console.log('\nFound var() function');
          const tokenNameNode = funcNode.children.first;
          console.log('Token node type:', tokenNameNode?.type);
          console.log('Token node name:', tokenNameNode?.name);
          console.log('Token node:', JSON.stringify(tokenNameNode, null, 2));
        }
      },
    });
  },
});
