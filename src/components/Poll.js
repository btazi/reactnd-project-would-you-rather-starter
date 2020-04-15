import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useParams, withRouter } from "react-router-dom";
import { answerQuestion, handleAnswerQuestion } from "../actions/questions";
import {
  Card,
  CardContent,
  Typography,
  makeStyles,
  RadioGroup,
  FormControlLabel,
  Radio,
  Avatar,
  Button,
  Divider,
  LinearProgress,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(2),
  },
  asks: {
    display: "flex",
    flexDirection: "row",
  },
  avatar: {
    marginRight: "5px",
  },
}));

const Poll = ({
  dispatch,
  poll,
  authorAvatar,
  isAnswered,
  chosenAnswer,
  pollPage,
}) => {
  const classes = useStyles();
  const selectRadio = (e) => {
    const answer = e.target.value;
    isAnswered
      ? alert("You have already voted for this question")
      : dispatch(handleAnswerQuestion(poll.id, answer)).then(
          alert("Your answer has been saved")
        );
  };

  const form = () => {
    return (
      <RadioGroup
        aria-label="poll"
        name="poll"
        value={isAnswered ? chosenAnswer : null}
        onChange={selectRadio}
      >
        <FormControlLabel
          value={"optionOne"}
          control={<Radio />}
          label={poll.optionOne.text}
        />
        <FormControlLabel
          value={"optionTwo"}
          control={<Radio />}
          label={poll.optionTwo.text}
        />
      </RadioGroup>
    );
  };

  const results = () => {
    const optionOneVotes = poll.optionOne.votes.length;
    const optionTwoVotes = poll.optionTwo.votes.length;
    const totalVotes = [...poll.optionOne.votes, ...poll.optionTwo.votes]
      .length;
    const optionOnePerc = Math.floor((optionOneVotes / totalVotes) * 100);
    const optionTwoPerc = Math.floor((optionTwoVotes / totalVotes) * 100);
    return (
      <>
        <Typography variant="h6">
          {poll.optionOne.text} ({optionOnePerc}%)
        </Typography>
        <LinearProgress variant="determinate" value={optionOnePerc} />
        <Typography variant="subtitle2">
          {optionOneVotes} out of {totalVotes} votes
        </Typography>
        <Divider />
        <Typography variant="h6">
          {poll.optionTwo.text} ({optionTwoPerc}%)
        </Typography>
        <LinearProgress variant="determinate" value={optionTwoPerc} />
        <Typography variant="subtitle2">
          {optionTwoVotes} out of {totalVotes} votes
        </Typography>
      </>
    );
  };

  return (
    <Card className={classes.card}>
      <CardContent className="content">
        <div className={classes.asks}>
          <Avatar
            alt="logged_user"
            src={authorAvatar}
            className={classes.avatar}
          />
          <Typography variant="h6">{poll.author} asks</Typography>
        </div>
        <Typography variant="h5">Would You Rather:</Typography>
        {(!pollPage || (pollPage && !isAnswered)) && form()}
        {pollPage && isAnswered && results()}
        {!pollPage && (
          <Button to={`/questions/${poll.id}`} component={Link} color="primary">
            View Poll
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const mapStateToProps = ({ questions, users, authedUser }, props) => {
  const id = props.match.params.id || props.id;
  const poll = questions[id];
  const pollPage = props.match.path.includes("questions/");
  return {
    poll,
    authorAvatar: users[poll.author].avatarURL,
    pollPage,
    chosenAnswer: poll.optionOne.votes.includes(authedUser)
      ? "optionOne"
      : "optionTwo",
    isAnswered: [...poll.optionOne.votes, ...poll.optionTwo.votes].includes(
      authedUser
    ),
  };
};

Poll.propTypes = {
  poll: PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps)(Poll));
