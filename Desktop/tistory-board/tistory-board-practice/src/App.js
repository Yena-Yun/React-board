import React, { Component } from 'react';

class App extends Component {
	constructor(props) {
		super(props);
		this.child = React.createRef();
	}

	state = {
		maxNo: 3,
		boards: [
			{
				brdno: 1,
				brdwriter: 'Lee Sunsin',
				brdtitle: 'If you intend to live you will die',
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

	// 저장함수와 제출함수는 다름!
	handleSaveData = (data) => {
		if (data.brdno === null || data.brdno === '' || data.brdno === undefined) {
			this.setState({
				maxNo: this.state.maxNo + 1,
				boards: this.state.boards.concat({
					brdno: this.state.maxNo,
					brddate: new Date(),
					brdtitle: data.brdtitle,
					brdwriter: data.brdwriter,
				})
			});
		} else {
			this.setState({
				boards: this.state.boards.map(row => data.brdno === row.brdno ? { ...data } : row)
			});
		}
	}

	handleRemove = (brdno) => {
		// state를 절대 직접 바꾸지 않고 setState를 사용한다.
		this.setState({
			boards: this.state.boards.filter(row => row.brdno !== brdno)
		})
	}

	handleSelectRow = (row) => {
		this.child.current.handleSelectRow(row);
	}

	render() {
		return (
			<div>
				{/* Save 버튼이 BoardForm에 있음 + input창 값으로 state를 바꿀 때 필요한 ref도 넘기기 */}
				<BoardForm onSaveData={this.handleSaveData} ref={this.child} />

				<table border="1">
					<tbody>
						<tr align="center">
							<td width="50">No.</td>
							<td width="300">Title</td>
							<td width="100">Name</td>
							<td width="100">Date</td>
						</tr>
						{
							this.state.boards.map(row =>
								(<BoardItem key={row.brdno} row={row} onRemove={this.handleRemove} onSelectRow={this.handleSelectRow} />)
							)
						}
					</tbody>
				</table>
			</div>
		);
	}
}


class BoardItem extends Component {
	


}



class BoardForm extends Component {


	
}
//BoardForm

//state 초기화 = 입력창 값

// 1번째 state 변경함수
// 입력된 name(brdtitle 또는 brdwriter)을 key값으로 하고, 입력된 value를 value값으로 함


















//App

//constructor

//state (기존데이터)

//저장함수 (인자: data, / 신규등록, 수정)

//삭제함수 (인자: brdno / filter)

//선택함수 (인자: row)

//render() - div로 한번 묶고 + BoardForm + boards에서 꺼내서 BoardItem 반환
