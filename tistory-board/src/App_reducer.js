//액션type 정의
const BOARD_SAVE = 'SAVE'; //신규등록이나 수정내용 저장
const BOARD_REMOVE = 'REMOVE'; //글 삭제
const BOARD_READ = 'ONE'; //수정하기 위해 글 선택
const BOARD_LIST = 'LIST'; //글 리스트 제공(그냥 전체 글 리스트를 반환, 의미상 선언한 것으로 사용하지 않는다)

//액션생성함수
// type은 무조건 작성
export const board_save = (data) => ({
	type: BOARD_SAVE,
	// 받아온 data 객체 전체
	data
});

export const board_remove = (brdno) => ({
	type: BOARD_READ,
	// key에 value로 넣어줌
	brdno: brdno,
});

export const board_read = (brdno) => ({
	type: BOARD_READ,
	brdno: brdno,
})

export const board_list = () => ({
	type: BOARD_LIST
});


//초기 데이터 저장
//(reducer 파일에서는 state를 별도로 지정하지 않고
//initialState에 초기값으로 지정하면서 사용 시작)
const initialState = {
	maxNo: 3,
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
	],
	//수정하기 위해 선택한 글 정보
	selectedBoard: {},
};


//reducer 함수
//reducer 함수에서 모든 처리가 이루어지고,
//파라미터로 제공되는 action의 종류(type)에 따라 어떤 처리(CRUD)를 할 것 인지를 구현
export default function board_reducer(state = initialState, action) {
	let boards = state.boards;

	switch (action.type) {
		case BOARD_SAVE:
			let data = action.data;
			let maxNo = state.maxNo;

			//신규 등록
			if (!data.brdno) {
				return {
					maxNo: maxNo + 1, boards: boards.concat({
						...data, brdno: maxNo, brddate: new Date()
					}),
					selectedBoard: {}
				};
			}

			//수정
			return {
				...state,
				boards: boards.map(row => data.brdno === row.brdno ? { ...data } : row),
				selectedBoard: {}
			};
		
		case BOARD_REMOVE:
			return {
				...state,
				boards: boards.filter(row => row.brdno !== action.brdno),
				selectedBoard: {}
			};
		
		case BOARD_READ:
			return {
				...state,
				selectedBoard: boards.find(row => row.brdno === action.brdno)
			};

		default:
			return state;
	}
}