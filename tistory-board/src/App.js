import React, { Component } from 'react';

class App extends Component {

  // constructor: props의 초기값 설정
  // ref로 선택한 값을 this.child에 보관
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }

  state = {
    // maxNo 초기값 3
    // (이미 기존 데이터가 2개 있으므로 그 다음 추가되는 데이터는 3번부터 시작한다는 뜻)
    maxNo: 3,

    // boards 배열 (2개의 객체 데이터로 구성)
    // (= 데이터베이스에서 4개의 필드와 2개의 행이 있는 것과 동일)
    boards: [
      {
        brdno: 1,
        brdwriter: 'Lee SunSin',
        brdtitle: 'If you intend to live then you die',
        brddate: new Date(),
      },
      {
        brdno: 2,
        brdwriter: 'So SiNo',
        brdtitle: 'Founder for two countries',
        brddate: new Date(),
      }
    ]
  }

  // 저장함수 (data를 받아서 저장한다)
  // 부모 컴포넌트 BoardForm의 state(= data)를 파라미터로 전달받아 처리
  handleSaveData = (data) => {
    //state에 선언된 boards 배열을 가져온다.
    //let boards = this.state.boards;

    // 받아온 data에 brdno이 없으면 => 새로운 게시글 신규 등록
    // (기존 boards 배열에 새 data 추가)
    if (data.brdno === null || data.brdno === '' || data.brdno === undefined) {
      this.setState({
        //state인 maxNo를 boards 내에서 직접 변경하려고 하면 경고 ('Do not mutate state directly. Use setState().')
        //  => setState로 state의 maxNo을 변경한 후, boards 객체 안에서는 변경된 maxNo을 사용만
        maxNo: this.state.maxNo + 1,
        //concat()을 통해 기존 state의 boards에 새 데이터를 추가한 후
        //기존 boards 배열을 갈아끼운다
        boards: this.state.boards.concat({
          brdno: this.state.maxNo, //setState로 변경한 maxNo
          brddate: new Date(), //작성날짜
          brdwriter: data.brdwriter, //data로 받아온 brdwriter
          brdtitle: data.brdtitle, //data로 받아온 brdtitle
        })
      });

      // 받아온 data에 brdno이 있으면 => 이미 존재하는 게시글이란 뜻 => 수정(Update)
      } else {
      this.setState({
        // 기존 boards 배열을 갈아 끼운다.
        // (boards에서 하나씩 꺼낸 데이터(row)의 brdno이 받아온 data의 brdno과 같은지 확인하고,
        // 같으면 받아온 data를 하나씩 반환, 다르면 기존 데이터(row) 그대로 반환)
        boards: this.state.boards.map(row =>
          data.brdno === row.brdno ? { ...data } : row)
      });
    }
  }

  // 삭제함수 (brdno을 기준으로 삭제)
  handleRemove = (brdno) => {
    this.setState({
      // 현재 state에 있는 boards에서 조건에 맞는 항목만 골라 새 배열 반환(filter)
      // (fiter 사용법: 배열에서 하나씩 꺼내고(row) '조건문' 작성 => 조건문에 해당하는 것만 반환)
      // (현재 갖고 있는 board의 brdno과 받아온 brdno이 다른 경우만 반환 => 받아온 brdno을 가진 board는 자동 삭제되는 효과)
      boards: this.state.boards.filter(row => row.brdno !== brdno)
    })
  }

  // 선택함수 
  // 글 수정에 사용됨 - 글 항목(행)들 중에 하나를 선택하면(handleSelectRow)
  // 선택된 행의 값들을 사용자가 수정할 수 있도록 입력상자(BoardForm)에 뿌려주고,
  //사용자가 수정 후 Save 버튼을 클릭하면 handleSaveData 함수 실행
  handleSelectRow = (row) => {
    // ref로 가져온 DOM 요소(this.child.current)에다가 handSelectRow 함수를 실행한 값을 넣음
    // 'this.child의 현재(current)는 handleSelectRow에 row를 넣은 반환값'
    this.child.current.handleSelectRow(row);
  }

  //render(): React에서 화면을 생성하기 위한 이벤트 '함수'
  render() {
    //컴포넌트 전역에서 선언된 변수를 함수 내부에서 사용하려면 
    //'this'로 가져온다. (this는 컴포넌트 자기 자신을 의미)
    // this.state에 있는 것 중에서 하나를 가지고 올 때는 중괄호({})를 사용
    // (state에 변수가 많을 때 편하게 사용하기 위함)
    const { boards } = this.state; //(= const boards = this.state.boards;)

    //boards 배열에서 객체(row)를 하나씩 꺼내서
    //const list = boards.map(function (row) {
    //  2개 행의 글번호와 작성자를 묶어서 하나의 문자열(list)로 작성
    //  return row.brdno + row.brdwriter;
    //});

    //render()에서 return문 이전: JS 영역, return문 내부: HTML 영역
    //  => HTML 영역에서 JS 영역의 값이나 함수를 사용할 때에는 중괄호({}) 사용
    return (
      // return문은 하나의 요소만 반환할 수 있으므로 반드시 div(= React.Fragment)로 묶어준다.
      <div>
        {/* BoardForm의 props: '저장'함수, ref */}
				{/* Save 버튼이 BoardForm에 있음 + input창 값으로 state를 바꿀 때 필요한 ref도 넘기기 */}
        <BoardForm onSaveData={this.handleSaveData} ref={this.child} />

        {/* {list} */}
        {/* list 변수 거치는 과정 없이 바로 출력할 수 있음 */}
        {/* (데이터를 출력하는 코드는 render()와 return 사이에 변수로 선언하기보다 
            return의 HTML 사이에 변수 없이 바로 작성하는 방식을 많이 사용) */}
        {/* {
              boards.map(function (row) {
                return row.brdno + row.brdwriter;
              })
            } */}
        
        {/* div 태그를 사용하면 CSS 설정 등으로 불필요한 코드 작성이 필요해져서 다음과 같이 table 태그로 작성 */}
        {/* 데이터 추가되기 전의 table 모양 렌더링 */}
        <table border="1">
          {/* 글자 짙게 하는 css 속성 없애기 위해 thead 생략하고 대신 tbody 안에 head 내용 작성 */}
          <tbody>
            {/* header 생성하고, */}
            <tr align="center">
              <td width="50">No.</td>
              <td width="300">Title</td>
              <td width="100">Name</td>
              <td width="100">Date</td>
            </tr>
            {/* 아래 실제 body 내용은 BoardItem 이용 */}
            {
              // boards에서 하나씩 꺼내서 BoardItem에 넣어줌
              boards.map(row =>
                //('return' 생략하고 ()로 대체)
                //BoardItem의 props: key, row데이터 전체, 삭제함수, 선택함수
                (<BoardItem key={row.brdno} row={row} onRemove={this.handleRemove} onSelectRow={this.handleSelectRow} />)
              )
            }
          </tbody>
        </table>
      </div>
    );
  }
}

