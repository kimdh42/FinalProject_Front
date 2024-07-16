

const TreeCustomNode = ({ node, depth, isOpen, onToggle, onNodeClick }) => {
  return (
    <div style={{ marginLeft: depth * 20 }}>  {/* onClick 이벤트 추가 */}
      {node.droppable && (
        <span onClick={(e) => { e.stopPropagation(); onToggle(); }}>
          {isOpen ? "[-]" : "[+]"}
        </span>
      )}
      <span onClick={(e) => { e.stopPropagation(); onNodeClick(node.id) }}>
        {node.text}
      </span>
    </div>
  );
};

export default TreeCustomNode;