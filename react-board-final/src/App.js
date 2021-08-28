import React, { Component } from "react";

class App extends Component {
  state = {
    maxNo: 3,
    boards: [
      {
        brdno: 1, // 글번호
        brdwriter: "Lee SunSin", // 작성자
        brdtitle: "If you intend to live then you die", // 글제목
        brddate: new Date(), // 작성일자
      },
      {
        brdno: 2,
        brdwriter: "So SiNo",
        brdtitle: "Founder for two countries",
        brddate: new Date(),
      },
    ],
  };

  // 새로 입력된 데이터 저장 (보여주기)
  handleSaveData = (data) => {
    // 여기서 data는 state({ brdtitle: 입력값, brdwriter: 입력값 }) 형태로 넘어옴

    // 클래스 컴포넌트의 좋은 점: 사본 안 만들고 state를 바로 수정 가능
    this.setState({
      // maxNo 주의: 사용할 때(boards에 concat할 때) ++ 하면 warning 발생
      //   => setState 범위 내에서 수정 후 사용
      maxNo: this.state.maxNo + 1,
      // concat을 사용하여 boards 배열에 바로 수정할 데이터 추가
      // (여기서 ...data는 입력값으로 받아온 brdtitle과 brdwriter)
      boards: this.state.boards.concat({ brdno: this.state.maxNo, brddate: new Date(), ...data }),
    });
  };

  render() {
    // this = 자기자신(App 컴포넌트)
    // this.state에 있는 것 중에서 하나를 가지고 올 때 { } 사용
    // (this.state에 변수가 많을 때 편하게 사용하기 위한 기호, { } 없으면 this.state 뒤에 일일이 가져올 state의 key 이름을 붙여줘야)
    const { boards } = this.state; // (중괄호 없으면 const board = this.state.board)

    return (
      <div>
        <BoardForm onSaveData={this.handleSaveData} />
        <table border="1">
          <tbody>
            <tr align="center">
              <td width="50">No.</td>
              <td width="300">Title</td>
              <td width="100">Name</td>
              <td width="100">Date</td>
            </tr>
            {boards.map((row) => (
              <BoardItem key={row.brdno} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

class BoardItem extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.row.brdno}</td>
        <td>{this.props.row.brdtitle}</td>
        <td>{this.props.row.brdwriter}</td>
        <td>{this.props.row.brddate.toLocaleDateString("ko-KR")}</td>
      </tr>
    );
  }
}

class BoardForm extends Component {
  // 여기서 state는 input창의 입력값
  // 처음에 input창에는 아무 것도 없음
  state = {};

  // input을 입력할 때마다 state 변경
  // input창 내용이 바뀔 때마다
  // 해당 input창('e.target')의 'name'과 입력된 내용('value')을 state에 저장
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  // 저장 버튼을 누르면 BoardForm 컴포넌트에서 props로 받은
  // onSaveData(= App 컴포넌트에 정의된 handleSaveData())에
  // onChange로 변경된 state를 넣어줌
  // 그리고 state는 다시 비움 (= input창 초기화)
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSaveData(this.state);
    this.setState({});
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input placeholder="title" name="brdtitle" onChange={this.handleChange} />
        <input placeholder="name" name="brdwriter" onChange={this.handleChange} />
        <button type="submit">저장</button>
      </form>
    );
  }
}

export default App;
