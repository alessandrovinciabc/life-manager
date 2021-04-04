let saveCollection = (collection) => {
  localStorage.setItem('database', JSON.stringify(collection));
};

let getCollection = (collection) => {
  return JSON.parse(localStorage.getItem('database'));
};

let hasData = () => {
  return localStorage.getItem('database') ? true : false;
};

export default Object.assign({ saveCollection, getCollection, hasData });
