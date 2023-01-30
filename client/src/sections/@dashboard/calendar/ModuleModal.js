import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import ItemTypes from './ItemTypes';

const Task = ({ id, text, index, moveTask }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.TASK, id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item, monitor) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      if (!dragIndex) {
        return;
      }
      if (dragIndex === hoverIndex) {
        return;
      }
      moveTask(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {text}
    </div>
  );
};

const TasksSection = ({ tasks, moveTask }) => {
  return (
    <div>
      {tasks.map((task, index) => (
        <Task key={task.id} index={index} text={task.text} id={task.id} moveTask={moveTask} />
      ))}
    </div>
  );
};

const CalendarEventModal = ({ tasks, closeModal }) => {
  const [taskList, setTaskList] = useState(tasks);
  const moveTask = (dragIndex, hoverIndex) => {
    const dragTask = taskList[dragIndex];
    setTaskList(
      taskList
        .slice(0, dragIndex)
        .concat(
          taskList.slice(dragIndex + 1, hoverIndex + 1),
          dragTask,
          taskList.slice(hoverIndex + 1)
        )
    );
  };

  return (
    <div>
      <h2>Calendar Event</h2>
      <TasksSection tasks={taskList} moveTask={moveTask} />
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

export default CalendarEventModal;
