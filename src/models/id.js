import { v4 as uuidv4 } from 'uuid';

let generateId = () => {
  return uuidv4();
};

export { generateId };
