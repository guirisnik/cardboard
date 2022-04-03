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

function ProofOfConcept() {
  const [column1, setColumn1] = useState<Item[]>(generateItems(10));
  const [column2, setColumn2] = useState<Item[]>([]);

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) return;

    if (
      result.source.droppableId === "column1" &&
      result.destination.droppableId === "column2"
    ) {
      const [rColumn1, rColumn2] = reorder(
        column1,
        column2,
        result.source.index,
        result.destination.index
      );
      setColumn1(rColumn1);
      setColumn2(rColumn2);
    }

    console.log("wait");
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          display: "grid",
          gridAutoFlow: "column",
          columnGap: "10px",
        }}
      >
        <Droppable droppableId="column1">
          {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                padding: 8,
                backgroundColor: snapshot.isDraggingOver ? "aliceblue" : "gray",
              }}
            >
              {column1.map((item, index) => (
                <Draggable draggableId={item.id} key={item.id} index={index}>
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
        <Droppable droppableId="column2">
          {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                padding: 8,
                backgroundColor: snapshot.isDraggingOver ? "aliceblue" : "gray",
              }}
            >
              {column2.map((item, index) => (
                <Draggable draggableId={item.id} key={item.id} index={index}>
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
    </DragDropContext>
  );
}

export default ProofOfConcept;
