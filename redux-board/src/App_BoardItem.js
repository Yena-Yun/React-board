import React, { Component } from 'react';
import { connect } from 'react-redux';
import { board_read, board_remove } from './App_reducer';


class BoardItem extends Component {
	handleUpdateForm = (brdno) => {
		//board_read: 실제로 데이터를 저장하는 App_reducer에 있는 board_read
		this.props.dispatch(board_read(brdno));
	}

	render() {
		//부모로부터 받은 게시물 하나
		const row = this.props.row;

		return (
			<tr>
				<td>{row.brdno}</td>
				<td>
					{/* 제목 클릭 시 게시글 수정 */}
					<a onClick={() => this.handleUpdateForm(row.brdno)}>
						{row.brdtitle}
					</a>
				</td>
				<td>{row.brdwriter}</td>
				<td>{row.brddate.toLocaleDateString('ko-KR')}</td>
				<td>
					{/* x 버튼 클릭 시 게시글 삭제 */}
					{/* App_reducer에 있는 board_remove를 호출해서 삭제 */}
					<a onClick={() => { this.props.dispatch(board_remove(row.brdno)) }}>
						X
					</a>{row.brdno}
				</td>
			</tr>
		);
	}
};


export default connect()(BoardItem);