const express = require('express');
const cors = require('cors');
const { generateUniqueId } = require('./utils/generateUniqueId');
const { isUuid } = require('uuidv4');
const app = express();

app.use(express.json());
app.use(cors());

function checkId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ msg: 'Invalid repository id.' });
  }

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ msg: 'Repository not found.' });
  }
  response.locals.repositoryIndex = repositoryIndex;
  return next();
}

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.status(200).json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const id = generateUniqueId();

  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);
  return response.status(200).json(repository);
});

app.put('/repositories/:id', checkId, (request, response) => {
  const { id } = request.params;
  const { repositoryIndex } = response.locals;
  const { title, url, techs } = request.body;

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };
  repositories[repositoryIndex] = repository;
  return response.status(200).json(repository);
});

app.delete('/repositories/:id', checkId, (request, response) => {
  const { repositoryIndex } = response.locals;
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post('/repositories/:id/like', checkId, (request, response) => {
  const { repositoryIndex } = response.locals;
  repositories[repositoryIndex].likes += 1;
  return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