// BoardItem: 각 row의 데이터를 출력(렌더링)하고, 
//            props로 받은 삭제함수와 선택함수를 실제로 수행
class BoardItem extends Component {
  // 삭제함수
  handleRemove = () => {
    // 받아온 row 데이터와 onRemove 함수 세팅
    const { row, onRemove } = this.props;
    // row 데이터 중 brdno로 onRemove(= handleRemove 함수) 실행
    onRemove(row.brdno);
  }

  // 선택함수
  handleSelectRow = () => {
    // 받아온 row 데이터와 onSelectRow 함수 세팅
    const { row, onSelectRow } = this.props;
    // row 데이터로 onSelectRow(= handleSelectRow 함수) 실행
    onSelectRow(row);
  }

  render() {
    //(row의 brdno를 props로 잘 받아왔는지 콘솔로 확인)
    console.log(this.props.row.brdno);

    return (
      //(BoardItem 컴포넌트는 table의 '행' 하나를 반환하므로 <tr>로 시작)
      <tr>
        {/* 여기서 this는 App이 아니라 BoardItem 컴포넌트 - '이 컴포넌트의 props인 ~' */}
        {/* ('이 컴포넌트(this)의 props인 row객체 안의 value를 brdno,brdwriter 등의 key를 통해 가져옴') */}
        <td>{this.props.row.brdno}</td>
        {/* 사용자가 게시글 중 하나(title)를 선택하면(handleSelectRow)
            선택된 게시글을 사용자가 수정할 수 있도록 input창에 제목과 작성자가 들어감 
            (=> 이 부분은 실제 게시판 글작성 페이지로 이동하도록 수정해야) 
            입력상자는 BoardForm에 있기 때문에 BoardForm을 부모(App) 컴포넌트가 알고 있어야 함
            즉, 부모가 자식(BoardForm)의 이벤트를 처리하는 handler를 가지고 있어야 한다.*/}
        {/* 제목을 link로 만들어야 하므로 a 태그 사용 */}
        <td><a onClick={this.handleSelectRow}>{this.props.row.brdtitle}</a></td>
        <td>{this.props.row.brdwriter}</td>
        {/* toLocaleDateString('ko-KR'): date 객체를 한국날짜 기준으로 바꿈 (출력값 예: 2021. 6. 2.) => 영어는 'en-US' */}
        <td>{this.props.row.brddate.toLocaleDateString('ko-KR')}</td>
        {/* 마지막 칸에 삭제(x)버튼 생성 */}
        <td><button onClick={this.handleRemove}>X</button></td>
      </tr>
    );
  }  
}

