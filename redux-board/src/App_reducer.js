//App_reducer.js 파일 외부에서는 
//board_reducer 함수를 호출하는 것이 아니고,
//액션 종류에 따른 각각의 함수(board_list, board_save, board_read, board_remove)를 호출해서 사용한다.
import { createAction, handleActions } from 'redux-actions';

const BOARD_SAVE = 'SAVE';
const BOARD_REMOVE = 'REMOVE';
const BOARD_READ = 'ONE';
const BOARD_LIST = 'LIST';

//신규작성 또는 수정한 내용 저장
//파라미터: 저장할 게시글 데이터
//createAction: type만 지정하면 함수 자동으로 생성
export const board_save = createAction(BOARD_SAVE);
export const board_remove = createAction(BOARD_REMOVE, brdno => brdno);
export const board_read = createAction(BOARD_READ);
export const board_list = createAction(BOARD_LIST);

// //글을 삭제
// //파라미터: 삭제할 글 번호
// export const board_remove = (brdno) => ({
// 	type: BOARD_REMOVE,
// 	brdno: brdno //board_reducer에서는 action.brdno으로 파라미터값을 가져옴
// });

// //(수정하기 위해) 글을 선택
// //파라미터: 수정할 글 번호
// export const board_read = (brdno) => ({
// 	type: BOARD_READ,
// 	brdno: brdno //board_reducer에서는 action.brdno으로 파라미터값을 가져옴
// });

// //글 리스트 제공
// //그냥 전체 글 리스트를 반환하기 때문에 파라미터 없이 action type만 지정
// //(CRUD 개념상 선언한 것, 함수로 뭔가를 처리하는 게 아니고 state의 boards 변수의 전체값을 가져와서 출력만 하는 것이기 때문에 구현하지 않음)
// export const board_list = () => ({ type: BOARD_LIST });





//initialState 총 3개 (maxNo, boards, selectedBoard)
const initialState = {
	maxNo: 3, //최대 글 번호
	boards: [ //전체 게시글 데이터
		{
			brdno: 1,
			brdwriter: 'Lee Sunsin',
			brdtitle: 'If you intend to live then you die',
			brddate: new Date()
		},
		{
			brdno: 2,
			brdwriter: 'So SiNo',
			brdtitle: 'Founder for two countries',
			brddate: new Date()
		}
	],
	selectedBoard: {} //선택한 게시글 정보, BOARD_READ에서만 사용
};

export default handleActions({
	[BOARD_SAVE]: (state, { payload: data }) => {
		let boards = state.boards;
		let maxNo = state.maxNo;

		//글 번호(brdno) 값이 없으면 신규등록
		if (!data.brdno) {
			return {
				//신규라서 다음 글 번호를 1 증가시켜 놓고,
				maxNo: maxNo + 1,
				//기존 게시물 데이터(boards)에 새로운 게시물(data) 추가
				boards: boards.concat({
					...data,
					brdno: maxNo, //brdno은 state의 maxNo
					brddate: new Date() //brddate는 작성날짜
				}),
				selectedBoard: {} //선택한 행은 초기화
			}
		}

		//글 번호(brdno) 값이 있으면 수정
		return {
			...state, //기존 state(= maxNo) 그대로 넣어주기 
			//(= maxNo: state.maxNo 과 동일하나, 변수가 많을 경우 안 바뀐 모든 변수를 나열하는 것보다 '...state'처럼 spread 문법으로 쓰는 게 버그 방지에 좋음)
			//boards는 boards 배열의 모든 객체를 검사(map)해서 row로 하나씩 꺼낸 후
			boards: boards.map(row =>
				data.brdno === row.brdno ? { ...data } : row //꺼낸 row의 brdno이 받아온 data의 brdno과 같으면 새로운 게시물(data)를 반환하고, 그렇지 않으면 기존 게시물(row)을 그대로 반환
			),
			selectedBoard: {} //선택한 행은 초기화
		};
	},

	[BOARD_REMOVE]: (state, { payload: brdno }) => {
		let boards = state.boards;

		return {
			...state, //(= maxNo)
			//삭제할 게시글이 아닌 게시물만 모아서(filter) 배열로 다시 생성
			//(조건에 부합하는 데이터만 모아서 다시 배열을 만드는 방식)
			boards: boards.filter(row => row.brdno !== brdno),
			selectedBoard: {}
		};
	},

	[BOARD_READ]: (state, { payload: brdno }) => {
		let boards = state.boards;

		return {
			//나머지(maxNo, boards)는 ...state로 지정해서 반환
			...state, //(= maxNo, boards)
			selectedBoard: boards.find(row => row.brdno === brdno) //boards 배열에서 객체를 찾아봄(find) (=> boards 배열에서 객체 row를 하나씩 꺼내서 받아온 action의 brdno과 row의 brdno이 같은 경우의 객체를 반환)
		};
	}
}, initialState);

