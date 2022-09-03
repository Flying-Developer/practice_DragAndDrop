import styled from "styled-components";
import { DragDropContext ,Droppable,Draggable,DropResult} from "react-beautiful-dnd";
import { useRecoilState } from 'recoil';
import { toDoState } from "./atoms";
import DraggableCard from "./Components/DragabbleCard";

import Board from './Components/Board';
 const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
 `;

 const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
 `;

 const Card = styled.div`
   border-radius: 5px;
   margin-bottom: 5px;
   padding: 10px 10px;
   background-color: ${(props) => props.theme.cardColor};
 `; 

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    console.log(info);
    const { destination, draggableId, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // same board movement.
      setToDos((allBoards) => {
      const boardCopy = [...allBoards[source.droppableId]];
      boardCopy.splice(source.index, 1);
      boardCopy.splice(destination?.index, 0, draggableId);
      return {
        ...allBoards,
        [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      // cross board movement
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, draggableId);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Boards>  
            {Object.keys(toDos).map(boardId => <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />)}
          </Boards>
        </Wrapper>
      </DragDropContext>
    </>
  );
}

export default App;
