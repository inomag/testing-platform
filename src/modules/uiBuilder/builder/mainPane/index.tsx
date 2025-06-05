/* eslint-disable react/no-unstable-nested-components */
import _ from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactFlow, { Controls, NodeResizer } from 'reactflow';
import classNames from 'classnames';
import { ReactComponent as CopyIcon } from 'src/assets/icons/copy.svg';
import { ReactComponent as DeleteIcon } from 'src/assets/icons/cross.svg';
import { ReactComponent as EditIcon } from 'src/assets/icons/edit.svg';
import { getFlatComponentsList } from '../queries';
import { deviceLayouts } from './constants';
import DroppableCanvas from './droppableCanvas';
import styles from './index.module.scss';

function MainPane({
  layout,
  viewPort,
  nodes,
  edges,
  setNodes,
  setEdges,
  onNodesChange,
  onEdgesChange,
  handleMoveEnd,
  setSelectedNode,
  setShowRightPane,
  components,
}) {
  layout = Object.keys(deviceLayouts)[layout];

  const deviceLayout = deviceLayouts[layout];

  const flatComponents = useMemo(
    () => getFlatComponentsList(components),
    [components],
  );

  const canvasStyle = {
    width: deviceLayout.width,
    height: deviceLayout.height,
  };

  const wrapperStyle = {
    width: deviceLayout.width,
    height: deviceLayout.height,
    position: 'relative',
  };

  const withDefaultChildren = useCallback(
    (WrappedComponent, defaultChildren = 'Test Data') =>
      // eslint-disable-next-line func-names
      function (props) {
        const updatedProps = Object.keys(props).reduce((acc, key) => {
          // eslint-disable-next-line react/destructuring-assignment
          acc[key] = props[key];
          // eslint-disable-next-line react/destructuring-assignment
          if (_.isObject(props[key]) && 'path' in props[key]) {
            acc[key] = undefined;
          }

          if (key === 'children') {
            // eslint-disable-next-line react/destructuring-assignment
            acc[key] = props.children || defaultChildren;
          }

          return acc;
        }, {});

        return <WrappedComponent {...updatedProps} />;
      },
    [],
  );

  const componentsWithDefaultChildren = useMemo(
    () =>
      Object.keys(flatComponents).reduce((acc, key) => {
        const Component = flatComponents[key];

        const EnhancedComponent = withDefaultChildren(Component);

        acc[key] = function CustomNodeWrapper(props) {
          const { data, selected, id } = props;

          const componentRef = useRef(null);

          const [isHovered, setIsHovered] = useState(false); // Track hover state

          const handleEditClick = () => {
            setSelectedNode(data);
            setShowRightPane(true);
          };

          const handleCopyClick = () => {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            setNodes((nodes) => {
              const nodeToCopy = nodes.find((node) => node.id === id);
              if (!nodeToCopy) return nodes;

              const updatedId = `${id}-copy-${Date.now()}`;
              const newNode = {
                ...nodeToCopy,
                data: { ...nodeToCopy.data, key: updatedId },
                id: updatedId,
                position: {
                  x: nodeToCopy.position.x,
                  y:
                    nodeToCopy.position.y +
                    (nodeToCopy.data?.size?.height || 60),
                },
              };

              return [...nodes, newNode];
            });
          };

          const handleDeleteClick = () => {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            setNodes((nodes) => nodes.filter((node) => node.id !== id));
            // eslint-disable-next-line @typescript-eslint/no-shadow
            setEdges((edges) =>
              edges.filter((edge) => edge.source !== id && edge.target !== id),
            );
          };

          const handleResize = (size) => {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            setNodes((nodes) =>
              nodes.map((node) =>
                node.id === id
                  ? {
                      ...node,
                      data: { ...node.data, size: { x: size.x, y: size.y } },
                    }
                  : node,
              ),
            );
          };

          const [isResizing, setIsResizing] = useState(false);

          useEffect(() => {
            document.body.style.pointerEvents = isResizing ? 'none' : 'auto';
            return () => {
              document.body.style.pointerEvents = 'auto';
            };
          }, [isResizing]);

          return (
            <>
              <NodeResizer
                color="var(--primary-color)"
                isVisible={selected}
                onResizeStart={() => setIsResizing(true)}
                onResizeEnd={() => setIsResizing(false)}
                onResize={handleResize}
              />
              <div
                className={styles.deviceWrapper__canvas__nodeWrapper}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                ref={componentRef}
              >
                {(selected || isHovered) && ( // Show buttons on hover or selection
                  <div
                    className={
                      styles.deviceWrapper__canvas__nodeWrapper__buttons
                    }
                  >
                    <EditIcon onClick={handleEditClick} />

                    <CopyIcon onClick={handleCopyClick} />

                    <DeleteIcon onClick={handleDeleteClick} />
                  </div>
                )}
                <EnhancedComponent
                  {...data}
                  style={{
                    width: data.size?.width || '100%',
                    height: data.size?.height || 'auto',
                  }}
                />
              </div>
            </>
          );
        };

        return acc;
      }, {}),
    [
      flatComponents,
      setEdges,
      setNodes,
      setSelectedNode,
      setShowRightPane,
      withDefaultChildren,
    ],
  );

  const wrapperClassname = classNames(styles.deviceWrapper, {
    [styles.deviceWrapper__mobile]: layout === 'mobile',
    [styles.deviceWrapper__tablet]: layout === 'tablet',
    [styles.deviceWrapper__desktop]: layout === 'desktop',
  });

  return (
    <div
      // @ts-ignore
      style={wrapperStyle}
      className={wrapperClassname}
      data-test-id="builder-mainPane"
    >
      <DroppableCanvas>
        <ReactFlow
          data-test-id="builder-canvas"
          className={styles.deviceWrapper__canvas}
          translateExtent={[
            [0, 0],
            [wrapperStyle.width, wrapperStyle.height],
          ]}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={componentsWithDefaultChildren} // Register node types
          style={canvasStyle}
          defaultViewport={viewPort}
          minZoom={1}
          maxZoom={5}
          onMoveEnd={handleMoveEnd}
          panOnScroll
        >
          <Controls />
        </ReactFlow>
      </DroppableCanvas>
    </div>
  );
}

export default MainPane;
