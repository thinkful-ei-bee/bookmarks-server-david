'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { NODE_ENV } = require('./config');
const logger = require('./logger');
const validate = require('./authorize');

const app = express();

const bookmarksRouter = require('./bookmarks/bookmarks');
const bookmarksIdRouter = require('./bookmarksId/bookmarksId');
const bookmarksPostRouter = require('./bookmarkPost/bookmarkPost');

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(validate);

app.use(bookmarksRouter);
app.use(bookmarksIdRouter);
app.use(bookmarksPostRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// eslint-disable-next-line no-unused-vars
app.use(function errorHandler(error, req, res, next) {
  let response;
  logger.error('server error');
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    // eslint-disable-next-line no-console
    console.error(error);
    response = {message: error.message, error};
  }

  res.status(500).json(response);
});

module.exports = app;