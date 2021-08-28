/* eslint-disable */
import React, { Component, createRef } from 'react';

class App extends Component {
  // constructor(초기값)로 this.child(App의 하위 컴포넌트들)에 createRef 지정
  //    => 이후 하위 컴포넌트에서 ref={this.child}로 App의 createRef를 props로 사용 가능
  constructor(props) {
    super(props);
    this.child = createRef();
  }

  state = {
    maxNo: 3,
    boards: [
      {
        brdno: 1, // 글번호
        brdwriter: 'Lee SunSin', // 작성자
        brdtitle: 'If you intend to live then you die', // 글제목
        brddate: new Date(), // 작성일자
      },
      {
        brdno: 2,
        brdwriter: 'So SiNo',
        brdtitle: 'Founder for two countries',
        brddate: new Date(),
      },
    ],
  };

  // 새로 입력된 데이터로 state 수정(저장)
  handleSaveData = (data) => {
    // 여기서 data는 state(= { brdtitle: 입력값, brdwriter: 입력값 }) 형태로 넘어옴

    // 반복되는 this.state.boards를 변수로 뺌
    let boards = this.state.boards;

    // 받아온 data의 brdno이 기존에 없는 경우 => 글 신규작성
    if (data.brdno === null || data.brdno === '' || data.brdno === undefined) {
      // 클래스 컴포넌트의 좋은 점: 사본 안 만들고 setState로 state 바로 수정 가능
      this.setState({
        // maxNo 주의: boards에 concat할 때(사용할 때) ++을 붙이면 warning 발생
        //   => setState 내에서 수정 후 사용
        maxNo: this.state.maxNo + 1,
        boards: boards.concat({
          brdno: this.state.maxNo,
          brddate: new Date(),
          brdwriter: data.brdwriter,
          brdtitle: data.brdtitle,
        }),
      });

      // 위의 경우가 아니라면 => 글 수정
    } else {
      this.setState({
        // boards에서 row로 하나씩 꺼내서
        // 받아온 data의 brdno과 row의 brdno이 같다면
        // 그 row에 받아온 data 내용을 모두 넣어주고(brdno과 brddate는 그대로, brdtitle과 brdwriter만 수정됨)
        // 만약 brdno이 다르다면 기존 row 내용 그대로 반환
        boards: boards.map((row) =>
          data.brdno === row.brdno ? { ...data } : row
        ),
      });
    }
  };

  handleRemove = (brdno) => {
    this.setState({
      boards: this.state.boards.filter((row) => row.brdno !== brdno),
    });
  };

  // BoardItem으로 전달되어 클릭한 row 데이터를 받아오는 함수
  // row 데이터를 받아서 this.child(여기서는 BoardForm)의 handleSelectRow 함수를 실행하면서 row를 넘겨줌 (App에서 BoardForm으로 넘어감)
  handleSelectRow = (row) => {
    this.child.current.handleSelectRow(row);
  };

  render() {
    // this = 자기자신(App 컴포넌트)
    // this.state에 있는 것 중에서 하나를 가지고 올 때 { } 사용
    // (this.state에 변수가 많을 때 편하게 사용하기 위한 기호, { } 없으면 this.state 뒤에 일일이 가져올 state의 key 이름을 붙여줘야)
    const { boards } = this.state; // (중괄호 없으면 const board = this.state.board)

    return (
      <div>
        {/* App의 constructor에 있는 createRef를 사용하기 위해 ref={this.child}로 받아옴 */}
        <BoardForm onSaveData={this.handleSaveData} ref={this.child} />
        <table border="1">
          <tbody>
            <tr align="center">
              <td width="50">No.</td>
              <td width="300">Title</td>
              <td width="100">Name</td>
              <td width="100">Date</td>
            </tr>
            {boards.map((row) => (
              <BoardItem
                key={row.brdno}
                // BoardItem에 row 전달
                row={row}
                onRemove={this.handleRemove}
                // BoardItem에 App의 handleSelectRow 함수 전달
                onSelectRow={this.handleSelectRow}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

class BoardItem extends Component {
  handleRemove = () => {
    // App 컴포넌트에게서 row 데이터와 onRemove(handleRemove 함수)를 받아와서
    const { row, onRemove } = this.props;
    // onRemove에 row의 brdno을 넣어줌
    onRemove(row.brdno);
  };

  // 수정과정 2. App으로부터 전달받은 row와 onSelectRow를 props로 받아와서
  //      onSelectRow(App의 handleSelectRow)에 클릭한 row 넣어주는 작업 처리
  //      (=> App과 BoardItem 연결하는 함수)
  handleSelectRow = () => {
    const { row, onSelectRow } = this.props;
    onSelectRow(row);
  };

  render() {
    return (
      <tr>
        <td>{this.props.row.brdno}</td>
        <td>
          {/* 수정 1: 사용자가 글 리스트 중 하나의 title을 클릭하면 BoardItem의 handleSelectRow 호출 */}
          {/* 선택된 row의 값들을 사용자가 수정할 수 있게 입력상자에 넣어주어야 함 */}
          {/* 입력상자는 BoardForm에 있기 때문에 BoardForm을 부모 컴포넌트(App)이 알고 있어야 함 
            => 자식의 handle 함수를 갖고 있어야 함
            => 컴포넌트의 handle 함수를 가져오는 ref를 
              App의 하위 컴포넌트들을 가리키는 this.child에 보관하는 방법 사용 */}
          <a onClick={this.handleSelectRow}>{this.props.row.brdtitle}</a>
        </td>
        <td>{this.props.row.brdwriter}</td>
        <td>{this.props.row.brddate.toLocaleDateString('ko-KR')}</td>
        <td>
          <button onClick={this.handleRemove}>❌</button>
        </td>
      </tr>
    );
  }
}

class BoardForm extends Component {
  // 여기서 state는 input창의 입력값
  // 처음에 input창에는 아무 것도 없음
  state = {
    brdwriter: '',
    brdtitle: '',
  };

  // input을 입력할 때마다 state 변경
  // input창 내용이 바뀔 때마다
  // 해당 input창('e.target')의 'name'과 입력된 내용('value')을 state에 저장
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  // 부모한테서 받은 row를 이용하여 BoardForm 내의 state 변경
  //    => input 창에 row의 brdtitle과 brdwriter가 들어가서 사용자가 수정이 가능해짐
  //    => 이후 저장 버튼 누르면 App의 handleSaveData 함수(수정 및 생성) 실행
  handleSelectRow = (row) => {
    this.setState(row);
  };

  // 저장 버튼을 누르면 BoardForm 컴포넌트에서 props로 받은
  // onSaveData(= App 컴포넌트에 정의된 handleSaveData())에
  // onChange로 변경된 state를 넣어줌
  // 그리고 state는 다시 공백으로 (= input창 초기화)
  // (주의: 초기화하려면 반드시 input 태그에 value로 state의 해당 key가 잡혀 있어야 input창의 값을 인식)
  handleSubmit = (e) => {
    // 새고로침 막고
    e.preventDefault();
    // 저장함수에 전달하고
    this.props.onSaveData(this.state);
    // input창 초기화
    this.setState({
      brdno: '',
      brdwriter: '',
      brdtitle: '',
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          placeholder="title"
          name="brdtitle"
          value={this.state.brdtitle}
          onChange={this.handleChange}
        />
        <input
          placeholder="name"
          name="brdwriter"
          value={this.state.brdwriter}
          onChange={this.handleChange}
        />
        <button type="submit">저장</button>
      </form>
    );
  }
}

export default App;