// //board_reducer에서 구현한 각 액션의 기능은 모두 각 컴포넌트에서 사용한 코드를 모은 것

// //(게시물과 관련된 CRUD 코드들을 board_reduer 한 곳에 모아놓고 사용)
// export default function board_reducer(state = initialState, action) {
// 	let boards = state.boards;

// 	switch (action.type) {

// 		case BOARD_SAVE:
// 			let data = action.data;
// 			let maxNo = state.maxNo;

// 			//글 번호(brdno) 값이 없으면 신규등록
// 			if (!data.brdno) { 
// 				return {
// 					//신규라서 다음 글 번호를 1 증가시켜 놓고,
// 					maxNo: maxNo + 1,
// 					//기존 게시물 데이터(boards)에 새로운 게시물(data) 추가
// 					boards: boards.concat({
// 						...data,
// 						brdno: maxNo, //brdno은 state의 maxNo
// 						brddate: new Date() //brddate는 작성날짜
// 					}),
// 					selectedBoard: {} //선택한 행은 초기화
// 				}
// 			}

// 			//글 번호(brdno) 값이 있으면 수정
// 			return {
// 				...state, //기존 state(= maxNo) 그대로 넣어주기 
// 				//(= maxNo: state.maxNo 과 동일하나, 변수가 많을 경우 안 바뀐 모든 변수를 나열하는 것보다 '...state'처럼 spread 문법으로 쓰는 게 버그 방지에 좋음)
// 				//boards는 boards 배열의 모든 객체를 검사(map)해서 row로 하나씩 꺼낸 후
// 				boards: boards.map(row =>
// 					data.brdno === row.brdno ? { ...data } : row //꺼낸 row의 brdno이 받아온 data의 brdno과 같으면 새로운 게시물(data)를 반환하고, 그렇지 않으면 기존 게시물(row)을 그대로 반환
// 				),
// 				selectedBoard: {} //선택한 행은 초기화
// 			};

// 		case BOARD_REMOVE:
// 			return {
// 				...state, //(= maxNo)
// 				//삭제할 게시글이 아닌 게시물만 모아서(filter) 배열로 다시 생성
// 				//(조건에 부합하는 데이터만 모아서 다시 배열을 만드는 방식)
// 				boards: boards.filter(row => row.brdno !== action.brdno),
// 				selectedBoard: {}
// 			};

// 		//조회 => 주어진 글 번호(brdno)에 맞는 게시글을 찾아서(find) selectedBoard로 지정
// 		case BOARD_READ:
// 			return {
// 				//나머지(maxNo, boards)는 ...state로 지정해서 반환
// 				...state, //(= maxNo, boards)
// 				selectedBoard: boards.find(row => row.brdno === action.brdno) //boards 배열에서 객체를 찾아봄(find) (=> boards 배열에서 객체 row를 하나씩 꺼내서 받아온 action의 brdno과 row의 brdno이 같은 경우의 객체를 반환)
// 			};
		
// 		//위의 세 타입에 모두 해당하지 않으면
// 		default:
// 			//기존 state 그대로 반환
// 			return state;
// 	}
// }


//React로 작성된 코드를 Redux로 바꾸는 것은
//지금까지 정리한 App_reducer.js의 내용이 핵심이고, 다른 컴포넌트에서는 호출해서 사용만 하면 된다.
//App_reducer.js에서는 저장할 데이터(state)의 초기값 지정(initialState)과 역할별 기능을 board_reducer에 구현하면 된다.