import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import type { Node } from 'reactflow';
import { ReactFlowProvider, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';
import * as Atoms from 'src/@vymo/ui/atoms';
import * as Blocks from 'src/@vymo/ui/blocks';
import * as Molecules from 'src/@vymo/ui/molecules';
import { Banner } from 'src/@vymo/ui/blocks';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { getErrorMessage, getTemplateConfig } from '../selectors';
import { setTemplateUIConfig } from '../slice';
import BottomPane from './bottomPane';
import Header from './header';
import LeftPane from './leftPane';
import MainPane from './mainPane';
import RightPane from './rightPane';
import styles from './index.module.scss';

function UIBuilder() {
  const dispatch = useAppDispatch();
  const [components] = useState({
    atoms: Atoms,
    blocks: Blocks,
    molecules: Molecules,
  });
  const [selectedNode, setSelectedNode] = useState({ id: '', type: '' });

  const templateConfig = useAppSelector(getTemplateConfig);

  const errorMessage = useAppSelector(getErrorMessage);

  const [layout, setLayout] = useState(2);
  const [nodes, setNodes, onNodesChange] = useNodesState(templateConfig.ui);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showPane, setShowPane] = useState(false);

  const [zoom, setZoom] = useState(1);

  const [viewPort, setViewport] = useState({ x: 0, y: 0, zoom: 1 });

  const [activeDragItem, setActiveDragItem] = useState('');

  useEffect(() => {
    dispatch(setTemplateUIConfig(nodes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, dispatch]);

  useEffect(() => {
    // this is first mount actually for us as we get the data from selector at second rerender.
    if (!_.isEqual(nodes, templateConfig.ui)) {
      setNodes(templateConfig.ui);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setNodes, templateConfig]);

  const handleMoveEnd = (_arg0, viewportState) => {
    setZoom(viewportState.zoom);
    setViewport(viewportState);
  };

  const handleDragStart = (event) => {
    const { data, id } = event.active ?? {};
    setActiveDragItem(`${data?.current?.componentType}/${id}`);
  };

  const [componentType, componentName] = activeDragItem.split('/');
  const DragComponent = components?.[componentType]?.[componentName];

  const handleDragEnd = (event) => {
    setActiveDragItem('');
    const { active, over } = event;
    const canvas = document.querySelector('.react-flow__viewport'); // Get the React Flow viewport
    if (over && over.id === 'droppable-canvas' && canvas) {
      const rect = canvas.getBoundingClientRect(); // Get bounding box of the canvas

      const activeDrag = active?.rect?.current?.translated ?? {};
      const x = (activeDrag.left - rect.left) / zoom;
      const y = (activeDrag.top - rect.top) / zoom;

      const newNode: Node = {
        id: `node-${nodes.length + 1}`,
        type: active.id,
        position: { x, y },
        data: {
          ...active.data.current,
          elementType: active.id,
          key: `node-${nodes.length + 1}`,
          // TODO : remove this hack
          children: 'Test Data',
        },
      };

      setNodes((nds) => nds.concat(newNode));
    }
  };

  // const handleZoomReset = () => {
  //   setZoom(1); // Reset zoom to default (1)
  // };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={styles.builder}>
        <Header layout={layout} setLayout={setLayout} />
        <Banner
          variant="error"
          position="topRight"
          closeable
          message={errorMessage}
        >
          <div className={styles.builder__section}>
            <LeftPane components={components} />

            <MainPane
              layout={layout}
              viewPort={viewPort}
              nodes={nodes}
              setNodes={setNodes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              handleMoveEnd={handleMoveEnd}
              setSelectedNode={setSelectedNode}
              setShowRightPane={setShowPane}
              components={components}
              edges={edges}
              setEdges={setEdges}
            />

            {showPane && (
              <RightPane
                selectedNode={selectedNode}
                setNodes={setNodes}
                setShowRightPane={setShowPane}
              />
            )}
          </div>
          <BottomPane />
        </Banner>
      </div>

      <DragOverlay>
        {activeDragItem && DragComponent ? (
          <DragComponent>Test Data</DragComponent>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function Flow() {
  return (
    <ReactFlowProvider>
      <UIBuilder />
    </ReactFlowProvider>
  );
}

export default Flow;
