import { useAppSelector } from '../../hooks';
import Dropdown from '../../components/Dropdown';
import { CopyIcon, TrashIcon } from '../../assets';
import { Wrapper, useStyles } from './style';
import { Switch } from '@material-ui/core';
import { QUESTION_TYPES } from '../../const';
import { useEffect, useState } from 'react';
import { NarrativeQuestion, OptionalQuestion } from '../../components/Question';
import { useDispatch } from 'react-redux';
import { questionActions } from '../../slices';

interface QuestionProps {
  questionId: number;
}

const QuestionContainer = ({ questionId }: QuestionProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { questions } = useAppSelector((state) => state.form);
  const selectedQuestion = questions.find((item) => item.id === questionId);
  const questionType = selectedQuestion?.type;
  const options = selectedQuestion?.options;
  const questionContent = selectedQuestion?.questionContent;

  useEffect(() => {
    dispatch(questionActions.setNecessary({ id: questionId, isNecessary: isChecked }));
  }, [isChecked]);

  const handleSwitch = () => {
    setIsChecked((isChecked) => !isChecked);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(questionActions.setQuestionContent({ id: questionId, questionContent: e.target.value }));
  };

  const handleDeleteQuestion = () => {
    dispatch(questionActions.deleteQuestion(questionId));
  };

  const getInput = () => {
    switch (questionType) {
      case QUESTION_TYPES.ONE_CHOICE:
        return options?.map((option) => (
          <OptionalQuestion key={option.id} questionId={option.id} type={QUESTION_TYPES.ONE_CHOICE} />
        ));
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return options?.map((option) => (
          <OptionalQuestion key={option.id} questionId={option.id} type={QUESTION_TYPES.MULTIPLE_CHOICE} />
        ));
      case QUESTION_TYPES.DROP_DOWN:
        return options?.map((option) => (
          <OptionalQuestion key={option.id} questionId={option.id} type={QUESTION_TYPES.DROP_DOWN} />
        ));
      case QUESTION_TYPES.SHORT_ANSWER:
        return <NarrativeQuestion type="short" />;
      case QUESTION_TYPES.LONG_ANSWER:
        return <NarrativeQuestion type="long" />;
      default:
        return;
    }
  };

  return (
    <Wrapper>
      <div className="question">
        <input
          className="question-input"
          type="text"
          placeholder="질문"
          value={questionContent}
          onChange={handleQuestionChange}
        />

        <Dropdown questionId={questionId} />
      </div>
      {getInput()}
      <hr />
      <div className="settings">
        <img src={CopyIcon} alt="copy" />
        <img onClick={handleDeleteQuestion} src={TrashIcon} alt="trash" />
        <div className="switch-label">필수</div>
        <Switch className={classes.colorSecondary} checked={isChecked} onChange={handleSwitch} />
      </div>
    </Wrapper>
  );
};

export default QuestionContainer;
