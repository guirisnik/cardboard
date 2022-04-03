import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import type { DropResult, ResponderProvided } from "react-beautiful-dnd";
import type {
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";

type Item = {
  id: string;
  content: string;
};

type Column = {
  id: string;
  name: string;
  items: Item[];
};

const generateItems = (length: number): Item[] =>
  Array.from({ length }, (_, k) => ({ id: `item${k}`, content: `Item ${k}` }));

const reorder = (
  sourceColumn: Item[],
  destinationColumn: Item[],
  sourceIndex: number,
  destinationIndex: number
): Item[][] => {
  const sourceColumnCopy = Array.from(sourceColumn);
  const destinationColumnCopy = Array.from(destinationColumn);

  destinationColumnCopy.splice(
    destinationIndex,
    0,
    ...sourceColumnCopy.splice(sourceIndex, 1)
  );
  return [sourceColumnCopy, destinationColumnCopy];
};

function MultiColumnBoard() {
  const [columns, setColumns] = useState<Column[]>([]);

  const onDragEnd = (
    { destination, source }: DropResult,
    provided: ResponderProvided
  ) => {
    if (!destination) return;

    const columnsCopy = Array.from(columns);
    const sourceColumnIndex = columnsCopy.findIndex(
      (column) => column.id === source.droppableId
    );
    const destinationColumnIndex = columnsCopy.findIndex(
      (column) => column.id === destination.droppableId
    );

    columnsCopy[destinationColumnIndex].items.splice(
      destination.index,
      0,
      ...columnsCopy[sourceColumnIndex].items.splice(source.index, 1)
    );

    setColumns(columnsCopy);

    console.log("wait");
  };

  const handleAddColumn: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setColumns(
      columns.concat({
        id: `column${columns.length + 1}`,
        name: `Column ${columns.length + 1}`,
        items: [],
      })
    );
  };

  const handleAddItem = (columnIndex: number) => (e: React.MouseEvent) => {
    const columnsCopy = Array.from(columns);
    const itemsLength = columnsCopy.at(columnIndex)?.items.length;
    columnsCopy.at(columnIndex)?.items.push({
      id: `item${itemsLength}${columnIndex}`,
      content: `Item ${itemsLength}${columnIndex}`,
    });
    setColumns(columnsCopy);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <button onClick={handleAddColumn}>Add Column</button>
      <div
        style={{
          display: "grid",
          gridAutoFlow: "column",
          columnGap: "10px",
        }}
      >
        {columns.map((column, index) => (
          <div key={column.id}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>{column.name}</div>
              <button onClick={handleAddItem(index)}>Add item</button>
            </div>
            <Droppable droppableId={column.id}>
              {(
                provided: DroppableProvided,
                snapshot: DroppableStateSnapshot
              ) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    padding: 8,
                    backgroundColor: snapshot.isDraggingOver
                      ? "aliceblue"
                      : "gray",
                  }}
                >
                  {column.items.map((item, index) => (
                    <Draggable
                      draggableId={item.id}
                      key={item.id}
                      index={index}
                    >
                      {(
                        provided: DraggableProvided,
                        snapshot: DraggableStateSnapshot
                      ) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          style={{
                            margin: 8,
                            padding: 8,
                            backgroundColor: snapshot.isDragging
                              ? "greenyellow"
                              : "white",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

export default MultiColumnBoard;