// BoardForm: form 요소들을 반환하는 컴포넌트
//  => input에 입력된 값이 submit 되면서 state를 변경하고, 변경된 state값으로 저장 수행
class BoardForm extends Component {
  // 입력창에 보여질 값인 state 초기화
  // brdwriter와 brdtitle - 실제 사용자가 input창에 입력하는 값 (처음에는 비어있음)
  state = {
    brdwriter: '',
    brdtitle: '',
  };

  // 1번째 state 변경함수 - input창에 입력 시
  // 입력된 name(brdtitle 또는 brdwriter)을 key값으로 하고, 입력된 value를 value값으로 함
  handleChange = (e) => {
    this.setState({
      //e.target = 현재 이벤트가 발생한 개체, 즉 값을 입력하는 입력상자(= input)
      // key를 뜻할 때는 [] 사용
      [e.target.name]: e.target.value,
      // => state에 저장되는 형태
      //    state = {
      //      brdtitle: e.target.value,
      //      brdwriter: e.target.value
      //    } 
    })
  }

  // 2번째 state 변경함수 - title로 항목 중 하나 클릭 시
  // 받아온 row 데이터로 state 변경 (렌더링 시 쓰지는 않고 input창에 선택한 brdtitle과 brdwriter이 나타나게 하는 역할만)
  handleSelectRow = (row) => {
    this.setState(row); 
  }

  // 제출함수 (=> 여기서 props로 받아온 저장함수 실행)
  // handleSubmit: Form 태그가 값을 '서버로 전송할 때' 발생하는 이벤트 처리
  // (form과 submit button이 있는 곳에서만 사용)
  // Save 버튼 클릭 시 props로 받은 onSaveData의 저장함수 실행
  // 위의 두 함수로 수정된 this.state를 onSaveData(handleSubmit 함수)의 파라미터로 전달해서 함수 실행 
  //  => 부모 컴포넌트(App)의 state를 변경 
  //  + 변경 후 본 컴포넌트의 this.state(= input창에 입력된 값)은 제거
  handleSubmit = (e) => {
    // 아래 실행 안되는거 막아주고
    // (실제로 서버로 보낼 것이 아니기 때문에 preventDefault로 이벤트를 중지)
    e.preventDefault();

    // props로 받아온 저장함수에 변경된 state를 넣어서 App에서 실행
    this.props.onSaveData(this.state);

    // 그러고나서 state는 다시 공백으로 (=> input창에 반영됨)
    // (이걸 안 하면 게시글 추가 후에도 input에 값이 그대로 남아있음)
    this.setState({
      brdno: '',
      brdwriter: '',
      brdtitle: ''
    });
  }

  render() {
    return (
      // type이 submit인 button을 누르면 form의 onSubmit에 등록된 함수가 실행됨
      <form onSubmit={this.handleSubmit}>
        {/* (컴포넌트 내의 변수나 함수를 참조할 때는 this 붙여야) */}
        {/* value에 state 값의 key를 설정해서 input에 입력값이 들어올 때마다 해당 state값이 자동으로 바뀌도록 함 */}
        <input placeholder="title" name="brdtitle" value={this.state.brdtitle} onChange={this.handleChange} />
        <input placeholder="name" name="brdwriter" value={this.state.brdwriter} onChange={this.handleChange} />
        <button type="submit">Save</button>
      </form>
    )
  }
}

export default App;
