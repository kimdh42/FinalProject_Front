import React, { useState } from "react";
import Tree from "react-d3-tree";
import "./OrgD3Tree.css";
import transformData from "./transformData";



const svgSquare = {
  shape: "rect",
  shapeProps: {
    width: 180,
    height: 40,
    x: 0,
    y: -20,
    color: "#ffffff"
  }
};

const test = {
  shape: "rect",
  shapeProps: {
    width: 0,
    height: 0,
    x: -20,
    y: 20,
    stroke: "#2F80ED"
  }
};

const nodeStyle = (
  <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
    <rect
      width="80"
      height="40"
      x="10"
      y="10"
      style={{ fill: "skyblue", stroke: "cadetblue", strokeWidth: 2 }}
    />
  </svg>
);

const treeStyle = {
  nodes: {
    node: {
      circle: <nodeStyle />,
      name: <nodeStyle />,
      attributes: <nodeStyle />
    }
  }
};

const svgRectangle = {
  shape: "rect",
  shapeProps: {
    width: 180,
    height: 40,
    x: 0,
    y: -20,
    color: "#ffffff"
  }
};


const NodeLabel = ({ className, nodeData }) => (
  <div className={className}>
    {nodeData.attributes && (
      <div style={{ background: "#ffffff", height: "100%", textAlign: "center", borderRadius: "5px", border: "1px solid #ccc", padding: "5px", boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.1)" }}>
        {nodeData.attributes.Img ? (
          <div style={{ width: "50px", height: "50px" }}>
            <img src={nodeData.attributes.Img} alt="Employee Image" style={{ maxWidth: "100%", maxHeight: "100%" }} />
          </div>
        ) : (
          <div style={{ width: "50px", height: "50px" }}>
            <img src={`/images/profileImg/profileImg.png`} alt="Default Image" style={{ maxWidth: "100%", maxHeight: "100%" }} />
          </div>
        )}
        <p>{nodeData.name}</p>
        <p>dept: {nodeData.attributes.dept}</p>
        <p>positionName: {nodeData.attributes.positionName}</p>
      </div>
    )}
    {!nodeData.attributes && <p>{nodeData.name}</p>}
  </div>
);


const OrgD3Tree = ({ data }) => {

  const myTreeData = transformData(data);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      {myTreeData && (
        <Tree
          data={myTreeData}
          nodeSvgShape={svgSquare} // 원래 사용하던 다른 모양의 노드 스타일
          treeProps={treeStyle} // 위에서 정의한 treeStyle을 treeProps로 전달
          pathFunc="step"
          separation={{ siblings: 2, nonSiblings: 2 }}
          orientation="vertical"
          translate={{ x: 600, y: 100 }}
          allowForeignObjects={true}
          nodeLabelComponent={{
            render: <NodeLabel />,
            foreignObjectWrapper: {
              width: 220,
              height: 200,
              y: -50,
              x: -100
            }
          }}
          initialDepth={0}
        />
      )}
    </div>
  );
};

export default OrgD3Tree;