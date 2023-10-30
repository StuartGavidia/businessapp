import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import MessageThreadPicker from './MessageThreadPicker';
import {DefaultMessageThreadExample} from './MessageThread';

const CommRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={MessageThreadPicker} />
        <Route path="/messageThread/:messageThreadId" component={DefaultMessageThreadExample} />
      </Switch>
    </Router>
  );
};

export default CommRouter;
