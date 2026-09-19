const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that route elements are rendered as JSX.',
    },
    messages: {
      expectJsx: 'Route element must be a JSX element or fragment.',
    },
    schema: [],
  },
  create(context) {
    return {
      Property(node) {
        if (node.key && node.key.type === 'Identifier' && node.key.name === 'element') {
          const value = node.value;
          if (value && value.type !== 'JSXElement' && value.type !== 'JSXFragment') {
            context.report({ node: value || node, messageId: 'expectJsx' });
          }
        }
      },
    };
  },
};

export default {
  rules: {
    'route-element-jsx': rule,
  },
};