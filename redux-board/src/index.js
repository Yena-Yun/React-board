import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './App';
import board_reducer from './App_reducer';

// App_reducer: 데이터 입출력과 관련된 모든 기능 구현
// 이 파일을 Redux 문법에 맞추어 App 전체에서 사용할 수 있도록 등록

let store = createStore(
  board_reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
