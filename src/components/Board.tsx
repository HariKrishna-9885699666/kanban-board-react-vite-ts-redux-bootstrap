import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { setTasks } from '@redux/slices/kanbanSlice';
import { db } from '@db/dexieDB';
import Column from './Column';
import { Accordion, Button } from 'react-bootstrap';
import { users, prefixes, numbers, descriptions, taskStates, taskType } from "@lib/constants";


const Board: React.FC = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.kanban.tasks);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await db.tasks.toArray();
      dispatch(setTasks(tasks));
    };

    fetchTasks();
  }, [dispatch]);

  const getTaskCount = (user: string) => tasks.filter(task => task.assignee === user).length;

  const addDummyTasks = async () => {
    await db.tasks.clear();

    const getRandomElement = (arr: string[]) =>
      arr[Math.floor(Math.random() * arr.length)];
    const getRandomTitle = () => {
      return `${getRandomElement(prefixes)}${getRandomElement(numbers)}`;
    };
    const getRandomDescription = () => {
      return getRandomElement(descriptions);
    };

    for (const user of users) {
      for (const column of taskStates) {
        for (let i = 1; i <= 2; i++) {
          const task = {
            title: getRandomTitle(),
            description: getRandomDescription(),
            type: getRandomElement(taskType) as
              | "Bug"
              | "Story"
              | "Feature"
              | "Task",
            assignee: user,
            column: column,
          };
          await db.tasks.add(task);
        }
      }
    }

    const tasks = await db.tasks.toArray();
    dispatch(setTasks(tasks));
  };

  const clearTasks = async () => {
    await db.tasks.clear();
    dispatch(setTasks([]));
  };

  return (
    <div className="container">
      <div className="mb-3">
        <Button variant="primary" onClick={addDummyTasks}>Add Dummy Tasks</Button>
        <Button variant="danger" onClick={clearTasks} className="ms-2">Clear Tasks</Button>
      </div>
      <Accordion defaultActiveKey="0">
        {users.map((user, index) => (
          <Accordion.Item eventKey={index.toString()} key={user}>
            <Accordion.Header>{user} ({getTaskCount(user)} tasks)</Accordion.Header>
            <Accordion.Body>
              <div className="row">
                <Column title="To Do" assignee={user} />
                <Column title="In Progress" assignee={user} />
                <Column title="In Review" assignee={user} />
                <Column title="Done" assignee={user} />
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default Board;
