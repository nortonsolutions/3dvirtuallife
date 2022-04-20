/**
 * This is meant to follow quizActiveScripts.js
 * 
 * Using Redux here to externalize the store/state,
 * so it can be accessed from outside the component.
 * 
 * Norton 2021
 */ 

if (!reviewMode) {
    const initialState = {
        timePassed: timePassed,
        running: (timePassed < timeLimit)
    }
    
    const UPDATESTATE = 'UPDATESTATE';
    
    const updateStateAction = (payload) => ({
        type: UPDATESTATE,
        payload
    })
    
    // // Thunk!
    // const asyncGetQuizzesAndSetQuizIdAction = (quizzes) => {
    //     return (dispatch, getState) => {
    //         dispatch(updateStateAction({quizzes: quizzes}));
    //         dispatch(updateStateAction({quizId: getState().quizzes[0]._id }))            
    //     }
    // }
    
    const reducer = (state = initialState, { type, payload }) => {
        switch (type) {
        
            case UPDATESTATE:
                return { ...state, ...payload };
    
            default:
                return state
        }
    }
    
    const store = Redux.createStore(reducer);
    // const store = Redux.createStore(reducer, Redux.applyMiddleware(ReduxThunk.default));
    
    
    const mapStateToProps = (state) => {
        return {
            timePassed: state.timePassed,
            running: state.running
        }
    }
    
    const mapDispatchToProps = (dispatch) => {
        return {
            updateState: (payload) => {
                dispatch(updateStateAction(payload));
            }
            // asyncGetQuizzesAndSetQuizId: (quizzes) => {
            //     dispatch(asyncGetQuizzesAndSetQuizIdAction(quizzes));
            // }
        }
    };
    
    class QuizTimer extends React.Component {
    
        constructor(props) {
            super(props);
        }
    
        render() {
            return (
                <div id="timerContainer" className="mx-0">
                {String(this.minutes(this.props.timePassed) + ":" + this.seconds(this.props.timePassed))}/
                {timeLimit==Infinity? <span className='fas fa-infinity'></span> : String(this.minutes(timeLimit) + ":" + this.seconds(timeLimit))}
                </div>
            )
        }
    
        minutes(totalTime) {
            return Math.floor(totalTime/60);
        }
    
    
        seconds(totalTime) {
            return (totalTime%60).toLocaleString("en-US", { minimumIntegerDigits: 2 })
        }
    
        tick() {
    
            if (this.props.timePassed >= timeLimit) {
                this.props.updateState({running: false});
            }
    
            if (this.props.running) {
                this.props.updateState({timePassed: this.props.timePassed + 1});
            }
        }
    
        componentDidMount() {
            // document.getElementById('beep').load();
            if (this.props.running) {
                let myVar = setInterval(() => {
                    if (this.props.running) {
                        this.tick();
                    } else {
                        submitQuiz();
                        clearInterval(myVar);
                    }
                }, 1000)
            }
        }
    }
    
    const QuizTimerConnnected = ReactRedux.connect(
        mapStateToProps,
        mapDispatchToProps
    )(QuizTimer);
    
    const Provider = ReactRedux.Provider;
    
    class QuizTimerWrapped extends React.Component {
    
        constructor(props) {
            super(props)
        }
    
        render() {
            return (
                <Provider store={store}>
                    <QuizTimerConnnected />
                </Provider>
            )
        }
    }
    
    ReactDOM.render(
        <QuizTimerWrapped />,
        document.getElementById('quizTimer')
    )
}
